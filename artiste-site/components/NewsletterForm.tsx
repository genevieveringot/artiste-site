'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center gap-3 text-[#c9a86c]">
        <Check size={20} />
        <span>Merci pour votre inscription !</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Votre adresse email"
        required
        className="flex-1 px-6 py-4 bg-transparent border border-[#2a2a2a] text-white placeholder:text-[#555] focus:outline-none focus:border-[#c9a86c] transition-colors duration-300"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <span className="w-5 h-5 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
        ) : (
          <>
            S'inscrire
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  )
}
