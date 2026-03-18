import { Metadata } from 'next'
import { safeFetch } from '@/lib/sanity.client'
import { allExpositionsQuery } from '@/lib/sanity.queries'
import { getExpoStatus } from '@/lib/utils'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import ExpositionCard from '@/components/exposition/ExpositionCard'
import ScrollReveal from '@/components/shared/ScrollReveal'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Expositions',
  description: 'Retrouvez toutes les expositions passées et à venir.',
}

export default async function ExpositionsPage() {
  const expositions = (await safeFetch(allExpositionsQuery)) || []

  const current = expositions.filter(
    (e: any) => getExpoStatus(e.dateDebut, e.dateFin) !== 'past'
  )
  const past = expositions.filter(
    (e: any) => getExpoStatus(e.dateDebut, e.dateFin) === 'past'
  )

  return (
    <>
      <section className="hero hero--small hero--no-image">
        <div className="hero__content">
          <h1 className="hero__title">Expositions</h1>
          <p className="hero__subtitle">Retrouvez toutes mes expositions</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Expositions' }]} />

          {current.length > 0 && (
            <div className="exhibition-section">
              <h2 className="exhibition-section__title">Expositions en cours et à venir</h2>
              <div className="exhibitions-list">
                {current.map((expo: any) => (
                  <ScrollReveal key={expo._id}>
                    <ExpositionCard exposition={expo} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="exhibition-section">
              <h2 className="exhibition-section__title">Expositions passées</h2>
              <div className="exhibitions-list">
                {past.map((expo: any) => (
                  <ScrollReveal key={expo._id}>
                    <ExpositionCard exposition={expo} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          )}

          {expositions.length === 0 && (
            <p className="no-results">Aucune exposition pour le moment.</p>
          )}
        </div>
      </section>
    </>
  )
}
