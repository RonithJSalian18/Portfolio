'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { GlassCard, type GlowColor } from '@/components/GlassCard'
import { SectionHeader } from '@/components/SectionHeader'
import {
  staggerContainerVariants,
  staggerItemVariants,
} from '@/lib/animations'

type TimelineType = 'education' | 'internship' | 'hackathon' | 'achievement'

interface TimelineItem {
  period: string
  title: string
  organization: string
  description: string
  type: TimelineType
}

const timelineItems: TimelineItem[] = [
  {
    period: 'July 2023 - Present',
    title: 'BTech in Information Science & Engineering',
    organization: 'NMAM Institute of Technology, Nitte',
    description: 'Pursuing Bachelor of Technology with CGPA 8.64. Focus on full-stack development, machine learning, and problem-solving excellence.',
    type: 'education',
  },
  {
    period: 'June 2025 - July 2025',
    title: 'LTE RAN Internship',
    organization: 'Sasken Technologies',
    description: 'Gained practical experience in wireless protocols, LTE RAN debugging, and telecom workflows. Strengthened technical and analytical skills in network protocols.',
    type: 'internship',
  },
  {
    period: 'Innoversite',
    title: 'Innoversite Hackathon',
    organization: 'Hackathon Participant',
    description: 'Took part in the Innoversite Hackathon, collaborating with a team under tight deadlines to ideate, build, and pitch a working prototype.',
    type: 'hackathon',
  },
  {
    period: 'HackLoop 2024',
    title: 'StudyBuddy - AI PDF Q&A Application',
    organization: 'HackLoop Hackathon',
    description: 'Built an AI-powered application enabling students to upload PDFs and ask context-based questions. Implemented NLP for summarization and real-time responses.',
    type: 'hackathon',
  },
  {
    period: 'Sep 2023 - Mar 2024',
    title: 'Lost and Found Web Application',
    organization: 'NMAMIT Student Project',
    description: 'Developed a web application for students to post and search for lost/found items. Implemented image upload and responsive interface.',
    type: 'achievement',
  },
  {
    period: '328+ Problems Solved',
    title: 'Competitive Programming & DSA',
    organization: 'LeetCode & Problem-Solving',
    description: 'Consistently solving algorithmic problems across various difficulty levels. LeetCode Rank: 408K with 246 active days and max streak of 33 days.',
    type: 'achievement',
  },
]

const typeStyles: Record<TimelineType, { label: string; glow: GlowColor; dot: string; text: string }> = {
  education: { label: 'Jedi Academy', glow: 'jedi', dot: 'bg-jedi', text: 'text-jedi' },
  internship: { label: 'Field Training', glow: 'gold', dot: 'bg-gold', text: 'text-gold' },
  hackathon: { label: 'Hackathon', glow: 'yoda', dot: 'bg-yoda', text: 'text-yoda' },
  achievement: { label: 'Achievement', glow: 'mace', dot: 'bg-mace', text: 'text-mace' },
}

export function Experience() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section
      id="experience"
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
          <SectionHeader
            kicker="Episode V"
            title="The"
            highlight="Saga"
            description="Education, internships, hackathons, and achievements: the journey across the galaxy so far."
          />

          {/* Timeline */}
          <div className="relative space-y-8">
            {/* Vertical lightsaber line */}
            <motion.div
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-jedi shadow-saber"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: inView ? 1 : 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
              style={{ transformOrigin: 'top' }}
            />

            {timelineItems.map((item, index) => {
              const isLeft = index % 2 === 0
              const style = typeStyles[item.type]

              return (
                <motion.div
                  key={`${item.period}-${item.title}`}
                  className={`relative flex ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12`}
                  variants={staggerItemVariants}
                >
                  {/* Timeline node */}
                  <motion.div
                    className={`absolute left-4 md:left-1/2 top-8 w-4 h-4 -translate-x-1/2 rounded-full ring-4 ring-space ${style.dot} ${style.text}`}
                    style={{ boxShadow: '0 0 14px currentColor' }}
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : { scale: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  />

                  <div className="w-full md:w-1/2 pl-12 md:pl-0">
                    <GlassCard className="p-6 md:p-8 h-full" glowColor={style.glow}>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <span className={`font-mono text-[11px] uppercase tracking-[0.25em] ${style.text}`}>
                          {style.label}
                        </span>
                        <span className="font-mono text-xs text-text-muted">{item.period}</span>
                      </div>

                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gold/90 font-medium mb-4">{item.organization}</p>
                      <p className="text-text-secondary leading-relaxed">{item.description}</p>
                    </GlassCard>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
