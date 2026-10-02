import { CrabProgress } from '@/components/CrabProgress'
import { Navbar } from '@/components/Navbar'
import { IntroGate } from '@/components/intro/IntroGate'
import { RevealObserver } from '@/components/RevealObserver'
import { WaveDivider } from '@/components/WaveDivider'
import { About } from '@/components/sections/About'
import { Achievements } from '@/components/sections/Achievements'
import { Contact } from '@/components/sections/Contact'
import { Experience } from '@/components/sections/Experience'
import { Footer } from '@/components/sections/Footer'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Quotes } from '@/components/sections/Quotes'
import { Skills } from '@/components/sections/Skills'

// A walk down the beach: each section's sand is a little wetter than the last, ending in the sea (footer).
export default function Home() {
  return (
    <>
      <IntroGate />
      <div id="site">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1}>
          <Hero />
          <About />
          <WaveDivider from="sand-1" to="sand-2" />
          <Skills />
          <WaveDivider from="sand-2" to="sand-3" />
          <Projects />
          <WaveDivider from="sand-3" to="sand-4" />
          <Experience />
          <WaveDivider from="sand-4" to="sand-5" />
          <Achievements />
          <WaveDivider from="sand-5" to="sand-wet" />
          <Quotes />
          <WaveDivider from="sand-wet" to="sand-wet" />
          <Contact />
        </main>
        <Footer />
        <CrabProgress />
      </div>
      <RevealObserver />
    </>
  )
}
