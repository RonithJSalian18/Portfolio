'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { Mail, Phone } from 'lucide-react'
import { GlassCard } from '@/components/GlassCard'
import { SectionHeader } from '@/components/SectionHeader'
import { GithubIcon, LinkedinIcon } from '@/components/SocialIcons'
import { EMAIL, socialLinks } from '@/lib/site'
import {
  staggerContainerVariants,
  fadeUpVariants,
} from '@/lib/animations'

const channels = [
  { Icon: Mail, label: 'Email', value: EMAIL, href: socialLinks.email },
  { Icon: Phone, label: 'Phone', value: '+91 76193 40723', href: 'tel:+917619340723' },
  { Icon: LinkedinIcon, label: 'LinkedIn', value: 'ronith-j-salian', href: socialLinks.linkedin },
  { Icon: GithubIcon, label: 'GitHub', value: 'RonithJSalian18', href: socialLinks.github },
]

const inputClass =
  'w-full px-4 py-2.5 rounded-lg bg-space/60 border border-white/15 text-white placeholder-text-muted focus:outline-none focus:border-jedi focus:ring-2 focus:ring-jedi/25 transition-all'

export function Contact() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [transmitted, setTransmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // There is no backend, so hand the message to the visitor's mail client, pre-filled.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = `Portfolio transmission from ${formData.name}`
    const body = `${formData.message}\n\n— ${formData.name} (${formData.email})`
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setTransmitted(true)
    setTimeout(() => setTransmitted(false), 6000)
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="section-container"
    >
      <div className="section-content">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-12"
        >
          <SectionHeader
            kicker="Episode VII"
            title="Open a Comm"
            highlight="Channel"
            description="Interested in collaborating or have a mission in mind? Send a transmission. I'm always excited to discuss new opportunities."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Comm channels */}
            <motion.div className="space-y-4" variants={fadeUpVariants}>
              {channels.map(({ Icon, label, value, href }, index) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="glass-card glow-jedi p-4 flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-jedi/10 text-jedi">
                    <Icon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-text-muted">{label}</p>
                    <p className="text-white font-semibold truncate">{value}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            {/* Transmission form */}
            <motion.div variants={fadeUpVariants}>
              <GlassCard className="p-8 h-full" hover={false} glowColor="gold">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="Luke Skywalker"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={inputClass}
                      placeholder="luke@rebellion.org"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`${inputClass} resize-none`}
                      placeholder="Help me, Ronith. You're my only hope..."
                    />
                  </div>

                  <button type="submit" className="w-full glass-button-primary py-3">
                    Send Transmission
                  </button>

                  <AnimatePresence>
                    {transmitted && (
                      <motion.p
                        className="p-3 rounded-lg bg-yoda/10 border border-yoda/40 text-yoda !text-sm"
                        role="status"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Transmission ready. Your email app should open with the message filled in; hit send there.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
