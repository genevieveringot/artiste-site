'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Send, CheckCircle } from 'lucide-react'

export function ContactForm() {
  const searchParams = useSearchParams()
  const defaultSubject = searchParams.get('subject') || ''
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Form submitted:', {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
      })
      
      setIsSuccess(true)
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-8 border border-[#c9a86c] rounded-full flex items-center justify-center">
          <CheckCircle size={32} className="text-[#c9a86c]" />
        </div>
        <h3 className="font-serif text-3xl mb-4">Message Envoyé !</h3>
        <p className="text-[#888] font-light mb-8">
          Merci pour votre message. Je vous répondrai dans les plus brefs délais.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="btn btn-outline"
        >
          Envoyer un autre message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <label htmlFor="name" className="block text-sm uppercase tracking-wider text-[#888] mb-3">
            Nom complet
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Votre nom"
            required
            className="w-full px-0 py-4 bg-transparent border-0 border-b border-[#2a2a2a] text-white placeholder:text-[#555] focus:outline-none focus:border-[#c9a86c] transition-colors duration-300"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm uppercase tracking-wider text-[#888] mb-3">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="votre@email.com"
            required
            className="w-full px-0 py-4 bg-transparent border-0 border-b border-[#2a2a2a] text-white placeholder:text-[#555] focus:outline-none focus:border-[#c9a86c] transition-colors duration-300"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm uppercase tracking-wider text-[#888] mb-3">
          Sujet
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          placeholder="Objet de votre message"
          defaultValue={defaultSubject}
          required
          className="w-full px-0 py-4 bg-transparent border-0 border-b border-[#2a2a2a] text-white placeholder:text-[#555] focus:outline-none focus:border-[#c9a86c] transition-colors duration-300"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm uppercase tracking-wider text-[#888] mb-3">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Votre message..."
          rows={6}
          required
          className="w-full px-0 py-4 bg-transparent border-0 border-b border-[#2a2a2a] text-white placeholder:text-[#555] focus:outline-none focus:border-[#c9a86c] transition-colors duration-300 resize-none"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn btn-primary disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <span className="w-5 h-5 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin mr-3" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send size={18} className="mr-3" />
            Envoyer le message
          </>
        )}
      </button>
    </form>
  )
}
