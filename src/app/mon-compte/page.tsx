'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Inquiry {
  _id: string
  oeuvreTitle: string
  oeuvreSlug: string
  message: string
  status: string
  createdAt: string
}

const statusLabels: Record<string, string> = {
  new: 'Nouvelle',
  in_progress: 'En cours',
  replied: 'Répondue',
  terminated: 'Terminée',
}

export default function MonComptePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion?callbackUrl=/mon-compte')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.email) {
      fetch(`/api/my-inquiries`)
        .then(res => res.json())
        .then(data => {
          setInquiries(data.inquiries || [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [session])

  if (status === 'loading' || status === 'unauthenticated') {
    return <section className="auth-page"><div className="auth-page__container"><p>Chargement...</p></div></section>
  }

  return (
    <section className="auth-page">
      <div className="auth-page__container auth-page__container--wide">
        <div className="dashboard-header">
          <div>
            <h1 className="auth-page__title">Mon compte</h1>
            <p className="dashboard-header__welcome">Bonjour, {session?.user?.name}</p>
            <p className="dashboard-header__email">{session?.user?.email}</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn--outline">
            Se déconnecter
          </button>
        </div>

        <h2 className="dashboard__section-title">Mes demandes</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : inquiries.length === 0 ? (
          <div className="dashboard__empty">
            <p>Vous n&apos;avez pas encore de demandes.</p>
            <Link href="/galerie" className="btn btn--primary">Découvrir la galerie</Link>
          </div>
        ) : (
          <div className="dashboard__inquiries">
            {inquiries.map((inq) => (
              <div key={inq._id} className="inquiry-card">
                <div className="inquiry-card__header">
                  <Link href={`/galerie/${inq.oeuvreSlug}`} className="inquiry-card__title">
                    {inq.oeuvreTitle || 'Oeuvre'}
                  </Link>
                  <span className={`inquiry-card__status inquiry-card__status--${inq.status}`}>
                    {statusLabels[inq.status] || inq.status}
                  </span>
                </div>
                <p className="inquiry-card__message">{inq.message}</p>
                <p className="inquiry-card__date">
                  {new Date(inq.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
