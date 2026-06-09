'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import {
  heroHeadingVariants,
  heroSubtitleVariants,
  staggerContainerVariants,
  fadeUpVariants,
  buttonHoverVariants,
} from '@/lib/animations'

const roles = ['Developer', 'Problem Solver', 'Tech Enthusiast', 'Backend Learner']

export function Hero() {
  const [currentRole, setCurrentRole] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const text = roles[currentRole]
    let index = 0

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(typingInterval)
      }
    }, 80)

    return () => clearInterval(typingInterval)
  }, [currentRole])

  useEffect(() => {
    if (!isTyping) {
      const delayInterval = setTimeout(() => {
        setCurrentRole((prev) => (prev + 1) % roles.length)
        setDisplayedText('')
        setIsTyping(true)
      }, 2000)

      return () => clearTimeout(delayInterval)
    }
  }, [isTyping])

  return (
    <section id="hero" className="section-container pt-32 md:pt-40">
      <div className="section-content">
        <motion.div
          className="flex flex-col items-center justify-center text-center space-y-8"
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main heading with glow effect */}
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight text-gradient glow-text"
            variants={heroHeadingVariants}
            style={{
              backgroundSize: '200% 200%',
            }}
          >
            Hi, I&apos;m Ronith
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            className="text-xl sm:text-2xl md:text-3xl text-text-secondary max-w-2xl font-light"
            variants={heroSubtitleVariants}
          >
            Computer Science Student & Full Stack Developer
          </motion.h2>

          {/* Typing animation roles */}
          <motion.div
            className="h-16 sm:h-20 md:h-24 flex items-center justify-center"
            variants={fadeUpVariants}
          >
            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold">
              <span className="text-text-secondary">I&apos;m a </span>
              <span className="text-gradient glow-text min-w-[200px] sm:min-w-[250px]">
                {displayedText}
                <motion.span
                  className="inline-block w-1 h-8 sm:h-10 md:h-12 ml-2 bg-gradient-to-b from-cyan via-electric-blue to-purple"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </span>
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-8"
            variants={fadeUpVariants}
          >
            <motion.a
              href="#projects"
              className="glass-button-primary text-center"
              variants={buttonHoverVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              View Projects
            </motion.a>
            <motion.a
              href="#contact"
              className="glass-button text-center"
              variants={buttonHoverVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              Download Resume
            </motion.a>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            className="flex gap-6 mt-12"
            variants={fadeUpVariants}
          >
            {[
              { icon: 'GitHub', href: 'https://github.com' },
              { icon: 'LinkedIn', href: 'https://linkedin.com' },
              { icon: 'Twitter', href: 'https://twitter.com' },
            ].map((social, index) => (
              <motion.a
                key={social.icon}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl glass-card flex items-center justify-center hover:text-cyan transition-colors"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <span className="text-sm font-semibold">{social.icon.slice(0, 2)}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <a href="#about" className="text-gray-400 hover:text-cyan transition-colors">
              <svg
                className="w-6 h-6 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
