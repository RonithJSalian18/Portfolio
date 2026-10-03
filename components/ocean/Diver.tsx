'use client'

import { useEffect, useRef } from 'react'

// What the diver swims over to look at. Pointing is reserved for project cards and skills.
const INTERESTING = [
  '.zone .section-head',
  '.zone .about-story',
  '.zone .about-card',
  '.zone .pool',
  '.zone .gauges',
  '.zone .bottle-card',
  '.zone .trail-card',
  '.zone .medal',
  '.zone .deep-scene',
  '.zone .contact-form',
].join(',')
const POINT_AT = '.bottle-card, .pool, .gauges'

/** The line (share of the viewport height) the diver tries to keep its subject on */
const FOCUS = 0.45

/**
 * A scuba diver in the left margin who follows the scroll: it swims to whatever is in focus, pitches
 * toward where it's heading, kicks harder while moving, and points at project cards and skills.
 */
export default function Diver() {
  const rootRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const body = bodyRef.current
    if (!root || !body) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const about = document.getElementById('about')
    const footer = document.querySelector('footer')
    let targets = Array.from(document.querySelectorAll<HTMLElement>(INTERESTING))

    // Start above the screen so the first appearance is a dive in from the surface
    let y = -120
    let velocity = 0
    let goal = window.innerHeight * FOCUS
    let frame = 0

    const choose = () => {
      const viewport = window.innerHeight
      const focus = viewport * FOCUS
      let best: HTMLElement | null = null
      let bestAnchor = focus
      let bestDistance = Infinity
      for (const target of targets) {
        const box = target.getBoundingClientRect()
        if (box.bottom < 80 || box.top > viewport - 60) continue
        // Aim at the top part of tall elements (where their heading is)
        const anchor = box.top + Math.min(56, box.height * 0.3)
        const distance = Math.abs(anchor - focus)
        if (distance < bestDistance) {
          best = target
          bestAnchor = anchor
          bestDistance = distance
        }
      }
      root.dataset.pose = best?.matches(POINT_AT) ? 'point' : 'look'
      goal = Math.min(viewport - 90, Math.max(110, bestAnchor))
      // Only underwater: from the reef down to the seafloor
      const underwater =
        !!about && !!footer && about.getBoundingClientRect().top < viewport * 0.6 && footer.getBoundingClientRect().top > viewport * 0.35
      root.dataset.visible = String(underwater)
    }

    const step = () => {
      frame = 0
      if (reduceMotion) {
        y = goal
        velocity = 0
      } else {
        // Damped spring toward the goal: eases in rather than snapping
        velocity += (goal - y) * 0.045
        velocity *= 0.84
        y += velocity
      }
      const tilt = Math.max(-32, Math.min(32, velocity * 2.4))
      body.style.transform = `translate3d(-50%, ${y.toFixed(1)}px, 0) translateY(-50%) rotate(${tilt.toFixed(1)}deg)`
      root.style.setProperty('--kick', `${Math.max(0.35, 1.4 - Math.abs(velocity) * 0.12).toFixed(2)}s`)
      root.style.setProperty('--diver-y', `${y.toFixed(1)}px`)
      if (Math.abs(velocity) > 0.05 || Math.abs(goal - y) > 0.5) frame = requestAnimationFrame(step)
    }

    const update = () => {
      choose()
      if (!frame) frame = requestAnimationFrame(step)
    }
    const onResize = () => {
      targets = Array.from(document.querySelectorAll<HTMLElement>(INTERESTING))
      update()
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={rootRef} className="diver" data-visible="false" data-pose="look" aria-hidden="true">
      <div className="diver-bubbles">
        <span />
        <span />
        <span />
      </div>
      <div ref={bodyRef} className="diver-body">
        <div className="diver-hover">
          <svg viewBox="0 0 170 80" focusable="false">
            <g className="diver-fin diver-fin-top">
              <path d="M34 30 6 17Q1 21 5 26L30 38Z" />
            </g>
            <g className="diver-fin diver-fin-bottom">
              <path d="M34 44 6 51Q2 56 7 58L31 52Z" />
            </g>
            <g className="diver-suit">
              <path d="M70 34Q52 30 34 31V40Q52 40 70 42Z" />
              <path d="M70 42Q52 46 34 45V52Q52 54 72 51Z" />
              <path d="M66 30Q90 24 112 28 122 32 120 42 118 52 104 54 86 56 66 52Z" />
            </g>
            <path className="diver-stripe" d="M72 45Q92 47 114 43" />
            <rect className="diver-tank" x="68" y="15" width="44" height="14" rx="7" />
            <rect className="diver-tank-band" x="80" y="15" width="5" height="14" />
            <rect className="diver-valve" x="111" y="18" width="6" height="7" rx="1.5" />
            <path className="diver-hose" d="M141 44Q128 56 115 22" />
            <circle className="diver-suit-fill" cx="130" cy="36" r="11.5" />
            <path className="diver-mask" d="M128 27.5h9.5q4.5 0 4.5 4.5v5.5q0 4.5-4.5 4.5H128z" />
            <path className="diver-glint" d="M131.5 30.5h5" />
            <circle className="diver-reg" cx="141.5" cy="44.5" r="2.8" />
            <rect className="diver-lamp" x="131" y="22" width="6" height="4.5" rx="1.2" />
            <circle className="diver-lamp-light" cx="137.5" cy="24.2" r="1.8" />
            <g className="diver-arm">
              <path className="diver-arm-limb" d="M110 36 130 38 146 36.5" />
              <circle className="diver-glove" cx="148" cy="36.3" r="3.6" />
              <path className="diver-finger" d="M150.5 35.4 156 34.6" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
