import Link from 'next/link'
import SanityImage from '@/components/shared/SanityImage'
import { formatDateFr, getExpoStatus, expoStatusLabels } from '@/lib/utils'

interface ExpositionCardProps {
  exposition: any
}

export default function ExpositionCard({ exposition }: ExpositionCardProps) {
  const status = getExpoStatus(exposition.dateDebut, exposition.dateFin)
  const statusLabel = expoStatusLabels[status]

  return (
    <article className={`exhibition-card${status === 'past' ? ' exhibition-card--past' : ''}`}>
      <span className={`badge badge--${status}`}>{statusLabel}</span>

      <div className="exhibition-card__dates">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="icon--inline">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
        </svg>
        <span>
          {formatDateFr(exposition.dateDebut)}
          {exposition.dateFin && ` — ${formatDateFr(exposition.dateFin)}`}
        </span>
      </div>

      <h3 className="exhibition-card__title">
        <Link href={`/expositions/${exposition.slug?.current}`}>
          {exposition.title}
        </Link>
      </h3>

      {exposition.lieu && (
        <div className="exhibition-card__venue">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="icon--inline">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
          </svg>
          <span>{exposition.lieu}{exposition.ville ? `, ${exposition.ville}` : ''}</span>
        </div>
      )}

      {exposition.adresse && (
        <p className="exhibition-card__address">{exposition.adresse}</p>
      )}

      {exposition.oeuvres && exposition.oeuvres.length > 0 && (
        <div className="exhibition-card__thumbnails">
          {exposition.oeuvres.slice(0, 4).map((oeuvre: any) => (
            oeuvre.mainImage?.asset && (
              <SanityImage
                key={oeuvre._id}
                image={oeuvre.mainImage}
                alt={oeuvre.title}
                width={48}
                height={48}
                className="exhibition-card__thumb"
              />
            )
          ))}
        </div>
      )}
    </article>
  )
}
