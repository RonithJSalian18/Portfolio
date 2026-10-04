import { CrabProgress } from '@/components/CrabProgress'
import { Navbar } from '@/components/Navbar'
import { OffscreenPauser } from '@/components/OffscreenPauser'
import { IntroGate } from '@/components/intro/IntroGate'
import { DiveTransition } from '@/components/ocean/DiveTransition'
import { DiverGate } from '@/components/ocean/DiverGate'
import { OceanZone } from '@/components/ocean/OceanZone'
import { RevealObserver } from '@/components/RevealObserver'
import { StructuredData } from '@/components/StructuredData'
import { About } from '@/components/sections/About'
import { Achievements } from '@/components/sections/Achievements'
import { Contact } from '@/components/sections/Contact'
import { Experience } from '@/components/sections/Experience'
import { Footer } from '@/components/sections/Footer'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'

// While the intro plays, the page under it takes no focus. Set by the parser as it reaches the page, before
// anything in it is styled, so it costs nothing; IntroGate lifts it when the clouds part.
const holdFocus = "if(document.documentElement.dataset.intro==='play')document.currentScript.parentNode.inert=true"

// From the beach, dive under the waterline and keep going down: each zone is deeper and darker,
// ending on the seafloor (footer).
export default function Home() {
  return (
    <>
      <StructuredData />
      <IntroGate />
      {/* inert is only ever added by the script below */}
      <div id="site" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: holdFocus }} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1}>
          <Hero />
          <DiveTransition />
          <OceanZone zone="reef">
            <About />
          </OceanZone>
          <OceanZone zone="open">
            <Skills />
            <Projects />
          </OceanZone>
          <OceanZone zone="twilight">
            <Experience />
            <Achievements />
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
      <OffscreenPauser />
    </>
  )
}
