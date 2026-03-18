import { safeFetch } from '@/lib/sanity.client'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/shared/Breadcrumbs'
import SanityImage from '@/components/shared/SanityImage'

export const revalidate = 60
export const dynamicParams = true

// Routes that already have dedicated pages — exclude from this catch-all
const RESERVED_SLUGS = new Set([
  'galerie',
  'expositions',
  'contact',
  'connexion',
  'inscription',
  'mon-compte',
  'studio',
  'api',
])

const pageQuery = `*[_type == "page" && slug.current == $slug][0]{
  title,
  content,
  seoDescription,
  mainImage,
  heroOverlay,
  artistPhoto
}`

const allPagesQuery = `*[_type == "page"]{ "slug": slug.current }`

export async function generateStaticParams() {
  const pages = await safeFetch<{ slug: string }[]>(allPagesQuery)
  return (pages || [])
    .filter((p) => p.slug && !RESERVED_SLUGS.has(p.slug))
    .map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (RESERVED_SLUGS.has(slug)) return {}
  const page = await safeFetch<any>(pageQuery, { slug })
  if (!page) return {}
  return {
    title: `${page.title} — Artiste Peintre`,
    description: page.seoDescription || '',
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (RESERVED_SLUGS.has(slug)) {
    notFound()
  }

  const page = await safeFetch<any>(pageQuery, { slug })

  if (!page) {
    notFound()
  }

  const hasPhoto = !!page.artistPhoto?.asset
  const hasHeroImage = !!page.mainImage?.asset
  const overlayOpacity = Math.max(0, Math.min(100, page.heroOverlay ?? 40)) / 100

  return (
    <>
      <section className={`hero hero--small${hasHeroImage ? ' hero--has-image' : ''}`}>
        {hasHeroImage && (
          <div className="hero__bg">
            <SanityImage image={page.mainImage} alt="" fill priority sizes="100vw" className="hero__bg-img" />
          </div>
        )}
        <div
          className="hero__overlay"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.4}) 0%, rgba(0,0,0,${overlayOpacity}) 100%)`,
          }}
        />
        <div className="hero__content">
          <h1 className="hero__title">{page.title}</h1>
          <Breadcrumbs items={[{ label: page.title }]} light />
        </div>
      </section>

      <article className="page-content">
        <div className="container">
          <div className={`page-content__layout${hasPhoto ? ' page-content__layout--with-image' : ''}`}>
            {hasPhoto && (
              <div className="page-content__image">
                <SanityImage
                  image={page.artistPhoto}
                  alt={page.title}
                  width={600}
                  height={750}
                  className="page-content__photo"
                />
              </div>
            )}
            <div className="page-content__text">
              {page.content && (
                <div className="page-content__body">
                  <PortableText value={page.content} />
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
