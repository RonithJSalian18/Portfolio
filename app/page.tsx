'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { LoadingScreen } from '@/components/LoadingScreen'
import { ScrollProgress } from '@/components/ScrollProgress'
import { BackgroundEffects } from '@/components/BackgroundEffects'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Skills } from '@/components/sections/Skills'
import { Projects } from '@/components/sections/Projects'
import { Experience } from '@/components/sections/Experience'
import { Achievements } from '@/components/sections/Achievements'
import { TechQuotes } from '@/components/sections/TechQuotes'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Enable scrolling after loading is done
      document.body.style.overflow = 'auto'
    }, 3500)

    // Disable scrolling during loading
    document.body.style.overflow = 'hidden'

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <>
      {/* Loading screen with AnimatePresence for smooth exit */}
      <LoadingScreen isLoading={isLoading} />

      {/* Main content - only visible after loading completes */}
      <main className={`relative w-full overflow-hidden bg-dark-bg transition-opacity duration-500 ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {/* Background effects */}
        <BackgroundEffects />

        {/* Scroll progress indicator */}
        <ScrollProgress />

        {/* Navigation */}
        <Navbar />

        {/* Sections */}
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <TechQuotes />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
