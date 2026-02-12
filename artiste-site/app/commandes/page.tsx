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

interface Order {
  id: string
  created_at: string
  status: string
  total: number
  items: any[]
}

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [headerSection, setHeaderSection] = useState<Section | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchOrders()
    fetchPageHeader()
  }, [])

  async function fetchPageHeader() {
    const { data } = await supabase
      .from('page_sections')
      .select('*')
      .eq('page_name', 'commandes')
      .eq('section_key', 'page-header')
      .eq('is_visible', true)
      .single()
    if (data) setHeaderSection(data)
  }

  async function fetchOrders() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/connexion')
      return
    }

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setOrders(data || [])
    setLoading(false)
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, { text: string; color: string }> = {
      'pending': { text: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      'confirmed': { text: 'Confirmée', color: 'bg-blue-100 text-blue-800' },
      'shipped': { text: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
      'delivered': { text: 'Livrée', color: 'bg-green-100 text-green-800' },
      'cancelled': { text: 'Annulée', color: 'bg-red-100 text-red-800' },
    }
    return labels[status] || { text: status, color: 'bg-gray-100 text-gray-800' }
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
              {headerSection?.title || 'Mes commandes'}
            </h1>
            {headerSection?.subtitle && (
              <p className="text-[#6b6860]">{headerSection.subtitle}</p>
            )}
          </div>

          {/* Retour au compte */}
          <Link 
            href="/compte" 
            className="inline-flex items-center gap-2 text-[#c9a050] hover:underline mb-6"
          >
            ← Retour à mon compte
          </Link>

          {orders.length === 0 ? (
            <div className="bg-white p-8 border border-[#e8e7dd] text-center">
              <div className="text-4xl mb-4">📦</div>
              <h2 className="text-lg font-medium mb-2">Aucune commande</h2>
              <p className="text-[#6b6860] mb-4">Vous n'avez pas encore passé de commande.</p>
              <Link 
                href="/boutique"
                className="inline-block px-6 py-3 bg-[#c9a050] text-black font-medium hover:bg-[#b8923f] transition-colors"
              >
                Découvrir la boutique
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const status = getStatusLabel(order.status)
                return (
                  <div key={order.id} className="bg-white p-6 border border-[#e8e7dd]">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <p className="text-sm text-[#6b6860]">Commande #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-[#6b6860]">
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    
                    <div className="border-t border-[#e8e7dd] pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[#6b6860]">
                          {order.items?.length || 0} article(s)
                        </span>
                        <span className="text-lg font-medium">
                          {order.total?.toLocaleString('fr-FR')} €
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
