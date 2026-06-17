"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const quotes = [
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs", color: "text-accent-pink shadow-accent-pink/20" },
  { text: "Programs must be written for people to read.", author: "Harold Abelson", color: "text-accent-cyan shadow-accent-cyan/20" },
];

export default function FamousQuotes() {
  return (
    <section className="py-32 relative hidden lg:block">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-mono font-bold text-white mb-4">
            Core <span className="text-accent-purple">Philosophy</span>
          </h2>
        </div>

        <div className="flex items-center justify-center gap-12 perspective-1000">
          {quotes.map((quote, i) => (
            <motion.div
              key={i}
              className={`relative w-[400px] p-8 holographic-panel rounded-2xl flex flex-col justify-between ${quote.color}`}
              style={{ transformStyle: 'preserve-3d' }}
              whileHover={{ rotateY: i % 2 === 0 ? 10 : -10, rotateX: 5, z: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Quote className={`w-8 h-8 mb-6 ${quote.color.split(' ')[0]} opacity-50`} />
              <p className="text-2xl font-outfit font-bold text-white mb-8" style={{ transform: 'translateZ(30px)' }}>
                "{quote.text}"
              </p>
              <div className="text-right font-mono text-sm" style={{ transform: 'translateZ(20px)' }}>
                <span className="text-text-muted">_sys.author: </span>
                <span className={quote.color.split(' ')[0]}>{quote.author}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
