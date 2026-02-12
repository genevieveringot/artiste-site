'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useI18n } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState('/')
  
  const { t } = useI18n()
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const redirect = searchParams.get('redirect')
    if (redirect) {
      setRedirectUrl(redirect)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(redirectUrl)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f6ec] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-[#e8e7dd] p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-2xl font-['Cormorant_Garamond'] text-[#13130d]">J. Wattebled</h1>
            </Link>
            <h2 className="text-xl font-medium text-[#13130d]">{t.nav.login}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

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
                className="w-full px-4 py-3 border border-[#e8e7dd] text-[#13130d] focus:border-[#c9a050] focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <Link href="/auth/forgot-password" className="text-sm text-[#c9a050] hover:underline">
                {t.auth.forgotPassword}
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#c9a050] text-white font-medium hover:bg-[#b8923f] disabled:opacity-50 transition-colors"
            >
              {loading ? t.common.loading : t.auth.login}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#6b6860]">
              {t.auth.noAccount}{' '}
              <Link href="/auth/register" className="text-[#c9a050] hover:underline">
                {t.nav.register}
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f6ec] flex items-center justify-center">
        <div className="text-[#c9a050]">Chargement...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
