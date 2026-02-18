'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Section {
  id: string
  section_key: string
  title: string | null
  subtitle: string | null
  description: string | null
  background_color: string
  text_color: string
  accent_color: string
  is_visible: boolean
}

interface CartItem {
  id: string
  title: string
  image_url: string
  price: number
  quantity: number
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [headerSection, setHeaderSection] = useState<Section | null>(null)
  
  // Formulaire
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [telephone, setTelephone] = useState('')
  const [adresse, setAdresse] = useState('')
  const [codePostal, setCodePostal] = useState('')
  const [ville, setVille] = useState('')
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchPageHeader()
    loadCart()
  }, [])

  async function fetchPageHeader() {
    const { data } = await supabase
      .from('page_sections')
      .select('*')
      .eq('page_name', 'checkout')
      .eq('section_key', 'page-header')
      .eq('is_visible', true)
      .single()
    if (data) setHeaderSection(data)
  }

  function loadCart() {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const items = JSON.parse(savedCart)
      if (items.length === 0) {
        router.push('/panier')
        return
      }
      setCart(items)
    } else {
      router.push('/panier')
      return
    }
    setLoading(false)
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setProcessing(true)

    const { data: { user } } = await supabase.auth.getUser()

    // Créer la commande
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user?.id,
        items: cart,
        total_amount: total,
        status: 'pending',
        shipping_info: {
          nom,
          prenom,
          email,
          telephone,
          adresse,
          code_postal: codePostal,
          ville,
        }
      })
      .select()
      .single()

    if (error) {
      alert('Erreur lors de la création de la commande: ' + error.message)
      setProcessing(false)
      return
    }

    // Vider le panier
    localStorage.removeItem('cart')

    // Rediriger vers la confirmation ou le paiement
    router.push(`/checkout/${order.id}`)
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#f7f6ec] pt-24 pb-16 flex items-center justify-center">
          <div className="animate-pulse text-[#6b6860]">Chargement...</div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f6ec] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* En-tête de page personnalisable */}
          <div 
            className="text-center mb-8"
            style={{
              backgroundColor: headerSection?.background_color || 'transparent',
              color: headerSection?.text_color || '#13130d'
            }}
          >
            <h1 className="text-3xl md:text-4xl font-light mb-2">
              {headerSection?.title || 'Finaliser ma commande'}
            </h1>
            {headerSection?.subtitle && (
              <p className="text-[#6b6860]">{headerSection.subtitle}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulaire */}
            <div className="bg-white p-6 border border-[#e8e7dd]">
              <h2 className="text-lg font-medium mb-4">Informations de livraison</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#6b6860] mb-1">Prénom *</label>
                    <input
                      type="text"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-[#e8e7dd] focus:border-[#c9a050] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b6860] mb-1">Nom *</label>
                    <input
                      type="text"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-[#e8e7dd] focus:border-[#c9a050] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#6b6860] mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[#e8e7dd] focus:border-[#c9a050] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#6b6860] mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full px-4 py-3 border border-[#e8e7dd] focus:border-[#c9a050] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#6b6860] mb-1">Adresse *</label>
                  <input
                    type="text"
                    value={adresse}
                    onChange={(e) => setAdresse(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[#e8e7dd] focus:border-[#c9a050] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#6b6860] mb-1">Code postal *</label>
                    <input
                      type="text"
                      value={codePostal}
                      onChange={(e) => setCodePostal(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-[#e8e7dd] focus:border-[#c9a050] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#6b6860] mb-1">Ville *</label>
                    <input
                      type="text"
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-[#e8e7dd] focus:border-[#c9a050] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-4 bg-[#c9a050] text-black font-medium hover:bg-[#b8923f] disabled:opacity-50 transition-colors mt-6"
                >
                  {processing ? 'Traitement...' : `Payer ${total.toLocaleString('fr-FR')} €`}
                </button>
              </form>
            </div>

            {/* Récapitulatif */}
            <div className="bg-white p-6 border border-[#e8e7dd] h-fit">
              <h2 className="text-lg font-medium mb-4">Récapitulatif</h2>
              
              <div className="space-y-4 border-b border-[#e8e7dd] pb-4 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    {item.image_url && (
                      <img 
                        src={item.image_url} 
                        alt={item.title}
                        className="w-16 h-16 object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-[#6b6860]">Qté: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      {(item.price * item.quantity).toLocaleString('fr-FR')} €
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>{total.toLocaleString('fr-FR')} €</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
