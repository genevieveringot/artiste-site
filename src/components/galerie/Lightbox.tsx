'use client'

import { useEffect, useCallback, useState } from 'react'

interface LightboxImage {
  src: string
  alt: string
  caption?: string
}

interface LightboxProps {
  images: LightboxImage[]
  initialIndex?: number
  onClose: () => void
}

export default function Lightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const current = images[currentIndex]
  const total = images.length

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % total)
  }, [total])

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + total) % total)
  }, [total])

  useEffect(() => {
    document.body.classList.add('lightbox-open')
    return () => { document.body.classList.remove('lightbox-open') }
  }, [])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, goNext, goPrev])

  return (
    <div className="lightbox is-active" onClick={onClose} role="dialog" aria-modal="true" aria-label="Visionneuse d'images">
      <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox__close" onClick={onClose} aria-label="Fermer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {total > 1 && (
          <>
            <button className="lightbox__nav lightbox__nav--prev" onClick={goPrev} aria-label="Image précédente">
              &#8249;
            </button>
            <button className="lightbox__nav lightbox__nav--next" onClick={goNext} aria-label="Image suivante">
              &#8250;
            </button>
          </>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.src} alt={current.alt} className="lightbox__image" />

        {current.caption && (
          <div className="lightbox__caption">{current.caption}</div>
        )}
        {total > 1 && (
          <div className="lightbox__counter">{currentIndex + 1} / {total}</div>
        )}
      </div>
    </div>
  )
}
