'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GlassCard } from '@/components/GlassCard'
import {
  staggerContainerVariants,
  scrollRevealVariants,
  staggerItemVariants,
} from '@/lib/animations'

interface Service {
  title: string
  description: string
  features: string[]
  icon: string
  color: 'cyan' | 'purple' | 'blue'
}

const services: Service[] = [
  {
    title: 'Web Development',
    description: 'Building modern, responsive web applications with cutting-edge technologies.',
    features: ['React & Next.js', 'Responsive Design', 'Performance Optimization'],
    icon: '💻',
    color: 'cyan',
  },
  {
    title: 'Backend Development',
    description: 'Designing and developing scalable server-side solutions and APIs.',
    features: ['Node.js & Express', 'Database Design', 'API Development'],
    icon: '⚙️',
    color: 'purple',
  },
  {
    title: 'Dashboard Development',
    description: 'Creating interactive dashboards for data visualization and analytics.',
    features: ['Real-time Data', 'Charts & Graphs', 'User Analytics'],
    icon: '📊',
    color: 'blue',
  },
  {
    title: 'UI/UX Design',
    description: 'Designing beautiful and intuitive user interfaces with optimal user experience.',
    features: ['Wireframing', 'Prototyping', 'Design Systems'],
    icon: '🎨',
    color: 'cyan',
  },
  {
    title: 'Data Analytics',
    description: 'Transforming raw data into actionable insights and visualizations.',
    features: ['Data Analysis', 'Visualization', 'Business Intelligence'],
    icon: '📈',
    color: 'purple',
  },
  {
    title: 'System Design',
    description: 'Architecting scalable and maintainable systems for enterprise applications.',
    features: ['Architecture', 'Scalability', 'Performance'],
    icon: '🏗️',
    color: 'blue',
  },
]

const colorMap = {
  cyan: { glow: 'hover:shadow-glow', border: 'border-cyan/30' },
  purple: { glow: 'hover:shadow-glow-purple', border: 'border-purple/30' },
  blue: { glow: 'hover:shadow-glow-blue', border: 'border-electric-blue/30' },
}

export function Services() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  return (
    <section
      id="services"
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
              <span className="text-white">Services I </span>
              <span className="text-gradient">Offer</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive solutions tailored to bring your vision to life with professional expertise.
            </p>
          </motion.div>

          {/* Services grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const colors = colorMap[service.color]

              return (
                <motion.div
                  key={service.title}
                  variants={staggerItemVariants}
                  custom={index}
                >
                  <GlassCard
                    className={`h-full p-6 md:p-8 group ${colors.glow} border-2 ${colors.border}`}
                    glowColor={service.color}
                  >
                    {/* Icon */}
                    <motion.div
                      className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 10 }}
                    >
                      {service.icon}
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan transition-colors">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <motion.li
                          key={feature}
                          className="flex gap-2 text-gray-300 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                          transition={{ delay: 0.1 }}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 bg-${service.color}`}
                            style={{
                              backgroundColor:
                                service.color === 'cyan'
                                  ? '#00d4ff'
                                  : service.color === 'purple'
                                    ? '#a855f7'
                                    : '#0066ff',
                            }}
                          />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>

                    {/* Decorative border animation */}
                    <motion.div
                      className={`absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100`}
                      style={{
                        background: `linear-gradient(45deg, transparent, ${
                          service.color === 'cyan'
                            ? 'rgba(0, 212, 255, 0.1)'
                            : service.color === 'purple'
                              ? 'rgba(168, 85, 247, 0.1)'
                              : 'rgba(0, 102, 255, 0.1)'
                        }, transparent)`,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
