'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GlassCard } from '@/components/GlassCard'
import {
  staggerContainerVariants,
  scrollRevealVariants,
  fadeUpVariants,
} from '@/lib/animations'

export function TechQuotes() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  const quotes = [
    {
      text: 'Stay hungry, stay foolish.',
      author: 'Steve Jobs',
      icon: '💡',
      color: 'from-cyan to-electric-blue',
    },
    {
      text: 'Programs must be written for people to read.',
      author: 'Harold Abelson',
      icon: '📖',
      color: 'from-electric-blue to-purple',
    },
    {
      text: 'Code is like humor. When you have to explain it, it\'s bad.',
      author: 'Cory House',
      icon: '😄',
      color: 'from-purple to-pink',
    },
    {
      text: 'The best way to predict the future is to invent it.',
      author: 'Alan Kay',
      icon: '🚀',
      color: 'from-pink to-cyan',
    },
  ]

  return (
    <section className="section-container relative" ref={ref}>
      <div className="section-content">
        {/* Section title */}
        <motion.div
          className="text-center mb-20"
          variants={scrollRevealVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <h2 className="text-gradient glow-text mb-4">
            Inspiration & Philosophy
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Timeless wisdom that guides my approach to software development and problem-solving.
          </p>
        </motion.div>

        {/* Quotes grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {quotes.map((quote, index) => (
            <motion.div
              key={index}
              variants={fadeUpVariants}
              whileHover={{ y: -4 }}
              className="group"
            >
              <GlassCard className={`h-full p-8 relative overflow-hidden flex flex-col justify-between`}>
                {/* Animated gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${quote.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                {/* Quote icon */}
                <motion.div
                  className="text-5xl mb-6 drop-shadow-lg"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {quote.icon}
                </motion.div>

                {/* Quote text */}
                <blockquote className="relative z-10">
                  <p className="text-xl md:text-2xl font-semibold text-white mb-6 leading-relaxed">
                    "{quote.text}"
                  </p>

                  <footer className="text-text-secondary text-sm">
                    — <cite className="not-italic font-medium">{quote.author}</cite>
                  </footer>
                </blockquote>

                {/* Decorative gradient line */}
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${quote.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                />
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="mt-20 text-center"
          variants={fadeUpVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <p className="text-text-secondary text-lg">
            These principles drive my commitment to building quality software and solving challenging problems.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
