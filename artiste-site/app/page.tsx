'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import Footer from '@/components/Footer'

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
  hero_image: string
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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expoDropdown, setExpoDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [paintings, setPaintings] = useState<Painting[]>([])
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [email, setEmail] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const [paintingsRes, exhibitionsRes, settingsRes] = await Promise.all([
        supabase.from('paintings').select('*').eq('available', true).order('created_at', { ascending: false }).limit(6),
        supabase.from('exhibitions').select('*').order('year', { ascending: false }).limit(4),
        supabase.from('settings').select('*').single()
      ])
      
      if (paintingsRes.data) setPaintings(paintingsRes.data)
      if (exhibitionsRes.data) setExhibitions(exhibitionsRes.data)
      if (settingsRes.data) setSettings(settingsRes.data)
    }
    fetchData()

    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen">
      
      {/* Fixed Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#13130d] shadow-lg' : 'bg-[#13130d] md:bg-transparent'
      }`}>
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-[#c9a050] text-sm tracking-wider font-medium">
              MAISON
            </Link>
            
            <Link href="/expositions" className={`text-sm tracking-wider transition-colors ${
              scrolled ? 'text-[#f7f6ec] hover:text-[#c9a050]' : 'text-white hover:text-[#c9a050]'
            }`}>EXPOSITIONS</Link>

            <Link href="/galerie" className={`text-sm tracking-wider transition-colors ${
              scrolled ? 'text-[#f7f6ec] hover:text-[#c9a050]' : 'text-white hover:text-[#c9a050]'
            }`}>
              COLLECTIONS
            </Link>
          </div>
          
          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="/logo.png"
              alt="J. Wattebled"
              width={280}
              height={80}
              className={`h-14 md:h-16 w-auto object-contain transition-all ${
                scrolled ? '' : 'md:brightness-0 md:invert'
              }`}
            />
          </Link>
          
          {/* Right nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/boutique" className={`text-sm tracking-wider transition-colors ${
              scrolled ? 'text-[#f7f6ec] hover:text-[#c9a050]' : 'text-white hover:text-[#c9a050]'
            }`}>
              BOUTIQUE
            </Link>
            <Link href="/contact" className={`text-sm tracking-wider transition-colors ${
              scrolled ? 'text-[#f7f6ec] hover:text-[#c9a050]' : 'text-white hover:text-[#c9a050]'
            }`}>
              CONTACTS
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden ml-auto p-2 text-[#f7f6ec]"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#13130d] border-t border-white/10">
            <div className="px-6 py-4 flex flex-col">
              <Link href="/" onClick={() => setMenuOpen(false)} className="py-3 border-b border-white/10 text-[#c9a050]">MAISON</Link>
              <Link href="/expositions" onClick={() => setMenuOpen(false)} className="py-3 border-b border-white/10 text-[#f7f6ec]">EXPOSITIONS</Link>
              <Link href="/galerie" onClick={() => setMenuOpen(false)} className="py-3 border-b border-white/10 text-[#f7f6ec]">COLLECTIONS</Link>
              <Link href="/boutique" onClick={() => setMenuOpen(false)} className="py-3 border-b border-white/10 text-[#f7f6ec]">BOUTIQUE</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="py-3 text-[#f7f6ec]">CONTACTS</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Full Screen */}
      <section className="relative h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={settings?.hero_image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&q=80"}
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <p className="text-[#e8e7dd] text-base md:text-lg font-['Cormorant_Garamond'] italic mb-4">
              Paysages et scènes
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Cormorant_Garamond'] text-white leading-tight mb-8">
              Je suis {settings?.artist_name || 'J. Wattebled'},<br/>
              {settings?.artist_title || 'peintre impressionniste'}
            </h1>
            <Link 
              href="/galerie"
              className="inline-block px-10 py-4 bg-[#e8e7dd] text-[#13130d] text-sm tracking-wider hover:bg-[#c9a050] hover:text-white transition-colors"
            >
              APPRENDRE ENCORE PLUS
            </Link>
          </div>
        </div>
      </section>

      {/* Collection Section */}
      <section className="py-24 px-6 bg-[#f7f6ec]">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] text-[#13130d]">
              Collection
            </h2>
            <Link href="/galerie" className="hidden md:flex items-center gap-3 text-[#13130d] text-xs tracking-wider hover:text-[#c9a050] transition-colors">
              VOIR TOUTE LA COLLECTION
              <svg className="w-8 h-[1px] bg-current" />
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="h-px bg-[#13130d]/20 mb-8" />
          
          <p className="text-[#6b6860] max-w-3xl mb-12">
            {settings?.artist_bio || "Ma nouvelle collection de peintures comprend plus de 30 œuvres d'art de style impressionniste et est actuellement exposée dans la section d'art moderne du musée."}
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
              href="/galerie"
              className="inline-block px-12 py-4 bg-[#c9a050] text-white text-sm tracking-wider rounded-full hover:bg-[#b8923f] transition-colors"
            >
              CHARGER PLUS
            </Link>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="grid md:grid-cols-2">
        {/* Left - Image */}
        <div className="relative h-[500px] md:h-auto">
          <Image
            src="https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80"
            alt="Récompenses"
            fill
            className="object-cover"
          />
        </div>
        
        {/* Right - Content */}
        <div className="bg-[#13130d] py-16 md:py-24 px-8 md:px-16">
          <h2 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] text-[#c9a050] italic mb-6">
            Mes récompenses
          </h2>
          <p className="text-[#e8e7dd]/80 mb-12">
            Certaines de mes peintures ont été récompensées par des prix spéciaux de l'Académie des Beaux-Arts et exposées dans le monde entier.
          </p>

          {/* Timeline */}
          <div className="space-y-8">
            {exhibitions.length > 0 ? exhibitions.map((expo) => (
              <div key={expo.id} className="grid grid-cols-[100px_1fr] gap-6 pb-8 border-b border-white/10">
                <div>
                  <p className="text-[#e8e7dd] font-medium">{expo.month}</p>
                  <p className="text-[#e8e7dd]">{expo.year}</p>
                </div>
                <p className="text-[#e8e7dd]/80">
                  {expo.title}, {expo.location}
                </p>
              </div>
            )) : (
              <>
                <div className="grid grid-cols-[100px_1fr] gap-6 pb-8 border-b border-white/10">
                  <div>
                    <p className="text-[#e8e7dd] font-medium">Février</p>
                    <p className="text-[#e8e7dd]">2024</p>
                  </div>
                  <p className="text-[#e8e7dd]/80">Voyage lumineux fantastique, galerie Modern Eden, San Francisco</p>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-6 pb-8 border-b border-white/10">
                  <div>
                    <p className="text-[#e8e7dd] font-medium">Septembre</p>
                    <p className="text-[#e8e7dd]">2023</p>
                  </div>
                  <p className="text-[#e8e7dd]/80">Le Rêve de la Saint-Jean, Galerie Haven, North Port, New York</p>
                </div>
              </>
            )}
          </div>

          <Link 
            href="/expositions"
            className="inline-flex items-center gap-4 mt-12 text-[#e8e7dd] text-xs tracking-wider hover:text-[#c9a050] transition-colors"
          >
            EN SAVOIR PLUS
            <svg className="w-8 h-[1px] bg-current" />
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Shop Section */}
      <section className="py-24 px-6 bg-[#f7f6ec]">
        <div className="max-w-[1400px] mx-auto">
          {/* Section Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] text-[#13130d]">
              Ma boutique
            </h2>
            <Link href="/boutique" className="hidden md:flex items-center gap-3 text-[#13130d] text-xs tracking-wider hover:text-[#c9a050] transition-colors">
              AFFICHER TOUS LES ARTICLES
              <svg className="w-8 h-[1px] bg-current" />
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="h-px bg-[#13130d]/20 mb-8" />
          
          <p className="text-[#6b6860] max-w-3xl mb-12">
            Achetez des œuvres originales d'artistes indépendants directement sur le site et soutenez-moi dans ma passion. Payez en ligne et bénéficiez d'une garantie complète.
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
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#c9a050] flex items-center justify-center text-white text-xs font-medium">
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

                {/* Tags */}
                <div className="flex items-center gap-2 text-xs text-[#6b6860] mb-2">
                  <span className="text-[#c9a050]">ART</span>
                  <span>,</span>
                  <span className="text-[#c9a050]">LIVRE</span>
                  <span>,</span>
                  <span className="text-[#c9a050]">EXPOSITION</span>
                </div>

                <h3 className="text-xl font-['Cormorant_Garamond'] text-[#13130d] mb-2 group-hover:text-[#c9a050] transition-colors">
                  {painting.title}
                </h3>
                
                <div className="flex items-center gap-3">
                  {painting.original_price && (
                    <span className="text-[#6b6860] line-through">
                      {painting.original_price.toFixed(2)} €
                    </span>
                  )}
                  <span className="text-[#c9a050] text-lg">
                    {painting.price?.toFixed(2)} €
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative py-32 px-6">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1920&q=80"
            alt="Newsletter"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-['Cormorant_Garamond'] text-white italic mb-6">
            Bulletin
          </h2>
          <p className="text-[#e8e7dd]/90 font-['Cormorant_Garamond'] text-xl italic mb-10">
            Recevez par courriel des mises à jour sur nos expositions, événements et plus encore.
          </p>
          
          <form className="relative max-w-xl mx-auto mb-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Saisissez votre adresse e-mail"
              className="w-full px-6 py-5 pr-16 bg-[#13130d] border border-white/20 text-white placeholder-white/50 focus:border-[#c9a050] focus:outline-none rounded-full"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-[#c9a050] transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </form>

          <label className="flex items-center justify-center gap-3 text-white/70 text-xs">
            <input type="checkbox" className="rounded border-white/30" />
            J'ACCEPTE QUE LES DONNÉES QUE J'AI SOUMISES SOIENT <span className="text-[#c9a050]">COLLECTÉES ET STOCKÉES</span>.
          </label>
        </div>
      </section>

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
