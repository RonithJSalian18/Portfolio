'use client'

import { useEffect, useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
let switchTimer = 0

// The theme lives on <html data-theme>, set before paint by the boot script in app/layout.tsx.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

const getTheme = (): Theme => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
const getServerTheme = (): Theme | null => null

function applyTheme(theme: Theme) {
  const root = document.documentElement
  // Temporarily lets every color fade (see .theme-switching in base.css) while the sun sets or the moon rises
  root.classList.add('theme-switching')
  window.clearTimeout(switchTimer)
  switchTimer = window.setTimeout(() => root.classList.remove('theme-switching'), 1700)
  root.dataset.theme = theme
  root.style.colorScheme = theme
}

function storedTheme(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme)

  // Follow the system setting until the visitor picks a theme themselves
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = (event: MediaQueryListEvent) => {
      if (!storedTheme()) applyTheme(event.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onSystemChange)
    return () => media.removeEventListener('change', onSystemChange)
  }, [])

  const next: Theme = theme === 'dark' ? 'light' : 'dark'
  const label = theme ? `Switch to ${next} theme (${next === 'dark' ? 'night' : 'day'} beach)` : 'Switch theme'

  const toggle = () => {
    applyTheme(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage can be blocked; the switch still works for this visit
    }
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      <span className="tt-stars" aria-hidden="true" />
      <span className="tt-sun" aria-hidden="true" />
      <span className="tt-moon" aria-hidden="true" />
      <span className="tt-sea" aria-hidden="true" />
    </button>
  )
}
