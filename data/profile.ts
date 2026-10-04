// Single source of truth for everything the site says, taken from the résumé.
// Components only decide how it looks. Lines marked TODO need a real value before launch.

export const profile = {
  name: 'Ronith J Salian',
  shortName: 'Ronith',
  givenName: 'Ronith',
  familyName: 'Salian',
  role: 'Full Stack Developer',
  focus: 'AI/ML',
  location: 'Udupi, Karnataka',
  email: 'ronithjsalian01@gmail.com',
  spokenLanguages: ['English', 'Hindi', 'Kannada', 'Tulu'],
  /** Written from the résumé's facts; edit freely */
  bio: "I'm a full stack developer from Udupi, Karnataka, studying Information Science and Engineering at NMAM Institute of Technology. I build web apps end to end with React, Next.js, Node.js and FastAPI, and I'm working more and more on AI/ML: multi-agent LangGraph pipelines, retrieval over pgvector, and TensorFlow models for computer vision.",
} as const

/** Search and link-preview text (the preview image is app/opengraph-image.tsx) */
export const seo = {
  title: `${profile.name} | ${profile.role}`,
  description: `${profile.role} from ${profile.location}, building web apps with React, Next.js and FastAPI, and ${profile.focus} systems with LangGraph, RAG and TensorFlow.`,
  keywords: [
    profile.name,
    'full stack developer',
    'AI/ML',
    'Udupi',
    'Karnataka',
    'React',
    'Next.js',
    'FastAPI',
    'LangGraph',
    'portfolio',
  ],
}

export type SocialKey = 'github' | 'linkedin' | 'leetcode' | 'email'

export const socials: { key: SocialKey; label: string; handle: string; href: string }[] = [
  { key: 'github', label: 'GitHub', handle: 'RonithJSalian18', href: 'https://github.com/RonithJSalian18' },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    handle: 'ronith-j-salian',
    href: 'https://www.linkedin.com/in/ronith-j-salian-093b76288',
  },
  { key: 'leetcode', label: 'LeetCode', handle: 'ronith_salian', href: 'https://leetcode.com/u/ronith_salian' },
  { key: 'email', label: 'Email', handle: profile.email, href: `mailto:${profile.email}` },
]

export const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact', href: '#contact' },
]

export interface SectionCopy {
  /** Small label above the title: the ocean zone the section sits in */
  eyebrow: string
  title?: string
  highlight: string
  intro?: string
}

export const sections = {
  about: { eyebrow: 'Shallow reef', title: 'About', highlight: 'Ronith' },
  skills: {
    eyebrow: 'Open water',
    title: 'Skills &',
    highlight: 'Tools',
    intro: 'The languages, frameworks and tools I build with, grouped by what they do.',
  },
  projects: {
    eyebrow: 'Open water',
    title: 'Selected',
    highlight: 'Projects',
    intro: 'Four builds across full stack web, AI agents and computer vision.',
  },
  experience: {
    eyebrow: 'Twilight zone',
    title: 'Experience &',
    highlight: 'Education',
    intro: "Where I've worked and studied.",
  },
  achievements: {
    eyebrow: 'Twilight zone',
    highlight: 'Achievements',
    intro: 'Problem-solving milestones and hackathons.',
  },
  contact: {
    eyebrow: 'The deep',
    title: 'Get in',
    highlight: 'Touch',
    intro: 'Email is the fastest way to reach me. You can also find me on LinkedIn and GitHub.',
  },
} satisfies Record<string, SectionCopy>

/** Quick facts shown beside the bio */
export const facts = [
  { label: 'Based in', value: profile.location },
  {
    label: 'Studying',
    value: 'B.Tech in Information Science and Engineering, NMAM Institute of Technology (2023–2027), CGPA 8.68/10',
  },
  { label: 'Focus', value: `Full stack development, with a growing focus on ${profile.focus}` },
  { label: 'Speaks', value: profile.spokenLanguages.join(', ') },
] as const

// ---------- Skills ----------

export type SkillGroupId = 'languages' | 'frontend' | 'backend' | 'ai' | 'databases' | 'tools'

export const skillGroups = [
  { id: 'languages', name: 'Languages', skills: ['Python', 'JavaScript', 'TypeScript', 'SQL'] },
  { id: 'frontend', name: 'Frontend', skills: ['React.js', 'Next.js', 'Tailwind CSS', 'HTML', 'CSS'] },
  { id: 'backend', name: 'Backend', skills: ['Node.js', 'Express.js', 'FastAPI', 'REST APIs'] },
  {
    id: 'ai',
    name: 'AI/ML',
    skills: ['LangGraph', 'LangChain', 'RAG', 'pgvector', 'Hugging Face', 'TensorFlow', 'OpenCV', 'scikit-learn'],
  },
  { id: 'databases', name: 'Databases', skills: ['PostgreSQL (Supabase)', 'MySQL'] },
  { id: 'tools', name: 'Tools', skills: ['Git', 'GitHub', 'Docker', 'Linux', 'pytest', 'Vercel', 'Render'] },
] as const satisfies readonly { id: SkillGroupId; name: string; skills: readonly string[] }[]

/** Any skill named in skillGroups (so projects can only reference real skills) */
export type Skill = (typeof skillGroups)[number]['skills'][number]

// ---------- Projects ----------

/** Sea-glass tint of the project's bottle */
export type GlassTint = 'cobalt' | 'seafoam' | 'amber' | 'aqua'

export interface Project {
  id: string
  title: string
  tagline: string
  summary: string
  points: string[]
  /** Tech as listed on the résumé */
  stack: string[]
  /** Which skills from skillGroups it uses (drives the "used in" readout) */
  skills: Skill[]
  category: string
  glass: GlassTint
  flagship?: boolean
  event?: string
  repo?: string
  live?: string
}

export const projects: Project[] = [
  {
    id: 'voxscribe',
    title: 'VoxScribe AI',
    tagline: 'Multi-Agent Blog Generator',
    summary: 'Turns any YouTube video into an SEO-optimized blog post that sounds like you.',
    points: [
      'Turns any YouTube video into an SEO-optimized blog post using a three-agent LangGraph pipeline (Researcher, Writer, Editor) running Llama 3.1 8B on Groq.',
      '"Brand Voice Vault": RAG that parses a user\'s past writing from PDFs (PyMuPDF) and embeds it with Hugging Face into Supabase pgvector, so drafts match their style.',
      'Frontend on Vercel, FastAPI backend on Render, Supabase Auth for accounts.',
    ],
    stack: ['Next.js', 'Tailwind CSS', 'FastAPI', 'LangGraph', 'LangChain', 'Supabase (PostgreSQL, pgvector)', 'Groq'],
    skills: [
      'Python',
      'TypeScript',
      'React.js',
      'Next.js',
      'Tailwind CSS',
      'HTML',
      'CSS',
      'FastAPI',
      'REST APIs',
      'LangGraph',
      'LangChain',
      'RAG',
      'pgvector',
      'Hugging Face',
      'PostgreSQL (Supabase)',
      'Git',
      'GitHub',
      'Vercel',
      'Render',
    ],
    category: 'AI · Full stack',
    glass: 'seafoam',
    flagship: true,
    repo: 'https://github.com/RonithJSalian18/VoxScribeAI', // TODO: confirm this is the repo to show
    live: 'https://vox-scribe-ai.vercel.app',
  },
  {
    id: 'sentinelfi',
    title: 'SentinelFi',
    tagline: 'Autonomous KYC/AML compliance platform',
    summary:
      'Automates corporate due diligence for financial institutions, from parsing complex filings to catching circular money-laundering loops.',
    points: [
      'Architected an autonomous KYC/AML compliance platform using FastAPI, Next.js, and PostgreSQL to automate corporate due diligence for financial institutions.',
      'Engineered a multi-threaded C++ graph cycle-detection engine (integrated via pybind11) to uncover circular money-laundering loops in transaction ledgers, operating 287x faster than pure Python.',
      'Integrated Gemini 2.5 Flash with Celery and Redis to asynchronously parse complex financial PDFs, extracting ESG vulnerabilities, legal liabilities, and composite risk scores.',
      'Implemented a custom Zero-Trust ASGI middleware to block SQLi/XSS attacks in real-time, securing the system alongside OAuth2/JWT role-based access control.',
      'Designed an encrypted document retention pipeline using AWS S3, serving secure, short-lived pre-signed URLs to an embedded frontend viewer with live WebSocket job status updates.',
    ],
    stack: [
      'FastAPI',
      'Next.js',
      'PostgreSQL',
      'C++ (pybind11)',
      'Gemini 2.5 Flash',
      'Celery',
      'Redis',
      'AWS S3',
      'OAuth2/JWT',
      'WebSockets',
    ],
    skills: [
      'Python',
      'TypeScript',
      'React.js',
      'Next.js',
      'Tailwind CSS',
      'HTML',
      'CSS',
      'FastAPI',
      'REST APIs',
      'PostgreSQL (Supabase)',
      'Git',
      'GitHub',
    ],
    category: 'Full stack · Security',
    glass: 'cobalt',
    flagship: true,
    repo: 'https://github.com/RonithJSalian18/SentinelFi', // TODO: confirm this is the repo to show
  },
  {
    id: 'unibank',
    title: 'UniBank MDM',
    tagline: 'Unified Customer 360',
    summary: "Unifies a bank's customer records from multiple source systems into a single Customer 360 view.",
    points: [
      "Co-developed an automated Master Data Management platform that unifies a bank's customer records from multiple source systems into a single Customer 360 view.",
      'React frontend, Node.js/Express REST API, and a separate Python processing engine.',
    ],
    stack: ['React', 'Node.js', 'Express.js', 'Python', 'Supabase (PostgreSQL)'],
    skills: [
      'Python',
      'JavaScript',
      'React.js',
      'HTML',
      'CSS',
      'Node.js',
      'Express.js',
      'REST APIs',
      'PostgreSQL (Supabase)',
    ],
    category: 'Full stack · Hackathon',
    glass: 'amber',
    event: 'BNP Paribas Innoversité 2026-27 Hackathon',
    // TODO: add the repo URL (no public repo found on GitHub); the card shows no Code button until set
  },
  {
    id: 'space-debris',
    title: 'Space Debris Identification System',
    tagline: 'Debris or active spacecraft, from orbital imagery',
    summary: 'Classifies about 110,000 SPARK-2022 orbital images as debris or active spacecraft at 99.92–99.98% F1.',
    points: [
      'TensorFlow pipeline classifying ~110,000 SPARK-2022 orbital images as debris or active spacecraft. Benchmarked a custom CNN, MobileNetV2, ResNet-50 and EfficientNet-B0 at 99.92–99.98% F1.',
      'Prevented data leakage with trajectory-grouped 70/15/15 splits and multi-core perceptual-hash deduplication. Calibrated the decision threshold on validation data only.',
      'Two-phase fine-tuning with BatchNorm locked in inference mode. Handled a 10:1 class imbalance with class weighting and space-physics augmentations (solar glare, sensor noise).',
      'GPU Docker image for training and inference, a 3-state uncertainty policy that flags low-confidence predictions, and 14 pytest tests.',
    ],
    stack: ['Python', 'TensorFlow', 'OpenCV', 'scikit-learn', 'Docker', 'pytest'],
    skills: ['Python', 'TensorFlow', 'OpenCV', 'scikit-learn', 'Docker', 'pytest', 'Git', 'GitHub'],
    category: 'Machine learning · Computer vision',
    glass: 'aqua',
    repo: 'https://github.com/RonithJSalian18/Space-Derbis-Identification', // TODO: confirm (repo name is spelled "Derbis")
  },
]

// ---------- Experience and education ----------

export interface TimelineEntry {
  kind: 'work' | 'education'
  title: string
  org: string
  period: string
  points: string[]
}

export const timeline: TimelineEntry[] = [
  {
    kind: 'work',
    title: 'Intern',
    org: 'Sasken Technologies Ltd.',
    period: 'Jun 2025 – Jul 2025',
    points: [
      'Analyzed 4G LTE network architecture across the Radio Access Network (eNodeB) and Evolved Packet Core (EPC), covering the protocol stack from PHY to RRC.',
      'Examined S1/X2 interfaces and UE attach and handover procedures, mapping how data and signaling flow between devices, base stations and the network core.',
    ],
  },
  {
    kind: 'education',
    title: 'B.Tech in Information Science and Engineering',
    org: 'NMAM Institute of Technology, Nitte',
    period: '2023 – 2027 (expected)',
    points: [
      'CGPA 8.68/10',
      'Coursework: Data Structures & Algorithms, OOP, DBMS, Operating Systems, Computer Networks',
    ],
  },
  {
    kind: 'education',
    title: 'Pre-University (Class XII), PCMCs',
    org: 'Vidyodaya PU College',
    period: '2021 – 2023',
    points: ['Karnataka State Board', 'Aggregate 96.66%'],
  },
]

// ---------- Achievements ----------

export type AchievementIcon = 'sand-dollar' | 'scallop' | 'starfish' | 'conch'

export interface Achievement {
  icon: AchievementIcon
  title: string
  detail: string
  href?: string
  /** Skills it counts as using (for the "used in" readout) */
  skills?: Skill[]
}

export const achievements: Achievement[] = [
  {
    icon: 'sand-dollar',
    title: 'LeetCode: 480+ problems',
    detail: 'Solved in Python and SQL',
    href: 'https://leetcode.com/u/ronith_salian',
    skills: ['Python', 'SQL'],
  },
  { icon: 'scallop', title: 'LeetCode 100 Days Badge', detail: 'Earned in 2025 and 2026' },
  { icon: 'starfish', title: 'BNP Paribas Innoversité 2026-27', detail: 'Hackathon: built UniBank MDM', href: '#project-unibank' },
  { icon: 'conch', title: 'Hackloop 2024', detail: 'Hackathon: built Study Buddy' },
]

export const footer = {
  blurb: `${profile.role} from ${profile.location}, building web apps and ${profile.focus} systems.`,
  credit: 'Built with Next.js, Tailwind CSS and WebGL',
}

/** Where a skill shows up: featured projects first, then achievements */
export function usesOf(skill: Skill): { label: string; href: string }[] {
  return [
    ...projects.filter((project) => project.skills.includes(skill)).map((p) => ({ label: p.title, href: `#project-${p.id}` })),
    ...achievements
      .filter((achievement) => achievement.skills?.includes(skill))
      .map((a) => ({ label: a.title, href: a.href ?? '#achievements' })),
  ]
}
