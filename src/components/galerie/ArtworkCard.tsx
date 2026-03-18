import Link from 'next/link'
import SanityImage from '@/components/shared/SanityImage'

interface ArtworkCardProps {
  oeuvre: any
}

export default function ArtworkCard({ oeuvre }: ArtworkCardProps) {
  const categories = [
    oeuvre.categorie?.title,
    ...(oeuvre.techniques?.map((t: any) => t.title) || []),
  ].filter(Boolean).join(', ')

  return (
    <div className="artwork-card">
      <div className="artwork-card__image-wrap">
        {oeuvre.mainImage?.asset ? (
          <SanityImage
            image={oeuvre.mainImage}
            alt={oeuvre.title}
            width={600}
            height={800}
            className="artwork-card__image"
          />
        ) : (
          <div className="artwork-card__image artwork-card__image--placeholder" />
        )}
        <div className="artwork-card__hover">
          <span className="artwork-card__voir">VOIR</span>
        </div>
        {oeuvre.disponibilite === 'vendu' && (
          <span className="artwork-card__badge artwork-card__badge--sold">Vendu</span>
        )}
      </div>
      <div className="artwork-card__caption">
        <h3 className="artwork-card__title">{oeuvre.title}</h3>
        {categories && <p className="artwork-card__categories">{categories}</p>}
      </div>
      <Link href={`/galerie/${oeuvre.slug?.current}`} className="artwork-card__link" aria-label={oeuvre.title} />
    </div>
  )
}
