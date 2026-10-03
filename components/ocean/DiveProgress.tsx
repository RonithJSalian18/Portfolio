'use client'

import { useEffect, useRef } from 'react'

/** Tells the dive section how far it has been scrolled (`--dive`, 0 to 1); CSS moves the waterline. */
export function DiveProgress() {
  const markerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const dive = markerRef.current?.parentElement
    if (!dive || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const rect = dive.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 1
      dive.style.setProperty('--dive', progress.toFixed(4))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return <span ref={markerRef} hidden />
}
