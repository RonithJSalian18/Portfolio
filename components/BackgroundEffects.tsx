"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BackgroundEffects() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-bg-space">
      {/* Floating Particles */}
      {Array.from({ length: 60 }).map((_, i) => {
        const size = Math.random() * 4 + 1;
        const colorClass = Math.random() > 0.6 
          ? "bg-accent-cyan/40" 
          : (Math.random() > 0.5 ? "bg-accent-purple/40" : "bg-white/20");
          
        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${colorClass} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
            style={{
              width: size + "px",
              height: size + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
            }}
            animate={{
              y: [0, -200, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0.1, 0.8, 0.1],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        );
      })}
    </div>
  );
}
