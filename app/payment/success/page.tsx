'use client'

import Link from 'next/link'

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-6">✅</div>
        <h1 className="text-4xl font-['Cormorant_Garamond'] mb-4">Paiement réussi !</h1>
        <p className="text-[var(--text-muted)] mb-8">
          Merci pour votre achat ! Vous allez recevoir un email de confirmation avec les détails pour organiser la remise de votre tableau.
        </p>
        <p className="text-[var(--text-muted)] mb-8">
          L'artiste vous contactera dans les 24h pour convenir d'un rendez-vous.
        </p>
        <Link href="/" className="btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
