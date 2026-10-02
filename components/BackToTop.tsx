'use client'

import { useEffect, useRef } from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Shown after the first screens; toggled on the DOM so scrolling never re-renders React
  useEffect(() => {
    const button = buttonRef.current
    if (!button) return
    const update = () => {
      button.dataset.visible = String(window.scrollY > 900)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  const backToTop = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    // Keep keyboard users' place: focus lands on the page title instead of staying at the bottom
    document.getElementById('hero-title')?.focus({ preventScroll: true })
  }

  return (
    <button ref={buttonRef} type="button" className="back-to-top" onClick={backToTop} aria-label="Back to top">
      <ArrowUp className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}
