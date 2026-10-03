'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Diver = dynamic(() => import('./Diver'), { ssr: false })

/** Margins are only wide enough for the full diver from this width up (narrower screens get the mini diver
 * that swims between sections, see MiniDiver) */
const WIDE_ENOUGH = '(min-width: 1280px)'

/**
 * Loads the diver once any part of the ocean is about a screen away, on screens with room for it in the
 * margin. Watching every zone (not just the first) covers links that land straight on a deeper section.
 */
export function DiverGate() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const zones = document.querySelectorAll('.zone')
    const media = window.matchMedia(WIDE_ENOUGH)
    if (!zones.length) return

    let near = false
    const sync = () => setShow(near && media.matches)
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        near = true
        sync()
        observer.disconnect()
      },
      { rootMargin: '100% 0px' },
    )
    for (const zone of zones) observer.observe(zone)
    media.addEventListener('change', sync)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', sync)
    }
  }, [])

  return show ? <Diver /> : null
}
