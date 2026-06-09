'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GlassCard } from '@/components/GlassCard'
import {
  staggerContainerVariants,
  scrollRevealVariants,
  fadeUpVariants,
} from '@/lib/animations'

export function Achievements() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const stats = [
    {
      label: 'Problems Solved',
      value: '328+',
      color: 'from-cyan to-electric-blue',
    },
    {
      label: 'LeetCode Rank',
      value: '408K',
      color: 'from-electric-blue to-purple',
    },
    {
      label: 'Active Days',
      value: '246',
      color: 'from-purple to-pink',
    },
    {
      label: 'Max Streak',
      value: '33',
      color: 'from-pink to-cyan',
    },
  ]

  const problemStats = [
    { category: 'Easy', solved: 207, total: 949, color: 'text-green-400' },
    { category: 'Medium', solved: 120, total: 2066, color: 'text-yellow-400' },
    { category: 'Hard', solved: 1, total: 942, color: 'text-red-400' },
  ]

  return (
    <section id="achievements" className="section-container relative" ref={ref}>
      <div className="section-content">
        {/* Section title */}
        <motion.div
          className="text-center mb-20"
          variants={scrollRevealVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h2 className="text-gradient glow-text mb-4">
            Coding Journey & Achievements
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Consistent problem-solving on LeetCode showcasing dedication to Data Structures, Algorithms, and Software Development excellence.
          </p>
        </motion.div>

        {/* Main stats grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUpVariants}
              className="group"
            >
              <GlassCard className={`h-full flex flex-col items-center justify-center py-8 relative overflow-hidden`}>
                {/* Animated gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                <motion.div
                  className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {stat.value}
                </motion.div>

                <p className="text-text-secondary font-medium text-center">
                  {stat.label}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Problem solving breakdown */}
        <motion.div
          className="mb-16"
          variants={fadeUpVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h3 className="text-2xl font-bold mb-8 text-center">
            Problem Solving by Difficulty
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problemStats.map((problem) => {
              const percentage = (problem.solved / problem.total) * 100
              return (
                <motion.div
                  key={problem.category}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <GlassCard className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`text-lg font-bold ${problem.color}`}>
                        {problem.category}
                      </h4>
                      <span className="text-sm text-text-muted">
                        {problem.solved}/{problem.total}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${problem.color === 'text-green-400' ? 'from-green-400 to-emerald-500' : problem.color === 'text-yellow-400' ? 'from-yellow-400 to-amber-500' : 'from-red-400 to-rose-500'}`}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${percentage}%` } : { width: 0 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                      />
                    </div>

                    <p className="text-sm text-text-muted mt-3">
                      {percentage.toFixed(1)}% Complete
                    </p>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* LeetCode submissions activity */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold mb-6">Coding Activity</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-gradient mb-1">723+</p>
                <p className="text-text-secondary text-sm">Submissions (Last Year)</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan mb-1">246</p>
                <p className="text-text-secondary text-sm">Active Days</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-electric-blue mb-1">33</p>
                <p className="text-text-secondary text-sm">Max Streak</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple mb-1">408K</p>
                <p className="text-text-secondary text-sm">Global Rank</p>
              </div>
            </div>

            {/* Heatmap visualization */}
            <div className="space-y-2">
              <p className="text-sm text-text-muted mb-4">
                Contribution activity showcasing consistent daily problem-solving and commitment to coding excellence.
              </p>

              {/* Simplified activity grid */}
              <div className="grid grid-cols-13 md:grid-cols-26 gap-1">
                {Array.from({ length: 365 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-2 rounded-xs ${
                      Math.random() > 0.4
                        ? 'bg-gradient-to-br from-cyan to-electric-blue'
                        : 'bg-white/5'
                    }`}
                    whileHover={{ scale: 1.5 }}
                  />
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Badges */}
        <motion.div
          className="mt-16"
          variants={fadeUpVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h3 className="text-2xl font-bold mb-8 text-center">Achievements</h3>

          <div className="flex flex-wrap justify-center gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <GlassCard className="p-8 flex flex-col items-center">
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  🏅
                </motion.div>
                <p className="font-semibold text-center">100 Days Badge 2026</p>
                <p className="text-text-muted text-sm mt-2">
                  Consistent daily problem-solving streak
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
