import Link from 'next/link'
import SanityImage from '@/components/shared/SanityImage'

interface HeroProps {
  title: string
  subtitle?: string
  ctaText?: string
  heroImage?: any
  overlayOpacity?: number
}

export default function Hero({ title, subtitle, ctaText, heroImage, overlayOpacity = 40 }: HeroProps) {
  const opacity = Math.max(0, Math.min(100, overlayOpacity)) / 100

  return (
    <section className="hero hero--full hero--under-header">
      {heroImage?.asset && (
        <div className="hero__bg">
          <SanityImage image={heroImage} alt="" fill priority sizes="100vw" className="hero__bg-img" />
        </div>
      )}
      <div
        className="hero__overlay"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,${opacity * 0.4}) 0%, rgba(0,0,0,${opacity}) 100%)`,
        }}
      />
      <div className="hero__content">
        {subtitle && <p className="hero__subtitle">{subtitle}</p>}
        <h1 className="hero__title">{title}</h1>
        {ctaText && (
          <div className="hero__cta">
            <Link href="/galerie" className="btn btn--white btn--lg">
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
