'use client'

import { useEffect, useRef } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { GithubIcon } from '@/components/SocialIcons'
import type { Project } from '@/lib/content'

/** "Uncork" button plus the letter it unrolls: a native modal <dialog> with the project's full story. */
export function UncorkLetter({ project }: { project: Project }) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = `letter-${project.id}-title`

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const card = buttonRef.current?.closest<HTMLElement>('.bottle-card')

    // A click on the dialog element itself (not the paper inside it) means the backdrop was clicked
    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close()
    }
    const onClose = () => {
      card?.removeAttribute('data-uncorked')
      buttonRef.current?.focus()
    }
    dialog.addEventListener('click', onClick)
    dialog.addEventListener('close', onClose)
    return () => {
      dialog.removeEventListener('click', onClick)
      dialog.removeEventListener('close', onClose)
    }
  }, [])

  const open = () => {
    buttonRef.current?.closest('.bottle-card')?.setAttribute('data-uncorked', '')
    dialogRef.current?.showModal()
  }

  return (
    <>
      <button ref={buttonRef} type="button" className="btn btn-primary btn-sm" aria-haspopup="dialog" onClick={open}>
        Uncork<span className="sr-only"> the full story of {project.title}</span>
      </button>

      <dialog ref={dialogRef} className="letter" aria-labelledby={titleId}>
        <div className="letter-paper">
          <button type="button" className="letter-close" onClick={() => dialogRef.current?.close()} aria-label="Close letter">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="letter-scroll">
            <p className="letter-kicker">
              {project.category}
              {project.flagship && ' · Flagship'}
            </p>
            <h3 id={titleId} className="letter-title">
              {project.title}
            </h3>
            <p className="letter-tagline">{project.tagline}</p>
            <p className="letter-text">{project.fullDescription}</p>

            <h4 className="letter-heading">Highlights</h4>
            <ul className="letter-list">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <h4 className="letter-heading">Tech stack</h4>
            <ul className="tags">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>

            <div className="letter-links">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  <GithubIcon className="h-4 w-4" /> View code on GitHub
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                  <ExternalLink className="h-4 w-4" aria-hidden="true" /> Open live demo
                </a>
              )}
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
