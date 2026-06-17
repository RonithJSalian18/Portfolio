"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Home, User, Rocket, Code2, Briefcase, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const dockItems = [
  { id: "home", icon: Home, label: "Command Center" },
  { id: "skills", icon: Rocket, label: "Skill Galaxy" },
  { id: "mission", icon: Code2, label: "Mission Control" },
  { id: "projects", icon: Briefcase, label: "Project Universe" },
  { id: "contact", icon: Mail, label: "Comm Channel" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = dockItems.map(i => i.id);
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Adjust threshold based on section size
          if (rect.top >= -300 && rect.top <= 400) {
            setActive(section);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-end gap-2 p-3 rounded-2xl bg-bg-space/80 backdrop-blur-2xl border border-accent-cyan/20 shadow-[0_0_30px_rgba(0,229,255,0.15)]"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
    >
      {dockItems.map((item) => {
        const isActive = active === item.id;
        const isHovered = hovered === item.id;

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            className="relative flex flex-col items-center justify-end"
            onClick={() => setActive(item.id)}
          >
            {/* Tooltip */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-12 px-3 py-1.5 bg-bg-void/90 text-accent-cyan text-xs font-mono rounded border border-accent-cyan/30 whitespace-nowrap shadow-[0_0_10px_rgba(0,229,255,0.2)]"
              >
                {item.label}
              </motion.div>
            )}

            <motion.div
              animate={{
                scale: isHovered ? 1.4 : isActive ? 1.1 : 1,
                y: isHovered ? -10 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded-xl transition-colors duration-300 relative overflow-hidden",
                isActive 
                  ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50 shadow-[0_0_15px_rgba(0,229,255,0.4)]" 
                  : "bg-white/5 text-text-muted hover:bg-white/10 hover:text-white border border-transparent"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="dock-active" 
                  className="absolute inset-0 bg-accent-cyan/10"
                />
              )}
              <item.icon size={isHovered ? 24 : 20} className="relative z-10" />
            </motion.div>
            
            {/* Active dot */}
            {isActive && (
              <motion.div 
                layoutId="dock-dot"
                className="absolute -bottom-2 w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,229,255,1)]"
              />
            )}
          </a>
        );
      })}
    </motion.div>
  );
}
