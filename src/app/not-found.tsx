import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-page__code">404</div>
      <h1 className="error-page__title">Page introuvable</h1>
      <p className="error-page__text">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/" className="btn btn--primary">
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
