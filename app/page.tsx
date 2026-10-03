import { CrabProgress } from '@/components/CrabProgress'
import { Navbar } from '@/components/Navbar'
import { IntroGate } from '@/components/intro/IntroGate'
import { DiveTransition } from '@/components/ocean/DiveTransition'
import { DiverGate } from '@/components/ocean/DiverGate'
import { OceanZone } from '@/components/ocean/OceanZone'
import { RevealObserver } from '@/components/RevealObserver'
import { About } from '@/components/sections/About'
import { Achievements } from '@/components/sections/Achievements'
import { Contact } from '@/components/sections/Contact'
import { Experience } from '@/components/sections/Experience'
import { Footer } from '@/components/sections/Footer'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Quotes } from '@/components/sections/Quotes'
import { Skills } from '@/components/sections/Skills'

// From the beach, dive under the waterline and keep going down: each zone is deeper and darker,
// ending on the seafloor (footer).
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
          <DiveTransition />
          <OceanZone zone="reef">
            <About />
            <Skills />
          </OceanZone>
          <OceanZone zone="open">
            <Projects />
            <Experience />
          </OceanZone>
          <OceanZone zone="twilight">
            <Achievements />
            <Quotes />
          </OceanZone>
          <OceanZone zone="deep">
            <Contact />
          </OceanZone>
        </main>
        <Footer />
        <DiverGate />
        <CrabProgress />
      </div>
      <RevealObserver />
    </>
  )
}
