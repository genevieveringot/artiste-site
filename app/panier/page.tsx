'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/lib/auth/context'

interface CartItem {
  id: string
  title: string
  image_url: string
  price: number
  quantity: number
}

interface Order {
  id: string
  items: CartItem[]
  total_amount: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  tracking_number?: string
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente de paiement', color: 'bg-yellow-100 text-yellow-800' },
  paid: { label: 'Payée', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
}

export default function PanierPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart')
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  // Rediriger vers login si non connecté
  useEffect(() => {
    if (!authLoading) {
      setAuthChecked(true)
      if (!user) {
        router.push('/auth/login?redirect=/panier')
      }
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    
    // Charger le panier depuis localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }

    // Charger les commandes
    fetchOrders()
  }, [user])

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (data) {
        setOrders(data)
      }
    } catch (err) {
      // Table might not exist yet
      console.log('Orders table not found')
    }
    setLoading(false)
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    )
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  function removeItem(id: string) {
    const newCart = cart.filter(item => item.id !== id)
    setCart(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Afficher le chargement pendant la vérification d'auth
  if (authLoading || !authChecked) {
    return (
      <main className="min-h-screen bg-[#f7f6ec] flex items-center justify-center">
        <div className="text-[#c9a050] text-xl font-['Cormorant_Garamond']">Chargement...</div>
      </main>
    )
  }

  // Rediriger si non connecté (le useEffect s'en charge)
  if (!user) {
    return (
      <main className="min-h-screen bg-[#f7f6ec] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-['Cormorant_Garamond'] text-[#13130d] mb-4">
            Connexion requise
          </h2>
          <p className="text-[#6b6860] mb-8">
            Redirection vers la page de connexion...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f6ec]">
      <Header
        currentPage="panier"
        backgroundImage="https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=1920&q=80"
        title="Mon Panier"
        breadcrumb="Panier"
      />

      <section className="py-16 px-6">
        <div className="max-w-[1200px] mx-auto">
          
          {/* Tabs */}
          <div className="flex border-b border-[#e8e7dd] mb-8">
            <button
              onClick={() => setActiveTab('cart')}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'cart'
                  ? 'border-b-2 border-[#c9a050] text-[#c9a050]'
                  : 'text-[#6b6860] hover:text-[#13130d]'
              }`}
            >
              🛒 Panier ({cart.length})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'border-b-2 border-[#c9a050] text-[#c9a050]'
                  : 'text-[#6b6860] hover:text-[#13130d]'
              }`}
            >
              📦 Mes Commandes
            </button>
          </div>

          {/* Cart Tab */}
          {activeTab === 'cart' && (
            <div>
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🛒</div>
                  <h2 className="text-2xl font-['Cormorant_Garamond'] text-[#13130d] mb-4">
                    Votre panier est vide
                  </h2>
                  <p className="text-[#6b6860] mb-8">
                    Découvrez nos œuvres et ajoutez vos coups de cœur
                  </p>
                  <Link
                    href="/boutique"
                    className="inline-block px-8 py-4 bg-[#c9a050] text-white text-sm tracking-wider hover:bg-[#b8923f] transition-colors"
                  >
                    VOIR LA BOUTIQUE
                  </Link>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Cart Items */}
                  <div className="lg:col-span-2 space-y-4">
                    {cart.map(item => (
                      <div
                        key={item.id}
                        className="bg-white p-4 border border-[#e8e7dd] flex gap-4"
                      >
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-['Cormorant_Garamond'] text-lg text-[#13130d]">
                            {item.title}
                          </h3>
                          <p className="text-[#c9a050] font-medium">
                            {item.price.toFixed(2)} €
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 border border-[#e8e7dd] hover:border-[#c9a050]"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 border border-[#e8e7dd] hover:border-[#c9a050]"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#13130d]">
                            {(item.price * item.quantity).toFixed(2)} €
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 text-sm mt-2 hover:underline"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white p-6 border border-[#e8e7dd] h-fit">
                    <h3 className="text-xl font-['Cormorant_Garamond'] text-[#13130d] mb-4">
                      Récapitulatif
                    </h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-[#6b6860]">
                        <span>Sous-total</span>
                        <span>{total.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-[#6b6860]">
                        <span>Livraison</span>
                        <span>Calculée à l'étape suivante</span>
                      </div>
                    </div>
                    <div className="border-t border-[#e8e7dd] pt-4 mb-6">
                      <div className="flex justify-between text-lg font-medium text-[#13130d]">
                        <span>Total</span>
                        <span className="text-[#c9a050]">{total.toFixed(2)} €</span>
                      </div>
                    </div>
                    <Link
                      href="/checkout"
                      className="block w-full py-4 bg-[#c9a050] text-white text-center text-sm tracking-wider hover:bg-[#b8923f] transition-colors"
                    >
                      PASSER LA COMMANDE
                    </Link>
                    <Link
                      href="/boutique"
                      className="block w-full py-4 mt-2 border border-[#c9a050] text-[#c9a050] text-center text-sm tracking-wider hover:bg-[#c9a050] hover:text-white transition-colors"
                    >
                      CONTINUER MES ACHATS
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              {!user ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔒</div>
                  <h2 className="text-2xl font-['Cormorant_Garamond'] text-[#13130d] mb-4">
                    Connectez-vous pour voir vos commandes
                  </h2>
                  <p className="text-[#6b6860] mb-8">
                    Accédez à l'historique de vos commandes et suivez vos livraisons
                  </p>
                  <Link
                    href="/auth/login"
                    className="inline-block px-8 py-4 bg-[#c9a050] text-white text-sm tracking-wider hover:bg-[#b8923f] transition-colors"
                  >
                    SE CONNECTER
                  </Link>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📦</div>
                  <h2 className="text-2xl font-['Cormorant_Garamond'] text-[#13130d] mb-4">
                    Aucune commande
                  </h2>
                  <p className="text-[#6b6860] mb-8">
                    Vous n'avez pas encore passé de commande
                  </p>
                  <Link
                    href="/boutique"
                    className="inline-block px-8 py-4 bg-[#c9a050] text-white text-sm tracking-wider hover:bg-[#b8923f] transition-colors"
                  >
                    DÉCOUVRIR LA BOUTIQUE
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div
                      key={order.id}
                      className="bg-white p-6 border border-[#e8e7dd]"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                          <p className="text-xs text-[#6b6860]">
                            Commande #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-[#6b6860]">
                            {new Date(order.created_at).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 text-xs rounded-full ${
                              STATUS_LABELS[order.status]?.color || 'bg-gray-100'
                            }`}
                          >
                            {STATUS_LABELS[order.status]?.label || order.status}
                          </span>
                          {order.tracking_number && (
                            <p className="text-xs text-[#6b6860] mt-1">
                              Suivi: {order.tracking_number}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-[#e8e7dd] pt-4">
                        <div className="flex flex-wrap gap-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              {item.image_url && (
                                <div className="relative w-16 h-16">
                                  <Image
                                    src={item.image_url}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="text-sm text-[#13130d]">{item.title}</p>
                                <p className="text-xs text-[#6b6860]">
                                  {item.quantity} × {item.price.toFixed(2)} €
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-[#e8e7dd] pt-4 mt-4 flex justify-between items-center">
                        <span className="text-[#6b6860]">Total</span>
                        <span className="text-lg font-medium text-[#c9a050]">
                          {order.total_amount.toFixed(2)} €
                        </span>
                      </div>

                      {order.status === 'pending' && (
                        <div className="mt-4">
                          <Link
                            href={`/checkout/${order.id}`}
                            className="inline-block px-6 py-2 bg-[#c9a050] text-white text-sm hover:bg-[#b8923f] transition-colors"
                          >
                            Payer maintenant
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
