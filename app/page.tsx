"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

// Global Components
import LoadingScreen from "@/components/LoadingScreen";
import BackgroundEffects from "@/components/BackgroundEffects";
import MouseWaterEffect from "@/components/MouseWaterEffect";
import Navbar from "@/components/Navbar";

// Sections
import Hero from "@/components/sections/Hero";
import TechnicalExpertise from "@/components/sections/TechnicalExpertise";
import CodingJourney from "@/components/sections/CodingJourney";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  // Restore scrolling when loading completes
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // ensure x axis remains hidden
      document.body.style.overflowX = "hidden";
    }
  }, [isLoading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Main Content wrapper */}
      <div 
        className="relative min-h-screen font-sans selection:bg-accent-cyan/30"
        style={{ 
          opacity: isLoading ? 0 : 1, 
          pointerEvents: isLoading ? "none" : "auto",
          transition: "opacity 0.5s ease-in-out" 
        }}
      >
        <BackgroundEffects />
        <MouseWaterEffect />
        <Navbar />

        <main className="relative z-10 flex flex-col items-center">
          <div className="w-full">
            <Hero />
            <TechnicalExpertise />
            <CodingJourney />
            <Projects />
            <Experience />
            <Blog />
            <Contact />
          </div>
        </main>
      </div>
    </>
  );
}
