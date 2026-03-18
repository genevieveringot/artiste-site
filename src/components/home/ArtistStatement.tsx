import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import SanityImage from '@/components/shared/SanityImage'
import ScrollReveal from '@/components/shared/ScrollReveal'

interface ArtistStatementProps {
  statement?: any[]
  photo?: any
}

export default function ArtistStatement({ statement, photo }: ArtistStatementProps) {
  return (
    <section className="page-section bg-alt" id="artist-statement">
      <div className="container">
        <div className="about-grid">
          <ScrollReveal>
            <div className="about-grid__image">
              {photo?.asset ? (
                <SanityImage
                  image={photo}
                  alt="L'artiste"
                  width={600}
                  height={800}
                  className="about-grid__photo"
                />
              ) : (
                <div className="about-grid__placeholder" aria-hidden="true">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
                  </svg>
                </div>
              )}
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="about-grid__content">
              <h2 className="section-title section-title--left">L&apos;artiste</h2>
              <div className="about-grid__text">
                {statement ? (
                  <PortableText value={statement} />
                ) : (
                  <p>
                    Passionné(e) par la peinture depuis toujours, je crée des œuvres qui
                    reflètent ma vision du monde. Chaque toile est une invitation au voyage,
                    entre lumière et couleurs.
                  </p>
                )}
              </div>
              <Link href="/l-artiste" className="btn btn--primary">
                En savoir plus
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
