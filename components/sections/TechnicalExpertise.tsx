"use client";

import { motion } from "framer-motion";

const categories = [
  {
    name: "Frontend",
    orbitSize: "w-[300px] h-[300px]",
    color: "border-accent-cyan",
    brighten: "bg-accent-cyan/10 shadow-[0_0_15px_rgba(0,229,255,0.3)] backdrop-blur-sm",
    skills: ["React", "Next.js", "Tailwind", "TS", "JS", "HTML", "CSS"],
    duration: 20
  },
  {
    name: "Backend & DB",
    orbitSize: "w-[450px] h-[450px]",
    color: "border-accent-purple",
    brighten: "bg-accent-purple/10 shadow-[0_0_15px_rgba(124,58,237,0.3)] backdrop-blur-sm",
    skills: ["Node.js", "Express", "Python", "Java", "C++", "C", "MySQL", "Prisma"],
    duration: 35
  },
  {
    name: "Tools",
    orbitSize: "w-[600px] h-[600px]",
    color: "border-accent-pink",
    brighten: "bg-accent-pink/10 shadow-[0_0_15px_rgba(255,78,205,0.3)] backdrop-blur-sm",
    skills: ["Git", "GitHub", "Vercel", "Docker"],
    duration: 45
  }
];

export default function TechnicalExpertise() {
  return (
    <section id="skills" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 max-w-6xl">
        
        {/* Left: Text Context */}
        <div className="flex-1 space-y-6 max-w-md">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5"
          >
            <span className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
            <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Technical Arsenal</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-outfit font-black text-white leading-tight"
          >
            ORBITAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">GALAXY</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-text-muted">Orbital visualization of technical proficiencies.</p>
          </motion.div>

          <div className="space-y-4 pt-4">
            {categories.map((cat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex items-center gap-4"
              >
                <div className={`w-3 h-3 rounded-full border ${cat.color} ${cat.color.replace('border', 'bg').replace('accent', 'accent')}/20`} />
                <span className="text-white font-mono">{cat.name}</span>
                <span className="text-text-muted text-sm ml-auto">{cat.skills.length} nodes</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Orbital Physics System */}
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="relative w-full max-w-4xl aspect-square flex items-center justify-center scale-[0.55] sm:scale-75 lg:scale-100 mt-10 lg:mt-0">
            
            {/* Core Star */}
            <div className="absolute w-20 h-20 bg-accent-cyan rounded-full blur-[20px] animate-pulse" />
            <div className="absolute w-12 h-12 bg-bg-space border-2 border-accent-cyan rounded-full flex items-center justify-center z-10 shadow-[0_0_15px_rgba(0,229,255,0.5)]">
              <span className="text-accent-cyan font-bold font-mono text-xs">CORE</span>
            </div>

            {/* Orbits */}
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full border border-dashed opacity-30 ${cat.color} ${cat.orbitSize}`}
                animate={{ rotate: 360 }}
                transition={{ duration: cat.duration, repeat: Infinity, ease: "linear" }}
              >
                {cat.skills.map((skill, j) => {
                  const angle = (j / cat.skills.length) * 360;
                  // Calculate position on the circle (using 50% translation logic in css)
                  return (
                    <div
                      key={skill}
                      className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 group"
                      style={{
                        transformOrigin: `50% ${parseInt(cat.orbitSize.split('[')[1]) / 2}px`,
                        transform: `rotate(${angle}deg)`,
                      }}
                    >
                      {/* The planet itself needs to counter-rotate to keep text upright, but simple text badge is fine too. */}
                      <div 
                        className={`px-3 py-1 border rounded-full text-xs font-bold font-mono whitespace-nowrap transition-transform hover:scale-125 ${cat.color.replace('border', 'text')} ${cat.color} ${cat.brighten}`}
                        style={{ transform: `rotate(-${angle}deg)` }} // Counter-rotation
                      >
                        {skill}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ))}
            
          </div>
        </div>

      </div>
    </section>
  );
}
