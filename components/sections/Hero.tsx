"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronRight, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

const roles = ["Full Stack Developer", "Problem Solver", "AI Enthusiast", "System Architect"];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-10 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 max-w-6xl">
        
        {/* Left Side: Cinematic Typography */}
        <div className="flex-1 flex flex-col items-start space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-cyan/30 bg-accent-cyan/10"
          >
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span className="text-xs font-mono text-accent-cyan uppercase tracking-widest">System Online</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black font-outfit tracking-tighter leading-tight text-white"
          >
            RONITH <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">
              SALIAN
            </span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl font-mono text-text-secondary h-8 flex items-center overflow-hidden"
          >
            <span className="text-accent-pink mr-2">{">"}</span>
            <motion.span
              key={roleIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-white"
            >
              {roles[roleIndex]}
            </motion.span>
            <span className="animate-pulse w-3 h-6 bg-accent-cyan ml-2 block" />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-md text-text-muted text-lg leading-relaxed"
          >
            Initiating developer workspace... Building scalable ecosystems and solving complex algorithmic challenges.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center gap-6 pt-4 w-full"
          >
            <a href="#projects" className="group relative px-6 py-3 rounded border border-accent-cyan bg-accent-cyan/10 text-accent-cyan font-mono overflow-hidden transition-all duration-300 hover:bg-accent-cyan hover:text-bg-space hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] hover:scale-105 flex items-center gap-2">
              <span className="relative z-10">Execute /projects</span>
              <ChevronRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </a>

            {/* Glowing Social Links */}
            <div className="flex gap-4">
              {[
                { icon: FaGithub, href: "https://github.com/RonithJSalian18", glow: "hover:text-accent-purple hover:border-accent-purple hover:shadow-[0_0_25px_rgba(124,58,237,0.7)]" },
                { icon: FaLinkedin, href: "https://linkedin.com/", glow: "hover:text-accent-cyan hover:border-accent-cyan hover:shadow-[0_0_25px_rgba(0,229,255,0.7)]" },
                { icon: SiLeetcode, href: "https://leetcode.com/u/ronith_salian/", glow: "hover:text-yellow-400 hover:border-yellow-400 hover:shadow-[0_0_25px_rgba(250,204,21,0.7)]" },
                { icon: Mail, href: "mailto:email@example.com", glow: "hover:text-accent-pink hover:border-accent-pink hover:shadow-[0_0_25px_rgba(255,78,205,0.7)]" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`w-12 h-12 flex items-center justify-center rounded border border-white/10 bg-white/5 text-text-muted transition-all duration-300 hover:scale-110 hover:bg-bg-space ${social.glow}`}
                >
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Interactive Ecosystem / Particle Sphere Pseudo-3D */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative h-[500px] flex-1 flex items-center justify-center hidden lg:flex perspective-1000"
        >
          {/* Simulated 3D Core */}
          <div className="absolute w-64 h-64 rounded-full border border-accent-cyan/20 flex items-center justify-center animate-[spin_20s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute w-full h-full rounded-full border border-accent-purple/30" style={{ transform: 'rotateX(60deg) rotateY(45deg)' }} />
            <div className="absolute w-full h-full rounded-full border border-accent-pink/30" style={{ transform: 'rotateX(45deg) rotateY(60deg)' }} />
            <div className="absolute w-48 h-48 bg-accent-cyan/5 rounded-full blur-xl animate-pulse" />
            
            {/* Core Node */}
            <div className="w-16 h-16 bg-bg-space border-2 border-accent-cyan rounded-xl shadow-[0_0_30px_rgba(0,229,255,0.5)] flex items-center justify-center relative z-10 rotate-45">
              <span className="-rotate-45 text-accent-cyan font-bold font-mono">SYS</span>
            </div>

            {/* Orbiting Tech Nodes */}
            {[
              { label: "AI", angle: 0, color: "text-accent-pink border-accent-pink/50" },
              { label: "WEB", angle: 120, color: "text-accent-cyan border-accent-cyan/50" },
              { label: "API", angle: 240, color: "text-accent-purple border-accent-purple/50" }
            ].map((node, i) => (
              <motion.div
                key={i}
                className={`absolute w-12 h-12 bg-bg-space border rounded-full flex items-center justify-center text-xs font-mono shadow-lg ${node.color}`}
                style={{
                  top: `calc(50% - 24px + ${Math.sin(node.angle * Math.PI / 180) * 140}px)`,
                  left: `calc(50% - 24px + ${Math.cos(node.angle * Math.PI / 180) * 140}px)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5
                }}
              >
                {node.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
