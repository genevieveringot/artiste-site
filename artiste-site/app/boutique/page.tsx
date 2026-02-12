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
  width: number
  height: number
  category: string
  available: boolean
  description: string | null
  tags?: string[]
}

export default function BoutiquePage() {
  const [paintings, setPaintings] = useState<Painting[]>([])
  const [filteredPaintings, setFilteredPaintings] = useState<Painting[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [maxPrice, setMaxPrice] = useState(5000)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [settings, setSettings] = useState<any>({})
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [expoDropdown, setExpoDropdown] = useState(false)
  
  const itemsPerPage = 8
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const [paintingsRes, settingsRes, logoRes] = await Promise.all([
        supabase.from('paintings').select('*').eq('available', true).order('created_at', { ascending: false }),
        supabase.from('settings').select('*').single(),
        supabase.from('page_sections').select('custom_data').eq('page_name', 'global').eq('section_key', 'logo').single()
      ])
      const logoData = logoRes.data?.custom_data || {}
      
      if (paintingsRes.data) {
        setPaintings(paintingsRes.data)
        setFilteredPaintings(paintingsRes.data)
        
        // Extract categories
        const cats = Array.from(new Set(paintingsRes.data.map(p => p.category).filter(Boolean))) as string[]
        setCategories(cats)
        
        // Extract tags
        const allTags = paintingsRes.data.flatMap(p => p.tags || [])
        setTags(Array.from(new Set(allTags)))
        
        // Set max price
        const prices = paintingsRes.data.map(p => p.price || 0).filter(p => p > 0)
        if (prices.length > 0) {
          const max = Math.max(...prices)
          setMaxPrice(max)
          setPriceRange([0, max])
        }
      }
      if (settingsRes.data) setSettings({ ...settingsRes.data, ...logoData })
    }
    fetchData()

    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Apply filters
  useEffect(() => {
    let result = [...paintings]
    
    // Search
    if (searchQuery) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Category
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory)
    }
    
    // Price
    result = result.filter(p => {
      const price = p.price || 0
      return price >= priceRange[0] && price <= priceRange[1]
    })
    
    // Sort
    if (sortBy === 'price-asc') result.sort((a, b) => (a.price || 0) - (b.price || 0))
    if (sortBy === 'price-desc') result.sort((a, b) => (b.price || 0) - (a.price || 0))
    if (sortBy === 'name') result.sort((a, b) => a.title.localeCompare(b.title))
    
    setFilteredPaintings(result)
    setCurrentPage(1)
  }, [paintings, searchQuery, selectedCategory, priceRange, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredPaintings.length / itemsPerPage)
  const paginatedPaintings = filteredPaintings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getDiscount = (original: number | null | undefined, current: number | null) => {
    if (!original || !current || original <= current) return null
    return Math.round((1 - current / original) * 100)
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
              <Link href="/galerie" className="text-[#f7f6ec] text-xs tracking-wider hover:text-[#c9a050]">COLLECTIONS</Link>
            </div>
            
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Image src={settings?.logo_main || "/logo.png"} alt={settings?.artist_name || "Logo"} width={320} height={100} className="h-16 md:h-20 w-auto object-contain" />
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/boutique" className="text-[#c9a050] text-xs tracking-wider font-medium">BOUTIQUE</Link>
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
              <Link href="/galerie" onClick={() => setMenuOpen(false)} className="block text-[#f7f6ec] text-sm">COLLECTIONS</Link>
              <Link href="/boutique" onClick={() => setMenuOpen(false)} className="block text-[#c9a050] text-sm font-medium">BOUTIQUE</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="block text-[#f7f6ec] text-sm">CONTACTS</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src={settings.header_boutique || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&q=80"}
            alt="Boutique"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-7xl font-['Cormorant_Garamond'] text-white mb-4">
            Boutique
          </h1>
          <p className="text-white/80 font-['Cormorant_Garamond'] text-lg">
            Maison / <span className="text-[#c9a050]">Boutique</span>
          </p>
        </div>
      </section>

      {/* Shop Section */}
      <section className="py-12 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <div className="flex-1">
              {/* Controls Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  {/* View Mode Icons */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'text-[#13130d]' : 'text-[#a09a92]'}`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="7" height="7" rx="1"/>
                        <rect x="14" y="3" width="7" height="7" rx="1"/>
                        <rect x="3" y="14" width="7" height="7" rx="1"/>
                        <rect x="14" y="14" width="7" height="7" rx="1"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'text-[#13130d]' : 'text-[#a09a92]'}`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="4" rx="1"/>
                        <rect x="3" y="10" width="18" height="4" rx="1"/>
                        <rect x="3" y="16" width="18" height="4" rx="1"/>
                      </svg>
                    </button>
                  </div>
                  <span className="text-[#6b6963] text-sm">
                    Affichage des résultats {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredPaintings.length)} sur {filteredPaintings.length}
                  </span>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-[#e8e7dd] text-[#13130d] px-6 py-3 pr-12 text-sm focus:border-[#c9a050] focus:outline-none cursor-pointer min-w-[250px]"
                  >
                    <option value="date">Trier par date la plus récente</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="name">Nom</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6963] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Products Grid */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-8' : 'space-y-6'}>
                {paginatedPaintings.map((painting) => {
                  const discount = getDiscount(painting.original_price, painting.price)
                  
                  return (
                    <Link 
                      key={painting.id}
                      href={`/checkout/${painting.id}`}
                      className={`group block ${viewMode === 'list' ? 'flex gap-6' : ''}`}
                    >
                      {/* Image Container */}
                      <div className={`relative bg-[#e8e7dd]/50 ${viewMode === 'list' ? 'w-48 h-48 flex-shrink-0' : 'aspect-square'} overflow-hidden`}>
                        {painting.image_url ? (
                          <Image
                            src={painting.image_url}
                            alt={painting.title}
                            fill
                            className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#a09a92]">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        
                        {/* Discount Badge */}
                        {discount && (
                          <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#c9a050] flex items-center justify-center">
                            <span className="text-white text-xs font-medium">-{discount}%</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className={`${viewMode === 'list' ? 'flex-1 py-4' : 'pt-6 text-center'}`}>
                        {/* Categories */}
                        <p className="text-xs text-[#a09a92] tracking-wider mb-2">
                          {painting.category ? painting.category.toUpperCase() : 'ART'}
                        </p>
                        
                        {/* Title */}
                        <h3 className="text-xl font-['Cormorant_Garamond'] text-[#13130d] mb-2 group-hover:text-[#c9a050] transition-colors">
                          {painting.title}
                        </h3>
                        
                        {/* Price */}
                        <div className="flex items-center justify-center gap-3">
                          {painting.original_price && painting.original_price > (painting.price || 0) && (
                            <span className="text-[#a09a92] line-through">
                              {painting.original_price.toLocaleString('fr-FR')} €
                            </span>
                          )}
                          <span className="text-[#c9a050] text-lg font-medium">
                            {painting.price?.toLocaleString('fr-FR')} €
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-[#e8e7dd]">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 flex items-center justify-center text-sm transition-colors ${
                        currentPage === page
                          ? 'text-[#c9a050] font-medium'
                          : 'text-[#13130d] hover:text-[#c9a050]'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  {currentPage < totalPages && (
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="w-10 h-10 flex items-center justify-center border border-[#e8e7dd] text-[#13130d] hover:border-[#c9a050] hover:text-[#c9a050] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 space-y-8">
              
              {/* Chariot */}
              <div className="bg-white p-6">
                <h3 className="text-2xl font-['Cormorant_Garamond'] text-[#13130d] mb-4">Chariot</h3>
                <p className="text-[#6b6963] text-sm">Aucun produit dans le panier.</p>
              </div>

              {/* Recherche */}
              <div className="bg-white p-6">
                <h3 className="text-2xl font-['Cormorant_Garamond'] text-[#13130d] mb-4">Recherche</h3>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Recherche de pro..."
                    className="w-full px-4 py-3 pr-12 bg-[#f7f6ec] border-0 text-[#13130d] placeholder-[#a09a92] focus:outline-none focus:ring-1 focus:ring-[#c9a050]"
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a09a92]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Filtre Prix */}
              <div className="bg-white p-6">
                <h3 className="text-2xl font-['Cormorant_Garamond'] text-[#13130d] mb-6">Filtre</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-[#c9a050]"
                  />
                  <p className="text-sm text-[#6b6963]">
                    Prix : {priceRange[0]} € à {priceRange[1]} €
                  </p>
                  <button 
                    onClick={() => {}}
                    className="w-full py-3 bg-[#c9a050] text-white text-sm tracking-wider hover:bg-[#b8923f] transition-colors"
                  >
                    FILTRER
                  </button>
                </div>
              </div>

              {/* Catégories */}
              <div className="bg-white p-6">
                <h3 className="text-2xl font-['Cormorant_Garamond'] text-[#13130d] mb-4">Catégories</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex items-center gap-3 text-sm ${!selectedCategory ? 'text-[#c9a050]' : 'text-[#6b6963] hover:text-[#13130d]'}`}
                  >
                    <span className="w-4 h-px bg-current" />
                    TOUS
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center gap-3 text-sm ${selectedCategory === cat ? 'text-[#c9a050]' : 'text-[#6b6963] hover:text-[#13130d]'}`}
                    >
                      <span className="w-4 h-px bg-current" />
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Étiquettes */}
              {tags.length > 0 && (
                <div className="bg-white p-6">
                  <h3 className="text-2xl font-['Cormorant_Garamond'] text-[#13130d] mb-4">Étiquettes</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        className="px-4 py-2 border border-[#e8e7dd] text-[#6b6963] text-xs hover:border-[#c9a050] hover:text-[#c9a050] transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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

      {/* Scroll to top */}
      {scrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-white border border-[#e8e7dd] text-[#13130d] flex items-center justify-center hover:border-[#c9a050] hover:text-[#c9a050] transition-colors z-40"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </main>
  )
}
