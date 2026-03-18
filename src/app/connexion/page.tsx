'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ConnexionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/mon-compte'
  const registered = searchParams.get('registered')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Email ou mot de passe incorrect.')
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <>
      {registered && (
        <div className="auth-page__success">
          Compte créé avec succès ! Vous pouvez maintenant vous connecter.
        </div>
      )}

      {error && <div className="auth-page__error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-form__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votre@email.com"
          />
        </div>
        <div className="auth-form__field">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="btn btn--primary auth-form__submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="auth-page__link">
        Pas encore de compte ? <Link href="/inscription">Créer un compte</Link>
      </p>
    </>
  )
}

export default function ConnexionPage() {
  return (
    <section className="auth-page">
      <div className="auth-page__container">
        <h1 className="auth-page__title">Connexion</h1>
        <Suspense fallback={<p>Chargement...</p>}>
          <ConnexionForm />
        </Suspense>
      </div>
    </section>
  )
}
