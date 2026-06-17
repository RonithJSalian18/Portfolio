"use client";

import { motion } from "framer-motion";
import { Lock, Radio } from "lucide-react";

export default function Blog() {
  return (
    <section id="blog" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6"
          >
            <Radio className="w-4 h-4 text-accent-cyan animate-pulse" />
            <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Transmission Logs</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-outfit font-black text-white tracking-tight"
          >
            NEURAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-purple">ARCHIVES</span>
          </motion.h2>
        </div>

        {/* Coming Soon Holographic Panel */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden group border border-white/10 bg-[#050b14] flex flex-col items-center justify-center p-16 md:p-24 text-center shadow-[0_0_30px_rgba(0,229,255,0.05)] hover:shadow-[0_0_50px_rgba(0,229,255,0.15)] transition-shadow duration-500"
        >
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,229,255,0.03)_50%)] bg-[length:100%_4px] pointer-events-none" />
          
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-accent-cyan blur-[30px] opacity-20 rounded-full" />
            <Lock className="w-16 h-16 text-accent-cyan/80 relative z-10 drop-shadow-[0_0_15px_rgba(0,229,255,0.8)]" />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-outfit font-black text-white mb-4 tracking-widest uppercase">
            [ Encrypted Data Stream ]
          </h3>
          
          <p className="text-text-muted font-mono max-w-md mx-auto mb-10 leading-relaxed">
            The neural blog archives are currently sealed. Writing protocols are being initialized. Check back later for deep dives into engineering, system architecture, and AI.
          </p>
          
          {/* Animated Loading Bar */}
          <div className="w-full max-w-xs h-1 bg-white/5 rounded-full overflow-hidden relative mb-4">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-accent-cyan shadow-[0_0_10px_rgba(0,229,255,1)]"
              animate={{ 
                x: ["-100%", "100%"]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ width: "50%" }}
            />
          </div>
          <span className="text-[10px] font-mono text-accent-cyan tracking-widest uppercase animate-pulse">
            Awaiting decryption keys...
          </span>

        </motion.div>
      </div>
    </section>
  );
}
