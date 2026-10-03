'use client'

import { useEffect } from 'react'

/**
 * Feeds the scroll offset to the hero as `--hero-scroll` (CSS turns it into per-layer parallax), and
 * marks the hero `data-offscreen` while it's out of view so its animations pause.
 */
export function HeroParallax() {
  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return

    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) hero.removeAttribute('data-offscreen')
      else hero.setAttribute('data-offscreen', '')
    })
    visibility.observe(hero)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => visibility.disconnect()

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
      visibility.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
