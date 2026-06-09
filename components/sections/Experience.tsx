'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GlassCard } from '@/components/GlassCard'
import {
  staggerContainerVariants,
  scrollRevealVariants,
  staggerItemVariants,
} from '@/lib/animations'

interface TimelineItem {
  period: string
  title: string
  organization: string
  description: string
  type: 'education' | 'internship' | 'achievement'
}

const timelineItems: TimelineItem[] = [
  {
    period: '2024 - Present',
    title: 'Full Stack Development Internship',
    organization: 'Tech Startup XYZ',
    description: 'Building scalable web applications using Next.js and cloud technologies. Led optimization efforts improving performance by 40%.',
    type: 'internship',
  },
  {
    period: '2023 - 2024',
    title: 'Teaching Assistant',
    organization: 'University CS Department',
    description: 'Assisted in teaching Data Structures and Algorithms. Mentored 50+ students and conducted weekly lab sessions.',
    type: 'achievement',
  },
  {
    period: '2022 - Present',
    title: 'Bachelor of Technology',
    organization: 'Computer Science',
    description: 'Pursuing B.Tech in Computer Science with focus on full-stack development, system design, and algorithms.',
    type: 'education',
  },
  {
    period: '2023',
    title: 'Web Development Internship',
    organization: 'Digital Agency',
    description: 'Developed responsive web applications using React and TypeScript. Improved site load times by 35%.',
    type: 'internship',
  },
  {
    period: '2021 - 2022',
    title: 'Competitive Programmer',
    organization: 'CodeChef',
    description: 'Achieved 4-star rating on CodeChef. Ranked top 500 in multiple contests.',
    type: 'achievement',
  },
]

const typeColors = {
  education: { bg: 'from-cyan', text: 'text-cyan' },
  internship: { bg: 'from-purple', text: 'text-purple' },
  achievement: { bg: 'from-electric-blue', text: 'text-electric-blue' },
}

export function Experience() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  return (
    <section
      id="experience"
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
              <span className="text-white">Experience & </span>
              <span className="text-gradient">Education</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A journey of growth, learning, and professional development.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative space-y-8">
            {/* Vertical line */}
            <motion.div
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan via-purple to-electric-blue"
              scaleY={inView ? 1 : 0}
              transition={{ duration: 1.2, delay: 0.2 }}
              style={{ transformOrigin: 'top' }}
            />

            {/* Timeline items */}
            {timelineItems.map((item, index) => {
              const isLeft = index % 2 === 0
              const colors = typeColors[item.type]

              return (
                <motion.div
                  key={`${item.period}-${item.title}`}
                  className={`relative flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12`}
                  variants={staggerItemVariants}
                  custom={index}
                >
                  {/* Timeline dot */}
                  <motion.div
                    className={`absolute left-0 md:left-1/2 top-6 w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-dark-bg flex items-center justify-center transform md:-translate-x-1/2 flex-shrink-0 bg-gradient-to-br ${colors.bg} to-cyan`}
                    whileHover={{ scale: 1.2 }}
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  />

                  {/* Content */}
                  <div className={`w-full md:w-1/2 pt-6 md:pt-0 pl-12 md:pl-0`}>
                    <GlassCard className="p-6 md:p-8 h-full hover:shadow-glow-blue">
                      {/* Type badge */}
                      <div className="mb-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/10 ${colors.text}`}
                        >
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                      </div>

                      {/* Period */}
                      <p className="text-sm text-gray-400 mb-2">{item.period}</p>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>

                      {/* Organization */}
                      <p className="text-cyan font-semibold mb-4">{item.organization}</p>

                      {/* Description */}
                      <p className="text-gray-300 leading-relaxed">{item.description}</p>
                    </GlassCard>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
