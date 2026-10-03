// Everything the site says about Ronith lives here, so sections only decide how it looks.

export const profile = {
  name: 'Ronith J Salian',
  shortName: 'Ronith',
  role: 'Full Stack Developer',
  headline: 'Computer Science Student & Full Stack Developer',
  tagline: 'Building efficient, scalable, and intelligent solutions.',
  roles: ['Computer Science Student', 'AI Engineer', 'Problem Solver', 'Tech Enthusiast', 'Backend Learner'],
  email: 'ronithjsalian01@gmail.com',
  phone: { display: '+91 76193 40723', href: 'tel:+917619340723' },
  /** The beach on the Karnataka coast that the intro globe zooms in on */
  beach: { lat: 13.101766, lng: 74.769385 },
}

export type SocialKey = 'github' | 'linkedin' | 'leetcode' | 'email'

export const socials: { key: SocialKey; label: string; handle: string; href: string }[] = [
  { key: 'github', label: 'GitHub', handle: 'RonithJSalian18', href: 'https://github.com/RonithJSalian18' },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    handle: 'ronith-j-salian',
    href: 'https://linkedin.com/in/ronith-j-salian-093b76288/',
  },
  { key: 'leetcode', label: 'LeetCode', handle: 'ronith_salian', href: 'https://leetcode.com/ronith_salian' },
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
  /** Small label above the title; it names the depth zone the section sits in */
  eyebrow: string
  title: string
  highlight: string
  intro: string
}

export const sections = {
  about: {
    eyebrow: 'Shallow reef',
    title: 'About',
    highlight: 'Ronith',
    intro:
      'Aspiring software engineer with strong interest in Machine Learning, Data Structures, Algorithms, and Software Development. Passionate about building efficient, scalable, and intelligent solutions.',
  },
  skills: {
    eyebrow: 'Coral garden',
    title: 'Technical',
    highlight: 'Expertise',
    intro:
      'Full-stack development toolkit with expertise in modern web technologies, databases, DevOps, and algorithmic problem solving.',
  },
  projects: {
    eyebrow: 'Open water',
    title: 'My',
    highlight: 'Projects',
    intro: 'A showcase of innovative solutions and impactful projects built with modern technologies.',
  },
  experience: {
    eyebrow: 'Descent line',
    title: 'Journey &',
    highlight: 'Milestones',
    intro: 'Education, internships, and achievements showcasing growth and commitment to excellence.',
  },
  achievements: {
    eyebrow: 'Twilight zone',
    title: 'Wins &',
    highlight: 'Achievements',
    intro:
      'Consistent problem-solving on LeetCode showcasing dedication to Data Structures, Algorithms, and Software Development excellence.',
  },
  contact: {
    eyebrow: 'The deep',
    title: 'Get in',
    highlight: 'Touch',
    intro:
      "Interested in collaborating or have a project in mind? Feel free to reach out! I'm always excited to discuss new opportunities.",
  },
} satisfies Record<string, SectionCopy>

export const about = {
  paragraphs: [
    "I'm a BTech student in Information Science & Engineering at NMAM Institute of Technology, Nitte, with a CGPA of 8.64. My passion lies in full-stack development, machine learning, and solving complex algorithmic problems. I recently interned at Sasken Technologies, working on LTE RAN protocols and wireless systems.",
    "I'm committed to continuous learning, problem-solving excellence, and building innovative software solutions. With skills in Python, JavaScript, TypeScript, React, Next.js, and modern DevOps tools, I strive to create impactful applications. I'm always eager to collaborate on challenging projects and contribute to the developer community.",
  ],
  cards: [
    {
      title: 'Education',
      items: ['BTech in Information Science & Engineering', 'NMAM Institute of Technology, Nitte', 'CGPA: 8.64/10'],
    },
    {
      title: 'Core Interests',
      items: ['Machine Learning & AI', 'Data Structures & Algorithms', 'Full-stack Web Development'],
    },
    {
      title: 'Passions',
      items: ['Building scalable solutions', 'Competitive Problem Solving', 'Open-source contributions'],
    },
  ],
}

export const skillGroups: { name: string; skills: string[] }[] = [
  { name: 'Languages', skills: ['Python', 'JavaScript', 'TypeScript', 'C++', 'C', 'Java'] },
  { name: 'Frontend', skills: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'shadcn/ui'] },
  { name: 'Backend', skills: ['FastAPI', 'Node.js', 'Express.js', 'Python', 'REST APIs', 'WebSockets'] },
  {
    name: 'AI & Agents',
    skills: ['LangGraph', 'LangChain', 'RAG Pipelines', 'Groq / Llama 3.1', 'Google Gemini', 'HuggingFace'],
  },
  {
    name: 'Databases & ORM',
    skills: ['PostgreSQL', 'Supabase + pgvector', 'MongoDB', 'Prisma ORM', 'Database Design'],
  },
  { name: 'DevOps & Tools', skills: ['Docker', 'Git', 'GitHub', 'Vercel', 'Render', 'Command Line'] },
  { name: 'Specializations', skills: ['DSA', 'Problem Solving', 'System Design', 'LTE RAN', 'Wireless Protocols'] },
]

export const proficiency = [
  { skill: 'Frontend Development', level: 90 },
  { skill: 'Backend Development', level: 85 },
  { skill: 'Database Design', level: 80 },
  { skill: 'Problem Solving', level: 92 },
]

/** Sea-glass tint of the project's bottle */
export type GlassTint = 'cobalt' | 'seafoam' | 'amber' | 'aqua'

export interface Project {
  id: number
  title: string
  tagline: string
  description: string
  fullDescription: string
  features: string[]
  tags: string[]
  category: string
  glass: GlassTint
  flagship?: boolean
  github?: string
  live?: string
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'SentinelFi',
    tagline: 'Autonomous KYB Intelligence & AML Graph Surveillance Engine',
    description:
      'Zero-trust compliance automation that parses corporate filings and hunts circular money-laundering loops.',
    fullDescription:
      'An enterprise-grade, zero-trust compliance automation platform for Tier-1 financial institutions, fintechs, and corporate compliance teams. Corporate onboarding (Know Your Business) and continuous Anti-Money Laundering monitoring are plagued by manual document review, fragmented registries, and schemes like round-tripping and circular trading. SentinelFi automates the whole suite.',
    features: [
      'Extracts entity details, ESG vulnerabilities, and hidden legal liabilities from corporate PDFs using Gemini 2.5 Flash with deterministic JSON schema validation',
      'Detects multi-party round-trip transactions (A → B → C → A) in ledgers with high-performance relational self-joins',
      'Conversational due diligence on corporate filings with verified document grounding',
      'Zero-Trust Security Shield in the ASGI middleware that blocks SQL injection and XSS and enforces strict HSTS and security headers',
    ],
    tags: ['FastAPI', 'Next.js', 'React', 'Tailwind CSS', 'PostgreSQL', 'Google Gemini', 'Security'],
    category: 'AI Systems',
    glass: 'cobalt',
    flagship: true,
    github: 'https://github.com/RonithJSalian18/SentinelFi',
  },
  {
    id: 2,
    title: 'VoxScribe AI',
    tagline: 'YouTube videos into SEO-optimized blog posts, in your voice',
    description:
      'A multi-agent RAG pipeline that turns any YouTube video into a blog post written in your own brand voice.',
    fullDescription:
      'A full-stack AI application that transforms any YouTube video into a high-quality, SEO-optimized blog post. Using a multi-agent workflow and Retrieval-Augmented Generation, VoxScribe does not just summarize: it analyzes your past writing through a "Brand Voice Vault" so the generated content sounds exactly like you.',
    features: [
      'Multi-agent pipeline built with LangGraph: Researcher, Writer, and Editor agents process transcripts and draft content',
      'Brand Voice Vault (RAG): upload PDFs of past writing; HuggingFace embeddings and Supabase pgvector capture your tone and vocabulary',
      'Automatic YouTube transcript extraction from standard video URLs',
      'Secure sign-up and login with Supabase Auth, in a responsive Next.js + Tailwind interface',
    ],
    tags: ['Next.js', 'FastAPI', 'LangGraph', 'LangChain', 'Groq (Llama 3.1)', 'Supabase pgvector', 'HuggingFace'],
    category: 'AI Systems',
    glass: 'seafoam',
    flagship: true,
    github: 'https://github.com/RonithJSalian18/VoxScribeAI',
    live: 'https://vox-scribe-ai.vercel.app',
  },
  {
    id: 3,
    title: 'StudyBuddy',
    tagline: 'HackLoop 2024: AI-powered PDF Q&A',
    description: 'AI-powered PDF Q&A application with NLP summarization.',
    fullDescription:
      'A web application enabling students to upload PDFs and ask context-based questions using AI. Implements NLP techniques to extract and summarize key information from documents, with an intuitive interface for real-time responses and enhanced study efficiency.',
    features: [
      'Upload PDFs and ask context-based questions',
      'NLP-driven extraction and summarization of key information',
      'Real-time responses in an intuitive study interface',
    ],
    tags: ['React', 'Next.js', 'Python', 'NLP', 'AI'],
    category: 'Full Stack',
    glass: 'amber',
    github: 'https://github.com/RonithJSalian18/Study_Buddy',
  },
  {
    id: 4,
    title: 'Lost and Found Platform',
    tagline: 'Reuniting students with their belongings',
    description: 'Student item recovery and lost-found database platform.',
    fullDescription:
      'A web application allowing students to post and search for lost or found items, helping reconnect users with their belongings efficiently. Features image upload, responsive design, and categorized item tracking for smooth access across devices.',
    features: [
      'Post and search lost or found items',
      'Image upload for faster identification',
      'Categorized tracking with a responsive, cross-device interface',
    ],
    tags: ['React', 'Node.js', 'MongoDB', 'File Upload'],
    category: 'Web App',
    glass: 'aqua',
    github: 'https://github.com/RonithJSalian18/Lostify',
    live: 'https://lostify-wine.vercel.app/',
  },
]

export type TimelineType = 'education' | 'internship' | 'hackathon' | 'achievement'

export const timeline: {
  period: string
  title: string
  organization: string
  description: string
  type: TimelineType
}[] = [
  {
    period: 'July 2023 - Present',
    title: 'BTech in Information Science & Engineering',
    organization: 'NMAM Institute of Technology, Nitte',
    description:
      'Pursuing Bachelor of Technology with CGPA 8.64. Focus on full-stack development, machine learning, and problem-solving excellence.',
    type: 'education',
  },
  {
    period: 'June 2025 - July 2025',
    title: 'LTE RAN Internship',
    organization: 'Sasken Technologies',
    description:
      'Gained practical experience in wireless protocols, LTE RAN debugging, and telecom workflows. Strengthened technical and analytical skills in network protocols.',
    type: 'internship',
  },
  {
    period: 'Innoversite',
    title: 'Innoversite Hackathon',
    organization: 'Hackathon Participant',
    description:
      'Took part in the Innoversite Hackathon, collaborating with a team under tight deadlines to ideate, build, and pitch a working prototype.',
    type: 'hackathon',
  },
  {
    period: 'HackLoop 2024',
    title: 'StudyBuddy - AI PDF Q&A Application',
    organization: 'HackLoop Hackathon',
    description:
      'Built an AI-powered application enabling students to upload PDFs and ask context-based questions. Implemented NLP for summarization and real-time responses.',
    type: 'hackathon',
  },
  {
    period: 'Sep 2023 - Mar 2024',
    title: 'Lost and Found Web Application',
    organization: 'NMAMIT Student Project',
    description:
      'Developed a web application for students to post and search for lost/found items. Implemented image upload and responsive interface.',
    type: 'achievement',
  },
  {
    period: '328+ Problems Solved',
    title: 'Competitive Programming & DSA',
    organization: 'LeetCode & Problem-Solving',
    description:
      'Consistently solving algorithmic problems across various difficulty levels. LeetCode Rank: 408K with 246 active days and max streak of 33 days.',
    type: 'achievement',
  },
]

export type MedalShape = 'sand-dollar' | 'starfish' | 'scallop'

export const medals: { shape: MedalShape; title: string; detail: string }[] = [
  { shape: 'sand-dollar', title: '100 Days Badge 2026', detail: 'Consistent daily problem-solving streak' },
  {
    shape: 'starfish',
    title: 'Innoversite Hackathon',
    detail: 'Participant: built and pitched a prototype against the clock',
  },
  { shape: 'scallop', title: 'HackLoop 2024', detail: 'Participant: shipped StudyBuddy, an AI PDF Q&A app' },
]

export const footer = {
  blurb:
    'BTech student and aspiring software engineer passionate about full-stack development, machine learning, and solving algorithmic challenges.',
  credit: 'Crafted with 💙 using Next.js & Tailwind CSS',
}

/** Which projects list a skill among their tags (matched loosely, e.g. "Groq / Llama 3.1" = "Groq (Llama 3.1)") */
export function projectsUsing(skill: string): string[] {
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')
  const key = normalize(skill)
  return projects.filter((project) => project.tags.some((tag) => normalize(tag) === key)).map((p) => p.title)
}
