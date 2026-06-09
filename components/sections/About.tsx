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
      'BTech in Information Science & Engineering',
      'NMAM Institute of Technology, Nitte',
      'CGPA: 8.64/10',
    ],
  },
  {
    title: 'Core Interests',
    items: [
      'Machine Learning & AI',
      'Data Structures & Algorithms',
      'Full-stack Web Development',
    ],
  },
  {
    title: 'Passions',
    items: [
      'Building scalable solutions',
      'Competitive Problem Solving',
      'Open-source contributions',
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
              <span className="text-gradient">Ronith</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Aspiring software engineer with strong interest in Machine Learning, Data Structures, Algorithms, 
              and Software Development. Passionate about building efficient, scalable, and intelligent solutions.
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
              <p className="text-text-secondary text-lg leading-relaxed mb-4">
                I&apos;m a BTech student in Information Science & Engineering at NMAM Institute of Technology, 
                Nitte, with a CGPA of 8.64. My passion lies in full-stack development, machine learning, and 
                solving complex algorithmic problems. I recently interned at Sasken Technologies, working on 
                LTE RAN protocols and wireless systems.
              </p>
              <p className="text-text-secondary text-lg leading-relaxed">
                I&apos;m committed to continuous learning, problem-solving excellence, and building innovative 
                software solutions. With skills in Python, JavaScript, TypeScript, React, Next.js, and modern 
                DevOps tools, I strive to create impactful applications. I&apos;m always eager to collaborate 
                on challenging projects and contribute to the developer community.
              </p>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
