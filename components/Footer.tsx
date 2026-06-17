"use client";

import { motion } from "framer-motion";
import { Mail, Terminal, Activity, Cpu } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#020617] pt-20 pb-10 overflow-hidden mt-10">
      {/* Background glow and Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:30px_30px] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-accent-cyan/10 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Animated Top Border */}
      <motion.div 
        className="absolute top-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent w-full opacity-50"
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 100%" }}
      />

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & System Info */}
          <div className="md:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 border border-accent-cyan/30 bg-accent-cyan/10 rounded flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <Terminal className="text-accent-cyan w-5 h-5" />
              </div>
              <h3 className="text-2xl font-outfit font-black text-white tracking-widest uppercase">
                RONITH <span className="text-accent-cyan">SALIAN</span>
              </h3>
            </div>
            <p className="text-text-muted font-mono text-sm max-w-md mb-8 leading-relaxed">
              Architecting scalable digital ecosystems. Bridging the gap between complex algorithms and seamless user experiences.
            </p>
            
            <div className="flex flex-wrap gap-4 text-[10px] font-mono tracking-widest uppercase text-text-muted">
              <div className="flex items-center gap-2 border border-white/5 bg-white/5 px-3 py-1.5 rounded-sm backdrop-blur-sm">
                <Activity className="w-3 h-3 text-accent-green animate-pulse" />
                Sys: <span className="text-accent-green font-bold">Online</span>
              </div>
              <div className="flex items-center gap-2 border border-white/5 bg-white/5 px-3 py-1.5 rounded-sm backdrop-blur-sm">
                <Cpu className="w-3 h-3 text-accent-purple" />
                Core: <span className="text-white font-bold">Stable</span>
              </div>
            </div>
          </div>

          {/* Navigation/Links */}
          <div className="md:col-span-3 flex flex-col space-y-4">
            <h4 className="text-white font-outfit font-bold tracking-widest uppercase text-sm mb-2">Directives</h4>
            {['Mission', 'Projects', 'Experience', 'Transmission Logs'].map((link) => (
              <a key={link} href="#" className="text-text-muted font-mono text-sm hover:text-accent-cyan transition-colors flex items-center gap-2 group w-max">
                <span className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-accent-cyan">{'>'}</span> 
                {link}
              </a>
            ))}
          </div>

          {/* Network Nodes (Socials) */}
          <div className="md:col-span-4 flex flex-col md:items-end justify-center space-y-6">
            <h4 className="text-white font-outfit font-bold tracking-widest uppercase text-sm mb-2">Network Nodes</h4>
            <div className="flex gap-4">
              {[
                { icon: FaGithub, href: "https://github.com/RonithJSalian18", label: "GitHub", color: "hover:border-white hover:text-white hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]" },
                { icon: FaLinkedin, href: "https://linkedin.com/", label: "LinkedIn", color: "hover:border-[#0077b5] hover:text-[#0077b5] hover:bg-[#0077b5]/10 hover:shadow-[0_0_15px_rgba(0,119,181,0.4)]" },
                { icon: SiLeetcode, href: "https://leetcode.com/u/ronith_salian/", label: "LeetCode", color: "hover:border-yellow-500 hover:text-yellow-500 hover:bg-yellow-500/10 hover:shadow-[0_0_15px_rgba(234,179,8,0.4)]" },
                { icon: Mail, href: "mailto:ronith@example.com", label: "Email", color: "hover:border-accent-pink hover:text-accent-pink hover:bg-accent-pink/10 hover:shadow-[0_0_15px_rgba(255,78,205,0.4)]" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-12 h-12 rounded-lg border border-white/10 bg-[#050b14] flex items-center justify-center text-text-muted transition-all duration-300 ${social.color}`}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon size={20} />
                  <span className="sr-only">{social.label}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-text-muted tracking-widest uppercase">
          <p className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-[2px] bg-accent-cyan shadow-[0_0_8px_rgba(0,229,255,1)] animate-pulse" />
            END OF TRANSMISSION © {new Date().getFullYear()}
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">INITIALIZED WITH NEXT.JS & TAILWIND</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
