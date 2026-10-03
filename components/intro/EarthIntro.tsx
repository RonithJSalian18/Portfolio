'use client'

import { useEffect, useRef } from 'react'
import { BEACH } from '@/config/site'
import { NORTH_AXIS, add, cross, dot, mix, normalize, rotateAbout, scale, slerp, type Vec3 } from './geo'
import { LANDING_CLOUD_TOP, createGlobe, type Globe, type Pose } from './globe'

const IDLE_MS = 1600
const DIVE_MS = 7000
const REVEAL_MS = 1800
const REDUCED_MOTION_HOLD_MS = 1600

/** Dive stages (share of DIVE_MS): turn and zoom in, hover over the beach, then plunge into the cloud */
const APPROACH_END = 0.7
const HOVER_END = 0.84
const FOG_FROM = 0.86
/** Camera height above the surface while hovering (Earth radii) */
const HOVER_FROM = 0.15
const HOVER_TO = 0.13
/** The plunge stops just above the landing cloud, which by then fills the screen */
const PLUNGE_TO = LANDING_CLOUD_TOP + 0.01

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const smoothstep = (from: number, to: number, t: number) => {
  const x = clamp01((t - from) / (to - from))
  return x * x * (3 - 2 * x)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** Altitude over the dive: an even-feeling zoom (log scale), a short hover, then an accelerating plunge */
function altitude(progress: number, start: number) {
  if (progress < APPROACH_END) {
    const t = easeInOutCubic(progress / APPROACH_END)
    return Math.exp(lerp(Math.log(start), Math.log(HOVER_FROM), t))
  }
  if (progress < HOVER_END) return lerp(HOVER_FROM, HOVER_TO, easeInOutCubic((progress - APPROACH_END) / (HOVER_END - APPROACH_END)))
  const t = (progress - HOVER_END) / (1 - HOVER_END)
  return lerp(HOVER_TO, PLUNGE_TO, t * t * t)
}

/** Unit vector pointing north along the surface at `point` */
const northAt = (point: Vec3) => normalize(add(NORTH_AXIS, scale(point, -dot(NORTH_AXIS, point))))

interface EarthIntroProps {
  /** First frame is on screen */
  onReady: () => void
  /** The dive is over and the clouds start parting over the page */
  onReveal: () => void
  /** The intro has finished (completed, skipped, or failed) */
  onDone: () => void
}

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

    let globe: Globe | null = null
    let phase: 'loading' | 'idle' | 'dive' | 'reveal' | 'leaving' = 'loading'
    let frame = 0
    let start = 0
    let diveStart = 0
    let readySent = false
    let timer = 0
    let cancelled = false
    let measured = false
    let startDirection: Vec3 = [0, 0, 1]
    let lastFog = ''

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

    // Into the cloud: stop rendering the globe and let the cloud banks part over the real hero
    const startReveal = () => {
      phase = 'reveal'
      root.dataset.phase = 'reveal'
      fog.style.opacity = '1'
      onReveal()
      timer = window.setTimeout(() => leave(false), REVEAL_MS)
    }

    /** Where the camera is at `time` (seconds) and dive `progress` (0..1) */
    const poseAt = (scene: Globe, time: number, progress: number): Pose => {
      const half = scene.halfFov()
      // Far enough back for the whole globe to fit, with some space around it
      const startDistance = Math.max(3.6, 1 / Math.sin(Math.min(half.x, half.y) * 0.78))
      const beach = scene.targetDirection(time)
      const turn = easeInOutCubic(clamp01(progress / APPROACH_END))
      const direction = slerp(startDirection, beach, turn)
      return {
        position: scale(direction, 1 + altitude(progress, startDistance - 1)),
        lookAt: scale(beach, smoothstep(0.3, 0.66, progress)),
        up: normalize(mix([0, 1, 0], northAt(beach), smoothstep(0.2, 0.66, progress))),
      }
    }

    const report = (scene: Globe, time: number, pose: Pose) => {
      const result = scene.measureLanding(time, pose)
      const offset = (point: { x: number; y: number } | null) =>
        point ? `${(point.x - result.center.x).toFixed(2)}, ${(point.y - result.center.y).toFixed(2)} px` : 'not visible'
      const summary = {
        target: BEACH,
        viewport: { width: window.innerWidth, height: window.innerHeight },
        center: result.center,
        projected: result.projected,
        drawn: result.drawn,
        coastKm: result.coastKm,
        markerPixels: result.markerPixels,
      }
      ;(window as unknown as { __globeDebug?: typeof summary }).__globeDebug = summary
      if (debugRef.current) {
        debugRef.current.textContent = [
          `beach ${BEACH.lat}, ${BEACH.lng}`,
          `viewport ${window.innerWidth}×${window.innerHeight}, center ${result.center.x}, ${result.center.y}`,
          `projected (camera maths): off center by ${offset(result.projected)}`,
          `drawn (shader marker, ${result.markerPixels} px): off center by ${offset(result.drawn)}`,
          result.coastKm === null
            ? 'coastline: not measured'
            : `map under the marker: ${Math.abs(result.coastKm).toFixed(2)} km ${result.coastKm >= 0 ? 'inland from' : 'offshore of'} the coastline`,
        ].join('\n')
      }
    }

    const loop = (now: number) => {
      const scene = globe
      if (!scene || (phase !== 'idle' && phase !== 'dive')) return
      if (phase === 'idle' && now - start >= IDLE_MS) startDive(now)
      const time = (now - start) / 1000
      let progress = phase === 'dive' ? clamp01((now - diveStart) / DIVE_MS) : 0
      if (debug) progress = Math.min(progress, HOVER_END)
      const pose = poseAt(scene, time, progress)
      const landingAt = ((phase === 'dive' ? diveStart - start : IDLE_MS) + DIVE_MS) / 1000
      // A ring pulses out from the beach while the camera hovers over it
      const hoverStart = diveStart + (APPROACH_END - 0.02) * DIVE_MS
      const pulse = phase === 'dive' && now > hoverStart && !debug ? ((now - hoverStart) / 900) % 1 : -1

      // Only touch the DOM when the fog actually changes (it's 0 for most of the dive)
      const fogOpacity = smoothstep(FOG_FROM, 1, progress).toFixed(3)
      if (fogOpacity !== lastFog) fog.style.opacity = lastFog = fogOpacity
      scene.render(time, pose, { pulse, landingAt, debug })

      if (!readySent) {
        readySent = true
        onReady()
        void scene.loadLocal()
      }
      if (debug && progress >= HOVER_END && !measured) {
        measured = true
        report(scene, time, pose)
      }
      if (progress >= 1 && !debug) return startReveal()
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
    const onResize = () => {
      globe?.resize()
      measured = false
    }

    root.addEventListener('pointerdown', onPointer)
    root.addEventListener('wheel', onWheel, { passive: true })
    root.addEventListener('touchmove', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    skip.addEventListener('click', onSkip)
    skip.focus({ preventScroll: true })

    createGlobe(stage, { lite, target: BEACH })
      .then((created) => {
        if (cancelled) return created.dispose()
        globe = created
        globe.onContextLost(() => leave(false))

        // Match the site theme. By day the sun sits west of the beach (afternoon), so the opening shot and the
        // landing are both lit; by night the dive flies from the sunlit side into the dark, where the coast
        // shows its city lights
        const landing = globe.targetDirection((IDLE_MS + DIVE_MS) / 1000)
        const east = normalize(cross(NORTH_AXIS, landing))
        const sunAngle = night ? -2.3 : -0.5
        globe.setSun(add(add(scale(landing, Math.cos(sunAngle)), scale(east, Math.sin(sunAngle))), scale(northAt(landing), 0.25)))
        // Open the shot over Africa, west of the beach
        startDirection = rotateAbout(landing, NORTH_AXIS, -1.2)

        if (reduceMotion && !debug) {
          // One still frame looking down at India, then a plain fade into the site
          const beach = globe.targetDirection(0)
          globe.render(0, { position: scale(beach, 2.3), lookAt: [0, 0, 0], up: northAt(beach) })
          onReady()
          timer = window.setTimeout(() => leave(true), REDUCED_MOTION_HOLD_MS)
          return
        }

        phase = 'idle'
        start = performance.now()
        frame = requestAnimationFrame(loop)
      })
      // No WebGL 2, or the maps failed to load: just show the site
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
      globe?.dispose()
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
        Intro animation: an illustrated Earth turns toward the coast of Karnataka, India, and the camera dives through a
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
