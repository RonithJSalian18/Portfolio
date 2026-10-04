import { BackToTop } from '@/components/BackToTop'
import { RESUME_URL, footer, navLinks, profile, socials } from '@/data/profile'

/** The seafloor at the bottom of the dive */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="seafloor">
        <div className="seafloor-dunes" aria-hidden="true" />
        <div className="footer-plankton" aria-hidden="true" />
        <div className="footer-inner">
          <div className="footer-brand">
            <p className="footer-name">{profile.name}</p>
            <p className="footer-blurb">{footer.blurb}</p>
          </div>
          <nav aria-labelledby="footer-nav-title">
            <h2 id="footer-nav-title" className="footer-heading">
              Navigation
            </h2>
            <ul>
              {[{ label: 'Home', href: '#hero' }, ...navLinks].map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h2 className="footer-heading">Connect</h2>
            <ul>
              {socials.map((social) => (
                <li key={social.key}>
                  <a
                    href={social.href}
                    {...(social.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {social.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" aria-label="Résumé (PDF, opens in a new tab)">
                  Résumé (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {year} {profile.name}. All rights reserved.
          </p>
          <p>{footer.credit}</p>
        </div>
      </div>
      <BackToTop />
    </footer>
  )
}
