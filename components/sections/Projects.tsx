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
    title: 'Placement Preparation Platform',
    description: 'Comprehensive platform for competitive programming and interview prep',
    fullDescription:
      'A full-stack platform offering curated coding problems, mock interviews, and performance analytics for students preparing for placements. Features real-time code execution, leaderboards, and personalized learning paths.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'WebSocket'],
    category: 'Web App',
    github: 'https://github.com',
    live: 'https://example.com',
  },
  {
    id: 2,
    title: 'Security Threat Identification System',
    description: 'ML-based system for detecting and classifying security threats',
    fullDescription:
      'Advanced machine learning system that analyzes network traffic and system logs to identify potential security threats. Includes real-time alerts, threat scoring, and comprehensive reporting.',
    tags: ['Python', 'TensorFlow', 'Flask', 'React'],
    category: 'AI/ML',
    github: 'https://github.com',
    live: 'https://example.com',
  },
  {
    id: 3,
    title: 'COVID Tableau Dashboard',
    description: 'Interactive visualization dashboard for COVID-19 data analysis',
    fullDescription:
      'Comprehensive COVID-19 data visualization platform with real-time statistics, trends, and predictions. Features multiple visualization types and interactive filters for deep data exploration.',
    tags: ['Tableau', 'Python', 'Data Analysis'],
    category: 'Data Science',
    github: 'https://github.com',
    live: 'https://example.com',
  },
  {
    id: 4,
    title: 'Poverty Analysis in India',
    description: 'Statistical analysis and visualization of poverty trends',
    fullDescription:
      'In-depth analysis of poverty indicators across Indian states using statistical methods and data visualization. Includes predictive models and regional comparison tools.',
    tags: ['Python', 'Pandas', 'Matplotlib', 'Machine Learning'],
    category: 'Data Science',
    github: 'https://github.com',
    live: 'https://example.com',
  },
  {
    id: 5,
    title: 'Online Course Registration System',
    description: 'Web-based course management and registration platform',
    fullDescription:
      'Scalable course registration system with student dashboards, instructor panels, and administrative controls. Features payment integration, schedules management, and automated notifications.',
    tags: ['Next.js', 'MongoDB', 'Stripe', 'TypeScript'],
    category: 'Web App',
    github: 'https://github.com',
    live: 'https://example.com',
  },
  {
    id: 6,
    title: 'Student Placement Blog Website',
    description: 'Blog platform with placement success stories and tips',
    fullDescription:
      'Content-rich blogging platform featuring placement success stories, interview experiences, and preparation tips. Includes SEO optimization and social media integration.',
    tags: ['Next.js', 'CMS', 'Tailwind CSS'],
    category: 'Web App',
    github: 'https://github.com',
    live: 'https://example.com',
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
