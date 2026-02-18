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

interface UserProfile {
  email: string
  nom?: string
  prenom?: string
}

export default function ComptePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [headerSection, setHeaderSection] = useState<Section | null>(null)
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchUser()
    fetchPageHeader()
  }, [])

  async function fetchPageHeader() {
    const { data } = await supabase
      .from('page_sections')
      .select('*')
      .eq('page_name', 'compte')
      .eq('section_key', 'page-header')
      .eq('is_visible', true)
      .single()
    if (data) setHeaderSection(data)
  }

  async function fetchUser() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/connexion')
      return
    }

    setUser({
      email: user.email || '',
      nom: user.user_metadata?.nom,
      prenom: user.user_metadata?.prenom,
    })
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
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
        <div className="max-w-2xl mx-auto px-4">
          {/* En-tête de page personnalisable */}
          <div 
            className="text-center mb-8"
            style={{
              backgroundColor: headerSection?.background_color || 'transparent',
              color: headerSection?.text_color || '#13130d'
            }}
          >
            <h1 className="text-3xl md:text-4xl font-light mb-2">
              {headerSection?.title || 'Mon compte'}
            </h1>
            {headerSection?.subtitle && (
              <p className="text-[#6b6860]">{headerSection.subtitle}</p>
            )}
          </div>

          {/* Informations du compte */}
          <div className="bg-white p-6 border border-[#e8e7dd] mb-6">
            <h2 className="text-lg font-medium mb-4">Mes informations</h2>
            <div className="space-y-3 text-[#6b6860]">
              {user?.prenom && user?.nom && (
                <p><span className="text-[#13130d] font-medium">Nom:</span> {user.prenom} {user.nom}</p>
              )}
              <p><span className="text-[#13130d] font-medium">Email:</span> {user?.email}</p>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <Link 
              href="/commandes"
              className="bg-white p-6 border border-[#e8e7dd] hover:border-[#c9a050] transition-colors group"
            >
              <div className="text-2xl mb-2">📦</div>
              <h3 className="font-medium group-hover:text-[#c9a050] transition-colors">Mes commandes</h3>
              <p className="text-sm text-[#6b6860]">Voir l'historique de vos commandes</p>
            </Link>

            <Link 
              href="/panier"
              className="bg-white p-6 border border-[#e8e7dd] hover:border-[#c9a050] transition-colors group"
            >
              <div className="text-2xl mb-2">🛒</div>
              <h3 className="font-medium group-hover:text-[#c9a050] transition-colors">Mon panier</h3>
              <p className="text-sm text-[#6b6860]">Voir votre panier en cours</p>
            </Link>
          </div>

          {/* Déconnexion */}
          <div className="text-center">
            <button
              onClick={handleLogout}
              className="px-6 py-3 border border-[#c9a050] text-[#c9a050] hover:bg-[#c9a050] hover:text-black transition-colors"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
