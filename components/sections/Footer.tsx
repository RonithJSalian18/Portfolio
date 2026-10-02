'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { socialLinks } from '@/lib/site'

const footerLinks = [
  {
    category: 'Navigation',
    links: [
      { label: 'Home', href: '#hero' },
      { label: 'Origin', href: '#about' },
      { label: 'Arsenal', href: '#skills' },
      { label: 'Missions', href: '#projects' },
      { label: 'Comms', href: '#contact' },
    ],
  },
  {
    category: 'Connect',
    links: [
      { label: 'GitHub', href: socialLinks.github },
      { label: 'LinkedIn', href: socialLinks.linkedin },
      { label: 'LeetCode', href: socialLinks.leetcode },
      { label: 'Email', href: socialLinks.email },
    ],
  },
]

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <footer className="relative z-10 border-t border-jedi/15 bg-space/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-12 md:mb-16">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display uppercase tracking-[0.15em] text-gradient !text-2xl">Ronith J Salian</h3>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              BTech student and aspiring software engineer passionate about full-stack development,
              AI systems, and solving algorithmic challenges.
            </p>
          </motion.div>

          {footerLinks.map((section, index) => (
            <motion.div
              key={section.category}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-mono text-xs font-semibold text-gold uppercase tracking-[0.3em]">
                {section.category}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-block text-text-secondary hover:text-jedi transition-colors text-sm"
                      whileHover={{ x: 5 }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Lightsaber divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-jedi to-transparent mb-8 shadow-saber"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />

        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-text-secondary !text-sm">
            &copy; {currentYear} Ronith J Salian. All rights reserved.
          </p>
          <p className="font-display uppercase tracking-[0.25em] !text-xs text-gold">
            May the Force be with you
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full border border-jedi bg-space/80 text-jedi flex items-center justify-center shadow-saber hover:text-white"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  )
}
