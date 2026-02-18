'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

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

export default function GaleriePage() {
  const [paintings, setPaintings] = useState<Painting[]>([])
  const [filteredPaintings, setFilteredPaintings] = useState<Painting[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null)
  const [settings, setSettings] = useState<any>({})
  const [sections, setSections] = useState<PageSection[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
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
      const [paintingsRes, settingsRes, sectionsRes, logoRes] = await Promise.all([
        supabase.from('paintings').select('*').order('created_at', { ascending: false }),
        supabase.from('settings').select('*').single(),
        supabase.from('page_sections').select('*').eq('page_name', 'galerie').order('section_order'),
        supabase.from('page_sections').select('custom_data').eq('page_name', 'global').eq('section_key', 'logo').single()
      ])
      
      if (paintingsRes.data) {
        setPaintings(paintingsRes.data)
        setFilteredPaintings(paintingsRes.data)
        const cats = Array.from(new Set(paintingsRes.data.map(p => p.category).filter(Boolean))) as string[]
        setCategories(cats)
      }
      const logoData = logoRes.data?.custom_data || {}
      if (settingsRes.data) setSettings({ ...settingsRes.data, ...logoData })
      if (sectionsRes.data) setSections(sectionsRes.data)
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

  // Get custom categories from section or use dynamic ones
  const gallerySection = getSection('gallery')
  const customCategories = gallerySection?.custom_data?.categories as string[] | undefined
  const displayCategories = customCategories && customCategories.length > 0 ? customCategories : categories

  return (
    <main className="min-h-screen bg-[#f7f6ec]">
      <Header currentPage="galerie" />

      {/* Hero Section */}
      {(() => {
        const hero = getSection('hero')
        return (
          <section id="section-hero" className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
            <div className="absolute inset-0">
              <Image
                src={hero?.image_url || settings.header_galerie || "https://images.unsplash.com/photo-1594732832278-abd644401426?w=1920&q=80"}
                alt="Galerie"
                fill
                className="object-cover"
                priority
              />
              <div 
                className="absolute inset-0" 
                style={{ backgroundColor: `rgba(0,0,0,${hero?.image_overlay_opacity ?? 0.3})` }}
              />
            </div>

            <div className="relative z-10 text-center px-6">
              <h1 
                className="text-4xl md:text-6xl font-['Cormorant_Garamond'] mb-4"
                style={{ color: hero?.text_color || '#ffffff' }}
              >
                {hero?.title || 'Collections'}
              </h1>
              <p className="font-['Cormorant_Garamond'] text-lg" style={{ color: `${hero?.text_color || '#ffffff'}cc` }}>
                Maison / <span style={{ color: hero?.accent_color || '#c9a050' }}>{hero?.title || 'Collections'}</span>
              </p>
            </div>
          </section>
        )
      })()}

      {/* Gallery Section */}
      {(() => {
        const gallery = getSection('gallery')
        return (
          <section 
            id="section-gallery"
            className="py-12 px-6"
            style={{ backgroundColor: gallery?.background_color || '#f7f6ec' }}
          >
            <div className="max-w-6xl mx-auto">
              {/* Section title and description */}
              {(gallery?.title || gallery?.description) && (
                <div className="text-center mb-8">
                  {gallery?.title && (
                    <h2 
                      className="text-3xl md:text-4xl font-['Cormorant_Garamond'] mb-4"
                      style={{ color: gallery?.text_color || '#13130d' }}
                    >
                      {gallery.title}
                    </h2>
                  )}
                  {gallery?.description && (
                    <p 
                      className="max-w-2xl mx-auto"
                      style={{ color: `${gallery?.text_color || '#13130d'}99` }}
                    >
                      {gallery.description}
                    </p>
                  )}
                </div>
              )}

              {/* Categories Filter */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <button
                  onClick={() => filterByCategory('all')}
                  className="px-8 py-3 text-sm tracking-wider transition-colors"
                  style={{
                    backgroundColor: activeCategory === 'all' ? (gallery?.accent_color || '#c9a050') : '#ffffff',
                    color: activeCategory === 'all' ? '#ffffff' : (gallery?.text_color || '#5c5a56'),
                    border: activeCategory === 'all' ? 'none' : '1px solid #e8e7dd'
                  }}
                >
                  {gallery?.custom_data?.allLabel || 'TOUS'}
                </button>
                {displayCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => filterByCategory(cat)}
                    className="px-8 py-3 text-sm tracking-wider transition-colors"
                    style={{
                      backgroundColor: activeCategory === cat ? (gallery?.accent_color || '#c9a050') : '#ffffff',
                      color: activeCategory === cat ? '#ffffff' : (gallery?.text_color || '#5c5a56'),
                      border: activeCategory === cat ? 'none' : '1px solid #e8e7dd'
                    }}
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
                    <h3 
                      className="text-lg font-['Cormorant_Garamond'] mb-1"
                      style={{ color: gallery?.text_color || '#13130d' }}
                    >
                      {painting.title}
                    </h3>
                    {painting.price && (
                      <p className="font-medium" style={{ color: gallery?.accent_color || '#c9a050' }}>
                        {painting.price.toLocaleString('fr-FR')} €
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {filteredPaintings.length === 0 && (
                <div className="text-center py-12" style={{ color: `${gallery?.text_color || '#13130d'}80` }}>
                  Aucune œuvre dans cette catégorie.
                </div>
              )}
            </div>
          </section>
        )
      })()}

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
