'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

// The intro (three.js + textures) is its own chunk, only fetched when it's actually going to play
const EarthIntro = dynamic(() => import('./EarthIntro'), { ssr: false })

/** Give up on the intro if it hasn't drawn a frame by then, so a slow connection never blocks the site */
const FAIL_SAFE_MS = 5000

const subscribeNever = () => () => {}
// data-intro is decided before first paint by the boot script in app/layout.tsx
const introIsPlaying = () => {
  const state = document.documentElement.dataset.intro
  return state === 'play' || state === 'running'
}

export function IntroGate() {
  const playing = useSyncExternalStore(subscribeNever, introIsPlaying, () => false)
  const [finished, setFinished] = useState(false)

  const finish = useCallback(() => {
    const root = document.documentElement
    if (root.dataset.intro === 'done') return
    const focusWasInIntro = document.activeElement?.closest('.intro') != null
    root.dataset.intro = 'done'
    document.getElementById('site')?.removeAttribute('inert')
    setFinished(true)
    if (focusWasInIntro) document.getElementById('hero-title')?.focus({ preventScroll: true })
  }, [])

  const markRunning = useCallback(() => {
    if (document.documentElement.dataset.intro === 'play') document.documentElement.dataset.intro = 'running'
  }, [])

  useEffect(() => {
    if (!playing) return
    try {
      sessionStorage.setItem('intro-played', '1')
    } catch {
      // Storage blocked: the intro may play again next visit, which is fine
    }
    // Keep keyboard and screen-reader focus on the intro while it covers the page
    document.getElementById('site')?.setAttribute('inert', '')
    window.scrollTo(0, 0)
    const failSafe = window.setTimeout(() => {
      if (document.documentElement.dataset.intro === 'play') finish()
    }, FAIL_SAFE_MS)
    return () => window.clearTimeout(failSafe)
  }, [playing, finish])

  if (!playing || finished) return null
  return <EarthIntro onReady={markRunning} onDone={finish} />
}
