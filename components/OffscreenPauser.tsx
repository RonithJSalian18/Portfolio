'use client'

import { useEffect } from 'react'

/** Everything with its own decorative animations, besides the hero (HeroParallax) and the zone animals (ZoneLife) */
const ANIMATED = '.dive, main section:not(.hero), .site-footer'

/**
 * Marks big page blocks `data-offscreen` while they're well out of view, so the CSS in base.css pauses their
 * animations. Off-screen animations still cost the browser a layer update on every frame otherwise.
 */
export function OffscreenPauser() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.toggleAttribute('data-offscreen', !entry.isIntersecting)
      },
      // Resume a little before a block scrolls into view
      { rootMargin: '25% 0px' },
    )
    for (const element of document.querySelectorAll(ANIMATED)) observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return null
}
