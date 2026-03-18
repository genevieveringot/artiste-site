import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { safeFetch } from '@/lib/sanity.client'
import { oeuvreBySlugQuery, oeuvresSlugsQuery } from '@/lib/sanity.queries'
import { formatPrice, formatDimensions, dispoLabels, encadrementLabels } from '@/lib/utils'
import { urlFor } from '@/lib/sanity.image'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import ArtworkCard from '@/components/galerie/ArtworkCard'
import ArtworkGallery from '@/components/galerie/ArtworkGallery'
import InquiryForm from '@/components/galerie/InquiryForm'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

export const revalidate = 60
export const dynamicParams = true

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await safeFetch<string[]>(oeuvresSlugsQuery)
  return (slugs || []).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const oeuvre = await safeFetch(oeuvreBySlugQuery, { slug })
  if (!oeuvre) return { title: 'Œuvre introuvable' }
  return {
    title: oeuvre.title,
    description: `${oeuvre.title} — œuvre de l'artiste`,
  }
}

export default async function OeuvrePage({ params }: Props) {
  const { slug } = await params
  const oeuvre = await safeFetch(oeuvreBySlugQuery, { slug })

  if (!oeuvre) notFound()

  const allImages = [
    ...(oeuvre.mainImage?.asset ? [oeuvre.mainImage] : []),
    ...(oeuvre.gallery || []).filter((img: any) => img?.asset),
  ]

  const lightboxImages = allImages.map((img: any) => ({
    src: urlFor(img).width(1200).url(),
    alt: oeuvre.title,
    caption: oeuvre.title,
  }))

  return (
    <>
      <section className="single-artwork">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Galerie', href: '/galerie' }, { label: oeuvre.title }]} />

          <div className="single-artwork__grid">
            <ArtworkGallery images={allImages} title={oeuvre.title} lightboxImages={lightboxImages} />

            <div className="single-artwork__details">
              <h1 className="single-artwork__title">{oeuvre.title}</h1>

              <div className="single-artwork__tags">
                {oeuvre.categorie && (
                  <span className="tag tag--category">{oeuvre.categorie.title}</span>
                )}
                {oeuvre.techniques?.map((t: any) => (
                  <span key={t._id} className="tag tag--technique">{t.title}</span>
                ))}
              </div>

              <dl className="single-artwork__meta">
                {oeuvre.annee && (
                  <>
                    <dt>Année</dt>
                    <dd>{oeuvre.annee}</dd>
                  </>
                )}
                {(oeuvre.largeur || oeuvre.hauteur) && (
                  <>
                    <dt>Dimensions</dt>
                    <dd>{formatDimensions(oeuvre.largeur, oeuvre.hauteur, oeuvre.profondeur)}</dd>
                  </>
                )}
                {oeuvre.support && (
                  <>
                    <dt>Support</dt>
                    <dd>{oeuvre.support}</dd>
                  </>
                )}
                {oeuvre.encadrement && (
                  <>
                    <dt>Encadrement</dt>
                    <dd>{encadrementLabels[oeuvre.encadrement] || oeuvre.encadrement}</dd>
                  </>
                )}
              </dl>

              <div className="single-artwork__purchase">
                {oeuvre.prix ? (
                  <div className="single-artwork__price">{formatPrice(oeuvre.prix)}</div>
                ) : oeuvre.disponibilite === 'sur_demande' ? (
                  <div className="single-artwork__price single-artwork__price--on-request">Prix sur demande</div>
                ) : null}

                {oeuvre.disponibilite && (
                  <div className={`single-artwork__availability single-artwork__availability--${oeuvre.disponibilite}`}>
                    {dispoLabels[oeuvre.disponibilite] || oeuvre.disponibilite}
                  </div>
                )}

                <InquiryForm
                  artworkTitle={oeuvre.title}
                  artworkId={oeuvre._id}
                  prix={oeuvre.prix}
                  disponibilite={oeuvre.disponibilite}
                />
              </div>

              {oeuvre.description && (
                <div className="single-artwork__description">
                  <PortableTextBlock value={oeuvre.description} />
                </div>
              )}

              <div className="single-artwork__actions">
                <Link href="/galerie" className="btn btn--outline">
                  Retour a la galerie
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {oeuvre.related && oeuvre.related.length > 0 && (
        <section className="related-artworks">
          <div className="container">
            <h2 className="section-title">Œuvres similaires</h2>
            <div className="gallery-grid gallery-grid--3col">
              {oeuvre.related.map((r: any) => (
                <ArtworkCard key={r._id} oeuvre={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

// Simple PortableText wrapper
function PortableTextBlock({ value }: { value: any }) {
  return <PortableText value={value} />
}
