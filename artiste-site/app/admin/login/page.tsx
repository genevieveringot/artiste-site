'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, ArrowLeft } from 'lucide-react'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('admin_token', data.token)
        router.push('/admin')
      } else {
        setError(data.error || 'Mot de passe incorrect')
      }
    } catch {
      setError('Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="border border-[#1a1a1a] p-10 bg-[#111]">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 border border-[#c9a86c]/30 flex items-center justify-center">
              <Lock size={32} className="text-[#c9a86c]" />
            </div>
            <h1 className="font-serif text-3xl mb-2">Administration</h1>
            <p className="text-[#888] text-sm font-light">
              Entrez le mot de passe pour accéder au panneau.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm uppercase tracking-wider text-[#888] mb-3">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-4 bg-[#0a0a0a] border text-white placeholder:text-[#555] focus:outline-none focus:border-[#c9a86c] transition-colors duration-300 ${
                  error ? 'border-red-500' : 'border-[#2a2a2a]'
                }`}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#c9a86c] text-[#0a0a0a] text-sm uppercase tracking-[0.15em] hover:bg-[#d4b87d] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin mr-2" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-[#888] text-sm hover:text-[#c9a86c] transition-colors duration-300"
            >
              <ArrowLeft size={16} />
              Retour au site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
