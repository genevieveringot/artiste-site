'use client'

import { useState, FormEvent } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function validate() {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = 'Le nom est requis.'
    if (!formData.email.trim()) errors.email = 'L\'email est requis.'
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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Une erreur est survenue.')
      }

      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
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

  return (
    <div className="contact-form">
      <h2 className="contact-form__title">Envoyer un message</h2>

      {status === 'success' && (
        <div className="form-message form-message--success">
          <p>Votre message a bien été envoyé. Je vous répondrai dans les plus brefs délais.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="form-message form-message--error">
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name" className="form-label form-label--required">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            className={`form-control${fieldErrors.name ? ' is-error' : ''}`}
            value={formData.name}
            onChange={handleChange}
            placeholder="Votre nom"
          />
          {fieldErrors.name && <span className="form-error">{fieldErrors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label form-label--required">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-control${fieldErrors.email ? ' is-error' : ''}`}
            value={formData.email}
            onChange={handleChange}
            placeholder="votre@email.com"
          />
          {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="subject" className="form-label">Sujet</label>
          <input
            type="text"
            id="subject"
            name="subject"
            className="form-control"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Sujet de votre message"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label form-label--required">Message</label>
          <textarea
            id="message"
            name="message"
            className={`form-control${fieldErrors.message ? ' is-error' : ''}`}
            value={formData.message}
            onChange={handleChange}
            placeholder="Votre message..."
            rows={6}
          />
          {fieldErrors.message && <span className="form-error">{fieldErrors.message}</span>}
        </div>

        <button
          type="submit"
          className={`btn btn--primary${status === 'loading' ? ' btn--loading' : ''}`}
          disabled={status === 'loading'}
        >
          Envoyer
        </button>
      </form>
    </div>
  )
}
