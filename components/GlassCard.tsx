'use client'

import { motion, MotionProps } from 'framer-motion'
import { ReactNode } from 'react'
import { cardHoverVariants } from '@/lib/animations'

export type GlowColor = 'jedi' | 'sith' | 'yoda' | 'mace' | 'gold'

interface GlassCardProps extends MotionProps {
  children: ReactNode
  className?: string
  hover?: boolean
  /** Lightsaber color used for the border, corner brackets and hover glow */
  glowColor?: GlowColor
}

export function GlassCard({
  children,
  className = '',
  hover = true,
  glowColor = 'jedi',
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card glow-${glowColor} ${className}`}
      variants={hover ? cardHoverVariants : undefined}
      initial="initial"
      whileHover={hover ? 'hover' : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}
