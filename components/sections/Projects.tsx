"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const projects = [
  {
    id: "studybuddy",
    title: "StudyBuddy",
    desc: "AI-powered PDF Q&A web app using NLP summarization and real-time responses to help students learn efficiently.",
    glow: "border-accent-purple shadow-[0_0_40px_rgba(124,58,237,0.4)]",
    hoverOverlay: "bg-gradient-to-t from-transparent to-accent-purple/20",
    btnColor: "border-accent-purple bg-accent-purple/10 text-accent-purple hover:bg-accent-purple",
    idleBadge: "border-accent-purple/50 text-accent-purple bg-accent-purple/10",
    titleGradient: "from-white to-accent-purple",
    stack: ["Next.js", "Python", "NLP", "OpenAI"],
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    githubUrl: "https://github.com/RonithJSalian18/Study_Buddy",
    colSpan: "md:col-span-2",
    minHeight: "min-h-[450px]"
  },
  {
    id: "tastegy",
    title: "Tastegy",
    desc: "Campus food discovery platform tailored for NMAMIT students. Finding the right meal around campus made simple.",
    glow: "border-accent-cyan shadow-[0_0_40px_rgba(0,229,255,0.4)]",
    hoverOverlay: "bg-gradient-to-t from-transparent to-accent-cyan/20",
    btnColor: "border-accent-cyan bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan",
    idleBadge: "border-accent-cyan/50 text-accent-cyan bg-accent-cyan/10",
    titleGradient: "from-white to-accent-cyan",
    stack: ["React", "Express", "MongoDB"],
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
    githubUrl: "https://github.com/RonithJSalian18",
    colSpan: "md:col-span-1",
    minHeight: "min-h-[450px]"
  },
  {
    id: "lostfound",
    title: "Lost & Found",
    desc: "Centralized student platform for posting and searching lost items with secure image upload capabilities.",
    glow: "border-accent-pink shadow-[0_0_40px_rgba(255,78,205,0.4)]",
    hoverOverlay: "bg-gradient-to-t from-transparent to-accent-pink/20",
    btnColor: "border-accent-pink bg-accent-pink/10 text-accent-pink hover:bg-accent-pink",
    idleBadge: "border-accent-pink/50 text-accent-pink bg-accent-pink/10",
    titleGradient: "from-white to-accent-pink",
    stack: ["Next.js", "PostgreSQL", "Prisma"],
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop",
    githubUrl: "https://github.com/RonithJSalian18/Lostify",
    colSpan: "md:col-span-1",
    minHeight: "min-h-[450px]"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-pink animate-pulse" />
              <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Active Deployments</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-outfit font-black text-white tracking-tight">
              PROJECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-cyan">UNIVERSE</span>
            </h2>
          </div>
          <p className="text-text-muted font-mono text-sm max-w-sm">
            A collection of production-grade architectures and scalable digital ecosystems.
          </p>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              tabIndex={0}
              className={`${project.colSpan} ${project.minHeight} relative rounded-3xl overflow-hidden group bg-[#050b14] flex flex-col cursor-pointer transition-all duration-500 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20`}
            >
              {/* Hover Glow Border & Shadow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-500 rounded-3xl border-2 z-20 pointer-events-none ${project.glow}`} />

              {/* Background Image */}
              <div className="absolute inset-0 overflow-hidden bg-[#020617]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={project.img} 
                  alt={project.title} 
                  className="w-full h-full object-cover opacity-20 group-hover:scale-110 group-focus:scale-110 group-hover:opacity-50 group-focus:opacity-50 transition-all duration-700 ease-in-out mix-blend-luminosity group-hover:mix-blend-normal group-focus:mix-blend-normal"
                />
              </div>

              {/* Idle State Content (Visible before hover) */}
              <div className="absolute inset-0 p-10 flex flex-col items-center justify-center transition-all duration-700 group-hover:opacity-0 group-focus:opacity-0 group-hover:-translate-y-8 group-focus:-translate-y-8 z-10 pointer-events-none">
                 <span className="text-4xl md:text-5xl font-black font-outfit text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] text-center">
                   {project.title}
                 </span>
                 <span className={`mt-4 text-[10px] font-mono px-4 py-1.5 border rounded-full tracking-widest uppercase backdrop-blur-md ${project.idleBadge}`}>
                   NODE IDLE
                 </span>
              </div>

              {/* Gradient Overlays (Intensify on hover) */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent opacity-70 group-hover:opacity-90 group-focus:opacity-90 transition-opacity duration-700 z-0 pointer-events-none" />
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-700 z-0 pointer-events-none ${project.hoverOverlay}`} />

              {/* Hover State Content (Pops up on hover) */}
              <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end opacity-0 group-hover:opacity-100 group-focus:opacity-100 translate-y-12 group-hover:translate-y-0 group-focus:translate-y-0 transition-all duration-700 z-10">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.stack.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded-full font-mono text-[10px] tracking-wider backdrop-blur-md shadow-lg">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <h3 className={`text-3xl md:text-4xl font-black font-outfit text-transparent bg-clip-text bg-gradient-to-r ${project.titleGradient} mb-3 tracking-tight`}>
                  {project.title}
                </h3>
                
                <p className="text-text-muted text-sm md:text-base font-mono mb-8 max-w-lg drop-shadow-md">
                  {project.desc}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className={`flex items-center gap-2 px-6 py-2.5 rounded-full border text-sm font-mono transition-colors hover:text-[#020617] shadow-lg ${project.btnColor}`}>
                    <FaGithub size={16} /> Code
                  </a>
                  <a href="#" onClick={(e) => e.stopPropagation()} className={`flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/20 bg-white/10 text-white font-mono text-sm hover:bg-white hover:text-[#020617] transition-colors shadow-lg backdrop-blur-md`}>
                    <ExternalLink size={16} /> Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
