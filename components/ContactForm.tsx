'use client'

import { useState, type FormEvent } from 'react'
import { profile } from '@/lib/content'

/**
 * There's no backend, so "sending" hands the message to the visitor's mail app, pre-filled,
 * while a little bottle is tossed out to sea.
 */
export function ContactForm() {
  // Counts sends so the bottle animation replays each time (it's keyed on this)
  const [sends, setSends] = useState(0)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const subject = `Portfolio message from ${name}`
    const body = `${message}\n\n— ${name} (${email})`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSends((count) => count + 1)
  }

  return (
    <form className="card contact-form" onSubmit={onSubmit}>
      <h3 className="form-title">Send a message in a bottle</h3>

      <div className="field">
        <label htmlFor="contact-name">Name</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" placeholder="Your name" required />
      </div>
      <div className="field">
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="your@email.com"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" rows={5} placeholder="Your message..." required />
      </div>

      <button type="submit" className="btn btn-primary form-submit">
        Send Message
      </button>

      <div className="form-sea" aria-hidden="true">
        <div className="wave form-wave" />
        {sends > 0 && (
          <svg key={sends} className="tossed-bottle" viewBox="0 0 60 24" focusable="false">
            <path className="glass-fill" d="M8 4h28c5 0 7 3 9 4h7v8h-7c-2 1-4 4-9 4H8a8 8 0 0 1 0-16z" />
            <rect className="paper" x="11" y="8" width="24" height="8" rx="4" />
            <path className="glass-edge" d="M8 4h28c5 0 7 3 9 4h7v8h-7c-2 1-4 4-9 4H8a8 8 0 0 1 0-16z" />
            <rect className="cork-mini" x="52" y="9" width="6" height="6" rx="1.5" />
          </svg>
        )}
      </div>

      <p className="form-status" role="status">
        {sends > 0 && (
          <>
            Your email app should open with the message ready to send. If it doesn&apos;t, write to{' '}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>.
          </>
        )}
      </p>
    </form>
  )
}
