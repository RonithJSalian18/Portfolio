'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'
import { GlassCard } from '@/components/GlassCard'
import {
  staggerContainerVariants,
  scrollRevealVariants,
} from '@/lib/animations'

interface Testimonial {
  name: string
  role: string
  company: string
  message: string
  avatar?: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Project Manager',
    company: 'TechCorp Solutions',
    message:
      'Ronith is an exceptional developer with a keen eye for detail. Their ability to deliver clean, scalable code while maintaining excellent communication made them invaluable to our team.',
    rating: 5,
  },
  {
    name: 'Alex Chen',
    role: 'CTO',
    company: 'StartUp Innovations',
    message:
      'Working with Ronith was a game-changer for our backend infrastructure. They designed and implemented a system that improved our performance by 50% while maintaining code quality.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'HR Manager',
    company: 'Digital Agency Pro',
    message:
      'Ronith demonstrated remarkable growth during their internship. They went above and beyond in learning new technologies and contributed significantly to multiple projects.',
    rating: 5,
  },
  {
    name: 'Michael Thompson',
    role: 'Senior Engineer',
    company: 'Cloud Systems Inc',
    message:
      'The level of professionalism and technical expertise Ronith brings is impressive. They are a problem-solver who doesn\'t settle for mediocre solutions.',
    rating: 5,
  },
]

export function Testimonials() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const goToSlide = (index: number) => {
    setCurrent(index)
  }

  return (
    <section
      id="testimonials"
      ref={ref}
      className="section-container"
    >
      <div className="section-content">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-12"
        >
          {/* Section title */}
          <motion.div
            className="text-center space-y-4"
            variants={scrollRevealVariants}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-white">What People </span>
              <span className="text-gradient">Say</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Feedback from colleagues, mentors, and clients who have worked with me.
            </p>
          </motion.div>

          {/* Testimonial carousel */}
          <div className="max-w-3xl mx-auto">
            {/* Main testimonial */}
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <GlassCard className="p-8 md:p-12">
                {/* Rating stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>

                {/* Message */}
                <p className="text-gray-300 text-lg leading-relaxed mb-8 italic">
                  &quot;{testimonials[current].message}&quot;
                </p>

                {/* Author info */}
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-white font-bold">
                      {testimonials[current].name.charAt(0)}
                    </span>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-white">{testimonials[current].name}</p>
                    <p className="text-sm text-gray-400">
                      {testimonials[current].role} at {testimonials[current].company}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current
                      ? 'bg-gradient-to-r from-cyan to-electric-blue w-8'
                      : 'bg-white/20 w-2 hover:bg-white/40'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Previous/Next buttons */}
            <div className="flex justify-between items-center mt-8">
              <motion.button
                onClick={() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ←
              </motion.button>

              <span className="text-gray-400 text-sm">
                {current + 1} / {testimonials.length}
              </span>

              <motion.button
                onClick={() => setCurrent((prev) => (prev + 1) % testimonials.length)}
                className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
