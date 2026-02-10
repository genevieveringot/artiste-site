'use client'

import Link from 'next/link'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-6">❌</div>
        <h1 className="text-4xl font-['Cormorant_Garamond'] mb-4">Paiement annulé</h1>
        <p className="text-[var(--text-muted)] mb-8">
          Votre paiement a été annulé. Aucun montant n'a été débité.
        </p>
        <p className="text-[var(--text-muted)] mb-8">
          Si vous avez des questions, n'hésitez pas à nous contacter.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/#shop" className="btn-outline">
            Retour à la boutique
          </Link>
          <Link href="/#contact" className="btn-primary">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  )
}
