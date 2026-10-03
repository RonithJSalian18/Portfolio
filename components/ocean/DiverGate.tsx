'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Diver = dynamic(() => import('./Diver'), { ssr: false })

/** Margins are only wide enough for the diver (or its bubble trail) from this width up */
const WIDE_ENOUGH = '(min-width: 1024px)'

/** Loads the diver once the reef is about a screen away, on screens with room for it in the margin */
export function DiverGate() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const about = document.getElementById('about')
    const media = window.matchMedia(WIDE_ENOUGH)
    if (!about) return

    let near = false
    const sync = () => setShow(near && media.matches)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        near = true
        sync()
        observer.disconnect()
      },
      { rootMargin: '100% 0px' },
    )
    observer.observe(about)
    media.addEventListener('change', sync)
    return () => {
      observer.disconnect()
      media.removeEventListener('change', sync)
    }
  }, [])

  return show ? <Diver /> : null
}
