'use client'

import { motion } from 'framer-motion'

export function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-charcoal to-dark-bg opacity-100" />

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-cyan to-transparent rounded-full blur-3xl opacity-20"
        animate={{
          y: [0, -50, 0],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/2 -right-32 w-80 h-80 bg-gradient-to-bl from-purple to-transparent rounded-full blur-3xl opacity-20"
        animate={{
          y: [0, 50, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-tr from-electric-blue to-transparent rounded-full blur-3xl opacity-15"
        animate={{
          y: [0, 30, 0],
          x: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 212, 255, .05) 25%, rgba(0, 212, 255, .05) 26%, transparent 27%, transparent 74%, rgba(0, 212, 255, .05) 75%, rgba(0, 212, 255, .05) 76%, transparent 77%, transparent),
                            linear-gradient(90deg, transparent 24%, rgba(0, 212, 255, .05) 25%, rgba(0, 212, 255, .05) 26%, transparent 27%, transparent 74%, rgba(0, 212, 255, .05) 75%, rgba(0, 212, 255, .05) 76%, transparent 77%, transparent)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-radial-gradient opacity-30" />

      {/* Additional subtle light rays effect */}
      <motion.div
        className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-cyan via-transparent to-transparent opacity-10"
        animate={{
          x: [-100, 100, -100],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}
