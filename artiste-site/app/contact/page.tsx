'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [expoDropdown, setExpoDropdown] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [settings, setSettings] = useState<any>({})
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('*').single()
      if (data) setSettings(data)
    }
    fetchSettings()

    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!consent) return
    setStatus('sending')
    await new Promise(r => setTimeout(r, 1000))
    setStatus('sent')
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 3000)
  }

  const faqs = [
    { q: "Quand l'atelier est-il ouvert ?", a: "L'atelier est ouvert du lundi au vendredi de 9h à 18h." },
    { q: "Comment acheter une œuvre ?", a: "Vous pouvez acheter directement sur le site via la boutique ou me contacter pour une commande personnalisée." },
    { q: "Proposez-vous des commandes personnalisées ?", a: "Oui, je réalise des œuvres sur commande. Contactez-moi pour discuter de votre projet." },
    { q: "Livrez-vous à l'international ?", a: "Oui, je livre dans le monde entier. Les frais de port sont calculés selon la destination." },
    { q: "Puis-je visiter l'atelier ?", a: "Oui, sur rendez-vous uniquement. Contactez-moi pour organiser une visite." },
    { q: "Les œuvres sont-elles encadrées ?", a: "Les tableaux sont vendus sans cadre, mais je peux vous conseiller sur l'encadrement." },
  ]

  return (
    <main className="min-h-screen bg-[#f7f6ec]">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#13130d]">
        {/* Top bar */}
        {!scrolled && (
          <div className="bg-[#13130d] text-white/80 text-xs">
            <div className="max-w-[1600px] mx-auto px-6 py-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                  <path strokeLinecap="round" strokeWidth="1.5" d="M12 6v6l4 2"/>
                </svg>
                <span>L'ATELIER EST OUVERT DU LUNDI AU VENDREDI DE 9H À 18H</span>
              </div>
              <span className="hidden md:block">Nord de la France</span>
            </div>
          </div>
        )}

        <div className="bg-[#13130d]">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-[#f7f6ec] text-xs tracking-wider hover:text-[#c9a050]">MAISON</Link>
              <Link href="/expositions" className="text-[#f7f6ec] text-xs tracking-wider hover:text-[#c9a050]">EXPOSITIONS</Link>
              <Link href="/galerie" className="text-[#f7f6ec] text-xs tracking-wider hover:text-[#c9a050]">COLLECTIONS</Link>
            </div>
            
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Image src="/logo.png" alt="J. Wattebled" width={200} height={60} className="h-10 md:h-12 w-auto object-contain" />
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/boutique" className="text-[#f7f6ec] text-xs tracking-wider hover:text-[#c9a050]">BOUTIQUE</Link>
              <Link href="/contact" className="text-[#c9a050] text-xs tracking-wider font-medium">CONTACTS</Link>
            </div>

            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden ml-auto p-2 text-[#f7f6ec]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#13130d] border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              <Link href="/" onClick={() => setMenuOpen(false)} className="block text-[#f7f6ec] text-sm">MAISON</Link>
              <Link href="/expositions" onClick={() => setMenuOpen(false)} className="block text-[#f7f6ec] text-sm">EXPOSITIONS</Link>
              <Link href="/galerie" onClick={() => setMenuOpen(false)} className="block text-[#f7f6ec] text-sm">COLLECTIONS</Link>
              <Link href="/boutique" onClick={() => setMenuOpen(false)} className="block text-[#f7f6ec] text-sm">BOUTIQUE</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="block text-[#c9a050] text-sm font-medium">CONTACTS</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src={settings.header_contact || "https://images.unsplash.com/photo-1594732832278-abd644401426?w=1920&q=80"}
            alt="Contact"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-['Cormorant_Garamond'] text-white mb-4">Contacts</h1>
          <p className="text-white/80 font-['Cormorant_Garamond'] text-lg">
            Maison / <span className="text-[#c9a050]">Contacts</span>
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 px-6 bg-[#f7f6ec]">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] text-[#13130d] mb-4">
            Contactez-nous
          </h2>
          <div className="h-px bg-[#13130d]/20 mb-8" />
          <p className="text-[#6b6860] mb-12 max-w-2xl">
            N'hésitez pas à me contacter pour toute question concernant mes œuvres, les commandes personnalisées ou les expositions à venir.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Nom"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-6 py-5 bg-white border border-[#e8e7dd] text-[#13130d] placeholder-[#9a9588] focus:border-[#c9a050] focus:outline-none rounded-full"
              />
              <input
                type="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-6 py-5 bg-white border border-[#e8e7dd] text-[#13130d] placeholder-[#9a9588] focus:border-[#c9a050] focus:outline-none rounded-full"
              />
            </div>
            <textarea
              placeholder="Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              rows={6}
              className="w-full px-6 py-5 bg-white border border-[#e8e7dd] text-[#13130d] placeholder-[#9a9588] focus:border-[#c9a050] focus:outline-none rounded-3xl resize-none"
            />
            
            <label className="flex items-center gap-3 text-[#6b6860] text-sm">
              <input 
                type="checkbox" 
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-5 h-5 border-[#e8e7dd] rounded"
              />
              J'ACCEPTE QUE LES DONNÉES QUE J'AI SOUMISES SOIENT COLLECTÉES ET STOCKÉES.
            </label>

            <button
              type="submit"
              disabled={status === 'sending' || !consent}
              className="px-10 py-4 bg-[#c9a050] text-white text-sm tracking-wider hover:bg-[#b8923f] transition-colors disabled:opacity-50"
            >
              {status === 'sending' ? 'ENVOI...' : status === 'sent' ? 'ENVOYÉ ✓' : 'ENVOYER UN MESSAGE'}
            </button>
          </form>
        </div>
      </section>

      {/* Map + Info Section */}
      <section className="grid md:grid-cols-2">
        {/* Map */}
        <div className="h-[500px] md:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2530.5!2d2.9!3d50.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTDCsDM2JzAwLjAiTiAywrA1NCcwMC4wIkU!5e0!3m2!1sfr!2sfr!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '500px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Info */}
        <div className="bg-[#13130d] py-16 px-8 md:px-16">
          <h2 className="text-4xl font-['Cormorant_Garamond'] text-white mb-12">
            Informations sur l'atelier
          </h2>

          <div className="mb-12">
            <h3 className="text-white font-medium mb-6 tracking-wider">Contacts</h3>
            <div className="h-px bg-white/10 mb-6" />
            
            <div className="space-y-4">
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-[#9a9588]">Téléphone</span>
                <span className="text-[#c9a050]">{settings.footer_phone || '+33 6 00 00 00 00'}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-[#9a9588]">Adresse</span>
                <span className="text-[#e8e7dd]">{settings.footer_address || 'Nord de la France'}</span>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <span className="text-[#9a9588]">E-mail</span>
                <span className="text-[#e8e7dd]">{settings.contact_email || 'contact@jwattebled.fr'}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-medium mb-6 tracking-wider">Horaires d'ouverture</h3>
            <div className="h-px bg-white/10 mb-6" />
            
            <div className="space-y-4">
              <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-[#9a9588]">Du lundi au vendredi</span>
                <span className="text-[#e8e7dd]">9h00 – 18h00</span>
              </div>
              <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-[#9a9588]">Samedi</span>
                <span className="text-[#e8e7dd]">Sur rendez-vous</span>
              </div>
              <div className="grid grid-cols-[180px_1fr] gap-4">
                <span className="text-[#9a9588]">Dimanche</span>
                <span className="text-[#e8e7dd]">Fermé</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-[#f7f6ec]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] text-[#13130d] mb-4">
            Foire aux questions
          </h2>
          <div className="h-px bg-[#13130d]/20 mb-12" />

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-0">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-[#13130d]/20">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full py-6 flex justify-between items-center text-left"
                >
                  <span className="text-lg font-['Cormorant_Garamond'] text-[#13130d] pr-4">
                    {faq.q}
                  </span>
                  <svg 
                    className={`w-5 h-5 text-[#13130d] flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="pb-6 text-[#6b6860]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer settings={settings} />

      {/* Side Buttons */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col">
        <Link href="/boutique" className="bg-[#c9a050] hover:bg-[#b8923f] w-14 h-14 flex items-center justify-center transition-colors">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </Link>
        <Link href="/galerie" className="bg-[#c9a050] hover:bg-[#b8923f] w-14 h-14 flex items-center justify-center transition-colors border-t border-[#b8923f]">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </Link>
        <Link href="/contact" className="bg-[#c9a050] hover:bg-[#b8923f] w-14 h-14 flex items-center justify-center transition-colors border-t border-[#b8923f]">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </Link>
      </div>
    </main>
  )
}
