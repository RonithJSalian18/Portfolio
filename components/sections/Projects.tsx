'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import {
  staggerContainerVariants,
  scrollRevealVariants,
  staggerItemVariants,
} from '@/lib/animations'

interface Project {
  id: number
  title: string
  description: string
  fullDescription: string
  tags: string[]
  category: string
  image?: string
  github?: string
  live?: string
}

const projects: Project[] = [
  {
    id: 1,
    title: 'StudyBuddy - HackLoop',
    description: 'AI-powered PDF Q&A application with NLP summarization',
    fullDescription:
      'A web application enabling students to upload PDFs and ask context-based questions using AI. Implements NLP techniques to extract and summarize key information from documents, with an intuitive interface for real-time responses and enhanced study efficiency.',
    tags: ['React', 'Next.js', 'Python', 'NLP', 'AI'],
    category: 'Full Stack',
    github: 'https://github.com/RonithSalian18',
  },
  {
    id: 2,
    title: 'Tastegy - NMAMIT Food Platform',
    description: 'Food discovery website for nearby restaurants and menus',
    fullDescription:
      'A web application showcasing local restaurant details, menus, and locations to help first-year NMAMIT students easily explore nearby dining options. Features restaurant search, menu browsing, and location-based recommendations.',
    tags: ['React', 'JavaScript', 'CSS', 'REST API'],
    category: 'Web App',
    github: 'https://github.com/RonithSalian18',
  },
  {
    id: 3,
    title: 'Lost and Found Platform',
    description: 'Student item recovery and lost-found database platform',
    fullDescription:
      'A web application allowing students to post and search for lost or found items, helping reconnect users with their belongings efficiently. Features image upload, responsive design, and categorized item tracking for smooth access across devices.',
    tags: ['React', 'Node.js', 'MongoDB', 'File Upload'],
    category: 'Web App',
    github: 'https://github.com/RonithSalian18',
  },
]

const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))]

interface ProjectCardProps {
  project: Project
  onViewDetails: (project: Project) => void
  index: number
}

function ProjectCard({ project, onViewDetails, index }: ProjectCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientY - rect.top - rect.height / 2) / 10
    const y = -(e.clientX - rect.left - rect.width / 2) / 10
    setTilt({ x, y })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <motion.div
      variants={staggerItemVariants}
      custom={index}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 30 }}
    >
      <GlassCard className="h-full p-6 md:p-8 cursor-pointer hover:shadow-glow-purple group flex flex-col">
        {/* Category badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-electric-blue/20 text-electric-blue border border-electric-blue/30">
            {project.category}
          </span>
        </div>

        {/* Project title */}
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gradient transition-all">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-text-secondary text-sm mb-6 flex-grow">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded-md bg-electric-blue/10 text-xs text-electric-blue border border-electric-blue/20 hover:border-cyan/50 hover:bg-cyan/10 transition-all"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View details button */}
        <motion.button
          onClick={() => onViewDetails(project)}
          className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-electric-blue/20 to-cyan/20 text-white font-medium hover:from-electric-blue/40 hover:to-cyan/40 border border-cyan/30 transition-all group-hover:shadow-glow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Details →
        </motion.button>
      </GlassCard>
    </motion.div>
  )
}

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              ×
            </motion.button>

            {/* Project details */}
            <h2 className="text-4xl font-bold text-white mb-4">{project.title}</h2>

            <div className="space-y-6">
              <p className="text-gray-300 text-lg leading-relaxed">{project.fullDescription}</p>

              {/* Tags */}
              <div>
                <h3 className="text-sm font-semibold text-cyan mb-3">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/10 text-sm text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-button flex-1 text-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  GitHub
                </motion.a>
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-button-primary flex-1 text-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Live Demo
                </motion.a>
              </div>
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
    threshold: 0.2,
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
          {/* Section title */}
          <motion.div
            className="text-center space-y-4"
            variants={scrollRevealVariants}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-white">My </span>
              <span className="text-gradient">Projects</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A showcase of innovative solutions and impactful projects built with modern technologies.
            </p>
          </motion.div>

          {/* Category filters */}
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            variants={scrollRevealVariants}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-cyan to-electric-blue text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>

          {/* Projects grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainerVariants}
          >
            <AnimatePresence mode="wait">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={setSelectedProject}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      {/* Project modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  )
}
