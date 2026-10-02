'use client'

import { motion } from 'framer-motion'
import { scrollRevealVariants } from '@/lib/animations'

interface SectionHeaderProps {
  /** Small HUD label above the title, e.g. "Episode II" */
  kicker: string
  title: string
  highlight: string
  description?: string
}

export function SectionHeader({ kicker, title, highlight, description }: SectionHeaderProps) {
  return (
    <motion.div className="text-center space-y-5" variants={scrollRevealVariants}>
      <div className="flex items-center justify-center gap-3">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-jedi" />
        <span className="hud-label">{kicker}</span>
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-jedi" />
      </div>
      <h2 className="font-display uppercase tracking-wider">
        <span className="text-text-primary">{title} </span>
        <span className="text-gradient glow-text">{highlight}</span>
      </h2>
      {description && (
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">{description}</p>
      )}
    </motion.div>
  )
}
