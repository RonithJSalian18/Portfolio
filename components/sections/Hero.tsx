import { Code2, Download, Mail } from 'lucide-react'
import { BeachFinds, Lighthouse, Sailboat, SkyLife, Surfer } from '@/components/beach/BeachLife'
import { HeroParallax } from '@/components/HeroParallax'
import { GithubIcon, LinkedinIcon } from '@/components/SocialIcons'
import { RESUME_PATH } from '@/config/site'
import { profile, socials, type SocialKey } from '@/data/profile'

const socialIcons: Record<SocialKey, React.ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  leetcode: Code2,
  email: Mail,
}

export function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="hero-sky" aria-hidden="true">
        <div className="hero-stars" />
        <div className="hero-clouds">
          <span className="cloud cloud-1" />
          <span className="cloud cloud-2" />
          <span className="cloud cloud-3" />
        </div>
        <div className="hero-dusk" />
        <SkyLife />
        <div className="celestial">
          <div className="sun" />
          <div className="moon" />
        </div>
      </div>

      <div className="hero-content">
        <p className="hero-hello">Hi, I&apos;m</p>
        <h1 id="hero-title" className="hero-name" tabIndex={-1}>
          {profile.name}
        </h1>
        <p className="hero-role">{profile.role}</p>
        <p className="hero-tagline">
          Also building with {profile.focus} · {profile.location}
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary">
            View Projects
          </a>
          <a href={RESUME_PATH} className="btn btn-ghost" download>
            <Download className="h-4 w-4" aria-hidden="true" />
            Download Resume
          </a>
        </div>
        <ul className="hero-socials">
          {socials.map((social) => {
            const Icon = socialIcons[social.key]
            const external = social.href.startsWith('http')
            return (
              <li key={social.key}>
                <a
                  href={social.href}
                  aria-label={`${social.label}: ${social.handle}`}
                  title={social.label}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <Icon aria-hidden="true" />
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="hero-scene" aria-hidden="true">
        <div className="reflection reflection-sun" />
        <div className="reflection reflection-moon" />
        <Sailboat />
        <Lighthouse />
        <div className="layer layer-far">
          <div className="wave wave-far" />
        </div>
        <div className="layer layer-mid">
          <div className="wave wave-mid" />
          <Surfer className="surfer-far" />
        </div>
        <div className="layer layer-near">
          <div className="wave wave-near" />
          <Surfer />
          <div className="wave-edge">
            <div className="wave-edge-glow">
              <span />
            </div>
            <span className="wave-edge-line" />
          </div>
        </div>
        <div className="layer layer-shore">
          <div className="wave wave-shore" />
          <div className="wave wave-shore-foam" />
        </div>
        <div className="layer layer-sand">
          <div className="wave wave-sand" />
        </div>
        <BeachFinds />
      </div>

      <HeroParallax />
    </section>
  )
}
