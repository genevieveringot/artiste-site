import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { safeFetch } from '@/lib/sanity.client'
import { expositionBySlugQuery, expositionsSlugsQuery } from '@/lib/sanity.queries'
import { formatDateFr, getExpoStatus, expoStatusLabels } from '@/lib/utils'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import SanityImage from '@/components/shared/SanityImage'
import ArtworkCard from '@/components/galerie/ArtworkCard'
import { PortableText } from '@portabletext/react'

export const revalidate = 60
export const dynamicParams = true

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await safeFetch<string[]>(expositionsSlugsQuery)
  return (slugs || []).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const expo = await safeFetch(expositionBySlugQuery, { slug })
  if (!expo) return { title: 'Exposition introuvable' }
  return {
    title: expo.title,
    description: `Exposition : ${expo.title}${expo.lieu ? ` — ${expo.lieu}` : ''}`,
  }
}

export default async function ExpositionPage({ params }: Props) {
  const { slug } = await params
  const expo = await safeFetch(expositionBySlugQuery, { slug })

  if (!expo) notFound()

  const status = getExpoStatus(expo.dateDebut, expo.dateFin)

  return (
    <>
      <section className="single-exhibition">
        <div className="container">
          <Breadcrumbs
            items={[
              { label: 'Expositions', href: '/expositions' },
              { label: expo.title },
            ]}
          />

          <div className="single-exhibition__header">
            <span className={`badge badge--${status}`}>{expoStatusLabels[status]}</span>
            <h1>{expo.title}</h1>
            <div className="single-exhibition__meta">
              <span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="icon--inline" style={{marginRight: '0.25rem'}}>
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                </svg>
                {formatDateFr(expo.dateDebut)}
                {expo.dateFin && ` — ${formatDateFr(expo.dateFin)}`}
              </span>
              {expo.lieu && (
                <span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="icon--inline" style={{marginRight: '0.25rem'}}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                  </svg>
                  {expo.lieu}{expo.ville ? `, ${expo.ville}` : ''}
                </span>
              )}
            </div>
          </div>

          {expo.mainImage?.asset && (
            <div style={{ marginBottom: 'var(--ap-space-10)', borderRadius: 'var(--ap-radius-md)', overflow: 'hidden' }}>
              <SanityImage image={expo.mainImage} alt={expo.title} width={1200} height={600} />
            </div>
          )}

          {expo.description && (
            <div className="container--narrow" style={{ marginBottom: 'var(--ap-space-10)' }}>
              <PortableText value={expo.description} />
            </div>
          )}

          {expo.adresse && (
            <p style={{ textAlign: 'center', color: 'var(--ap-color-text-light)', marginBottom: 'var(--ap-space-4)' }}>
              {expo.adresse}{expo.ville ? `, ${expo.ville}` : ''}
            </p>
          )}

          {expo.lienExterne && (
            <div className="section-cta">
              <a href={expo.lienExterne} target="_blank" rel="noopener noreferrer" className="btn btn--outline">
                Plus d&apos;informations
              </a>
            </div>
          )}
        </div>
      </section>

      {expo.oeuvres && expo.oeuvres.length > 0 && (
        <section className="page-section bg-alt">
          <div className="container">
            <h2 className="section-title">Œuvres exposées</h2>
            <div className="gallery-grid gallery-grid--3col">
              {expo.oeuvres.map((oeuvre: any) => (
                <ArtworkCard key={oeuvre._id} oeuvre={oeuvre} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="page-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <Link href="/expositions" className="btn btn--outline">
            Toutes les expositions
          </Link>
        </div>
      </section>
    </>
  )
}
