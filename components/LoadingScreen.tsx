'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  isLoading: boolean
}

// The page hides the loader after 3.5s; the intro line gets the first half, the title the rest.
const INTRO_MS = 1700

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [phase, setPhase] = useState<'intro' | 'title'>('intro')

  useEffect(() => {
    if (!isLoading) return
    const timer = setTimeout(() => setPhase('title'), INTRO_MS)
    return () => clearTimeout(timer)
  }, [isLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-space overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          role="status"
          aria-label="Loading portfolio"
        >
          <div className="absolute inset-0 stars-static opacity-70" aria-hidden="true" />

          <div className="relative z-10 w-full px-6 text-center">
            <AnimatePresence mode="wait">
              {phase === 'intro' ? (
                <motion.p
                  key="intro"
                  className="mx-auto max-w-xl text-left text-xl md:text-3xl leading-snug"
                  style={{ color: '#4bd5ee' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  A long time ago in a galaxy far,
                  <br />
                  far away....
                </motion.p>
              ) : (
                <motion.div
                  key="title"
                  className="font-display font-black uppercase text-gradient leading-none tracking-[0.12em]"
                  style={{ fontSize: 'clamp(3rem, 14vw, 9rem)' }}
                  initial={{ scale: 2.4, opacity: 0 }}
                  animate={{ scale: 0.85, opacity: 1 }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                >
                  Ronith
                  <span className="block text-[0.18em] tracking-[0.6em] mt-4">J Salian</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lightsaber progress bar */}
            <div className="mt-14 flex items-center justify-center" aria-hidden="true">
              <div className="saber-hilt" />
              <div className="w-56 md:w-72">
                <motion.div
                  className="saber-blade"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3.2, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
