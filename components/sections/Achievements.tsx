'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Medal, Rocket, Trophy } from 'lucide-react'
import { GlassCard, type GlowColor } from '@/components/GlassCard'
import { SectionHeader } from '@/components/SectionHeader'
import {
  staggerContainerVariants,
  fadeUpVariants,
} from '@/lib/animations'

const stats: { label: string; value: string; glow: GlowColor; text: string }[] = [
  { label: 'Problems Solved', value: '328+', glow: 'jedi', text: 'text-jedi' },
  { label: 'LeetCode Rank', value: '408K', glow: 'gold', text: 'text-gold' },
  { label: 'Active Days', value: '246', glow: 'yoda', text: 'text-yoda' },
  { label: 'Max Streak', value: '33', glow: 'sith', text: 'text-sith' },
]

// Easy / Medium / Hard map onto Yoda green, crawl gold and Sith red
const problemStats = [
  { category: 'Easy', solved: 207, total: 949, text: 'text-yoda', saber: '93, 255, 122' },
  { category: 'Medium', solved: 120, total: 2066, text: 'text-gold', saber: '255, 232, 31' },
  { category: 'Hard', solved: 1, total: 942, text: 'text-sith', saber: '255, 59, 59' },
]

const medals = [
  {
    Icon: Medal,
    title: '100 Days Badge 2026',
    detail: 'Consistent daily problem-solving streak on LeetCode',
    glow: 'gold' as GlowColor,
    text: 'text-gold',
  },
  {
    Icon: Rocket,
    title: 'Innoversite Hackathon',
    detail: 'Participant: built and pitched a prototype against the clock',
    glow: 'yoda' as GlowColor,
    text: 'text-yoda',
  },
  {
    Icon: Trophy,
    title: 'HackLoop 2024',
    detail: 'Participant: shipped StudyBuddy, an AI PDF Q&A app',
    glow: 'jedi' as GlowColor,
    text: 'text-jedi',
  },
]

export function Achievements() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section id="achievements" className="section-container relative" ref={ref}>
      <div className="section-content">
        <motion.div
          className="space-y-16"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <SectionHeader
            kicker="Episode VI"
            title="Hall of"
            highlight="Honors"
            description="Medals earned in battle: consistent problem-solving on LeetCode and time spent in the hackathon trenches."
          />

          {/* Medals */}
          <motion.div className="grid gap-6 md:grid-cols-3" variants={fadeUpVariants}>
            {medals.map(({ Icon, title, detail, glow, text }) => (
              <GlassCard key={title} className="p-8 flex flex-col items-center text-center" glowColor={glow}>
                <motion.div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-current/40 bg-white/5 ${text}`}
                  style={{ boxShadow: '0 0 24px currentColor' }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Icon className="h-7 w-7" />
                </motion.div>
                <p className="font-display text-sm uppercase tracking-widest text-white">{title}</p>
                <p className="text-text-muted text-sm mt-3">{detail}</p>
              </GlassCard>
            ))}
          </motion.div>

          {/* Main stats grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={fadeUpVariants}
          >
            {stats.map((stat) => (
              <GlassCard
                key={stat.label}
                className="h-full flex flex-col items-center justify-center py-8"
                glowColor={stat.glow}
              >
                <div className={`font-display text-4xl md:text-5xl font-black mb-3 ${stat.text}`} style={{ textShadow: '0 0 20px currentColor' }}>
                  {stat.value}
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary text-center">
                  {stat.label}
                </p>
              </GlassCard>
            ))}
          </motion.div>

          {/* Problem solving breakdown */}
          <motion.div variants={fadeUpVariants}>
            <h3 className="font-display uppercase tracking-widest text-center text-gold !text-xl mb-8">
              Problems by Difficulty
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {problemStats.map((problem) => {
                const percentage = (problem.solved / problem.total) * 100
                return (
                  <GlassCard key={problem.category} className="p-6" hover={false}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`font-display uppercase tracking-widest ${problem.text}`}>
                        {problem.category}
                      </h4>
                      <span className="font-mono text-sm text-text-muted">
                        {problem.solved}/{problem.total}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <div className="saber-hilt !w-6" />
                      <div className="flex-1 h-1.5 rounded-r-full bg-white/5">
                        <motion.div
                          className="saber-blade !h-1.5"
                          style={{ ['--saber' as string]: problem.saber }}
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${Math.max(percentage, 1.5)}%` } : { width: 0 }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                        />
                      </div>
                    </div>

                    <p className="text-sm text-text-muted mt-3">
                      {percentage.toFixed(1)}% of all {problem.category.toLowerCase()} problems
                    </p>
                  </GlassCard>
                )
              })}
            </div>
          </motion.div>

          {/* Activity summary */}
          <motion.div variants={fadeUpVariants}>
            <GlassCard className="p-8" hover={false} glowColor="mace">
              <h3 className="font-display uppercase tracking-widest !text-xl mb-8">Coding Activity</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: '723+', label: 'Submissions (Last Year)', text: 'text-gold' },
                  { value: '246', label: 'Active Days', text: 'text-yoda' },
                  { value: '33', label: 'Max Streak', text: 'text-jedi' },
                  { value: '408K', label: 'Global Rank', text: 'text-mace' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <p className={`font-display text-3xl font-bold mb-1 ${item.text}`}>{item.value}</p>
                    <p className="text-text-secondary text-sm">{item.label}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
