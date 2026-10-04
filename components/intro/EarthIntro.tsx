'use client'

import { useEffect, useRef } from 'react'
import { BEACH } from '@/config/site'
import { loadBitmap } from './gl'
import type { IntroCommand, IntroEvent, LandingReport } from './messages'

const REVEAL_MS = 1800
const REDUCED_MOTION_HOLD_MS = 1600

interface EarthIntroProps {
  /** First frame is on screen */
  onReady: () => void
  /** The page is being uncovered (the clouds part, or the intro fades out): it can move and take focus again */
  onReveal: () => void
  /** The intro has finished (completed, skipped, or failed) */
  onDone: () => void
}

/**
 * The intro's page side: the canvas, input, the fog and the cloud reveal. The globe itself renders in a worker
 * (intro.worker.ts), so none of its GPU work can hold up the page underneath.
 */
export default function EarthIntro({ onReady, onReveal, onDone }: EarthIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const fogRef = useRef<HTMLDivElement>(null)
  const skipRef = useRef<HTMLButtonElement>(null)
  const debugRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    const fog = fogRef.current
    const skip = skipRef.current
    if (!root || !stage || !fog || !skip) return

    const lite = document.documentElement.dataset.lite === '1'
    const night = document.documentElement.dataset.theme === 'dark'
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // ?globe-debug: stop above the beach, mark it, and report where it lands on screen
    const debug = new URLSearchParams(window.location.search).has('globe-debug')
    if (debug) root.dataset.debug = ''

    let phase: 'loading' | 'running' | 'reveal' | 'leaving' = 'loading'
    let timer = 0
    let releaseFrame = 0
    let releaseTimer = 0
    let worker: Worker | null = null
    const send = (command: IntroCommand, transfer: Transferable[] = []) => worker?.postMessage(command, transfer)

    const leave = (fade: boolean) => {
      if (phase === 'leaving') return
      phase = 'leaving'
      window.clearTimeout(timer)
      if (!fade) return onDone()
      root.classList.add('is-leaving')
      // Uncover the page once the fade's first frame is out: that restyles the whole page, which takes a moment
      // on a phone and shouldn't hold up the fade (or the response to a click on Skip)
      releaseFrame = requestAnimationFrame(() => (releaseTimer = window.setTimeout(onReveal, 0)))
      timer = window.setTimeout(onDone, 420)
    }

    const startDive = () => {
      if (phase === 'running') send({ type: 'dive' })
    }

    const report = (result: LandingReport) => {
      ;(window as unknown as { __globeDebug?: LandingReport }).__globeDebug = result
      if (!debugRef.current) return
      const offset = (point: { x: number; y: number } | null) =>
        point ? `${(point.x - result.center.x).toFixed(2)}, ${(point.y - result.center.y).toFixed(2)} px` : 'not visible'
      debugRef.current.textContent = [
        `beach ${result.target.lat}, ${result.target.lng}`,
        `viewport ${result.viewport.width}×${result.viewport.height}, center ${result.center.x}, ${result.center.y}`,
        `projected (camera maths): off center by ${offset(result.projected)}`,
        `drawn (shader marker, ${result.markerPixels} px): off center by ${offset(result.drawn)}`,
        result.coastKm === null
          ? 'coastline: not measured'
          : `map under the marker: ${Math.abs(result.coastKm).toFixed(2)} km ${result.coastKm >= 0 ? 'inland from' : 'offshore of'} the coastline`,
      ].join('\n')
    }

    const handle = (event: IntroEvent) => {
      if (phase === 'leaving') return
      switch (event.type) {
        case 'ready':
          phase = 'running'
          onReady()
          // Reduced motion gets one still frame, held briefly, then a plain fade into the site
          if (reduceMotion && !debug) timer = window.setTimeout(() => leave(true), REDUCED_MOTION_HOLD_MS)
          break
        case 'dive':
          root.dataset.phase = 'dive'
          break
        case 'fog':
          fog.style.opacity = event.opacity
          break
        // Into the cloud: the globe stops and the cloud banks part over the real hero
        case 'reveal':
          phase = 'reveal'
          root.dataset.phase = 'reveal'
          fog.style.opacity = '1'
          onReveal()
          timer = window.setTimeout(() => leave(false), REVEAL_MS)
          break
        case 'debug':
          report(event.report)
          break
        case 'failed':
          leave(false)
          break
      }
    }

    // Clicking, scrolling or pressing a key starts the dive early (Escape or the button skips)
    const onPointer = (event: PointerEvent) => {
      if (event.target !== skip) startDive()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') return leave(true)
      if (event.key === 'Tab' || event.key === 'Shift' || event.target === skip) return
      startDive()
    }
    const onSkip = () => leave(true)
    const onResize = () => send({ type: 'resize', width: window.innerWidth, height: window.innerHeight })

    root.addEventListener('pointerdown', onPointer)
    root.addEventListener('wheel', startDive, { passive: true })
    root.addEventListener('touchmove', startDive, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    skip.addEventListener('click', onSkip)
    skip.focus({ preventScroll: true })

    // Until the worker's first frame arrives the canvas is transparent, so the starfield cover shows through
    const canvas = document.createElement('canvas')
    // The intro is an extra: where workers can't draw with WebGL (Safari before 17), the site just shows
    if (typeof Worker === 'undefined' || !('transferControlToOffscreen' in canvas)) {
      timer = window.setTimeout(() => leave(false), 0)
    } else {
      stage.appendChild(canvas)
      const offscreen = canvas.transferControlToOffscreen()
      worker = new Worker(new URL('./intro.worker.ts', import.meta.url), { type: 'module' })
      worker.onmessage = (event: MessageEvent<IntroEvent>) => handle(event.data)
      worker.onerror = () => leave(false)
      send(
        {
          type: 'start',
          canvas: offscreen,
          options: {
            lite,
            night,
            reduceMotion,
            debug,
            target: BEACH,
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
          },
        },
        [offscreen],
      )

      // The page preloaded the maps (app/layout.tsx), so they're fetched here, where the preloads match, then
      // decoded off the main thread and handed over
      const file = (name: string) => `/intro/${name}.webp`
      const hand = (names: string[], type: 'maps' | 'local-maps') =>
        Promise.all(names.map((name) => loadBitmap(file(name)))).then(
          (maps) => {
            if (worker) send({ type, maps }, maps)
            else for (const map of maps) map.close()
          },
          () => send({ type: type === 'maps' ? 'maps-failed' : 'local-maps-failed' }),
        )
      void hand([lite ? 'globe-color-1024' : 'globe-color-2048', 'globe-coast-1024', 'globe-lights-512'], 'maps')
      // Only needed for the last stretch of the dive
      void hand(['globe-local-color-1024', 'globe-local-coast-1024'], 'local-maps')
    }

    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(releaseFrame)
      window.clearTimeout(releaseTimer)
      root.removeEventListener('pointerdown', onPointer)
      root.removeEventListener('wheel', startDive)
      root.removeEventListener('touchmove', startDive)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      skip.removeEventListener('click', onSkip)
      // The worker stops drawing at once and frees the GPU memory and its context soon after (losing the context
      // on purpose, so nothing it says from here on matters)
      send({ type: 'dispose' })
      if (worker) worker.onmessage = worker.onerror = null
      worker = null
      canvas.remove()
    }
  }, [onReady, onReveal, onDone])

  return (
    <div ref={rootRef} className="intro">
      <div ref={stageRef} className="intro-stage" aria-hidden="true" />
      <div ref={fogRef} className="intro-fog" aria-hidden="true">
        <div className="intro-fog-base" />
        <div className="intro-cloudbank intro-cloudbank-left" />
        <div className="intro-cloudbank intro-cloudbank-right" />
      </div>
      <pre ref={debugRef} className="intro-debug" aria-hidden="true" />
      <p className="sr-only">
        Intro animation: an illustrated Earth turns toward the southwest coast of India, and the camera dives through a
        cloud down to the beach.
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
