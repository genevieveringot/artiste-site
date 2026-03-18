import { Metadata } from 'next'
import { safeFetch } from '@/lib/sanity.client'
import { allOeuvresQuery, allCategoriesQuery, allTechniquesQuery } from '@/lib/sanity.queries'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import ArtworkFilters from '@/components/galerie/ArtworkFilters'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Galerie',
  description: 'Découvrez toutes les œuvres de l\'artiste.',
}

export default async function GaleriePage() {
  const [oeuvres, categories, techniques] = await Promise.all([
    safeFetch(allOeuvresQuery),
    safeFetch(allCategoriesQuery),
    safeFetch(allTechniquesQuery),
  ])

  return (
    <>
      <section className="hero hero--small">
        <div className="hero__content">
          <h1 className="hero__title">Galerie</h1>
          <Breadcrumbs items={[{ label: 'Galerie' }]} light />
        </div>
      </section>

      <section className="gallery-page">
        <div className="container">
          <ArtworkFilters
            oeuvres={oeuvres || []}
            categories={categories || []}
            techniques={techniques || []}
          />
        </div>
      </section>
    </>
  )
}
