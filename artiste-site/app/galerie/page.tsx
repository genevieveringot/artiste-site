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
  width: number
  height: number
  category: string
  available: boolean
  description: string | null
}

export default function GaleriePage() {
  const [paintings, setPaintings] = useState<Painting[]>([])
  const [filteredPaintings, setFilteredPaintings] = useState<Painting[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null)
  const [settings, setSettings] = useState<any>({})
  const [menuOpen, setMenuOpen] = useState(false)
  const [expoDropdown, setExpoDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const [paintingsRes, settingsRes] = await Promise.all([
        supabase.from('paintings').select('*').order('created_at', { ascending: false }),
        supabase.from('settings').select('*').single()
      ])
      
      if (paintingsRes.data) {
        setPaintings(paintingsRes.data)
        setFilteredPaintings(paintingsRes.data)
        const cats = Array.from(new Set(paintingsRes.data.map(p => p.category).filter(Boolean))) as string[]
        setCategories(cats)
      }
      if (settingsRes.data) setSettings(settingsRes.data)
    }
    fetchData()

    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filterByCategory = (category: string) => {
    setActiveCategory(category)
    if (category === 'all') {
      setFilteredPaintings(paintings)
    } else {
      setFilteredPaintings(paintings.filter(p => p.category === category))
    }
  }

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
              <Link href="/galerie" className="text-[#c9a050] text-xs tracking-wider font-medium">COLLECTIONS</Link>
            </div>
            
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Image src="/logo.png" alt="J. Wattebled" width={200} height={60} className="h-10 md:h-12 w-auto object-contain" />
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/boutique" className="text-[#f7f6ec] text-xs tracking-wider hover:text-[#c9a050]">BOUTIQUE</Link>
              <Link href="/contact" className="text-[#f7f6ec] text-xs tracking-wider hover:text-[#c9a050]">CONTACTS</Link>
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
              <Link href="/galerie" onClick={() => setMenuOpen(false)} className="block text-[#c9a050] text-sm font-medium">COLLECTIONS</Link>
              <Link href="/boutique" onClick={() => setMenuOpen(false)} className="block text-[#f7f6ec] text-sm">BOUTIQUE</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="block text-[#f7f6ec] text-sm">CONTACTS</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src={settings.header_galerie || "https://images.unsplash.com/photo-1594732832278-abd644401426?w=1920&q=80"}
            alt="Galerie"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-['Cormorant_Garamond'] text-white mb-4">
            Grille de la galerie
          </h1>
          <p className="text-white/80 font-['Cormorant_Garamond'] text-lg">
            Maison / <span className="text-[#c9a050]">Grille de la galerie</span>
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-12 px-6 bg-[#f7f6ec]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => filterByCategory('all')}
              className={`px-8 py-3 text-sm tracking-wider transition-colors ${
                activeCategory === 'all'
                  ? 'bg-[#c9a050] text-white'
                  : 'bg-white text-[#5c5a56] hover:text-[#c9a050] border border-[#e8e7dd]'
              }`}
            >
              TOUS
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => filterByCategory(cat)}
                className={`px-8 py-3 text-sm tracking-wider transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#c9a050] text-white'
                    : 'bg-white text-[#5c5a56] hover:text-[#c9a050] border border-[#e8e7dd]'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Paintings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPaintings.map((painting) => (
              <div 
                key={painting.id}
                className="group cursor-pointer"
                onClick={() => setSelectedPainting(painting)}
              >
                <div className="relative aspect-[4/3] overflow-hidden mb-4">
                  <Image
                    src={painting.image_url}
                    alt={painting.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm tracking-wider">
                      VOIR DÉTAILS
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-['Cormorant_Garamond'] text-[#13130d] mb-1">{painting.title}</h3>
                {painting.price && (
                  <p className="text-[#c9a050] font-medium">{painting.price.toLocaleString('fr-FR')} €</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer settings={settings} />

      {/* Modal */}
      {selectedPainting && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedPainting(null)}
        >
          <div className="max-w-4xl w-full bg-white" onClick={e => e.stopPropagation()}>
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-square">
                <Image
                  src={selectedPainting.image_url}
                  alt={selectedPainting.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-8">
                <button 
                  onClick={() => setSelectedPainting(null)}
                  className="float-right text-2xl text-[#6b6860] hover:text-[#13130d]"
                >
                  ×
                </button>
                <h2 className="text-2xl font-['Cormorant_Garamond'] text-[#13130d] mb-4">{selectedPainting.title}</h2>
                {selectedPainting.description && (
                  <p className="text-[#6b6860] mb-6">{selectedPainting.description}</p>
                )}
                <div className="space-y-2 text-sm text-[#6b6860] mb-6">
                  <p>Dimensions: {selectedPainting.width} × {selectedPainting.height} cm</p>
                  {selectedPainting.category && <p>Catégorie: {selectedPainting.category}</p>}
                </div>
                {selectedPainting.price && selectedPainting.available && (
                  <>
                    <p className="text-2xl text-[#c9a050] font-medium mb-6">{selectedPainting.price.toLocaleString('fr-FR')} €</p>
                    <Link
                      href={`/checkout/${selectedPainting.id}`}
                      className="block w-full py-3 bg-[#c9a050] text-white text-center text-sm tracking-wider hover:bg-[#b8923f] transition-colors"
                    >
                      ACHETER
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side Buttons */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col">
        <Link href="/boutique" className="bg-[#c9a050] hover:bg-[#b8923f] w-14 h-14 flex items-center justify-center transition-colors">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
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
