'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { GlassCard, type GlowColor } from '@/components/GlassCard'
import { SectionHeader } from '@/components/SectionHeader'
import { GithubIcon } from '@/components/SocialIcons'
import {
  staggerContainerVariants,
  scrollRevealVariants,
  staggerItemVariants,
} from '@/lib/animations'

interface Project {
  id: number
  title: string
  tagline: string
  description: string
  fullDescription: string
  features: string[]
  tags: string[]
  category: string
  saber: GlowColor
  flagship?: boolean
  github?: string
  live?: string
}

const projects: Project[] = [
  {
    id: 1,
    title: 'SentinelFi',
    tagline: 'Autonomous KYB Intelligence & AML Graph Surveillance Engine',
    description:
      'Zero-trust compliance automation that parses corporate filings and hunts circular money-laundering loops.',
    fullDescription:
      'An enterprise-grade, zero-trust compliance automation platform for Tier-1 financial institutions, fintechs, and corporate compliance teams. Corporate onboarding (Know Your Business) and continuous Anti-Money Laundering monitoring are plagued by manual document review, fragmented registries, and schemes like round-tripping and circular trading. SentinelFi automates the whole suite.',
    features: [
      'Extracts entity details, ESG vulnerabilities, and hidden legal liabilities from corporate PDFs using Gemini 2.5 Flash with deterministic JSON schema validation',
      'Detects multi-party round-trip transactions (A → B → C → A) in ledgers with high-performance relational self-joins',
      'Conversational due diligence on corporate filings with verified document grounding',
      'Zero-Trust Security Shield in the ASGI middleware that blocks SQL injection and XSS and enforces strict HSTS and security headers',
    ],
    tags: ['FastAPI', 'Next.js', 'React', 'Tailwind CSS', 'PostgreSQL', 'Google Gemini', 'Security'],
    category: 'AI Systems',
    saber: 'sith',
    flagship: true,
    github: 'https://github.com/RonithJSalian18/SentinelFi',
  },
  {
    id: 2,
    title: 'VoxScribe AI',
    tagline: 'YouTube videos into SEO-optimized blog posts, in your voice',
    description:
      'A multi-agent RAG pipeline that turns any YouTube video into a blog post written in your own brand voice.',
    fullDescription:
      'A full-stack AI application that transforms any YouTube video into a high-quality, SEO-optimized blog post. Using a multi-agent workflow and Retrieval-Augmented Generation, VoxScribe does not just summarize: it analyzes your past writing through a "Brand Voice Vault" so the generated content sounds exactly like you.',
    features: [
      'Multi-agent pipeline built with LangGraph: Researcher, Writer, and Editor agents process transcripts and draft content',
      'Brand Voice Vault (RAG): upload PDFs of past writing; HuggingFace embeddings and Supabase pgvector capture your tone and vocabulary',
      'Automatic YouTube transcript extraction from standard video URLs',
      'Secure sign-up and login with Supabase Auth, in a responsive Next.js + Tailwind interface',
    ],
    tags: ['Next.js', 'FastAPI', 'LangGraph', 'LangChain', 'Groq (Llama 3.1)', 'Supabase pgvector', 'HuggingFace'],
    category: 'AI Systems',
    saber: 'jedi',
    flagship: true,
    github: 'https://github.com/RonithJSalian18/VoxScribeAI',
    live: 'https://vox-scribe-ai.vercel.app',
  },
  {
    id: 3,
    title: 'StudyBuddy',
    tagline: 'HackLoop 2024: AI-powered PDF Q&A',
    description: 'AI-powered PDF Q&A application with NLP summarization.',
    fullDescription:
      'A web application enabling students to upload PDFs and ask context-based questions using AI. Implements NLP techniques to extract and summarize key information from documents, with an intuitive interface for real-time responses and enhanced study efficiency.',
    features: [
      'Upload PDFs and ask context-based questions',
      'NLP-driven extraction and summarization of key information',
      'Real-time responses in an intuitive study interface',
    ],
    tags: ['React', 'Next.js', 'Python', 'NLP', 'AI'],
    category: 'Full Stack',
    saber: 'yoda',
    github: 'https://github.com/RonithJSalian18/Study_Buddy',
  },
  {
    id: 4,
    title: 'Lost and Found Platform',
    tagline: 'Reuniting students with their belongings',
    description: 'Student item recovery and lost-found database platform.',
    fullDescription:
      'A web application allowing students to post and search for lost or found items, helping reconnect users with their belongings efficiently. Features image upload, responsive design, and categorized item tracking for smooth access across devices.',
    features: [
      'Post and search lost or found items',
      'Image upload for faster identification',
      'Categorized tracking with a responsive, cross-device interface',
    ],
    tags: ['React', 'Node.js', 'MongoDB', 'File Upload'],
    category: 'Web App',
    saber: 'mace',
    github: 'https://github.com/RonithJSalian18/Lostify',
    live: 'https://lostify-wine.vercel.app/',
  },
]

const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))]

interface ProjectCardProps {
  project: Project
  onViewDetails: (project: Project) => void
  inView: boolean
}

function ProjectCard({ project, onViewDetails, inView }: ProjectCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientY - rect.top - rect.height / 2) / 40
    const y = -(e.clientX - rect.left - rect.width / 2) / 40
    setTilt({ x, y })
  }

  return (
    <motion.div
      layout
      variants={staggerItemVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      exit={{ opacity: 0, scale: 0.95 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{ rotateX: tilt.x, rotateY: tilt.y, transformPerspective: 1000 }}
    >
      <GlassCard className="h-full p-6 md:p-8 group flex flex-col" glowColor={project.saber}>
        {/* Mission header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-text-muted">
            Mission {String(project.id).padStart(2, '0')} &middot; {project.category}
          </span>
          {project.flagship && (
            <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] text-gold border border-gold/40 bg-gold/10">
              Flagship
            </span>
          )}
        </div>

        <h3 className="font-display text-2xl uppercase tracking-wide text-white mb-2">{project.title}</h3>
        <p className="text-sm font-medium text-jedi mb-4">{project.tagline}</p>
        <p className="text-text-secondary text-sm mb-6 flex-grow">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-md bg-white/5 text-xs text-text-secondary border border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => onViewDetails(project)}
          className="glass-button-primary w-full"
        >
          Mission Briefing &rarr;
        </button>
      </GlassCard>
    </motion.div>
  )
}

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return
    const handleKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`glass-card glow-${project.saber} w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 md:p-10`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-6 right-6 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={onClose}
              aria-label="Close briefing"
            >
              <X className="w-4 h-4" />
            </button>

            <p className="hud-label mb-3">Mission Briefing</p>
            <h2 id="project-modal-title" className="font-display uppercase tracking-wide text-gradient !text-3xl md:!text-4xl mb-2">
              {project.title}
            </h2>
            <p className="text-jedi font-medium mb-6">{project.tagline}</p>

            <div className="space-y-7">
              <p className="text-text-secondary leading-relaxed">{project.fullDescription}</p>

              <div>
                <h3 className="font-mono !text-xs uppercase tracking-[0.25em] text-gold mb-3">Objectives Achieved</h3>
                <ul className="space-y-3">
                  {project.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                      <span className="text-jedi mt-0.5 flex-shrink-0" aria-hidden="true">&#x2726;</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-mono !text-xs uppercase tracking-[0.25em] text-gold mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-sm text-text-secondary">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {(project.github || project.live) && (
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="glass-button flex-1">
                      <GithubIcon className="w-4 h-4" /> Source
                    </a>
                  )}
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="glass-button-primary flex-1">
                      <ExternalLink className="w-4 h-4" /> Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Projects() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory)

  return (
    <section
      id="projects"
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
            kicker="Episode IV"
            title="Mission"
            highlight="Archives"
            description="Classified briefings on the systems I've built, from multi-agent AI pipelines to full-stack platforms."
          />

          {/* Category filters */}
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            variants={scrollRevealVariants}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-[0.2em] border transition-all duration-300 ${
                  selectedCategory === category
                    ? 'border-jedi text-white bg-jedi/15 shadow-saber'
                    : 'border-white/10 text-text-secondary bg-white/5 hover:border-white/30 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Projects grid */}
          <motion.div layout className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={setSelectedProject}
                  inView={inView}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  )
}
