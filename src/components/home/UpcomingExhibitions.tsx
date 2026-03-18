import Link from 'next/link'
import ExpositionCard from '@/components/exposition/ExpositionCard'
import ScrollReveal from '@/components/shared/ScrollReveal'

interface UpcomingExhibitionsProps {
  expositions: any[]
}

export default function UpcomingExhibitions({ expositions }: UpcomingExhibitionsProps) {
  return (
    <ScrollReveal>
      <section className="page-section" id="upcoming-exhibitions">
        <div className="container">
          <h2 className="section-title">Expositions à venir</h2>

          {expositions && expositions.length > 0 ? (
            <>
              <div className="exhibitions-list">
                {expositions.map((expo) => (
                  <ExpositionCard key={expo._id} exposition={expo} />
                ))}
              </div>
              <div className="section-cta">
                <Link href="/expositions" className="btn btn--outline">
                  Toutes les expositions
                </Link>
              </div>
            </>
          ) : (
            <p className="no-results">Aucune exposition prévue pour le moment.</p>
          )}
        </div>
      </section>
    </ScrollReveal>
  )
}
