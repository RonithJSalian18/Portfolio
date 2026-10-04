'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import type { Zone } from './OceanZone'

// Each zone's animals are their own chunk, fetched about a screen before the zone scrolls into view
const LIFE: Record<Zone, React.ComponentType> = {
  reef: dynamic(() => import('./life/ReefLife'), { ssr: false }),
  open: dynamic(() => import('./life/OpenLife'), { ssr: false }),
  twilight: dynamic(() => import('./life/TwilightLife'), { ssr: false }),
  deep: dynamic(() => import('./life/DeepLife'), { ssr: false }),
}

const FLEE_REACH = 150
const FLEE_PUSH = 44

/**
 * The animated layer behind a zone's content. It loads the zone's animals lazily, pauses them while the
 * zone is off-screen, measures the text-free bands between sections ("lanes") where animals may swim,
 * and drives the small reactions: fish scattering from the mouse, eyes following it, and animals that
 * cross the screen as you scroll past.
 */
export function ZoneLife({ zone }: { zone: Zone }) {
  const layerRef = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const layer = layerRef.current
    const zoneElement = layer?.parentElement
    if (!layer || !zoneElement) return

    const lite = document.documentElement.dataset.lite === '1'
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reacts = !lite && !reduceMotion && window.matchMedia('(pointer: fine)').matches
    if (lite) layer.classList.add('is-lite')

    const loader = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNear(true)
        loader.disconnect()
      },
      { rootMargin: '100% 0px' },
    )
    loader.observe(zoneElement)

    // Lanes: the top padding of the first section, each boundary between sections, and the band below the last
    const measure = () => {
      const sections = Array.from(zoneElement.querySelectorAll<HTMLElement>(':scope > section'))
      if (!sections.length) return
      const first = sections[0]
      const last = sections[sections.length - 1]
      const lanes = [first.offsetTop + parseFloat(getComputedStyle(first).paddingTop) * 0.45]
      for (let i = 1; i < sections.length; i++) lanes.push(sections[i].offsetTop)
      const contentEnd = last.offsetTop + last.offsetHeight - parseFloat(getComputedStyle(last).paddingBottom)
      lanes.push((contentEnd + zoneElement.offsetHeight) / 2)
      lanes.forEach((y, i) => layer.style.setProperty(`--lane-${i}`, `${Math.round(y)}px`))
    }
    const resizer = new ResizeObserver(measure)
    resizer.observe(zoneElement)

    let active = false
    let frame = 0
    let pointer: { x: number; y: number } | null = null

    const react = (x: number, y: number) => {
      // All reads first, then all writes: interleaving them would force a fresh layout for every fish
      const fishes = Array.from(layer.querySelectorAll<HTMLElement>('.flee'))
      const eyes = Array.from(layer.querySelectorAll<SVGElement>('.look'))
      // Measure each fish's un-displaced parent so it doesn't chase its own offset
      const fishBoxes = fishes.map((fish) => (fish.parentElement ?? fish).getBoundingClientRect())
      const eyeBoxes = eyes.map((eye) => eye.getBoundingClientRect())

      fishes.forEach((fish, index) => {
        const box = fishBoxes[index]
        const dx = box.left + box.width / 2 - x
        const dy = box.top + box.height / 2 - y
        const distance = Math.hypot(dx, dy) || 1
        if (distance < FLEE_REACH) {
          const push = (1 - distance / FLEE_REACH) * FLEE_PUSH
          fish.style.setProperty('--fx', `${((dx / distance) * push).toFixed(1)}px`)
          fish.style.setProperty('--fy', `${((dy / distance) * push).toFixed(1)}px`)
        } else if (fish.style.getPropertyValue('--fx')) {
          fish.style.removeProperty('--fx')
          fish.style.removeProperty('--fy')
        }
      })
      eyes.forEach((eye, index) => {
        const box = eyeBoxes[index]
        const dx = x - (box.left + box.width / 2)
        const dy = y - (box.top + box.height / 2)
        const distance = Math.hypot(dx, dy) || 1
        eye.style.setProperty('--lx', `${((dx / distance) * 1.6).toFixed(2)}px`)
        eye.style.setProperty('--ly', `${((dy / distance) * 1.2).toFixed(2)}px`)
      })
    }

    const tick = () => {
      frame = 0
      if (!active) return
      if (!reduceMotion) {
        // Animals that cross the screen as you scroll past them
        const viewport = window.innerHeight
        const critters = Array.from(layer.querySelectorAll<HTMLElement>('.scroll-right, .scroll-left'))
        const boxes = critters.map((critter) => critter.getBoundingClientRect())
        critters.forEach((critter, index) => {
          const box = boxes[index]
          const progress = Math.min(1, Math.max(0, (viewport - box.top) / (viewport + box.height)))
          critter.style.setProperty('--sp', progress.toFixed(4))
        })
      }
      if (pointer) react(pointer.x, pointer.y)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    // Pause everything (CSS animations included) while the zone is off-screen
    const activity = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting
      if (active) {
        layer.setAttribute('data-active', '')
        schedule()
      } else {
        layer.removeAttribute('data-active')
      }
    })
    activity.observe(zoneElement)

    const onPointer = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY }
      schedule()
    }
    window.addEventListener('scroll', schedule, { passive: true })
    if (reacts) window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      loader.disconnect()
      activity.disconnect()
      resizer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [])

  const Life = LIFE[zone]
  return (
    <div ref={layerRef} className="zone-life" data-zone={zone} aria-hidden="true">
      {near && <Life />}
    </div>
  )
}
