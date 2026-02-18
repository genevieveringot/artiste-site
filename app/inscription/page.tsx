'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
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

export default function InscriptionPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [headerSection, setHeaderSection] = useState<Section | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchPageHeader()
  }, [])

  async function fetchPageHeader() {
    const { data } = await supabase
      .from('page_sections')
      .select('*')
      .eq('page_name', 'inscription')
      .eq('section_key', 'page-header')
      .eq('is_visible', true)
      .single()
    if (data) setHeaderSection(data)
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nom,
          prenom,
        }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-[#f7f6ec] pt-24 pb-16">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white p-8 border border-[#e8e7dd] text-center">
              <div className="text-4xl mb-4">✅</div>
              <h2 className="text-xl font-medium mb-2">Inscription réussie !</h2>
              <p className="text-[#6b6860] mb-4">
                Vérifiez votre email pour confirmer votre compte.
              </p>
              <Link 
                href="/connexion"
                className="inline-block px-6 py-3 bg-[#c9a050] text-black font-medium hover:bg-[#b8923f] transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f6ec] pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          {/* En-tête de page personnalisable */}
          <div 
            className="text-center mb-8"
            style={{
              backgroundColor: headerSection?.background_color || 'transparent',
              color: headerSection?.text_color || '#13130d'
            }}
          >
            <h1 className="text-3xl md:text-4xl font-light mb-2">
              {headerSection?.title || 'Créer un compte'}
            </h1>
            {headerSection?.subtitle && (
              <p className="text-[#6b6860]">{headerSection.subtitle}</p>
            )}
          </div>

          <div className="bg-white p-8 border border-[#e8e7dd]">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#6b6860] mb-1">Prénom</label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[#e8e7dd] focus:border-[#c9a050] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#6b6860] mb-1">Nom</label>
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
                <label className="block text-sm text-[#6b6860] mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#e8e7dd] focus:border-[#c9a050] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#6b6860] mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#e8e7dd] focus:border-[#c9a050] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#6b6860] mb-1">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-[#e8e7dd] focus:border-[#c9a050] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#c9a050] text-black font-medium hover:bg-[#b8923f] disabled:opacity-50 transition-colors"
              >
                {loading ? 'Création...' : 'Créer mon compte'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-[#6b6860]">
              <p>
                Déjà un compte ?{' '}
                <Link href="/connexion" className="text-[#c9a050] hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
