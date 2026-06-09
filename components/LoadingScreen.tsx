'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const quotes = [
  'Build projects. Not just resumes.',
  'Consistency beats motivation.',
  'Code. Learn. Improve. Repeat.',
  'First solve the problem, then write the code.',
  'Every expert was once a beginner.',
  'Great code is readable code.',
  'Debug with patience, code with purpose.',
]

interface LoadingScreenProps {
  isLoading: boolean
}

export function LoadingScreen({ isLoading }: LoadingScreenProps) {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!isLoading) return

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 30
      })
    }, 200)

    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 3000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(quoteInterval)
    }
  }, [isLoading])

  useEffect(() => {
    if (!isLoading) {
      setProgress(100)
    }
  }, [isLoading])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background animated elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Floating orbs */}
            <motion.div
              className="absolute top-20 left-20 w-64 h-64 bg-cyan rounded-full blur-3xl opacity-10"
              animate={{
                y: [0, 30, 0],
                x: [0, -20, 0],
              }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-80 h-80 bg-purple rounded-full blur-3xl opacity-10"
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-12 px-4 max-w-2xl">
            {/* Logo/Initials */}
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="text-6xl md:text-7xl font-bold text-gradient"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                R
              </motion.div>
            </motion.div>

            {/* Rotating Quote */}
            <motion.div
              className="min-h-20 flex items-center justify-center"
              key={currentQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl md:text-2xl text-gray-300 text-balance">
                {quotes[currentQuote]}
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="space-y-4">
              <div className="h-1 w-full max-w-xs mx-auto bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan via-electric-blue to-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 30, damping: 20 }}
                />
              </div>
              <p className="text-sm text-gray-400">{Math.round(progress)}%</p>
            </div>

            {/* Loading dots */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan to-purple"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
