'use client'

import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { profile } from '@/lib/content'
import { createEarthScene, type CameraPose, type EarthScene } from './earthScene'

const IDLE_MS = 1600
const DIVE_MS = 7000
const REVEAL_MS = 1800
const REDUCED_MOTION_HOLD_MS = 1600

const START_DISTANCE = 3.6
const END_DISTANCE = 1.13
/** How far south of the beach the camera ends up, so it looks up the coast toward the horizon */
const APPROACH_OFFSET = 0.16
/** Share of the dive spent turning toward the beach (the rest is a straight descent) */
const TURN_SHARE = 0.78
const CLOUDS_FROM = 0.66
const FOG_FROM = 0.84

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const smoothstep = (from: number, to: number, t: number) => {
  const x = clamp01((t - from) / (to - from))
  return x * x * (3 - 2 * x)
}

interface EarthIntroProps {
  /** First frame is on screen */
  onReady: () => void
  /** The intro has finished (completed, skipped, or failed) */
  onDone: () => void
}

export default function EarthIntro({ onReady, onDone }: EarthIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const fogRef = useRef<HTMLDivElement>(null)
  const skipRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    const fog = fogRef.current
    const skip = skipRef.current
    if (!root || !stage || !fog || !skip) return

    const lite = document.documentElement.dataset.lite === '1'
    const night = document.documentElement.dataset.theme === 'dark'
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let scene: EarthScene | null = null
    let phase: 'loading' | 'idle' | 'dive' | 'reveal' | 'leaving' = 'loading'
    let frame = 0
    let start = 0
    let diveStart = 0
    let readySent = false
    let timer = 0
    let cancelled = false

    const startDirection = new Vector3()
    const target = new Vector3()
    const north = new Vector3()
    const direction = new Vector3()
    const worldUp = new Vector3(0, 1, 0)
    const pose: CameraPose = { position: new Vector3(), lookAt: new Vector3(), up: new Vector3(0, 1, 0) }

    const leave = (fade: boolean) => {
      if (phase === 'leaving') return
      phase = 'leaving'
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      if (!fade) return onDone()
      root.classList.add('is-leaving')
      timer = window.setTimeout(onDone, 420)
    }

    const startDive = (now: number) => {
      if (phase !== 'idle') return
      phase = 'dive'
      root.dataset.phase = 'dive'
      diveStart = now
    }

    // Out of the clouds: stop rendering the globe and let the cloud banks part over the real hero
    const startReveal = () => {
      phase = 'reveal'
      root.dataset.phase = 'reveal'
      fog.style.opacity = '1'
      timer = window.setTimeout(() => leave(false), REVEAL_MS)
    }

    const loop = (now: number) => {
      if (!scene || (phase !== 'idle' && phase !== 'dive')) return
      if (phase === 'idle' && now - start >= IDLE_MS) startDive(now)
      const time = (now - start) / 1000
      const progress = phase === 'dive' ? clamp01((now - diveStart) / DIVE_MS) : 0

      // Slow start, faster through the middle, gentle landing
      const turn = easeInOutCubic(clamp01(progress / TURN_SHARE))
      const descent = easeInOutCubic(progress)
      // Narrow (portrait) screens need the camera further back for the whole globe to fit
      const startDistance = START_DISTANCE * Math.max(1, 1.2 / scene.camera.aspect)
      const distance = startDistance + (END_DISTANCE - startDistance) * descent

      // The beach keeps moving as the planet spins, so the camera keeps chasing it
      scene.targetDirection(time, target)
      direction.copy(startDirection).lerp(target, turn).normalize()
      north.copy(scene.axis).addScaledVector(target, -scene.axis.dot(target)).normalize()
      const approach = smoothstep(0.45, 1, progress)
      pose.position.copy(direction).multiplyScalar(distance).addScaledVector(north, -APPROACH_OFFSET * approach)
      pose.lookAt.copy(target).multiplyScalar(smoothstep(0.3, 0.95, progress))
      pose.up.copy(worldUp).lerp(north, smoothstep(0.25, 0.9, progress)).normalize()

      fog.style.opacity = String(smoothstep(FOG_FROM, 1, progress))
      scene.render(time, pose, {
        detail: smoothstep(2.1, 1.45, distance),
        clouds: smoothstep(CLOUDS_FROM, 0.97, progress),
      })

      if (!readySent) {
        readySent = true
        onReady()
      }
      if (progress >= 1) return startReveal()
      frame = requestAnimationFrame(loop)
    }

    // Clicking, scrolling or pressing a key starts the dive early (Escape or the button skips)
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
    const onResize = () => scene?.resize()

    root.addEventListener('pointerdown', onPointer)
    root.addEventListener('wheel', onWheel, { passive: true })
    root.addEventListener('touchmove', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    skip.addEventListener('click', onSkip)
    skip.focus({ preventScroll: true })

    createEarthScene(stage, { lite, target: profile.beach })
      .then((created) => {
        if (cancelled) return created.dispose()
        scene = created
        scene.onContextLost(() => leave(false))
        scene.setNight(night)
        void scene.loadDetail()

        // Match the site theme: mid-morning sun over the beach by day; by night the beach is on the dark side
        const landing = scene.targetDirection((IDLE_MS + DIVE_MS) / 1000, new Vector3())
        const east = new Vector3().crossVectors(scene.axis, landing).normalize()
        const sunAngle = night ? 2.55 : 0.6
        scene.setSun(landing.clone().multiplyScalar(Math.cos(sunAngle)).addScaledVector(east, Math.sin(sunAngle)))
        // Open the shot over Africa, west of the beach
        startDirection.copy(landing).applyAxisAngle(scene.axis, -1.2)

        if (reduceMotion) {
          // One still frame looking down at India, then a plain fade into the site
          pose.position.copy(scene.targetDirection(0, target)).multiplyScalar(2.3 * Math.max(1, 1.2 / scene.camera.aspect))
          scene.render(0, pose)
          onReady()
          timer = window.setTimeout(() => leave(true), REDUCED_MOTION_HOLD_MS)
          return
        }

        phase = 'idle'
        start = performance.now()
        frame = requestAnimationFrame(loop)
      })
      // No WebGL, or the textures failed to load: just show the site
      .catch(() => leave(false))

    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      root.removeEventListener('pointerdown', onPointer)
      root.removeEventListener('wheel', onWheel)
      root.removeEventListener('touchmove', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      skip.removeEventListener('click', onSkip)
      scene?.dispose()
    }
  }, [onReady, onDone])

  return (
    <div ref={rootRef} className="intro">
      <div ref={stageRef} className="intro-stage" aria-hidden="true" />
      <div ref={fogRef} className="intro-fog" aria-hidden="true">
        <div className="intro-fog-base" />
        <div className="intro-cloudbank intro-cloudbank-left" />
        <div className="intro-cloudbank intro-cloudbank-right" />
      </div>
      <p className="sr-only">
        Intro animation: the Earth turns toward the coast of Karnataka, India, and the camera dives through the
        clouds down to the beach.
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
