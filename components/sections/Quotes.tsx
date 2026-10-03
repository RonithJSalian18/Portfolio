import type { CSSProperties } from 'react'
import { SectionHeading } from '@/components/SectionHeading'
import { quotes, quotesOutro, sayings, sections } from '@/lib/content'

export function Quotes() {
  return (
    <section id="quotes" className="section" aria-labelledby="quotes-title">
      <div className="section-inner">
        <SectionHeading id="quotes" copy={sections.quotes} />

        <ul className="quote-list">
          {quotes.map((quote, index) => (
            <li
              key={quote.author}
              data-reveal
              style={{ '--reveal-delay': `${(index % 2) * 110}ms` } as CSSProperties}
            >
              <figure className="quote-card">
                <blockquote>
                  <p>{quote.text}</p>
                </blockquote>
                <figcaption>{quote.author}</figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="quotes-outro" data-reveal>
          {quotesOutro}
        </p>

        <ul className="sayings" aria-label="Notes to self">
          {sayings.map((saying, index) => (
            <li key={saying} data-reveal style={{ '--reveal-delay': `${index * 90}ms` } as CSSProperties}>
              {saying}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
