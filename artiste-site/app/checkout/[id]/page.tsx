'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'

interface Painting {
  id: string
  title: string
  image_url: string
  price: number
  width: number
  height: number
  description: string | null
}

export default function CheckoutPage() {
  const params = useParams()
  const [painting, setPainting] = useState<Painting | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    message: ''
  })
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'card'>('paypal')
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchPainting() {
      const { data } = await supabase
        .from('paintings')
        .select('*')
        .eq('id', params.id)
        .single()
      
      if (data) {
        setPainting(data)
      }
      setLoading(false)
    }
    fetchPainting()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!painting) return
    setProcessing(true)

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          painting: {
            id: painting.id,
            title: painting.title,
            price: painting.price
          },
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: `${formData.address}, ${formData.postalCode} ${formData.city}`,
            message: formData.message
          },
          paymentMethod
        })
      })

      const data = await response.json()

      if (data.success && data.paypalUrl) {
        // Redirect to PayPal
        window.location.href = data.paypalUrl
      } else {
        throw new Error('Payment creation failed')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!painting) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Tableau non trouvé</h1>
          <Link href="/" className="text-[var(--accent)]">Retour à l'accueil</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/#shop" className="text-[var(--accent)] hover:underline mb-8 inline-block">
          ← Retour à la boutique
        </Link>
        
        <h1 className="text-4xl font-['Cormorant_Garamond'] mb-8">Finaliser votre achat</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Summary */}
          <div className="bg-[var(--surface)] p-6">
            <div className="aspect-[4/5] relative mb-6">
              {painting.image_url && (
                <Image
                  src={painting.image_url}
                  alt={painting.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <h2 className="text-2xl font-['Cormorant_Garamond'] mb-2">{painting.title}</h2>
            <p className="text-[var(--text-muted)] text-sm mb-4">
              {painting.width} × {painting.height} cm
            </p>
            <div className="border-t border-[var(--border)] pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">Prix</span>
                <span className="text-2xl text-[var(--accent)] font-['Cormorant_Garamond']">
                  {painting.price.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-xl font-['Cormorant_Garamond'] mb-4">Vos coordonnées</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom complet *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full"
                />
                <input
                  type="tel"
                  placeholder="Téléphone *"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-['Cormorant_Garamond'] mb-4">Adresse de livraison</h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Adresse *"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Code postal *"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Ville *"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-['Cormorant_Garamond'] mb-4">Message (optionnel)</h3>
              <textarea
                placeholder="Questions, demandes particulières, disponibilités pour le retrait..."
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full"
              />
            </div>

            <div>
              <h3 className="text-xl font-['Cormorant_Garamond'] mb-4">Mode de paiement</h3>
              
              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${paymentMethod === 'paypal' ? 'border-[var(--accent)] bg-[var(--surface)]' : 'border-[var(--border)]'}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="accent-[var(--accent)]"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🅿️</span>
                    <span>PayPal</span>
                  </div>
                </label>
                
                <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-[var(--accent)] bg-[var(--surface)]' : 'border-[var(--border)]'}`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-[var(--accent)]"
                  />
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💳</span>
                    <span>Carte bancaire</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">
              <p>🔒 Paiement 100% sécurisé via PayPal</p>
              <p className="mt-2">Après le paiement, vous recevrez un email de confirmation avec les détails pour organiser la remise du tableau (retrait sur place ou envoi).</p>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="btn-primary w-full py-4 disabled:opacity-50"
            >
              {processing ? 'Redirection vers le paiement...' : `Payer ${painting.price.toFixed(2)} €`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
