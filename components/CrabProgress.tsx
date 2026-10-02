'use client'

import { useEffect, useRef } from 'react'

/**
 * Scroll progress as a crab walking along the screen edge (right edge on desktop, bottom edge on
 * smaller screens). Progress goes to CSS as `--progress`; the legs only scuttle while the page moves.
 */
export function CrabProgress() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    let idleTimer = 0
    const update = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
      track.style.setProperty('--progress', progress.toFixed(4))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
      track.setAttribute('data-moving', '')
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => track.removeAttribute('data-moving'), 160)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
      window.clearTimeout(idleTimer)
    }
  }, [])

  return (
    <div ref={trackRef} className="crab-track" aria-hidden="true">
      <div className="crab">
        <svg viewBox="0 0 40 30" focusable="false">
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <g className="crab-leg crab-legs-a">
              <path d="M10 16 4 13 2 16" />
              <path d="M11 22 5 25 4 28" />
              <path d="M30 19 37 19 39 23" />
            </g>
            <g className="crab-leg crab-legs-b">
              <path d="M10 19 3 19 1 23" />
              <path d="M30 16 36 13 38 16" />
              <path d="M29 22 35 25 36 28" />
            </g>
            <path d="M14 14 9.5 8.5M26 14 30.5 8.5M17 12.5 16 8.5M23 12.5 24 8.5" />
          </g>
          <circle cx="8.5" cy="6.5" r="3.6" fill="currentColor" />
          <circle cx="31.5" cy="6.5" r="3.6" fill="currentColor" />
          <path className="crab-pincer" d="M8.5 6.5 6 3.2M31.5 6.5 34 3.2" strokeWidth="1.4" strokeLinecap="round" />
          <ellipse cx="20" cy="19" rx="10.5" ry="7.5" fill="currentColor" />
          <ellipse cx="17" cy="16.5" rx="4" ry="2" fill="#fff" opacity="0.35" />
          <circle className="crab-eye" cx="16" cy="7.8" r="1.7" />
          <circle className="crab-eye" cx="24" cy="7.8" r="1.7" />
        </svg>
      </div>
    </div>
  )
}
