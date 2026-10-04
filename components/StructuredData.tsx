import { SITE_URL } from '@/config/site'
import { headline, profile, skillGroups, socials, timeline } from '@/data/profile'

/** schema.org Person data, so search engines can tell who the site is about (built from data/profile.ts) */
export function StructuredData() {
  const [college, school] = timeline.filter((entry) => entry.kind === 'education')
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    givenName: profile.givenName,
    familyName: profile.familyName,
    jobTitle: profile.role,
    disambiguatingDescription: headline,
    description: profile.bio,
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    affiliation: college ? { '@type': 'CollegeOrUniversity', name: college.org } : undefined,
    alumniOf: school ? { '@type': 'EducationalOrganization', name: school.org } : undefined,
    knowsAbout: skillGroups.flatMap((group) => group.skills),
    knowsLanguage: profile.spokenLanguages,
    sameAs: socials.filter((social) => social.href.startsWith('http')).map((social) => social.href),
  }

  return (
    <script
      type="application/ld+json"
      // Escaping "<" keeps the JSON from ever closing the script tag early
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }}
    />
  )
}
