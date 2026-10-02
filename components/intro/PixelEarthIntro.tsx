'use client'

import { useEffect, useRef } from 'react'
import { profile } from '@/lib/content'
import {
  createGlobeRenderer,
  END_DISTANCE,
  loadTexture,
  START_DISTANCE,
  type BeachLayout,
  type GlobeRenderer,
  type View,
} from './globe'

const IDLE_MS = 3400
const TURN_MS = 1500
const ZOOM_DELAY_MS = 250
const ZOOM_MS = 2100
const RESOLVE_MS = 500
const DISSOLVE_MS = 650
const REDUCED_MOTION_HOLD_MS = 1400

/** Spin speed while idling, radians per second */
const SPIN = 0.17
const IDLE_PITCH = 0.3
const IDLE_ROLL = -0.36

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

/** Read the real hero's geometry and colors so the pixel beach lands exactly on top of it */
function readBeachLayout(): BeachLayout | null {
  const scene = document.querySelector('.hero-scene')
  if (!scene) return null
  const sceneRect = scene.getBoundingClientRect()
  const dark = document.documentElement.dataset.theme === 'dark'
  const celestialElement = document.querySelector(dark ? '.moon' : '.sun')
  const celestialRect = celestialElement?.getBoundingClientRect()
  const styles = getComputedStyle(document.documentElement)
  const token = (name: string) => styles.getPropertyValue(name).trim()

  return {
    horizon: sceneRect.top,
    sceneHeight: sceneRect.height,
    celestial: celestialRect
      ? {
          x: celestialRect.left + celestialRect.width / 2,
          y: celestialRect.top + celestialRect.height / 2,
          r: celestialRect.width / 2,
          color: token(dark ? '--moon' : '--sun'),
        }
      : null,
    colors: {
      skyTop: token('--sky-top'),
      skyMid: token('--sky-mid'),
      skyLow: token('--sky-low'),
      seaFar: token('--sea-far'),
      seaMid: token('--sea-mid'),
      seaNear: token('--sea-near'),
      seaShallow: token('--sea-shallow'),
      foam: token('--foam'),
      sandWet: token('--sand-wet'),
      sand: token('--sand-1'),
    },
  }
}

interface PixelEarthIntroProps {
  /** First frame is on screen */
  onReady: () => void
  /** The intro has finished (dissolved, skipped, or failed) */
  onDone: () => void
}

export default function PixelEarthIntro({ onReady, onDone }: PixelEarthIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const skipRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const skip = skipRef.current
    if (!root || !canvas || !skip) return

    const lite = document.documentElement.dataset.introLite === '1'
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targetYaw = (-profile.beach.lng * Math.PI) / 180
    const targetPitch = (profile.beach.lat * Math.PI) / 180

    let renderer: GlobeRenderer | null = null
    let phase: 'loading' | 'idle' | 'dive' | 'leaving' = 'loading'
    let frame = 0
    let start = 0
    let diveStart = 0
    let yawAtDive = 0
    let readySent = false
    let leaveTimer = 0
    // Start a little west of the target so the coast drifts into view as the globe spins
    const startYaw = targetYaw - SPIN * (IDLE_MS / 1000) - 0.55

    const idleView = (seconds: number): View => ({
      yaw: startYaw + SPIN * seconds,
      pitch: IDLE_PITCH,
      roll: IDLE_ROLL,
      distance: START_DISTANCE,
      time: seconds,
      marker: false,
      resolve: 0,
      dissolve: 0,
    })

    const leave = (fade: boolean) => {
      if (phase === 'leaving') return
      phase = 'leaving'
      cancelAnimationFrame(frame)
      if (!fade) return onDone()
      root.classList.add('is-leaving')
      leaveTimer = window.setTimeout(onDone, 380)
    }

    const startDive = (now: number) => {
      if (phase !== 'idle') return
      phase = 'dive'
      root.dataset.phase = 'dive'
      diveStart = now
      yawAtDive = startYaw + SPIN * ((now - start) / 1000)
    }

    const diveView = (now: number): View => {
      const elapsed = now - diveStart
      // Turn: continue the spin smoothly (Hermite curve starting at the idle speed) until the beach faces us
      const turn = clamp01(elapsed / TURN_MS)
      const endYaw = targetYaw + 2 * Math.PI * Math.ceil((yawAtDive - targetYaw) / (2 * Math.PI))
      const t2 = turn * turn
      const t3 = t2 * turn
      const yaw =
        (2 * t3 - 3 * t2 + 1) * yawAtDive +
        (t3 - 2 * t2 + turn) * SPIN * (TURN_MS / 1000) +
        (-2 * t3 + 3 * t2) * endYaw
      const settle = easeInOutCubic(turn)
      const zoom = easeInOutQuart(clamp01((elapsed - ZOOM_DELAY_MS) / ZOOM_MS))
      const afterZoom = elapsed - ZOOM_DELAY_MS - ZOOM_MS
      return {
        yaw,
        pitch: IDLE_PITCH + (targetPitch - IDLE_PITCH) * settle,
        roll: IDLE_ROLL * (1 - settle),
        distance: START_DISTANCE + (END_DISTANCE - START_DISTANCE) * zoom,
        time: now / 1000,
        marker: turn > 0.6,
        resolve: clamp01(afterZoom / RESOLVE_MS),
        dissolve: clamp01((afterZoom - RESOLVE_MS) / DISSOLVE_MS),
      }
    }

    const loop = (now: number) => {
      if (!renderer || phase === 'leaving') return
      if (phase === 'idle' && now - start >= IDLE_MS) startDive(now)
      const view = phase === 'dive' ? diveView(now) : idleView((now - start) / 1000)

      // Measure the hero once the zoom is done, right before pixels start turning into the beach
      if (view.resolve > 0 && !renderer.hasBeach()) {
        const layout = readBeachLayout()
        if (layout) renderer.setBeach(layout)
      }

      renderer.render(view)
      if (!readySent) {
        readySent = true
        onReady()
      }
      if (view.dissolve >= 1) return leave(false)
      frame = requestAnimationFrame(loop)
    }

    // The visitor can start the dive early by clicking, scrolling or pressing a key
    const onPointer = (event: PointerEvent) => {
      if (event.target !== skip) startDive(performance.now())
    }
    const onWheel = () => startDive(performance.now())
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') return leave(true)
      if (event.key === 'Tab' || event.key === 'Shift' || event.target === skip) return
      startDive(performance.now())
    }
    const onSkip = () => leave(true)
    const onResize = () => {
      renderer?.resize()
    }

    root.addEventListener('pointerdown', onPointer)
    root.addEventListener('wheel', onWheel, { passive: true })
    root.addEventListener('touchmove', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    skip.addEventListener('click', onSkip)
    skip.focus({ preventScroll: true })

    let cancelled = false
    // Texture: NASA Visible Earth "Blue Marble: Land Surface, Shallow Water, and Shaded Topography"
    // (public domain), resized and compressed to WebP. The boot script preloads the same file.
    loadTexture(lite ? '/intro/earth-1024.webp' : '/intro/earth-2048.webp')
      .then((texture) => {
        if (cancelled) return
        renderer = createGlobeRenderer(canvas, texture, { lite, target: profile.beach })

        if (reduceMotion) {
          // A single still frame of the coast, then a plain fade into the site
          renderer.render({
            yaw: targetYaw,
            pitch: targetPitch,
            roll: 0,
            distance: 2,
            time: 0,
            marker: true,
            resolve: 0,
            dissolve: 0,
          })
          onReady()
          leaveTimer = window.setTimeout(() => leave(true), REDUCED_MOTION_HOLD_MS)
          return
        }

        phase = 'idle'
        start = performance.now()
        frame = requestAnimationFrame(loop)
      })
      .catch(() => leave(false))

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.clearTimeout(leaveTimer)
      root.removeEventListener('pointerdown', onPointer)
      root.removeEventListener('wheel', onWheel)
      root.removeEventListener('touchmove', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      skip.removeEventListener('click', onSkip)
    }
  }, [onReady, onDone])

  return (
    <div ref={rootRef} className="intro">
      <canvas ref={canvasRef} className="intro-canvas" aria-hidden="true" />
      <p className="sr-only">
        Intro animation: a pixel-art Earth turns to the coast of Karnataka, India, and zooms in on the beach.
      </p>
      <p className="intro-hint" aria-hidden="true">
        Click or scroll to dive in
      </p>
      <button ref={skipRef} type="button" className="intro-skip" aria-label="Skip intro animation">
        Skip intro
      </button>
    </div>
  )
}
