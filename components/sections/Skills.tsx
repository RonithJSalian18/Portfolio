'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GlassCard } from '@/components/GlassCard'
import {
  staggerContainerVariants,
  scrollRevealVariants,
  staggerItemVariants,
} from '@/lib/animations'

const skillCategories = [
  {
    category: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    color: 'from-cyan',
  },
  {
    category: 'Backend',
    skills: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'MongoDB'],
    color: 'from-electric-blue',
  },
  {
    category: 'Databases',
    skills: ['PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'Prisma ORM'],
    color: 'from-purple',
  },
  {
    category: 'Tools & DevOps',
    skills: ['Git', 'Docker', 'GitHub', 'Vercel', 'AWS'],
    color: 'from-cyan',
  },
  {
    category: 'Data Science',
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Tableau'],
    color: 'from-electric-blue',
  },
  {
    category: 'Other',
    skills: ['Problem Solving', 'System Design', 'Agile', 'REST APIs', 'GraphQL'],
    color: 'from-purple',
  },
]

export function Skills() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  return (
    <section
      id="skills"
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
              <span className="text-white">My </span>
              <span className="text-gradient">Skills</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A comprehensive toolkit of technologies and expertise gained through continuous learning
              and practical application.
            </p>
          </motion.div>

          {/* Skills grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.category}
                variants={staggerItemVariants}
                custom={index}
              >
                <GlassCard
                  className="h-full p-6 md:p-8 hover:shadow-glow-blue group"
                  glowColor="blue"
                >
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`h-1 w-12 rounded-full bg-gradient-to-r ${category.color} to-cyan`}
                    />
                    <h3 className="text-xl font-bold text-white">{category.category}</h3>
                  </div>

                  {/* Skills list with hover effects */}
                  <div className="space-y-3">
                    {category.skills.map((skill, i) => (
                      <motion.div
                        key={skill}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                        transition={{ delay: 0.1 * i }}
                      >
                        <motion.span
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color} to-cyan`}
                          whileHover={{ scale: 1.5 }}
                        />
                        <span className="text-gray-300 group-hover:text-white transition-colors">
                          {skill}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Decorative glow element on hover */}
                  <motion.div
                    className={`absolute -inset-1 rounded-3xl bg-gradient-to-r ${category.color} to-cyan opacity-0 blur group-hover:opacity-20 transition-opacity duration-300 -z-10`}
                  />
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Proficiency summary */}
          <motion.div
            className="max-w-2xl mx-auto"
            variants={scrollRevealVariants}
          >
            <GlassCard className="p-8 md:p-12">
              <h3 className="text-2xl font-bold text-white mb-4">Proficiency Summary</h3>
              <div className="space-y-6">
                {[
                  { skill: 'Frontend Development', level: 90 },
                  { skill: 'Backend Development', level: 85 },
                  { skill: 'Database Design', level: 80 },
                  { skill: 'Problem Solving', level: 92 },
                ].map((item) => (
                  <div key={item.skill}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">{item.skill}</span>
                      <span className="text-cyan font-semibold">{item.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan to-electric-blue"
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${item.level}%` } : { width: 0 }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                      />
                    </div>
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
