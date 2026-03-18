'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function InscriptionPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur lors de la création du compte.')
        setLoading(false)
        return
      }

      router.push('/connexion?registered=1')
    } catch {
      setError('Erreur de connexion au serveur.')
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-page__container">
        <h1 className="auth-page__title">Créer un compte</h1>

        {error && <div className="auth-page__error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form__field">
            <label htmlFor="name">Nom complet *</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required placeholder="Votre nom" />
          </div>
          <div className="auth-form__field">
            <label htmlFor="email">Email *</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="votre@email.com" />
          </div>
          <div className="auth-form__field">
            <label htmlFor="phone">Téléphone</label>
            <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="06 12 34 56 78" />
          </div>
          <div className="auth-form__row">
            <div className="auth-form__field">
              <label htmlFor="password">Mot de passe *</label>
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Min. 8 caractères" />
            </div>
            <div className="auth-form__field">
              <label htmlFor="confirmPassword">Confirmer *</label>
              <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required placeholder="Confirmer" />
            </div>
          </div>
          <button type="submit" className="btn btn--primary auth-form__submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="auth-page__link">
          Déjà un compte ? <Link href="/connexion">Se connecter</Link>
        </p>
      </div>
    </section>
  )
}
