'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import Footer from '@/components/Footer'
import { useI18n } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'

// Drapeaux SVG
const FlagFR = () => (
  <svg viewBox="0 0 36 24" className="w-5 h-4 rounded-sm overflow-hidden">
    <rect width="12" height="24" fill="#002395"/>
    <rect x="12" width="12" height="24" fill="#fff"/>
    <rect x="24" width="12" height="24" fill="#ED2939"/>
  </svg>
)

const FlagEN = () => (
  <svg viewBox="0 0 36 24" className="w-5 h-4 rounded-sm overflow-hidden">
    <rect width="36" height="24" fill="#012169"/>
    <path d="M0,0 L36,24 M36,0 L0,24" stroke="#fff" strokeWidth="4"/>
    <path d="M0,0 L36,24 M36,0 L0,24" stroke="#C8102E" strokeWidth="2"/>
    <path d="M18,0 V24 M0,12 H36" stroke="#fff" strokeWidth="6"/>
    <path d="M18,0 V24 M0,12 H36" stroke="#C8102E" strokeWidth="4"/>
  </svg>
)

interface Painting {
  id: string
  title: string
  image_url: string
  price: number | null
  original_price?: number | null
  available: boolean
  category?: string
}

interface Exhibition {
  id: string
  title: string
  location: string
  date: string
  year: number
  month: string
}

interface FooterLink {
  label: string
  href: string
}

interface Settings {
  artist_name: string
  artist_title: string
  artist_bio: string
  logo_main?: string
  logo_light?: string
  hero_image: string
  hero_overlay_opacity?: number
  contact_email: string
  footer_description?: string
  footer_address?: string
  footer_phone?: string
  footer_col1_title?: string
  footer_col1_links?: FooterLink[]
  footer_col2_title?: string
  footer_col2_links?: FooterLink[]
  footer_col3_title?: string
  social_x?: string
  social_instagram?: string
  social_facebook?: string
}

interface PageSection {
  id: string
  page_name: string
  section_key: string
  section_order: number
  is_visible: boolean
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
  custom_data?: any
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [paintings, setPaintings] = useState<Painting[]>([])
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [sections, setSections] = useState<PageSection[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [langDropdown, setLangDropdown] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  
  const supabase = createClient()
  const { locale, setLocale, t } = useI18n()
  const { user, signOut } = useAuth()

  // Helper to get a section by key
  const getSection = (key: string) => sections.find(s => s.section_key === key && s.is_visible)

  // Helper to get localized content
  const getLocalized = (section: PageSection | null | undefined, field: 'title' | 'subtitle' | 'description' | 'button_text') => {
    if (!section) return ''
    if (locale === 'en' && section.custom_data?.[`${field}_en`]) {
      return section.custom_data[`${field}_en`]
    }
    return section[field] || ''
  }

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
  }, [loading])

  useEffect(() => {
    async function fetchData() {
      const [paintingsRes, exhibitionsRes, settingsRes, sectionsRes, logoRes] = await Promise.all([
        supabase.from('paintings').select('*').eq('available', true).order('created_at', { ascending: false }).limit(6),
        supabase.from('exhibitions').select('*').order('year', { ascending: false }).limit(4),
        supabase.from('settings').select('*').single(),
        supabase.from('page_sections').select('*').eq('page_name', 'home').order('section_order'),
        supabase.from('page_sections').select('custom_data').eq('page_name', 'global').eq('section_key', 'logo').single()
      ])
      
      if (paintingsRes.data) setPaintings(paintingsRes.data)
      if (exhibitionsRes.data) setExhibitions(exhibitionsRes.data)
      
      // Merge settings with logo data
      const logoData = logoRes.data?.custom_data || {}
      if (settingsRes.data) {
        setSettings({
          ...settingsRes.data,
          logo_main: logoData.logo_main,
          logo_light: logoData.logo_light
        })
      }
      
      if (sectionsRes.data) setSections(sectionsRes.data)
      setLoading(false)
    }
    fetchData()

    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    
    // Fermer dropdowns quand on clique ailleurs
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangDropdown(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Loading screen
  if (loading) {
    return (
      <main className="min-h-screen bg-[#13130d] flex items-center justify-center">
        <div className="text-[#c9a050] text-xl font-['Cormorant_Garamond']">Chargement...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      
      {/* Fixed Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#13130d] shadow-lg' : 'bg-[#13130d] md:bg-transparent'
      }`}>
        <div className="max-w-[1600px] mx-auto px-6 pt-8 pb-6 flex justify-between items-center">
          {/* Left nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-[#c9a050] text-sm tracking-wider font-medium">
              {t.nav.home}
            </Link>
            
            <Link href="/artiste" className={`text-sm tracking-wider transition-colors ${
              scrolled ? 'text-[#f7f6ec] hover:text-[#c9a050]' : 'text-white hover:text-[#c9a050]'
            }`}>{t.nav.artist}</Link>
            
            <Link href="/expositions" className={`text-sm tracking-wider transition-colors ${
              scrolled ? 'text-[#f7f6ec] hover:text-[#c9a050]' : 'text-white hover:text-[#c9a050]'
            }`}>{t.nav.exhibitions}</Link>

            <Link href="/galerie" className={`text-sm tracking-wider transition-colors ${
              scrolled ? 'text-[#f7f6ec] hover:text-[#c9a050]' : 'text-white hover:text-[#c9a050]'
            }`}>{t.nav.collections}</Link>
          </div>
          
          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src={settings?.logo_main || "/logo.png"}
              alt={settings?.artist_name || "Logo"}
              width={320}
              height={100}
              className="h-16 md:h-24 w-auto object-contain transition-all"
            />
          </Link>
          
          {/* Right nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/boutique" className={`text-sm tracking-wider transition-colors ${
              scrolled ? 'text-[#f7f6ec] hover:text-[#c9a050]' : 'text-white hover:text-[#c9a050]'
            }`}>{t.nav.shop}</Link>
            <Link href="/contact" className={`text-sm tracking-wider transition-colors ${
              scrolled ? 'text-[#f7f6ec] hover:text-[#c9a050]' : 'text-white hover:text-[#c9a050]'
            }`}>{t.nav.contact}</Link>

            {/* Séparateur */}
            <div className="w-px h-5 bg-white/20" />

            {/* Language selector */}
            <div ref={langRef} className="relative">
              <button 
                onClick={() => setLangDropdown(!langDropdown)}
                className="flex items-center gap-1.5 text-white hover:text-[#c9a050] transition-colors"
              >
                {locale === 'fr' ? <FlagFR /> : <FlagEN />}
                <svg className={`w-3 h-3 transition-transform ${langDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {langDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-[#13130d] border border-white/10 shadow-lg min-w-[120px]">
                  <button
                    onClick={() => { setLocale('fr'); setLangDropdown(false) }}
                    className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-white/5 ${locale === 'fr' ? 'text-[#c9a050]' : 'text-white'}`}
                  >
                    <FlagFR /> Français
                  </button>
                  <button
                    onClick={() => { setLocale('en'); setLangDropdown(false) }}
                    className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-white/5 ${locale === 'en' ? 'text-[#c9a050]' : 'text-white'}`}
                  >
                    <FlagEN /> English
                  </button>
                </div>
              )}
            </div>

            {/* User account */}
            <div ref={userRef} className="relative">
              <button 
                onClick={() => setUserDropdown(!userDropdown)}
                className="text-white hover:text-[#c9a050] transition-colors"
                title={t.nav.account}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </button>
              
              {userDropdown && (
                <div className="absolute top-full right-0 mt-2 bg-[#13130d] border border-white/10 shadow-lg min-w-[160px]">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-xs text-white/60">{locale === 'fr' ? 'Connecté' : 'Logged in'}</p>
                        <p className="text-sm text-white truncate">{user.email}</p>
                      </div>
                      <Link href="/compte" onClick={() => setUserDropdown(false)} className="block px-4 py-2 text-sm text-white hover:bg-white/5">
                        {t.nav.account}
                      </Link>
                      <button onClick={() => { signOut(); setUserDropdown(false) }} className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/5">
                        {t.nav.logout}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" onClick={() => setUserDropdown(false)} className="block px-4 py-2 text-sm text-white hover:bg-white/5">
                        {t.nav.login}
                      </Link>
                      <Link href="/auth/register" onClick={() => setUserDropdown(false)} className="block px-4 py-2 text-sm text-[#c9a050] hover:bg-white/5">
                        {t.nav.register}
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/panier" className="text-white hover:text-[#c9a050] transition-colors" title={t.nav.cart}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </Link>
          </div>

          {/* Mobile: icons + burger */}
          <div className="md:hidden ml-auto flex items-center gap-4">
            {/* Language mobile */}
            <button onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')} className="text-white">
              {locale === 'fr' ? <FlagFR /> : <FlagEN />}
            </button>

            {/* User mobile */}
            <Link href={user ? "/compte" : "/auth/login"} className="text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>

            {/* Cart mobile */}
            <Link href="/panier" className="text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </Link>

            {/* Burger menu */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#13130d] border-t border-white/10">
            <div className="px-6 py-4 flex flex-col">
              <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 border-b border-white/10 text-[#c9a050]">{t.nav.home}</Link>
              <Link href="/artiste" onClick={() => setMenuOpen(false)} className="py-3 border-b border-white/10 text-white">{t.nav.artist}</Link>
              <Link href="/expositions" onClick={() => setMenuOpen(false)} className="py-3 border-b border-white/10 text-white">{t.nav.exhibitions}</Link>
              <Link href="/galerie" onClick={() => setMenuOpen(false)} className="py-3 border-b border-white/10 text-white">{t.nav.collections}</Link>
              <Link href="/boutique" onClick={() => setMenuOpen(false)} className="py-3 border-b border-white/10 text-white">{t.nav.shop}</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="py-3 border-b border-white/10 text-white">{t.nav.contact}</Link>
              
              <div className="pt-4 border-t border-white/10 mt-2">
                {user ? (
                  <>
                    <p className="text-xs text-white/60 mb-2">{user.email}</p>
                    <Link href="/compte" onClick={() => setMenuOpen(false)} className="block py-2 text-white">{t.nav.account}</Link>
                    <button onClick={() => { signOut(); setMenuOpen(false) }} className="py-2 text-white">{t.nav.logout}</button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block py-2 text-white">{t.nav.login}</Link>
                    <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="block py-2 text-[#c9a050]">{t.nav.register}</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Full Screen */}
      {(() => {
        const hero = getSection('hero')
        return (
          <section id="section-hero" className="relative h-screen flex items-center">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={hero?.image_url || settings?.hero_image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&q=80"}
                alt="Hero"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${hero?.image_overlay_opacity ?? (settings?.hero_overlay_opacity ?? 40) / 100})` }} />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-[1600px] mx-auto px-6 w-full">
              <div className="flex items-center justify-between">
                <div className="max-w-2xl">
                  {getLocalized(hero, 'subtitle') && (
                    <p className="text-base md:text-lg font-['Cormorant_Garamond'] italic mb-4" style={{ color: hero?.accent_color || '#e8e7dd' }}>
                      {getLocalized(hero, 'subtitle')}
                    </p>
                  )}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Cormorant_Garamond'] leading-tight mb-8" style={{ color: hero?.text_color || '#ffffff' }}>
                    {(getLocalized(hero, 'title') || `Je suis ${settings?.artist_name || 'J. Wattebled'}, ${settings?.artist_title || 'peintre impressionniste'}`).split('|').map((line, i) => (
                      <span key={i} className="block">{line.trim()}</span>
                    ))}
                  </h1>
                  {(getLocalized(hero, 'button_text') || hero?.button_text) && (
                    <Link 
                      href={hero?.button_link || '/galerie'}
                      className="inline-block px-10 py-4 text-sm tracking-wider hover:opacity-80 transition-colors"
                      style={{ backgroundColor: hero?.accent_color || '#e8e7dd', color: hero?.background_color || '#13130d' }}
                    >
                      {getLocalized(hero, 'button_text') || hero?.button_text}
                    </Link>
                  )}
                </div>
                
                {/* Image de l'artiste */}
                {hero?.custom_data?.portrait_url && (
                  <div 
                    className="hidden lg:block absolute z-20"
                    style={{
                      top: '50%',
                      right: '5%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    <div 
                      className="overflow-hidden shadow-2xl"
                      style={{
                        width: '420px',
                        height: '320px',
                      }}
                    >
                      <img
                        src={hero.custom_data.portrait_url}
                        alt="Image de l'artiste"
                        className="w-full h-full object-cover"
                        style={{
                          transform: `scale(${(hero?.custom_data?.zoom || 100) / 100})`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )
      })()}

      {/* About Section */}
      {(() => {
        const about = getSection('about')
        if (!about) return null
        return (
          <section 
            id="section-about"
            className="py-24 px-6 relative overflow-hidden"
            style={{ backgroundColor: about.background_color || '#f7f6ec' }}
          >
            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-64 h-64 opacity-20">
              <svg viewBox="0 0 200 200" className="w-full h-full" style={{ color: about.accent_color || '#c9a050' }}>
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </div>
            <div className="absolute bottom-20 left-20 w-4 h-4 rounded-full opacity-40" style={{ backgroundColor: about.accent_color || '#c9a050' }} />
            <div className="absolute bottom-40 right-1/3 w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: about.accent_color || '#c9a050' }} />

            <div className="max-w-[1400px] mx-auto">
              <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
                {/* Left - Content */}
                <div className="order-2 md:order-1">
                  {getLocalized(about, 'subtitle') && (
                    <p 
                      className="text-xs tracking-[0.3em] uppercase mb-6"
                      style={{ color: about.text_color || '#13130d' }}
                    >
                      {getLocalized(about, 'subtitle')}
                    </p>
                  )}
                  <h2 
                    className="text-4xl md:text-5xl lg:text-6xl font-['Cormorant_Garamond'] leading-tight mb-8"
                    style={{ color: about.text_color || '#13130d' }}
                  >
                    {getLocalized(about, 'title') || (locale === 'en' ? 'About the artist' : 'À propos de l\'artiste')}
                  </h2>
                  {getLocalized(about, 'description') && (
                    <p 
                      className="text-lg leading-relaxed mb-10"
                      style={{ color: `${about.text_color || '#13130d'}99` }}
                    >
                      {getLocalized(about, 'description')}
                    </p>
                  )}
                  {(getLocalized(about, 'button_text') || about.button_text) && (
                    <Link 
                      href={about.button_link || '/contact'}
                      className="inline-block px-10 py-5 text-sm tracking-wider transition-all hover:opacity-80"
                      style={{ 
                        backgroundColor: about.accent_color || '#13130d', 
                        color: about.background_color || '#f7f6ec',
                        borderRadius: '50px'
                      }}
                    >
                      {getLocalized(about, 'button_text') || about.button_text}
                    </Link>
                  )}
                </div>

                {/* Right - Image */}
                <div className="order-1 md:order-2">
                  {about.image_url && (
                    <div className="relative">
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <Image
                          src={about.image_url}
                          alt={about.title || 'À propos'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {/* Decorative border */}
                      <div 
                        className="absolute -top-4 -right-4 w-full h-full border-2 -z-10"
                        style={{ borderColor: `${about.accent_color || '#c9a050'}40` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )
      })()}

      {/* Collection Section */}
      {(() => {
        const collection = getSection('featured')
        return (
          <section id="section-featured" className="py-24 px-6" style={{ backgroundColor: collection?.background_color || '#f7f6ec' }}>
            <div className="max-w-[1400px] mx-auto">
              {/* Section Header */}
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-4xl md:text-5xl font-['Cormorant_Garamond']" style={{ color: collection?.text_color || '#13130d' }}>
                  {collection?.title || 'Collection'}
                </h2>
                <Link href={collection?.button_link || '/galerie'} className="hidden md:flex items-center gap-3 text-xs tracking-wider hover:opacity-70 transition-colors" style={{ color: collection?.text_color || '#13130d' }}>
                  {collection?.button_text || 'VOIR TOUTE LA COLLECTION'}
                  <svg className="w-8 h-[1px] bg-current" />
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              
              <div className="h-px mb-8" style={{ backgroundColor: `${collection?.text_color || '#13130d'}33` }} />
              
              <p className="max-w-3xl mb-12" style={{ color: `${collection?.text_color || '#13130d'}99` }}>
                {collection?.description || settings?.artist_bio || "Ma nouvelle collection de peintures comprend plus de 30 œuvres d'art de style impressionniste."}
              </p>

          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {paintings.slice(0, 6).map((painting, index) => (
              <div key={painting.id} className="break-inside-avoid mb-8">
                <Link href={`/galerie`} className="block group">
                  <div className={`relative overflow-hidden bg-[#e8e7dd] ${
                    index % 3 === 1 ? 'aspect-[3/4]' : 'aspect-[4/3]'
                  }`}>
                    {painting.image_url ? (
                      <Image
                        src={painting.image_url}
                        alt={painting.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#6b6860]">Image</div>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-['Cormorant_Garamond'] text-[#13130d] group-hover:text-[#c9a050] transition-colors">
                    {painting.title}
                  </h3>
                  <p className="text-[#6b6860] text-sm">Artiste</p>
                </Link>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Link 
              href={collection?.button_link || '/galerie'}
              className="inline-block px-12 py-4 text-white text-sm tracking-wider rounded-full hover:opacity-80 transition-colors"
              style={{ backgroundColor: collection?.accent_color || '#c9a050' }}
            >
              CHARGER PLUS
            </Link>
          </div>
            </div>
          </section>
        )
      })()}

      {/* Awards Section */}
      {(() => {
        const awards = getSection('awards')
        if (!awards) return null
        return (
          <section id="section-awards" className="grid md:grid-cols-2">
            {/* Left - Image */}
            <div className="relative h-[500px] md:h-auto">
              <Image
                src={awards.image_url || "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80"}
                alt={awards.title || "Récompenses"}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Right - Content */}
            <div className="py-16 md:py-24 px-8 md:px-16" style={{ backgroundColor: awards.background_color || '#13130d' }}>
              <h2 
                className="text-4xl md:text-5xl font-['Cormorant_Garamond'] italic mb-6"
                style={{ color: awards.accent_color || '#c9a050' }}
              >
                {awards.title || 'Mes récompenses'}
              </h2>
              <p className="mb-12" style={{ color: `${awards.text_color || '#e8e7dd'}cc` }}>
                {awards.description || "Certaines de mes peintures ont été récompensées par des prix spéciaux."}
              </p>

              {/* Timeline */}
              <div className="space-y-8">
                {exhibitions.length > 0 ? exhibitions.map((expo) => (
                  <div key={expo.id} className="grid grid-cols-[100px_1fr] gap-6 pb-8 border-b" style={{ borderColor: `${awards.text_color || '#ffffff'}20` }}>
                    <div>
                      <p className="font-medium" style={{ color: awards.text_color || '#e8e7dd' }}>{expo.month}</p>
                      <p style={{ color: awards.text_color || '#e8e7dd' }}>{expo.year}</p>
                    </div>
                    <p style={{ color: `${awards.text_color || '#e8e7dd'}cc` }}>
                      {expo.title}, {expo.location}
                    </p>
                  </div>
                )) : (
                  <p style={{ color: `${awards.text_color || '#e8e7dd'}80` }}>Aucune exposition pour le moment.</p>
                )}
              </div>

              {awards.button_text && (
                <Link 
                  href={awards.button_link || "/expositions"}
                  className="inline-flex items-center gap-4 mt-12 text-xs tracking-wider hover:opacity-70 transition-colors"
                  style={{ color: awards.text_color || '#e8e7dd' }}
                >
                  {awards.button_text}
                  <svg className="w-8 h-[1px] bg-current" />
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>
          </section>
        )
      })()}

      {/* Shop Section */}
      {(() => {
        const shop = getSection('shop')
        if (!shop) return null
        return (
          <section id="section-shop" className="py-24 px-6" style={{ backgroundColor: shop.background_color || '#f7f6ec' }}>
            <div className="max-w-[1400px] mx-auto">
              {/* Section Header */}
              <div className="flex justify-between items-start mb-4">
                <h2 
                  className="text-4xl md:text-5xl font-['Cormorant_Garamond']"
                  style={{ color: shop.text_color || '#13130d' }}
                >
                  {shop.title || 'Ma boutique'}
                </h2>
                <Link 
                  href={shop.button_link || "/boutique"} 
                  className="hidden md:flex items-center gap-3 text-xs tracking-wider hover:opacity-70 transition-colors"
                  style={{ color: shop.text_color || '#13130d' }}
                >
                  {shop.button_text || 'AFFICHER TOUS LES ARTICLES'}
                  <svg className="w-8 h-[1px] bg-current" />
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              
              <div className="h-px mb-8" style={{ backgroundColor: `${shop.text_color || '#13130d'}20` }} />
              
              <p className="max-w-3xl mb-12" style={{ color: `${shop.text_color || '#13130d'}99` }}>
                {shop.description || "Achetez des œuvres originales directement sur le site."}
              </p>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paintings.slice(0, 6).map((painting) => (
                  <div key={painting.id} className="group">
                    <div className="relative aspect-square overflow-hidden bg-[#e8e7dd] mb-4">
                      {painting.image_url ? (
                        <Image
                          src={painting.image_url}
                          alt={painting.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6b6860]">Image</div>
                      )}
                      
                      {/* Discount Badge */}
                      {painting.original_price && (
                        <div 
                          className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: shop.accent_color || '#c9a050' }}
                        >
                          -20%
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Link 
                          href={`/checkout/${painting.id}`}
                          className="px-6 py-3 bg-transparent border border-white text-white text-xs tracking-wider hover:bg-white hover:text-[#13130d] transition-colors"
                        >
                          AJOUTER AU PANIER
                        </Link>
                      </div>
                    </div>

                    <h3 
                      className="text-xl font-['Cormorant_Garamond'] mb-2 group-hover:opacity-70 transition-colors"
                      style={{ color: shop.text_color || '#13130d' }}
                    >
                      {painting.title}
                    </h3>
                    
                    <div className="flex items-center gap-3">
                      {painting.original_price && (
                        <span className="line-through" style={{ color: `${shop.text_color || '#13130d'}60` }}>
                          {painting.original_price.toFixed(2)} €
                        </span>
                      )}
                      <span className="text-lg" style={{ color: shop.accent_color || '#c9a050' }}>
                        {painting.price?.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })()}

      {/* Newsletter Section */}
      {(() => {
        const newsletter = getSection('newsletter')
        if (!newsletter) return null
        return (
          <section id="section-newsletter" className="relative py-32 px-6">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={newsletter.image_url || "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1920&q=80"}
                alt={newsletter.title || "Newsletter"}
                fill
                className="object-cover"
              />
              <div 
                className="absolute inset-0" 
                style={{ backgroundColor: `rgba(0,0,0,${newsletter.image_overlay_opacity ?? 0.5})` }}
              />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <h2 
                className="text-5xl md:text-6xl font-['Cormorant_Garamond'] italic mb-6"
                style={{ color: newsletter.text_color || '#ffffff' }}
              >
                {newsletter.title || 'Bulletin'}
              </h2>
              <p 
                className="font-['Cormorant_Garamond'] text-xl italic mb-10"
                style={{ color: `${newsletter.text_color || '#ffffff'}ee` }}
              >
                {newsletter.description || "Recevez par courriel des mises à jour sur nos expositions."}
              </p>
              
              <form className="relative max-w-xl mx-auto mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletter.subtitle || "Saisissez votre adresse e-mail"}
                  className="w-full px-6 py-5 pr-16 bg-[#13130d] border border-white/20 text-white placeholder-white/50 focus:outline-none rounded-full"
                  style={{ borderColor: `${newsletter.accent_color || '#c9a050'}40` }}
                />
                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:opacity-70"
                  style={{ color: newsletter.text_color || '#ffffff' }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </form>

              <label className="flex items-center justify-center gap-3 text-xs" style={{ color: `${newsletter.text_color || '#ffffff'}99` }}>
                <input type="checkbox" className="rounded border-white/30" />
                J'ACCEPTE QUE LES DONNÉES QUE J'AI SOUMISES SOIENT <span style={{ color: newsletter.accent_color || '#c9a050' }}>COLLECTÉES ET STOCKÉES</span>.
              </label>
            </div>
          </section>
        )
      })()}

      <Footer settings={settings || undefined} />

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
