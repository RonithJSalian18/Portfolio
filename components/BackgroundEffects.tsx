'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  /** 0 = far, 2 = near. Nearer stars drift faster and parallax more on scroll. */
  layer: number
  twinkleOffset: number
  tint: string
}

interface Streak {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

const STAR_TINTS = ['255, 255, 255', '207, 232, 255', '255, 244, 214']
const LAYER_SPEED = [0.02, 0.05, 0.1]
const LAYER_PARALLAX = [0.03, 0.08, 0.16]

export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let stars: Star[] = []
    const streaks: Streak[] = []

    const seedStars = () => {
      const count = Math.min(420, Math.floor((width * height) / 4500))
      stars = Array.from({ length: count }, () => {
        const layer = Math.random() < 0.6 ? 0 : Math.random() < 0.75 ? 1 : 2
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.4 + layer * 0.45 + Math.random() * 0.4,
          layer,
          twinkleOffset: Math.random() * Math.PI * 2,
          tint: STAR_TINTS[Math.floor(Math.random() * STAR_TINTS.length)],
        }
      })
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seedStars()
      if (reduceMotion) draw(0)
    }

    const drawNebula = (time: number) => {
      const blobs = [
        { x: 0.18, y: 0.25, r: 0.45, color: '30, 123, 255', alpha: 0.07 },
        { x: 0.85, y: 0.7, r: 0.5, color: '255, 59, 59', alpha: 0.045 },
        { x: 0.55, y: 0.05, r: 0.4, color: '179, 107, 255', alpha: 0.04 },
      ]
      blobs.forEach((blob, i) => {
        const cx = width * blob.x + Math.sin(time * 0.1 + i) * 40
        const cy = height * blob.y + Math.cos(time * 0.08 + i) * 30
        const r = Math.max(width, height) * blob.r
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        gradient.addColorStop(0, `rgba(${blob.color}, ${blob.alpha})`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      })
    }

    const draw = (time: number) => {
      ctx.fillStyle = '#03040b'
      ctx.fillRect(0, 0, width, height)
      drawNebula(time)

      const scroll = window.scrollY
      for (const star of stars) {
        if (!reduceMotion) {
          star.x -= LAYER_SPEED[star.layer]
          if (star.x < 0) star.x += width
        }
        const y = (((star.y - scroll * LAYER_PARALLAX[star.layer]) % height) + height) % height
        const twinkle = reduceMotion ? 0.8 : 0.55 + Math.sin(time * 1.6 + star.twinkleOffset) * 0.35
        ctx.fillStyle = `rgba(${star.tint}, ${twinkle})`
        ctx.beginPath()
        ctx.arc(star.x, y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Hyperspace streaks: rare, fast, fading lines
      if (!reduceMotion && Math.random() < 0.006 && streaks.length < 2) {
        const fromLeft = Math.random() < 0.5
        streaks.push({
          x: fromLeft ? -50 : width + 50,
          y: Math.random() * height * 0.6,
          vx: (fromLeft ? 1 : -1) * (9 + Math.random() * 6),
          vy: 2 + Math.random() * 2,
          life: 1,
        })
      }
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i]
        s.x += s.vx
        s.y += s.vy
        s.life -= 0.012
        const gradient = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 12, s.y - s.vy * 12)
        gradient.addColorStop(0, `rgba(200, 236, 255, ${s.life})`)
        gradient.addColorStop(1, 'rgba(76, 201, 255, 0)')
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - s.vx * 12, s.y - s.vy * 12)
        ctx.stroke()
        if (s.life <= 0 || s.x < -300 || s.x > width + 300) streaks.splice(i, 1)
      }
    }

    resize()
    window.addEventListener('resize', resize)

    let animationId = 0
    const drawStatic = () => draw(0)
    if (reduceMotion) {
      drawStatic()
      window.addEventListener('scroll', drawStatic, { passive: true })
    } else {
      const loop = (now: number) => {
        draw(now / 1000)
        animationId = requestAnimationFrame(loop)
      }
      animationId = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', drawStatic)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />
      {/* Vignette so content at the edges stays readable */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0, 0, 0, 0.55) 100%)',
        }}
        aria-hidden="true"
      />
    </>
  )
}
