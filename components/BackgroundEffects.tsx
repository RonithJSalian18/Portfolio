'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export function BackgroundEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])

  // Initialize particles
  useEffect(() => {
    const particleCount = 50
    const newParticles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }))
    setParticles(newParticles)
  }, [])

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let animationId: number
    let time = 0

    const animate = () => {
      time += 0.005

      // Clear canvas with base color
      ctx.fillStyle = '#060816'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw animated gradient mesh
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, `rgba(6, 182, 212, ${0.05 + Math.sin(time) * 0.02})`)
      gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.03 + Math.cos(time * 0.8) * 0.02})`)
      gradient.addColorStop(1, `rgba(139, 92, 246, ${0.05 + Math.sin(time * 0.6) * 0.02})`)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw floating glow orbs
      const orbs = [
        {
          x: canvas.width * 0.2 + Math.sin(time * 0.3) * 100,
          y: canvas.height * 0.3 + Math.cos(time * 0.25) * 80,
          radius: 200,
          color: 'rgba(6, 182, 212, 0.08)',
        },
        {
          x: canvas.width * 0.8 + Math.sin(time * 0.25) * 120,
          y: canvas.height * 0.6 + Math.cos(time * 0.3) * 100,
          radius: 250,
          color: 'rgba(59, 130, 246, 0.06)',
        },
        {
          x: canvas.width * 0.5 + Math.cos(time * 0.2) * 150,
          y: canvas.height * 0.2 + Math.sin(time * 0.28) * 120,
          radius: 280,
          color: 'rgba(139, 92, 246, 0.06)',
        },
        {
          x: canvas.width * 0.3 + Math.cos(time * 0.35) * 130,
          y: canvas.height * 0.8 + Math.sin(time * 0.32) * 140,
          radius: 220,
          color: 'rgba(236, 72, 153, 0.04)',
        },
      ]

      orbs.forEach((orb) => {
        const orbGradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius)
        orbGradient.addColorStop(0, orb.color)
        orbGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = orbGradient
        ctx.fillRect(orb.x - orb.radius, orb.y - orb.radius, orb.radius * 2, orb.radius * 2)
      })

      // Draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Mouse attraction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = 200

        if (distance < maxDistance) {
          particle.vx += dx * 0.0001
          particle.vy += dy * 0.0001
          particle.opacity = Math.min(1, particle.opacity + 0.02)
        } else {
          particle.opacity = Math.max(particle.opacity * 0.98, 0.2)
        }

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -0.8
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -0.8

        // Clamp position
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Draw particle with glow
        ctx.fillStyle = `rgba(6, 182, 212, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw grid overlay
      const gridSize = 80
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)'
      ctx.lineWidth = 1

      for (let x = 0; x < canvas.width; x += gridSize) {
        const waveOffset = Math.sin(time * 0.2 + x * 0.01) * 2
        ctx.beginPath()
        ctx.moveTo(x + waveOffset, 0)
        ctx.lineTo(x + waveOffset, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        const waveOffset = Math.cos(time * 0.2 + y * 0.01) * 2
        ctx.beginPath()
        ctx.moveTo(0, y + waveOffset)
        ctx.lineTo(canvas.width, y + waveOffset)
        ctx.stroke()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [particles])

  return (
    <>
      {/* Canvas for background animations */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' result='noise' seed='2' /%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`,
          opacity: 0.5,
        }}
      />

      {/* Decorative floating elements */}
      <motion.div
        className="fixed top-10 left-10 w-72 h-72 floating-orb"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(6, 182, 212, 0.2), transparent)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="fixed bottom-20 right-10 w-96 h-96 floating-orb"
        style={{
          background: 'radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.15), transparent)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
        animate={{
          y: [0, 40, 0],
          x: [0, -40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="fixed top-1/2 right-1/4 w-80 h-80 floating-orb"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1), transparent)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
        animate={{
          y: [0, -30, 0],
          x: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Mouse glow effect */}
      <motion.div
        className="fixed w-96 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          zIndex: 1,
        }}
        animate={{
          x: mouseRef.current.x - 192,
          y: mouseRef.current.y - 192,
        }}
        transition={{
          type: 'tween',
          duration: 0.3,
        }}
      />
    </>
  )
}
