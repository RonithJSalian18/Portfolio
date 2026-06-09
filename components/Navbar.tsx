'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-dark-bg/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="#hero" className="text-2xl font-bold text-gradient">
            Ronith
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              whileHover="hover"
              variants={{
                hover: {
                  transition: { duration: 0.3 },
                },
              }}
            >
              {link.label}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan to-electric-blue"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>

        {/* Mobile menu button */}
        <motion.button
          className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <motion.span
              className="h-0.5 bg-white rounded-full"
              animate={isMobileMenuOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className="h-0.5 bg-white rounded-full"
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            />
            <motion.span
              className="h-0.5 bg-white rounded-full"
              animate={isMobileMenuOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
            />
          </div>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden bg-dark-bg/95 backdrop-blur-lg border-t border-white/10"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
                whileHover={{ x: 5 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
