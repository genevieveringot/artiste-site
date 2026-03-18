import Link from 'next/link'
import ArtworkCard from '@/components/galerie/ArtworkCard'
import ScrollReveal from '@/components/shared/ScrollReveal'

interface FeaturedWorksProps {
  oeuvres: any[]
}

export default function FeaturedWorks({ oeuvres }: FeaturedWorksProps) {
  if (!oeuvres || oeuvres.length === 0) return null

  return (
    <ScrollReveal>
      <section className="page-section" id="featured-works">
        <div className="container">
          <h2 className="section-title">Œuvres récentes</h2>
          <p className="section-subtitle">Découvrez mes dernières créations</p>

          <div className="gallery-grid gallery-grid--3col">
            {oeuvres.map((oeuvre) => (
              <ArtworkCard key={oeuvre._id} oeuvre={oeuvre} />
            ))}
          </div>

          <div className="section-cta">
            <Link href="/galerie" className="btn btn--outline">
              Voir toute la galerie
            </Link>
          </div>
        </div>
      </section>
    </ScrollReveal>
  )
}
