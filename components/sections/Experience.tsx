"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Trophy } from "lucide-react";

const milestones = [
  {
    id: 1,
    title: "BTech ISE",
    entity: "NMAMIT",
    icon: GraduationCap,
    desc: "CGPA: 8.64",
    align: "top",
    color: "text-accent-pink border-accent-pink",
    bg: "bg-accent-pink/10 shadow-[0_0_20px_rgba(255,78,205,0.3)]"
  },
  {
    id: 2,
    title: "LTE RAN Intern",
    entity: "Sasken Technologies",
    icon: Briefcase,
    desc: "Wireless protocols & Telecom workflows",
    align: "bottom",
    color: "text-accent-cyan border-accent-cyan",
    bg: "bg-accent-cyan/10 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
  },
  {
    id: 3,
    title: "Achievements",
    entity: "Hackathons & Coding",
    icon: Trophy,
    desc: "Building scalable AI solutions.",
    align: "top",
    color: "text-accent-purple border-accent-purple",
    bg: "bg-accent-purple/10 shadow-[0_0_20px_rgba(124,58,237,0.3)]"
  }
];

export default function Experience() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-32">
          <h2 className="text-3xl md:text-5xl font-mono font-bold text-white mb-4">
            Journey Through <span className="text-accent-green">Time</span>
          </h2>
        </div>

        {/* Winding Path Container */}
        <div className="relative max-w-5xl mx-auto h-[400px] flex items-center">
          
          {/* SVG Animated Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 400">
            <defs>
              <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF4ECD" />
                <stop offset="50%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 50 200 C 300 50, 400 350, 600 200 C 750 50, 900 200, 950 200"
              fill="none"
              stroke="url(#pathGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="shadow-[0_0_20px_rgba(0,229,255,0.5)]"
            />
          </svg>

          {/* Checkpoints */}
          <div className="w-full flex justify-between relative px-12 md:px-24">
            {milestones.map((ms, i) => (
              <motion.div
                key={ms.id}
                className="relative flex flex-col items-center"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.5, type: "spring" }}
              >
                {/* Node */}
                <div className={`w-16 h-16 rounded-full border-2 ${ms.color} ${ms.bg} bg-bg-space flex items-center justify-center relative z-10`}>
                  <ms.icon size={24} className={ms.color.split(' ')[0]} />
                </div>

                {/* Content Panel */}
                <div className={`absolute ${ms.align === 'top' ? 'bottom-24' : 'top-24'} w-64 holographic-panel p-4 rounded-xl text-center border-t border-t-white/20`}>
                  <h4 className={`font-bold font-outfit text-lg mb-1 ${ms.color.split(' ')[0]}`}>{ms.title}</h4>
                  <div className="text-white text-sm font-medium mb-2">{ms.entity}</div>
                  <div className="text-text-muted text-xs font-mono">{ms.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
