import { CrabProgress } from '@/components/CrabProgress'
import { Navbar } from '@/components/Navbar'
import { RevealObserver } from '@/components/RevealObserver'
import { WaveDivider } from '@/components/WaveDivider'
import { About } from '@/components/sections/About'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'

export default function Home() {
  return (
    <>
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
        </main>
        <CrabProgress />
      </div>
      <RevealObserver />
    </>
  )
}
