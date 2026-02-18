'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

interface PageSection {
  id: string
  section_key: string
  title: string | null
  subtitle: string | null
  description: string | null
  button_text: string | null
  button_link: string | null
  image_url: string | null
  image_overlay_opacity: number
  background_color: string
  text_color: string
  accent_color: string
  is_visible: boolean
  custom_data: any
}

export default function ContactPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [expoDropdown, setExpoDropdown] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [settings, setSettings] = useState<any>({})
  const [sections, setSections] = useState<PageSection[]>([])
  
  const supabase = createClient()

  // Helper to get a section by key
  const getSection = (key: string) => sections.find(s => s.section_key === key && s.is_visible)

  // Scroll to section if hash in URL
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 500)
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      const [settingsRes, sectionsRes, logoRes] = await Promise.all([
        supabase.from('settings').select('*').single(),
        supabase.from('page_sections').select('*').eq('page_name', 'contact').order('section_order'),
        supabase.from('page_sections').select('custom_data').eq('page_name', 'global').eq('section_key', 'logo').single()
      ])
      const logoData = logoRes.data?.custom_data || {}
      if (settingsRes.data) setSettings({ ...settingsRes.data, ...logoData })
      if (sectionsRes.data) setSections(sectionsRes.data)
    }
    fetchData()

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

  const defaultFaqs = [
    { q: "Quand l'atelier est-il ouvert ?", a: "L'atelier est ouvert du lundi au vendredi de 9h à 18h." },
    { q: "Comment acheter une œuvre ?", a: "Vous pouvez acheter directement sur le site via la boutique ou me contacter pour une commande personnalisée." },
    { q: "Proposez-vous des commandes personnalisées ?", a: "Oui, je réalise des œuvres sur commande. Contactez-moi pour discuter de votre projet." },
    { q: "Livrez-vous à l'international ?", a: "Oui, je livre dans le monde entier. Les frais de port sont calculés selon la destination." },
    { q: "Puis-je visiter l'atelier ?", a: "Oui, sur rendez-vous uniquement. Contactez-moi pour organiser une visite." },
    { q: "Les œuvres sont-elles encadrées ?", a: "Les tableaux sont vendus sans cadre, mais je peux vous conseiller sur l'encadrement." },
  ]
  
  // Get FAQs from section or use defaults
  const faqSection = getSection('faq')
  const faqs = (faqSection?.custom_data?.questions && faqSection.custom_data.questions.length > 0) 
    ? faqSection.custom_data.questions 
    : defaultFaqs

  return (
    <main className="min-h-screen bg-[#f7f6ec]">
      <Header currentPage="contact" />

      {/* Hero */}
      <section id="section-hero" className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
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
      <section id="section-form" className="py-24 px-6 bg-[#f7f6ec]">
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
      {(() => {
        const info = getSection('info')
        const mapAddress = encodeURIComponent(info?.custom_data?.address || settings.footer_address || '38 route Wierre, 62240 Longfossé, France')
        return (
          <section id="section-info" className="grid md:grid-cols-2">
            {/* Map */}
            <div className="h-[500px] md:h-auto relative">
              <iframe
                src={`https://maps.google.com/maps?q=${mapAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-6 left-6 flex items-center gap-2 px-5 py-3 bg-[#13130d] text-white text-sm tracking-wider hover:bg-[#c9a050] transition-colors shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                ITINÉRAIRE
              </a>
            </div>

            {/* Info */}
            <div 
              className="py-16 px-8 md:px-16"
              style={{ backgroundColor: info?.background_color || '#13130d' }}
            >
              <h2 
                className="text-4xl font-['Cormorant_Garamond'] mb-12"
                style={{ color: info?.text_color || '#ffffff' }}
              >
                {info?.title || 'Informations sur l\'atelier'}
              </h2>

              <div className="mb-12">
                <h3 className="font-medium mb-6 tracking-wider" style={{ color: info?.text_color || '#ffffff' }}>Contacts</h3>
                <div className="h-px mb-6" style={{ backgroundColor: `${info?.text_color || '#ffffff'}20` }} />
                
                <div className="space-y-4">
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span style={{ color: `${info?.text_color || '#ffffff'}80` }}>Téléphone</span>
                    <span style={{ color: info?.accent_color || '#c9a050' }}>
                      {info?.custom_data?.phone || settings.footer_phone || '+33 6 00 00 00 00'}
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span style={{ color: `${info?.text_color || '#ffffff'}80` }}>Adresse</span>
                    <span style={{ color: info?.text_color || '#e8e7dd' }}>
                      {info?.custom_data?.address || settings.footer_address || 'Nord de la France'}
                    </span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4">
                    <span style={{ color: `${info?.text_color || '#ffffff'}80` }}>E-mail</span>
                    <span style={{ color: info?.text_color || '#e8e7dd' }}>
                      {info?.custom_data?.email || settings.contact_email || 'contact@exemple.fr'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-6 tracking-wider" style={{ color: info?.text_color || '#ffffff' }}>Horaires d'ouverture</h3>
                <div className="h-px mb-6" style={{ backgroundColor: `${info?.text_color || '#ffffff'}20` }} />
                
                {info?.custom_data?.hours ? (
                  <div className="space-y-4">
                    {info.custom_data.hours.split('\n').map((line: string, i: number) => {
                      const parts = line.split(':')
                      if (parts.length >= 2) {
                        return (
                          <div key={i} className="grid grid-cols-[180px_1fr] gap-4">
                            <span style={{ color: `${info?.text_color || '#ffffff'}80` }}>{parts[0].trim()}</span>
                            <span style={{ color: info?.text_color || '#e8e7dd' }}>{parts.slice(1).join(':').trim()}</span>
                          </div>
                        )
                      }
                      return <p key={i} style={{ color: info?.text_color || '#e8e7dd' }}>{line}</p>
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-[180px_1fr] gap-4">
                      <span style={{ color: `${info?.text_color || '#ffffff'}80` }}>Du lundi au vendredi</span>
                      <span style={{ color: info?.text_color || '#e8e7dd' }}>9h00 – 18h00</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-4">
                      <span style={{ color: `${info?.text_color || '#ffffff'}80` }}>Samedi</span>
                      <span style={{ color: info?.text_color || '#e8e7dd' }}>Sur rendez-vous</span>
                    </div>
                    <div className="grid grid-cols-[180px_1fr] gap-4">
                      <span style={{ color: `${info?.text_color || '#ffffff'}80` }}>Dimanche</span>
                      <span style={{ color: info?.text_color || '#e8e7dd' }}>Fermé</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )
      })()}

      {/* FAQ Section */}
      {(() => {
        const faq = getSection('faq')
        if (faq === undefined) return null
        return (
          <section id="section-faq" className="py-24 px-6" style={{ backgroundColor: faq?.background_color || '#f7f6ec' }}>
            <div className="max-w-[1200px] mx-auto">
              <h2 
                className="text-4xl md:text-5xl font-['Cormorant_Garamond'] mb-4"
                style={{ color: faq?.text_color || '#13130d' }}
              >
                {faq?.title || 'Foire aux questions'}
              </h2>
              <div className="h-px mb-12" style={{ backgroundColor: `${faq?.text_color || '#13130d'}20` }} />

              <div className="grid md:grid-cols-2 gap-x-16 gap-y-0">
                {faqs.map((item: { q: string; a: string }, index: number) => (
                  <div key={index} className="border-b" style={{ borderColor: `${faq?.text_color || '#13130d'}20` }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full py-6 flex justify-between items-center text-left"
                    >
                      <span 
                        className="text-lg font-['Cormorant_Garamond'] pr-4"
                        style={{ color: faq?.text_color || '#13130d' }}
                      >
                        {item.q}
                      </span>
                      <svg 
                        className={`w-5 h-5 flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                        style={{ color: faq?.text_color || '#13130d' }}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === index && (
                      <div className="pb-6" style={{ color: `${faq?.text_color || '#13130d'}80` }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

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
