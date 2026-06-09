'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  heroHeadingVariants,
  heroSubtitleVariants,
  staggerContainerVariants,
  fadeUpVariants,
  buttonHoverVariants,
} from '@/lib/animations'

export function CTA() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })

  return (
    <section
      id="cta"
      ref={ref}
      className="section-container relative overflow-hidden"
    >
      {/* Background gradient orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 bg-cyan rounded-full blur-3xl opacity-10"
        animate={{
          x: [0, 50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple rounded-full blur-3xl opacity-10"
        animate={{
          x: [0, -50, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="section-content relative z-10">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-col items-center justify-center text-center space-y-10 max-w-4xl mx-auto"
        >
          {/* Main heading */}
          <motion.h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
            variants={heroHeadingVariants}
          >
            <span className="text-white">Ready to </span>
            <motion.span className="text-gradient" whileHover={{ scale: 1.05 }}>
              Collaborate?
            </motion.span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-400 max-w-2xl"
            variants={heroSubtitleVariants}
          >
            I&apos;m always excited about new opportunities and interesting projects. Let&apos;s
            create something amazing together!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-8"
            variants={fadeUpVariants}
          >
            <motion.a
              href="#contact"
              className="glass-button-primary text-center text-lg px-8 py-4"
              variants={buttonHoverVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              Get In Touch
            </motion.a>
            <motion.a
              href="#projects"
              className="glass-button text-center text-lg px-8 py-4"
              variants={buttonHoverVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              View My Work
            </motion.a>
          </motion.div>

          {/* Stats section */}
          <motion.div
            className="grid grid-cols-3 gap-4 md:gap-8 mt-12 pt-12 border-t border-white/10 w-full"
            variants={fadeUpVariants}
          >
            {[
              { number: '50+', label: 'Projects' },
              { number: '100+', label: 'Happy Clients' },
              { number: '3+', label: 'Years Exp' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-gradient">{stat.number}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
