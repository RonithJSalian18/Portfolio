'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GlassCard, type GlowColor } from '@/components/GlassCard'
import { SectionHeader } from '@/components/SectionHeader'
import {
  staggerContainerVariants,
  scrollRevealVariants,
  staggerItemVariants,
} from '@/lib/animations'

const aboutItems: { title: string; glow: GlowColor; items: string[] }[] = [
  {
    title: 'Jedi Academy',
    glow: 'jedi',
    items: [
      'BTech in Information Science & Engineering',
      'NMAM Institute of Technology, Nitte',
      'CGPA: 8.64/10',
    ],
  },
  {
    title: 'Paths of the Force',
    glow: 'yoda',
    items: [
      'Machine Learning & Agentic AI',
      'Data Structures & Algorithms',
      'Full-stack Web Development',
    ],
  },
  {
    title: 'What Drives Me',
    glow: 'mace',
    items: [
      'Building scalable solutions',
      'Competitive Problem Solving',
      'Open-source contributions',
    ],
  },
]

export function About() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  return (
    <section
      id="about"
      ref={ref}
      className="section-container"
    >
      <div className="section-content">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-16"
        >
          <SectionHeader
            kicker="Episode II"
            title="The Origin"
            highlight="Story"
            description="Aspiring software engineer drawn to Machine Learning, Data Structures, Algorithms, and Software Development, building efficient, scalable, and intelligent solutions."
          />

          {/* Opening crawl */}
          <motion.div variants={scrollRevealVariants} className="crawl-viewport">
            <div className="crawl-track">
              <p className="!text-center font-display uppercase tracking-[0.3em] !text-base">Episode II</p>
              <p className="!text-center font-display font-black uppercase tracking-[0.2em] !text-3xl !mb-8">
                The Origin
              </p>
              <p>
                It is a period of relentless learning. From the halls of the NMAM Institute of Technology,
                Nitte, a young developer studies Information Science &amp; Engineering, holding a CGPA of 8.64.
              </p>
              <p>
                Training at Sasken Technologies brought mastery of the ancient ways of LTE RAN protocols and
                wireless systems, debugging the signals that bind the galaxy together.
              </p>
              <p>
                Now, armed with Python, TypeScript, React, Next.js and FastAPI, Ronith builds multi-agent AI
                systems and full-stack applications, one commit at a time, in the hope of shipping software
                that makes a difference....
              </p>
            </div>
          </motion.div>

          {/* About cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutItems.map((item, index) => (
              <motion.div
                key={item.title}
                variants={staggerItemVariants}
                custom={index}
              >
                <GlassCard className="h-full p-6 md:p-8" glowColor={item.glow}>
                  <h3 className="font-display text-lg uppercase tracking-widest text-gold mb-5">{item.title}</h3>
                  <ul className="space-y-3">
                    {item.items.map((listItem) => (
                      <li key={listItem} className="flex gap-3">
                        <span className="text-jedi mt-0.5 flex-shrink-0" aria-hidden="true">&#x2726;</span>
                        <span className="text-text-secondary">{listItem}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
