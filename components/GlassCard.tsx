'use client'

import { motion, MotionProps } from 'framer-motion'
import { ReactNode } from 'react'
import { cardHoverVariants } from '@/lib/animations'

interface GlassCardProps extends MotionProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glowColor?: 'cyan' | 'purple' | 'blue'
}

const glowColorMap = {
  cyan: 'hover:shadow-glow',
  purple: 'hover:shadow-glow-purple',
  blue: 'hover:shadow-glow-blue',
}

export function GlassCard({
  children,
  className = '',
  hover = true,
  glowColor = 'cyan',
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card ${glowColorMap[glowColor]} ${className}`}
      variants={hover ? cardHoverVariants : undefined}
      initial="initial"
      whileHover={hover ? 'hover' : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}
