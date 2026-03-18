export const revalidate = 60

import { safeFetch } from '@/lib/sanity.client'
import { siteSettingsQuery, featuredOeuvresQuery, upcomingExpositionsQuery } from '@/lib/sanity.queries'
import Hero from '@/components/home/Hero'
import FeaturedWorks from '@/components/home/FeaturedWorks'
import ArtistStatement from '@/components/home/ArtistStatement'
import UpcomingExhibitions from '@/components/home/UpcomingExhibitions'
import CTA from '@/components/home/CTA'

const accueilPageQuery = `*[_type == "page" && slug.current == "accueil"][0]{ mainImage, heroOverlay }`

export default async function HomePage() {
  const [settings, oeuvres, expositions, accueilPage] = await Promise.all([
    safeFetch(siteSettingsQuery),
    safeFetch(featuredOeuvresQuery),
    safeFetch(upcomingExpositionsQuery),
    safeFetch(accueilPageQuery),
  ])

  // Use hero image from Accueil page if set, otherwise fall back to site settings
  const heroImage = accueilPage?.mainImage?.asset ? accueilPage.mainImage : settings?.heroImage
  const heroOverlay = accueilPage?.heroOverlay ?? 40

  return (
    <>
      <Hero
        title={settings?.heroTitle || 'Bienvenue'}
        subtitle={settings?.heroSubtitle}
        ctaText={settings?.heroCTA}
        heroImage={heroImage}
        overlayOpacity={heroOverlay}
      />
      <FeaturedWorks oeuvres={oeuvres || []} />
      <ArtistStatement
        statement={settings?.artistStatement}
        photo={settings?.artistPhoto}
      />
      <UpcomingExhibitions expositions={expositions || []} />
      <CTA />
    </>
  )
}
