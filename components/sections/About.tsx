'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GlassCard } from '@/components/GlassCard'
import {
  staggerContainerVariants,
  scrollRevealVariants,
  staggerItemVariants,
} from '@/lib/animations'

const aboutItems = [
  {
    title: 'Education',
    items: [
      'Bachelor of Technology in Computer Science',
      'GPA: 3.8/4.0',
      'Active learner and problem solver',
    ],
  },
  {
    title: 'Interests',
    items: [
      'Full-stack web development',
      'System design and architecture',
      'Open source contributions',
    ],
  },
  {
    title: 'Goals',
    items: [
      'Build scalable, impactful products',
      'Master backend technologies',
      'Contribute to cutting-edge projects',
    ],
  },
]

export function About() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  return (
    <section
      id="about"
      ref={ref}
      className="section-container"
    >
      <div className="section-content">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-16"
        >
          {/* Section title */}
          <motion.div
            className="text-center space-y-4"
            variants={scrollRevealVariants}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-white">About </span>
              <span className="text-gradient">Me</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A passionate computer science student dedicated to building elegant solutions
              to complex problems through clean, scalable code.
            </p>
          </motion.div>

          {/* About cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutItems.map((item, index) => (
              <motion.div
                key={item.title}
                variants={staggerItemVariants}
                custom={index}
              >
                <GlassCard className="h-full p-6 md:p-8 hover:shadow-glow-cyan">
                  <h3 className="text-2xl font-bold text-cyan mb-4">{item.title}</h3>
                  <ul className="space-y-3">
                    {item.items.map((listItem, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-purple mt-1 flex-shrink-0">•</span>
                        <span className="text-gray-300">{listItem}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Introduction paragraph */}
          <motion.div
            className="max-w-3xl mx-auto"
            variants={scrollRevealVariants}
          >
            <GlassCard className="p-8 md:p-12">
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                I&apos;m a third-year Computer Science student with a passion for full-stack
                development and system design. My journey in tech started with curiosity about
                how things work, and it has evolved into a deep commitment to building
                meaningful software solutions.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Beyond coding, I believe in continuous learning, contributing to open-source
                projects, and creating products that make a real impact. I&apos;m always excited
                to collaborate with talented individuals and tackle challenging problems.
              </p>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
