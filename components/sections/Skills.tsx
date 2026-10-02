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

// Saber colors as RGB triplets, fed to the `--saber` variable used by .saber-blade
const SABER_RGB: Record<GlowColor, string> = {
  jedi: '76, 201, 255',
  sith: '255, 59, 59',
  yoda: '93, 255, 122',
  mace: '179, 107, 255',
  gold: '255, 232, 31',
}

const skillCategories: { category: string; skills: string[]; saber: GlowColor }[] = [
  {
    category: 'Languages',
    skills: ['Python', 'JavaScript', 'TypeScript', 'C++', 'C', 'Java'],
    saber: 'jedi',
  },
  {
    category: 'Frontend',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'shadcn/ui'],
    saber: 'yoda',
  },
  {
    category: 'Backend',
    skills: ['FastAPI', 'Node.js', 'Express.js', 'REST APIs', 'WebSockets'],
    saber: 'mace',
  },
  {
    category: 'AI & Agents',
    skills: ['LangGraph', 'LangChain', 'RAG Pipelines', 'Groq / Llama 3.1', 'Google Gemini', 'HuggingFace'],
    saber: 'sith',
  },
  {
    category: 'Databases',
    skills: ['PostgreSQL', 'Supabase + pgvector', 'MongoDB', 'Prisma ORM', 'Database Design'],
    saber: 'gold',
  },
  {
    category: 'DevOps & Tools',
    skills: ['Docker', 'Git & GitHub', 'Vercel', 'Render', 'Command Line'],
    saber: 'jedi',
  },
]

const proficiency: { skill: string; level: number; saber: GlowColor }[] = [
  { skill: 'Frontend Development', level: 90, saber: 'jedi' },
  { skill: 'Backend Development', level: 85, saber: 'yoda' },
  { skill: 'Database Design', level: 80, saber: 'mace' },
  { skill: 'Problem Solving', level: 92, saber: 'sith' },
]

export function Skills() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  return (
    <section
      id="skills"
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
            kicker="Episode III"
            title="The Force"
            highlight="Arsenal"
            description="The tools I wield across modern web development, AI agents, databases, DevOps, and algorithmic problem solving."
          />

          {/* Skills grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category, index) => (
              <motion.div
                key={category.category}
                variants={staggerItemVariants}
                custom={index}
              >
                <GlassCard className="h-full p-6 md:p-8 group" glowColor={category.saber}>
                  {/* Category header with a mini lightsaber */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center">
                      <div className="saber-hilt !w-5 !h-2" />
                      <div
                        className="saber-blade w-10 transition-all duration-500 group-hover:w-16"
                        style={{ ['--saber' as string]: SABER_RGB[category.saber] }}
                      />
                    </div>
                    <h3 className="font-display text-base uppercase tracking-widest text-text-primary">
                      {category.category}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, i) => (
                      <motion.span
                        key={skill}
                        className="px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-sm text-text-secondary group-hover:text-white group-hover:border-white/20 transition-colors"
                        initial={{ opacity: 0, y: 6 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                        transition={{ delay: 0.05 * i }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Proficiency, as lightsabers */}
          <motion.div
            className="max-w-2xl mx-auto"
            variants={scrollRevealVariants}
          >
            <GlassCard className="p-8 md:p-12" glowColor="gold" hover={false}>
              <h3 className="font-display text-lg uppercase tracking-widest text-gold mb-8">Midi-chlorian Count</h3>
              <div className="space-y-7">
                {proficiency.map((item) => (
                  <div key={item.skill}>
                    <div className="flex justify-between mb-3">
                      <span className="text-text-secondary">{item.skill}</span>
                      <span className="font-mono text-sm text-white">{item.level}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="saber-hilt" />
                      <div className="flex-1">
                        <motion.div
                          className="saber-blade"
                          style={{ ['--saber' as string]: SABER_RGB[item.saber] }}
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${item.level}%` } : { width: 0 }}
                          transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
