'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'

// The intro (WebGL renderer + maps) is its own chunk, only fetched when it's actually going to play
const EarthIntro = dynamic(() => import('./EarthIntro'), { ssr: false })

/** Give up on the intro if it hasn't drawn a frame by then, so a slow connection never blocks the site */
const FAIL_SAFE_MS = 5000

const subscribeNever = () => () => {}

/** Let the page move and take focus again. Both restyle the whole page, so they happen together, once. */
function releasePage() {
  document.documentElement.removeAttribute('data-paused')
  document.getElementById('site')?.removeAttribute('inert')
}
// data-intro is decided before first paint by the boot script in app/layout.tsx
const introIsPlaying = () => {
  const state = document.documentElement.dataset.intro
  return state === 'play' || state === 'running'
}

export function IntroGate() {
  const playing = useSyncExternalStore(subscribeNever, introIsPlaying, () => false)
  const [finished, setFinished] = useState(false)
  // The intro's code only starts loading once the page has painted, so it never delays it
  const [started, setStarted] = useState(false)

  const finish = useCallback(() => {
    const root = document.documentElement
    if (root.dataset.intro === 'done') return
    const focusWasInIntro = document.activeElement?.closest('.intro') != null
    root.dataset.intro = 'done'
    releasePage()
    setFinished(true)
    if (focusWasInIntro) document.getElementById('hero-title')?.focus({ preventScroll: true })
  }, [])

  const markRunning = useCallback(() => {
    if (document.documentElement.dataset.intro === 'play') document.documentElement.dataset.intro = 'running'
  }, [])

  // The clouds are parting over the hero (or the intro is fading out), so the page underneath can start moving
  // again
  const markRevealing = useCallback(() => {
    if (document.documentElement.dataset.intro === 'running') document.documentElement.dataset.intro = 'reveal'
    releasePage()
  }, [])

  useEffect(() => {
    if (!playing) return
    try {
      sessionStorage.setItem('intro-played', '1')
    } catch {
      // Storage blocked: the intro may play again next visit, which is fine
    }
    // Keep keyboard and screen-reader focus on the intro while it covers the page (app/page.tsx normally did
    // this already, before the page was styled; adding it now would restyle the whole page)
    const site = document.getElementById('site')
    if (site && !site.hasAttribute('inert')) site.setAttribute('inert', '')
    window.scrollTo(0, 0)
    const start = () => setStarted(true)
    // Safari has no requestIdleCallback; a short timeout does the same job there
    const hasIdle = typeof window.requestIdleCallback === 'function'
    const idle = hasIdle ? window.requestIdleCallback(start, { timeout: 700 }) : window.setTimeout(start, 300)
    const failSafe = window.setTimeout(() => {
      if (document.documentElement.dataset.intro === 'play') finish()
    }, FAIL_SAFE_MS)
    return () => {
      window.clearTimeout(failSafe)
      if (hasIdle) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
    }
  }, [playing, finish])

  if (!playing || finished || !started) return null
  return <EarthIntro onReady={markRunning} onReveal={markRevealing} onDone={finish} />
}
