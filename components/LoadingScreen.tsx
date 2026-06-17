"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const quotes = [
  "Build projects. Not just resumes.",
  "Consistency beats motivation.",
  "Code. Learn. Improve. Repeat.",
  "First solve the problem, then write the code."
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Quote rotation
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 2000);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(quoteInterval);
          setTimeout(onComplete, 500); // Wait a bit before completing
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 300);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-main"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="relative flex flex-col items-center justify-center w-full max-w-md px-6">
        {/* Glowing Logo / Initials */}
        <motion.div 
          className="text-6xl font-outfit font-bold text-white mb-12 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-gradient">RS</span>
          <div className="absolute inset-0 blur-3xl bg-accent-purple/30 rounded-full" />
        </motion.div>

        {/* Quotes Rotation */}
        <div className="h-16 flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-text-secondary text-center font-inter italic"
            >
              "{quotes[quoteIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.3 }}
          />
        </div>
        
        {/* Percentage text */}
        <motion.div 
          className="mt-4 font-outfit text-accent-cyan tracking-widest text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {progress}%
        </motion.div>
      </div>
    </motion.div>
  );
}
