'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Code2, Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/SocialIcons'
import { socialLinks } from '@/lib/site'
import {
  heroHeadingVariants,
  heroSubtitleVariants,
  staggerContainerVariants,
  fadeUpVariants,
  buttonHoverVariants,
} from '@/lib/animations'

const roles = ['Full Stack Developer', 'AI Engineer', 'Problem Solver', 'Jedi of the Codebase']

const socials = [
  { Icon: GithubIcon, href: socialLinks.github, label: 'GitHub' },
  { Icon: LinkedinIcon, href: socialLinks.linkedin, label: 'LinkedIn' },
  { Icon: Code2, href: socialLinks.leetcode, label: 'LeetCode' },
  { Icon: Mail, href: socialLinks.email, label: 'Email' },
]

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
          {/* Episode kicker */}
          <motion.p
            className="hud-label !text-sm"
            variants={heroSubtitleVariants}
            initial="hidden"
            animate="visible"
          >
            Episode I &middot; A New Developer
          </motion.p>

          {/* Name, in opening-crawl yellow */}
          <motion.h1
            className="font-display font-black uppercase tracking-[0.08em] leading-[1.05]"
            variants={heroHeadingVariants}
            initial="hidden"
            animate="visible"
          >
            <span className="block text-base sm:text-lg md:text-xl font-medium tracking-[0.4em] text-text-secondary mb-4">
              Hi, I&apos;m
            </span>
            <span className="text-gradient glow-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              Ronith J Salian
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.h2
            className="text-lg sm:text-xl md:text-2xl text-text-secondary max-w-2xl font-light !tracking-normal"
            variants={heroSubtitleVariants}
            initial="hidden"
            animate="visible"
          >
            Computer Science Student &middot; Full Stack &amp; AI Developer
          </motion.h2>

          {/* Typing animation roles */}
          <motion.div
            className="h-16 sm:h-20 flex items-center justify-center"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-2xl sm:text-3xl md:text-4xl font-semibold">
              <span className="text-text-secondary">
                I&apos;m {/^[aeiou]/i.test(roles[currentRole]) ? 'an' : 'a'}{' '}
              </span>
              <span className="saber-text">
                {displayedText}
                <motion.span
                  className="inline-block w-1 h-7 sm:h-9 md:h-10 ml-2 align-middle bg-jedi rounded-full shadow-saber"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </span>
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-4"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.a
              href="#projects"
              className="glass-button-primary"
              variants={buttonHoverVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              View Missions
            </motion.a>
            <motion.a
              href="#contact"
              className="glass-button"
              variants={buttonHoverVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              Open Comms
            </motion.a>
          </motion.div>

          {/* Social Icons */}
          <motion.div
            className="flex gap-5 mt-8"
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            {socials.map(({ Icon, href, label }, index) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-14 h-14 rounded-xl glass-card flex items-center justify-center text-jedi hover:text-gold transition-colors"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                title={label}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <a href="#about" className="text-text-muted hover:text-gold transition-colors" aria-label="Scroll to the origin story">
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
