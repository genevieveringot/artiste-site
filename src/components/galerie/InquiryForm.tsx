'use client'

import { useState, FormEvent } from 'react'

interface InquiryFormProps {
  artworkTitle: string
  artworkId: string
  prix?: number
  disponibilite?: string
}

export default function InquiryForm({ artworkTitle, artworkId, disponibilite }: InquiryFormProps) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isOpen, setIsOpen] = useState(false)

  const isSold = disponibilite === 'vendu'

  function validate() {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = 'Le nom est requis.'
    if (!formData.email.trim()) errors.email = "L'email est requis."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email invalide.'
    if (!formData.message.trim()) errors.message = 'Le message est requis.'
    return errors
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          artworkTitle,
          artworkId,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Une erreur est survenue.')
      }

      setStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err.message || 'Une erreur est survenue.')
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => { const next = { ...prev }; delete next[name]; return next })
    }
  }

  if (isSold) {
    return null
  }

  return (
    <div className="artwork-inquiry">
      {!isOpen ? (
        <button
          className="btn btn--primary btn--full"
          onClick={() => setIsOpen(true)}
        >
          {disponibilite === 'sur_demande' ? 'Demander le prix' : "Demande d'achat / renseignement"}
        </button>
      ) : (
        <div className="artwork-inquiry__form">
          <div className="artwork-inquiry__header">
            <h3 className="artwork-inquiry__title">
              {disponibilite === 'sur_demande' ? 'Demander le prix' : 'Demande de renseignement'}
            </h3>
            <button
              className="artwork-inquiry__close"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer"
            >
              &times;
            </button>
          </div>

          <p className="artwork-inquiry__artwork-name">
            Concernant : <strong>{artworkTitle}</strong>
          </p>

          {status === 'success' ? (
            <div className="form-message form-message--success">
              <p>Votre demande a bien ete envoyee. Je vous repondrai dans les plus brefs delais.</p>
              <button className="btn btn--outline btn--sm" onClick={() => { setStatus('idle'); setIsOpen(false) }}>
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {status === 'error' && (
                <div className="form-message form-message--error">
                  <p>{errorMsg}</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="inquiry-name" className="form-label form-label--required">Nom</label>
                <input
                  type="text"
                  id="inquiry-name"
                  name="name"
                  className={`form-control${fieldErrors.name ? ' is-error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                />
                {fieldErrors.name && <span className="form-error">{fieldErrors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="inquiry-email" className="form-label form-label--required">Email</label>
                  <input
                    type="email"
                    id="inquiry-email"
                    name="email"
                    className={`form-control${fieldErrors.email ? ' is-error' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                  />
                  {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="inquiry-phone" className="form-label">Telephone</label>
                  <input
                    type="tel"
                    id="inquiry-phone"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="inquiry-message" className="form-label form-label--required">Message</label>
                <textarea
                  id="inquiry-message"
                  name="message"
                  className={`form-control${fieldErrors.message ? ' is-error' : ''}`}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={disponibilite === 'sur_demande'
                    ? "Je souhaiterais connaître le prix de cette oeuvre..."
                    : "Je suis intéressé(e) par cette oeuvre..."}
                  rows={4}
                />
                {fieldErrors.message && <span className="form-error">{fieldErrors.message}</span>}
              </div>

              <button
                type="submit"
                className={`btn btn--primary btn--full${status === 'loading' ? ' btn--loading' : ''}`}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Envoi...' : 'Envoyer ma demande'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
