'use client'

import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { profile } from '@/lib/content'
import { createEarthScene, type CameraPose, type EarthScene } from './earthScene'

const IDLE_MS = 2200
const DIVE_MS = 4500
const START_DISTANCE = 3.6
const END_DISTANCE = 1.6
const REDUCED_MOTION_HOLD_MS = 1600

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

interface EarthIntroProps {
  /** First frame is on screen */
  onReady: () => void
  /** The intro has finished (completed, skipped, or failed) */
  onDone: () => void
}

export default function EarthIntro({ onReady, onDone }: EarthIntroProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const skipRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    const skip = skipRef.current
    if (!root || !stage || !skip) return

    const lite = document.documentElement.dataset.introLite === '1'
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let scene: EarthScene | null = null
    let phase: 'loading' | 'idle' | 'dive' | 'leaving' = 'loading'
    let frame = 0
    let start = 0
    let diveStart = 0
    let readySent = false
    let leaveTimer = 0
    let cancelled = false

    const startDirection = new Vector3()
    const target = new Vector3()
    const pose: CameraPose = { position: new Vector3(), lookAt: new Vector3(), up: new Vector3(0, 1, 0) }

    const leave = (fade: boolean) => {
      if (phase === 'leaving') return
      phase = 'leaving'
      cancelAnimationFrame(frame)
      if (!fade) return onDone()
      root.classList.add('is-leaving')
      leaveTimer = window.setTimeout(onDone, 420)
    }

    const startDive = (now: number) => {
      if (phase !== 'idle') return
      phase = 'dive'
      root.dataset.phase = 'dive'
      diveStart = now
    }

    const loop = (now: number) => {
      if (!scene || phase === 'leaving') return
      if (phase === 'idle' && now - start >= IDLE_MS) startDive(now)
      const time = (now - start) / 1000
      const progress = phase === 'dive' ? clamp01((now - diveStart) / DIVE_MS) : 0
      const eased = easeInOutCubic(progress)
      // Narrow (portrait) screens need the camera further back for the whole globe to fit
      const startDistance = START_DISTANCE * Math.max(1, 1.2 / scene.camera.aspect)

      // Swing from the opening view toward the beach (which keeps moving as the planet spins) while descending
      scene.targetDirection(time, target)
      const direction = startDirection.clone().lerp(target, eased).normalize()
      pose.position.copy(direction).multiplyScalar(startDistance + (END_DISTANCE - startDistance) * eased)
      pose.lookAt.set(0, 0, 0)
      scene.render(time, pose)

      if (!readySent) {
        readySent = true
        onReady()
      }
      if (progress >= 1) return leave(true)
      frame = requestAnimationFrame(loop)
    }

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

        // Light the beach like a mid-morning sun, and open the shot over Africa, west of it
        const landing = scene.targetDirection((IDLE_MS + DIVE_MS) / 1000, new Vector3())
        const east = new Vector3().crossVectors(scene.axis, landing).normalize()
        scene.setSun(landing.clone().multiplyScalar(Math.cos(0.6)).addScaledVector(east, Math.sin(0.6)))
        startDirection.copy(landing).applyAxisAngle(scene.axis, -1.2)

        if (reduceMotion) {
          // One still frame looking down at India, then a plain fade into the site
          pose.position.copy(scene.targetDirection(0, target)).multiplyScalar(2.3 * Math.max(1, 1.2 / scene.camera.aspect))
          scene.render(0, pose)
          onReady()
          leaveTimer = window.setTimeout(() => leave(true), REDUCED_MOTION_HOLD_MS)
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
      window.clearTimeout(leaveTimer)
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
      <p className="sr-only">
        Intro animation: the Earth turns toward the coast of Karnataka, India, and the camera dives toward the beach.
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
