"use client";

import { motion } from "framer-motion";
import { Terminal, Send } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-32 relative">
      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-mono font-bold text-white mb-4 flex items-center justify-center gap-4">
            <Terminal className="text-accent-cyan" size={40} />
            Open Communication Channel
          </h2>
        </div>

        <div className="holographic-panel rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-pink" />
          
          <div className="flex items-center gap-2 mb-8 text-xs font-mono text-accent-cyan border-b border-white/10 pb-4">
            <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
            SECURE CONNECTION ESTABLISHED
          </div>

          <form className="space-y-6 font-mono" onSubmit={(e) => e.preventDefault()}>
            <div className="relative group">
              <label className="text-xs text-text-muted mb-2 block uppercase tracking-widest group-focus-within:text-accent-cyan transition-colors">Target ID (Name)</label>
              <input 
                type="text" 
                className="w-full bg-bg-space/50 border border-white/10 rounded-lg p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/50 transition-all"
                placeholder="_enter_designation"
              />
            </div>
            
            <div className="relative group">
              <label className="text-xs text-text-muted mb-2 block uppercase tracking-widest group-focus-within:text-accent-purple transition-colors">Return Node (Email)</label>
              <input 
                type="email" 
                className="w-full bg-bg-space/50 border border-white/10 rounded-lg p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple/50 transition-all"
                placeholder="_enter_address"
              />
            </div>

            <div className="relative group">
              <label className="text-xs text-text-muted mb-2 block uppercase tracking-widest group-focus-within:text-accent-pink transition-colors">Payload (Message)</label>
              <textarea 
                rows={4}
                className="w-full bg-bg-space/50 border border-white/10 rounded-lg p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-accent-pink focus:ring-1 focus:ring-accent-pink/50 transition-all resize-none"
                placeholder="_transmit_data"
              />
            </div>

            <button className="w-full py-4 mt-4 bg-accent-cyan/20 border border-accent-cyan text-accent-cyan rounded-lg font-bold tracking-widest hover:bg-accent-cyan hover:text-bg-space transition-all flex items-center justify-center gap-2 group">
              TRANSMIT 
              <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
