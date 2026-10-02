'use client'

import { useEffect } from 'react'

/** Feeds the scroll offset to the hero as `--hero-scroll`; CSS turns it into per-layer parallax. */
export function HeroParallax() {
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const offset = Math.min(window.scrollY, hero.offsetHeight)
      hero.style.setProperty('--hero-scroll', offset.toFixed(1))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
