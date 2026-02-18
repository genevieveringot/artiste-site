'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const { t } = useI18n()
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    setLoading(true)

    const { error } = await signUp(email, password, { firstName, lastName })
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f7f6ec] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white border border-[#e8e7dd] p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-[#13130d] mb-2">Compte créé !</h2>
            <p className="text-[#6b6860] mb-6">
              Vérifiez votre boîte mail pour confirmer votre adresse email.
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-[#c9a050] text-white font-medium hover:bg-[#b8923f] transition-colors"
            >
              {t.nav.login}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f6ec] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#e8e7dd] p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-2xl font-['Cormorant_Garamond'] text-[#13130d]">J. Wattebled</h1>
            </Link>
            <h2 className="text-xl font-medium text-[#13130d]">{t.nav.register}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#6b6860] mb-2">{t.auth.firstName}</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-[#6b6860] mb-2">{t.auth.lastName}</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#6b6860] mb-2">{t.auth.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-[#6b6860] mb-2">{t.auth.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm text-[#6b6860] mb-2">{t.auth.confirmPassword}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#c9a050] text-white font-medium hover:bg-[#b8923f] disabled:opacity-50 transition-colors"
            >
              {loading ? t.common.loading : t.auth.register}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6b6860]">
              {t.auth.hasAccount}{' '}
              <Link href="/auth/login" className="text-[#c9a050] hover:underline">
                {t.nav.login}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-[#6b6860] hover:text-[#c9a050]">
            ← {t.nav.home}
          </Link>
        </div>
      </div>
    </div>
  )
}
