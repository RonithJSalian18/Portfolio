'use client'

import { useEffect } from 'react'

/**
 * One observer for every `[data-reveal]` element on the page: marks each as revealed the first time it
 * scrolls into view. The fade itself is plain CSS (see base.css), so sections stay server components.
 */
export function RevealObserver() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])')
    const reveal = (element: HTMLElement) => element.setAttribute('data-revealed', '')

    if (!('IntersectionObserver' in window)) {
      elements.forEach(reveal)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          reveal(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return null
}
