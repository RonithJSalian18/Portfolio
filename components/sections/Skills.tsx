import { SectionHeading } from '@/components/SectionHeading'
import { SkillSonar, type SonarGroup } from '@/components/SkillSonar'
import { sections, skillGroups, usesOf } from '@/data/profile'

export function Skills() {
  // Resolved here so the client component only receives names and links
  const groups: SonarGroup[] = skillGroups.map((group) => ({
    id: group.id,
    name: group.name,
    skills: group.skills.map((skill) => ({ name: skill, uses: usesOf(skill) })),
  }))

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="section-inner">
        <SectionHeading id="skills" copy={sections.skills} />
        <SkillSonar groups={groups} />
      </div>
    </section>
  )
}
