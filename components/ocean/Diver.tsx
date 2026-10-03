'use client'

import { useEffect, useRef } from 'react'
import { RIG, Spring, Spring2, clamp, reach, rotateAbout, type Point } from './diverRig'

// What the diver swims over to look at
const INTERESTING = [
  '.zone .section-head',
  '.zone .about-story',
  '.zone .about-card',
  '.zone .sonar-group',
  '.zone .bottle-card',
  '.zone .trail-card',
  '.zone .medal',
  '.zone .deep-scene',
  '.zone .contact-form',
].join(',')

/** The line (share of the viewport height) the diver tries to keep its subject on */
const FOCUS = 0.45
const VIEW_WIDTH = 240
/** The artwork's middle row (the body's centre line) */
const MIDDLE = 60

type Gesture = 'rest' | 'point' | 'wave' | 'watch' | 'compass' | 'lamp'

/** Where each hand goes (artwork units, before the body's pitch) */
const HANDS = {
  restNear: [150, 90] as Point,
  restFar: [146, 85] as Point,
  watch: [186, 82] as Point,
  compass: [180, 82] as Point,
  lamp: [184, 47] as Point,
  wave: [178, 41] as Point,
}

/** Head tilt for the gestures that look at the diver's own kit */
const GLANCE: Partial<Record<Gesture, number>> = { watch: 24, compass: 20, lamp: -12 }

/** The diver, drawn in separate parts so each joint can move on its own */
function DiverFigure({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  const leg = (side: 'near' | 'far', [x, y]: Point) => (
    <g transform={`translate(${x} ${y})`}>
      <g data-joint={`thigh-${side}`}>
        <path className={`d-suit d-${side}`} d="M2 -5.4C-10 -5.8 -22 -5.3 -30 -4.5Q-34 0 -30 4.5C-22 5.3 -10 5.8 2 5.4Z" />
        <g transform="translate(-30 0)">
          <g data-joint={`knee-${side}`}>
            <path className={`d-suit d-${side}`} d="M1.5 -4.7C-8 -4.6 -18 -4.2 -26 -3.8Q-29 0 -26 3.8C-18 4.2 -8 4.6 1.5 4.7Z" />
            <path className={`d-accent d-${side}`} d="M-1 -4.6h-5.5v9.2h5.5Q1 0 -1 -4.6Z" />
            <g transform="translate(-27 0)">
              <g data-joint={`fin-${side}`}>
                <path
                  className={`d-fin d-${side}`}
                  d="M4 -4.5Q-3 -6.5 -10 -7L-38 -11.5Q-44 -9 -42 -3.5L-36 0L-42 3.5Q-44 9 -38 11.5L-10 7Q-3 6.5 4 4.5Z"
                />
                <path className="d-fin-rib" d="M-9 -3.6 -36 -6.6M-9 3.6 -36 6.6" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  )

  const arm = (side: 'near' | 'far', [x, y]: Point) => (
    <g transform={`translate(${x} ${y})`}>
      <g data-joint={`shoulder-${side}`}>
        <path className={`d-suit d-${side}`} d="M-3 -4.6C5 -4.6 14 -4.2 21 -3.8Q24.5 0 21 3.8C14 4.2 5 4.6 -3 4.6Z" />
        {side === 'near' && <path className="d-accent" d="M-1.5 -4.5h5v9h-5Q-4.5 0 -1.5 -4.5Z" />}
        <g transform="translate(21 0)">
          <g data-joint={`elbow-${side}`}>
            <path className={`d-suit d-${side}`} d="M-1.5 -4C6 -3.9 12 -3.6 18 -3.3Q20.5 0 18 3.3C12 3.6 6 3.9 -1.5 4Z" />
            {side === 'near' ? (
              <g className="d-watch">
                <rect className="d-strap" x="11" y="-4.4" width="4.4" height="8.8" rx="1" />
                <rect className="d-watch-face" x="10.4" y="-7.4" width="5.6" height="4.4" rx="1.2" />
                <path className="d-watch-hands" d="M13.2 -5.2v-1.4M13.2 -5.2h1.4" />
              </g>
            ) : (
              <g className="d-compass">
                <rect className="d-strap" x="11" y="-4.2" width="4.2" height="8.4" rx="1" />
                <circle className="d-compass-face" cx="13.1" cy="-6.6" r="3.3" />
                <path className="d-compass-needle" d="M13.1 -9.1 14.1 -6.6 13.1 -4.1 12.1 -6.6Z" />
              </g>
            )}
            <path className={`d-glove d-${side}`} d="M17.5 -3.8Q23.5 -5 25.5 -1.2Q26 0 25.5 1.2Q23.5 5 17.5 3.8Z" />
            {side === 'near' && <path className="d-finger" d="M24 -0.8h7.5" />}
          </g>
        </g>
      </g>
    </g>
  )

  return (
    <svg ref={svgRef} viewBox="0 0 240 120" focusable="false">
      <g data-joint="body">
        {leg('far', RIG.hipFar)}
        {arm('far', RIG.shoulderFar)}

        <g className="d-tank">
          <rect className="d-tank-body" x="104" y="37" width="52" height="15" rx="7.5" />
          <rect className="d-tank-shine" x="109" y="39.4" width="40" height="2.8" rx="1.4" />
          <rect className="d-tank-band" x="137" y="37" width="5" height="15" />
          <rect className="d-valve" x="155.5" y="40.5" width="6.5" height="8" rx="1.6" />
          <circle className="d-valve" cx="164" cy="42" r="2.6" />
        </g>

        <path className="d-suit d-torso" d="M91 61Q91 50 104 50L150 49Q165 49 166 62Q165 77 150 78L104 78Q91 77 91 68Z" />
        <path className="d-panel" d="M118 52L148 51.5Q160 52 161 62Q160 70 152 72L118 73Z" />
        <path className="d-stripe" d="M98 71Q126 74.5 158 69.5" />
        <path className="d-harness" d="M114 49.5v28.5M147 49.5v28" />

        {leg('near', RIG.hipNear)}

        <path className="d-hose" d="M163 45C171 46 173 52 170 58" />
        <g transform={`translate(${RIG.neck[0]} ${RIG.neck[1]})`}>
          <g data-joint="neck">
            <path className="d-hose" d="M5 -2C7 8 17 13 24 10" />
            <circle className="d-suit d-hood" cx="14" cy="-3" r="12.5" />
            <path className="d-skin" d="M20.5 3.5Q26.5 6.5 26 11.5Q21 13.5 17 9Z" />
            <path className="d-strap" d="M3.5 -8.5Q11 -11.5 18 -10" />
            <rect className="d-mask-frame" x="17" y="-11.5" width="13.5" height="13" rx="4" />
            <rect className="d-mask-glass" x="19" y="-9.6" width="9.6" height="9.2" rx="2.8" />
            <ellipse className="d-eye" cx="24" cy="-5" rx="2.7" ry="2.2" />
            <circle className="d-pupil" data-joint="pupil" cx="24.6" cy="-5" r="1.3" />
            <path className="d-glint" d="M20.6 -8.4h2.4" />
            <rect className="d-lamp-body" x="11" y="-17.6" width="11" height="5.6" rx="2" />
            <circle className="d-lamp-lens" cx="22.5" cy="-14.7" r="2.4" />
            <circle className="d-reg" cx="27" cy="9.5" r="4.6" />
            <circle className="d-reg-button" cx="27.6" cy="9" r="2" />
            <rect className="d-reg" x="24.5" y="13" width="5" height="2.6" rx="1" />
          </g>
        </g>

        {arm('near', RIG.shoulderNear)}
      </g>
    </svg>
  )
}

/**
 * A scuba diver in the left margin who follows the scroll and reacts to each depth: waves at reef animals,
 * points at project cards and checks its watch or compass in open water, looks along the timeline in the
 * twilight zone, and switches its headlamp on in the deep. Every joint is moved by small damped springs.
 */
export default function Diver() {
  const rootRef = useRef<HTMLDivElement>(null)
  const figureRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const beamRef = useRef<HTMLDivElement>(null)
  const bubblesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const figure = figureRef.current
    const svg = svgRef.current
    const beam = beamRef.current
    const bubbles = bubblesRef.current
    if (!root || !figure || !svg || !beam || !bubbles) return

    const joints: Record<string, SVGElement> = {}
    for (const element of svg.querySelectorAll<SVGElement>('[data-joint]')) joints[element.dataset.joint!] = element
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const about = document.getElementById('about')
    const footer = document.querySelector('footer')
    let targets = Array.from(document.querySelectorAll<HTMLElement>(INTERESTING))
    const zones = Array.from(document.querySelectorAll<HTMLElement>('.zone'))

    // Body: where it is on screen (px), how it pitches, and the kick cycle
    const y = new Spring(-140, 55, 13)
    const pitch = new Spring(0, 60, 12)
    const head = new Spring(0, 70, 11)
    const nearHand = new Spring2(HANDS.restNear, 90, 14)
    const farHand = new Spring2(HANDS.restFar, 90, 14)
    const fins = { near: new Spring(0, 220, 18), far: new Spring(0, 220, 18) }
    const lamp = new Spring(0, 26, 9)
    let kick = 0
    let bob = 0
    let goal = window.innerHeight * FOCUS
    let focus: HTMLElement | null = null
    let focusPoint: Point | null = null
    /** The focused element's box (screen px), read once per scroll */
    let focusBox: DOMRect | null = null
    /** Layout is only read when something moved: after a scroll or resize, at most once per frame */
    let stale = true
    let gesturePoint: Point | null = null
    let gesturePointAt = 0
    let zone: string | null = null
    let visible = false

    // Behaviour
    let gesture: Gesture = 'rest'
    let gestureUntil = 0
    let gestureTarget: HTMLElement | null = null
    let nextIdle = performance.now() + 3500
    let lastCheck: Gesture = 'compass'
    let lampOn = false
    let nextBreath = performance.now() + 1200

    let frame = 0
    let last = performance.now()
    let left = 0
    let size = 1
    const written: Record<string, string> = {}
    const write = (key: string, element: Element, attribute: string, value: string) => {
      if (written[key] === value) return
      written[key] = value
      element.setAttribute(attribute, value)
    }

    const measure = () => {
      const box = root.getBoundingClientRect()
      left = box.left
      size = box.width / VIEW_WIDTH || 1
    }

    /** Artwork point (before pitch) → screen point, with the current pitch and hover */
    const toScreen = (point: Point): Point => {
      const [x, py] = rotateAbout([point[0], point[1] + bob], RIG.center, pitch.value)
      return [left + x * size, y.value + (py - MIDDLE) * size]
    }
    /** Screen point → artwork point (before pitch) */
    const toArtwork = ([sx, sy]: Point): Point => {
      const [x, py] = rotateAbout([(sx - left) / size, (sy - y.value) / size + MIDDLE], RIG.center, -pitch.value)
      return [x, py - bob]
    }
    /** A point in the head's frame → artwork point (before pitch) */
    const fromHead = (point: Point): Point =>
      rotateAbout([RIG.neck[0] + point[0], RIG.neck[1] + point[1]], RIG.neck, head.value)

    const centerOf = (element: Element): Point => {
      const box = element.getBoundingClientRect()
      return [box.left + box.width / 2, box.top + box.height / 2]
    }

    const choose = () => {
      const viewport = window.innerHeight
      const line = viewport * FOCUS
      let best: HTMLElement | null = null
      let bestAnchor = line
      let bestDistance = Infinity
      for (const target of targets) {
        const box = target.getBoundingClientRect()
        if (box.bottom < 80 || box.top > viewport - 60) continue
        // Aim at the top part of tall elements (where their heading is)
        const anchor = box.top + Math.min(56, box.height * 0.3)
        const distance = Math.abs(anchor - line)
        if (distance < bestDistance) {
          best = target
          bestAnchor = anchor
          bestDistance = distance
        }
      }
      focus = best
      focusBox = best ? best.getBoundingClientRect() : null
      focusPoint = focusBox ? [focusBox.left, bestAnchor] : null
      goal = clamp(bestAnchor, 110, viewport - 90)
      // Only underwater: from the reef down to the seafloor
      visible =
        !!about && !!footer && about.getBoundingClientRect().top < viewport * 0.6 && footer.getBoundingClientRect().top > viewport * 0.35
      root.dataset.visible = String(visible)
      zone = null
      for (const element of zones) {
        const box = element.getBoundingClientRect()
        if (box.top <= goal && box.bottom > goal) zone = element.dataset.zone ?? null
      }
    }

    const nearestVisible = (selector: string) => {
      let nearest: HTMLElement | null = null
      let nearestDistance = Infinity
      for (const element of document.querySelectorAll<HTMLElement>(selector)) {
        const box = element.getBoundingClientRect()
        if (!box.width || box.bottom < 60 || box.top > window.innerHeight - 40 || box.right < 0 || box.left > window.innerWidth) continue
        const distance = Math.abs(box.top + box.height / 2 - y.value)
        if (distance < nearestDistance) {
          nearest = element
          nearestDistance = distance
        }
      }
      return nearest
    }

    const decide = (now: number) => {
      const timed = gesture === 'wave' || gesture === 'watch' || gesture === 'compass' || gesture === 'lamp'
      if (timed && now < gestureUntil) return
      if (gesture === 'lamp') lampOn = true
      if (timed) gesture = 'rest'

      // The deep: reach up and switch the headlamp on when arriving; off again on the way back up
      if (zone === 'deep' && !lampOn) {
        gesture = 'lamp'
        gestureUntil = now + 800
        return
      }
      if (zone !== 'deep') lampOn = false

      // Open water: point at the project card in focus
      if (zone === 'open' && focus?.matches('.bottle-card')) {
        gesture = 'point'
        return
      }
      if (gesture === 'point') gesture = 'rest'

      // Now and then, while mostly still: wave at a reef animal, or check the watch or compass
      if (now < nextIdle || Math.abs(y.velocity) > 140) return
      nextIdle = now + 6500 + Math.random() * 3500
      if (zone === 'reef') {
        const critter = nearestVisible('.zone-reef .critter')
        if (critter) {
          gesture = 'wave'
          gestureTarget = critter
          gesturePoint = null
          gestureUntil = now + 2300
        }
      } else if (zone === 'open') {
        lastCheck = lastCheck === 'watch' ? 'compass' : 'watch'
        gesture = lastCheck
        gestureUntil = now + 2400
      }
    }

    /** A short burst of bubbles from the regulator's exhaust, once per breath */
    const exhale = () => {
      const [sx, sy] = toScreen(fromHead(RIG.exhaust))
      const count = 4 + Math.floor(Math.random() * 3)
      for (let i = 0; i < count; i++) {
        const bubble = document.createElement('span')
        bubble.className = 'diver-bubble'
        const diameter = 3 + Math.random() * 5
        bubble.style.width = bubble.style.height = `${diameter.toFixed(1)}px`
        bubbles.appendChild(bubble)
        const rise = 110 + Math.random() * 90
        const drift = (Math.random() - 0.3) * 26
        bubble
          .animate(
            [
              { transform: `translate(${sx}px, ${sy}px) scale(0.5)`, opacity: 0 },
              { transform: `translate(${sx + drift * 0.2}px, ${sy - 14}px) scale(1)`, opacity: 0.9, offset: 0.12 },
              { transform: `translate(${sx + drift}px, ${sy - rise}px) scale(1.15)`, opacity: 0 },
            ],
            { duration: 1700 + Math.random() * 900, delay: i * 70, easing: 'cubic-bezier(0.25, 0.6, 0.35, 1)', fill: 'both' },
          )
          .finished.then(
            () => bubble.remove(),
            () => bubble.remove(),
          )
      }
    }

    const tick = (now: number) => {
      frame = 0
      const dt = Math.min(0.034, Math.max(0.001, (now - last) / 1000))
      last = now
      if (stale) {
        stale = false
        choose()
      }
      if (!visible) return

      // Body: follow the subject, pitch with the direction and speed of travel, hover gently
      if (reduceMotion) {
        y.value = goal
        y.velocity = 0
      } else {
        y.step(goal, dt)
      }
      const speed = y.velocity
      pitch.step(reduceMotion ? 0 : clamp(speed * 0.02, -24, 24), dt)
      bob = reduceMotion ? 0 : Math.sin(now / 620) * 1.6

      decide(now)

      // Legs: alternating flutter kick, faster when swimming harder; the fins trail on their own springs
      const frequency = 0.75 + Math.min(1.6, Math.abs(speed) / 650)
      const amplitude = reduceMotion ? 0 : 9 + Math.min(9, Math.abs(speed) / 110)
      kick += Math.PI * 2 * frequency * dt
      const legs = (['near', 'far'] as const).map((side) => {
        const phase = kick + (side === 'far' ? Math.PI : 0)
        const thigh = 4 + amplitude * Math.sin(phase)
        const thighSpeed = amplitude * Math.cos(phase) * Math.PI * 2 * frequency
        const knee = 6 + (amplitude ? 10 : 0) * (0.5 + 0.5 * Math.sin(phase - 1.2))
        const fin = fins[side].step(clamp(-thighSpeed * 0.09, -32, 32), dt)
        return { side, thigh, knee, fin }
      })

      // Arms: each hand springs toward its target; two-bone IK places the elbow
      let nearTarget = HANDS.restNear
      let farTarget = HANDS.restFar
      let lookAt: Point | null = focusPoint ? toArtwork(focusPoint) : null
      if (gesture === 'point' && focusBox) {
        const card = toArtwork([focusBox.left, focusBox.top + Math.min(90, focusBox.height * 0.35)])
        const angle = clamp(Math.atan2(card[1] - RIG.shoulderNear[1], card[0] - RIG.shoulderNear[0]), -0.7, 0.7)
        nearTarget = [RIG.shoulderNear[0] + 44 * Math.cos(angle), RIG.shoulderNear[1] + 44 * Math.sin(angle)]
        lookAt = card
      } else if (gesture === 'wave' && gestureTarget) {
        const swing = Math.sin(now / 95)
        nearTarget = [HANDS.wave[0] + swing * 6, HANDS.wave[1] + Math.abs(swing) * 2]
        // The animal swims, so look it up again now and then (not every frame: reading layout is costly)
        if (!gesturePoint || now - gesturePointAt > 300) {
          gesturePoint = centerOf(gestureTarget)
          gesturePointAt = now
        }
        lookAt = toArtwork(gesturePoint)
      } else if (gesture === 'watch') {
        nearTarget = HANDS.watch
      } else if (gesture === 'compass') {
        farTarget = HANDS.compass
      } else if (gesture === 'lamp') {
        nearTarget = HANDS.lamp
      }
      if (reduceMotion) {
        nearHand.x.value = nearTarget[0]
        nearHand.y.value = nearTarget[1]
        farHand.x.value = farTarget[0]
        farHand.y.value = farTarget[1]
      }
      const near = reach(RIG.shoulderNear, nearHand.step(nearTarget, dt), RIG.upperArm, RIG.forearm)
      const far = reach(RIG.shoulderFar, farHand.step(farTarget, dt), RIG.upperArm, RIG.forearm)

      // Head: turn toward the subject (or down at the watch, up at the lamp); the eye does the rest
      const glance = GLANCE[gesture]
      let lookAngle = 0
      if (glance !== undefined) {
        lookAngle = glance
      } else if (lookAt) {
        const eye = fromHead(RIG.eye)
        lookAngle = (Math.atan2(lookAt[1] - eye[1], lookAt[0] - eye[0]) * 180) / Math.PI
      }
      if (reduceMotion) head.value = clamp(lookAngle * 0.6, -26, 28)
      else head.step(clamp(lookAngle * 0.6, -26, 28), dt)
      const eyeAngle = ((lookAngle - head.value) * Math.PI) / 180

      // Breathing: a burst of bubbles on every exhale
      if (!reduceMotion && now >= nextBreath) {
        exhale()
        nextBreath = now + 3900 + Math.random() * 700
      }

      // Headlamp: warms up in the deep, and its beam lights the content in front of the diver
      if (reduceMotion) lamp.value = lampOn ? 1 : 0
      const lampLevel = reduceMotion ? lamp.value : lamp.step(lampOn ? 1 : 0, dt)

      // ---------- Draw (only what changed) ----------
      figure.style.transform = `translate3d(0, ${(y.value - MIDDLE * size).toFixed(1)}px, 0)`
      write(
        'body',
        joints.body,
        'transform',
        `rotate(${pitch.value.toFixed(2)} ${RIG.center[0]} ${RIG.center[1]}) translate(0 ${bob.toFixed(2)})`,
      )
      for (const { side, thigh, knee, fin } of legs) {
        write(`thigh-${side}`, joints[`thigh-${side}`], 'transform', `rotate(${thigh.toFixed(1)})`)
        write(`knee-${side}`, joints[`knee-${side}`], 'transform', `rotate(${knee.toFixed(1)})`)
        write(`fin-${side}`, joints[`fin-${side}`], 'transform', `rotate(${fin.toFixed(1)})`)
      }
      write('shoulder-near', joints['shoulder-near'], 'transform', `rotate(${near.shoulder.toFixed(1)})`)
      write('elbow-near', joints['elbow-near'], 'transform', `rotate(${near.elbow.toFixed(1)})`)
      write('shoulder-far', joints['shoulder-far'], 'transform', `rotate(${far.shoulder.toFixed(1)})`)
      write('elbow-far', joints['elbow-far'], 'transform', `rotate(${far.elbow.toFixed(1)})`)
      write('neck', joints.neck, 'transform', `rotate(${head.value.toFixed(1)})`)
      write('pupil-x', joints.pupil, 'cx', (RIG.eye[0] + 0.6 + Math.cos(eyeAngle) * 0.7).toFixed(2))
      write('pupil-y', joints.pupil, 'cy', (RIG.eye[1] + Math.sin(eyeAngle) * 0.8).toFixed(2))
      if (root.dataset.pose !== gesture) root.dataset.pose = gesture

      if (lampLevel > 0.01) {
        const [lx, ly] = toScreen(fromHead(RIG.lamp))
        beam.style.transform = `translate(${lx.toFixed(1)}px, ${ly.toFixed(1)}px) rotate(${(pitch.value + head.value + 4).toFixed(1)}deg)`
        beam.style.opacity = lampLevel.toFixed(3)
      } else if (beam.style.opacity !== '0') {
        beam.style.opacity = '0'
      }
      const lampState = lampLevel > 0.5 ? 'on' : 'off'
      if (root.dataset.lamp !== lampState) root.dataset.lamp = lampState

      frame = requestAnimationFrame(tick)
    }

    const update = () => {
      stale = true
      if (!frame) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    }
    const onResize = () => {
      targets = Array.from(document.querySelectorAll<HTMLElement>(INTERESTING))
      measure()
      update()
    }

    measure()
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frame)
      for (const animation of bubbles.getAnimations({ subtree: true })) animation.cancel()
    }
  }, [])

  return (
    <div ref={rootRef} className="diver" data-visible="false" data-pose="rest" data-lamp="off" aria-hidden="true">
      <div ref={beamRef} className="diver-beam" />
      <div ref={figureRef} className="diver-figure">
        <DiverFigure svgRef={svgRef} />
      </div>
      <div ref={bubblesRef} className="diver-bubbles" />
    </div>
  )
}
