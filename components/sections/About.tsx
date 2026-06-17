"use client";

import { motion } from "framer-motion";

const nodes = [
  { id: "core", label: "Ronith", x: "50%", y: "50%", color: "border-accent-cyan text-accent-cyan shadow-[0_0_20px_rgba(0,229,255,0.4)]" },
  { id: "edu", label: "NMAMIT BTech", x: "20%", y: "30%", color: "border-text-secondary text-text-secondary" },
  { id: "int", label: "Sasken Intern", x: "80%", y: "30%", color: "border-text-secondary text-text-secondary" },
  { id: "lang", label: "Eng/Hin/Kan/Tul", x: "20%", y: "70%", color: "border-text-secondary text-text-secondary" },
  { id: "hob", label: "Esports/Swim", x: "80%", y: "70%", color: "border-text-secondary text-text-secondary" },
  { id: "aim", label: "AI & Scalability", x: "50%", y: "15%", color: "border-accent-purple text-accent-purple" },
];

export default function About() {
  return (
    <section id="identity" className="py-32 relative">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-mono font-bold text-white mb-4">
              <span className="text-accent-pink">{'<'}</span> My Digital Identity <span className="text-accent-pink">{'>'}</span>
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Neural network visualization of core identity parameters.
            </p>
          </div>

          <div className="relative w-full h-[500px] holographic-panel rounded-3xl overflow-hidden hidden md:block">
            {/* Grid Background inside panel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />
            
            {/* Neural Connections (SVG lines) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <motion.line x1="50%" y1="50%" x2="20%" y2="30%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="5,5" 
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1 }} />
              <motion.line x1="50%" y1="50%" x2="80%" y2="30%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="5,5" 
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }} />
              <motion.line x1="50%" y1="50%" x2="20%" y2="70%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="5,5" 
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.4 }} />
              <motion.line x1="50%" y1="50%" x2="80%" y2="70%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="5,5" 
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.6 }} />
              <motion.line x1="50%" y1="50%" x2="50%" y2="15%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="5,5" 
                initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} />
            </svg>

            {/* Nodes */}
            {nodes.map((node, i) => (
              <motion.div
                key={node.id}
                className={`absolute -translate-x-1/2 -translate-y-1/2 bg-bg-space border rounded-xl px-4 py-2 font-mono text-sm cursor-pointer transition-all hover:scale-110 z-10 ${node.color}`}
                style={{ top: node.y, left: node.x }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 1 + i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {node.label}
              </motion.div>
            ))}
          </div>

          {/* Mobile Fallback */}
          <div className="md:hidden space-y-4">
            {nodes.map((node) => (
              <div key={node.id} className={`p-4 rounded-xl border bg-bg-space/50 ${node.color}`}>
                <span className="font-mono text-sm">{node.label}</span>
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
