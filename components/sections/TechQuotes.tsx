'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GlassCard, type GlowColor } from '@/components/GlassCard'
import { SectionHeader } from '@/components/SectionHeader'
import {
  staggerContainerVariants,
  fadeUpVariants,
} from '@/lib/animations'

const quotes: { text: string; author: string; lesson: string; glow: GlowColor; accent: string }[] = [
  {
    text: 'Do. Or do not. There is no try.',
    author: 'Yoda',
    lesson: 'Ship it properly, or not at all. Half-finished features help no one.',
    glow: 'yoda',
    accent: 'text-yoda',
  },
  {
    text: 'The greatest teacher, failure is.',
    author: 'Yoda',
    lesson: 'Every failing test and red build is a lesson in disguise.',
    glow: 'jedi',
    accent: 'text-jedi',
  },
  {
    text: 'Your focus determines your reality.',
    author: 'Qui-Gon Jinn',
    lesson: 'Deep work beats multitasking: one problem, fully solved.',
    glow: 'gold',
    accent: 'text-gold',
  },
  {
    text: "In my experience, there's no such thing as luck.",
    author: 'Obi-Wan Kenobi',
    lesson: 'Consistency, not luck, is what 328+ solved problems are made of.',
    glow: 'mace',
    accent: 'text-mace',
  },
]

export function TechQuotes() {
  const { ref, inView } = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  return (
    <section className="section-container relative" ref={ref}>
      <div className="section-content">
        <motion.div
          className="space-y-16"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <SectionHeader
            kicker="Jedi Archives"
            title="Wisdom of the"
            highlight="Jedi"
            description="Timeless words from a galaxy far, far away that shape how I approach software and problem-solving."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {quotes.map((quote) => (
              <motion.div key={quote.text} variants={fadeUpVariants} className="group">
                <GlassCard className="h-full p-8 flex flex-col justify-between" glowColor={quote.glow}>
                  <blockquote className="relative z-10">
                    <span className={`font-display text-5xl leading-none ${quote.accent}`} aria-hidden="true">
                      &ldquo;
                    </span>
                    <p className="text-xl md:text-2xl font-semibold text-white mb-5 leading-relaxed">
                      {quote.text}
                    </p>
                    <footer className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted">
                      &mdash; <cite className="not-italic">{quote.author}</cite>
                    </footer>
                  </blockquote>

                  <p className="mt-6 pt-5 border-t border-white/10 text-sm text-text-secondary">
                    <span className={`font-mono text-[11px] uppercase tracking-[0.25em] mr-2 ${quote.accent}`}>
                      In code:
                    </span>
                    {quote.lesson}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
