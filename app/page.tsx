import { CrabProgress } from '@/components/CrabProgress'
import { Navbar } from '@/components/Navbar'
import { RevealObserver } from '@/components/RevealObserver'
import { Hero } from '@/components/sections/Hero'

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
        </main>
        <CrabProgress />
      </div>
      <RevealObserver />
    </>
  )
}
