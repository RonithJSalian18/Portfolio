'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import {
  staggerContainerVariants,
  scrollRevealVariants,
  fadeUpVariants,
} from '@/lib/animations'

export function Contact() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })

      setTimeout(() => setSubmitStatus('idle'), 3000)
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } finally {
      setIsSubmitting(false)
    }
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
          {/* Section title */}
          <motion.div
            className="text-center space-y-4"
            variants={scrollRevealVariants}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="text-white">Get in </span>
              <span className="text-gradient">Touch</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Interested in collaborating or have a project in mind? Feel free to reach out! I&apos;m always excited to discuss new opportunities.
            </p>
          </motion.div>

          {/* Contact content */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Contact info */}
            <motion.div
              className="space-y-6"
              variants={fadeUpVariants}
            >
              <div className="space-y-4">
                {[
                  {
                    icon: '📧',
                    label: 'Email',
                    value: 'ronithjsalian01@gmail.com',
                    href: 'mailto:ronithjsalian01@gmail.com',
                  },
                  {
                    icon: '📱',
                    label: 'Phone',
                    value: '+91 76193 40723',
                    href: 'tel:+917619340723',
                  },
                  {
                    icon: '🔗',
                    label: 'LinkedIn',
                    value: 'ronith-j-salian',
                    href: 'https://linkedin.com/in/ronith-j-salian-093b76288/',
                  },
                  {
                    icon: '🐙',
                    label: 'GitHub',
                    value: 'RonithSalian18',
                    href: 'https://github.com/RonithSalian18',
                  },
                ].map((contact, index) => (
                  <motion.a
                    key={contact.label}
                    href={contact.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-card p-4 flex items-center gap-4 hover:shadow-glow-cyan"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <span className="text-2xl">{contact.icon}</span>
                    <div>
                      <p className="text-sm text-gray-400">{contact.label}</p>
                      <p className="text-white font-semibold">{contact.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div variants={fadeUpVariants}>
              <GlassCard className="p-8 h-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name input */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label htmlFor="name" className="text-sm font-semibold text-gray-300">
                      Name
                    </label>
                    <motion.input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-all"
                      placeholder="Your name"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </motion.div>

                  {/* Email input */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label htmlFor="email" className="text-sm font-semibold text-gray-300">
                      Email
                    </label>
                    <motion.input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-all"
                      placeholder="your@email.com"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </motion.div>

                  {/* Message textarea */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label htmlFor="message" className="text-sm font-semibold text-gray-300">
                      Message
                    </label>
                    <motion.textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20 transition-all resize-none"
                      placeholder="Your message..."
                      whileFocus={{ scale: 1.02 }}
                    />
                  </motion.div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full glass-button-primary font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={!isSubmitting ? { scale: 1.05 } : undefined}
                    whileTap={!isSubmitting ? { scale: 0.95 } : undefined}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </motion.button>

                  {/* Status message */}
                  <AnimatePresence>
                    {submitStatus === 'success' && (
                      <motion.div
                        className="p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Message sent successfully! I&apos;ll get back to you soon.
                      </motion.div>
                    )}
                    {submitStatus === 'error' && (
                      <motion.div
                        className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        Something went wrong. Please try again.
                      </motion.div>
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
