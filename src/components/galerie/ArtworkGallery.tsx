'use client'

import { useState } from 'react'
import SanityImage from '@/components/shared/SanityImage'
import Lightbox from './Lightbox'
import { urlFor } from '@/lib/sanity.image'

interface ArtworkGalleryProps {
  images: any[]
  title: string
  lightboxImages: { src: string; alt: string; caption?: string }[]
}

export default function ArtworkGallery({ images, title, lightboxImages }: ArtworkGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (images.length === 0) return null

  return (
    <div className="single-artwork__gallery">
      <div className="single-artwork__main-image" onClick={() => setLightboxOpen(true)}>
        <SanityImage
          image={images[activeIndex]}
          alt={title}
          width={800}
          height={1000}
        />
      </div>

      {images.length > 1 && (
        <div className="single-artwork__thumbnails">
          {images.map((img: any, i: number) => (
            <img
              key={i}
              src={urlFor(img).width(80).height(80).url()}
              alt={`${title} — vue ${i + 1}`}
              className={`single-artwork__thumb${i === activeIndex ? ' is-active' : ''}`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          initialIndex={activeIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}
