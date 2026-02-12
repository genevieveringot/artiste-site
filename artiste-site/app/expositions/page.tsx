'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import Footer from '@/components/Footer'

interface Exhibition {
  id: string
  title: string
  location: string
  start_date: string
  end_date: string | null
  description: string | null
  image_url: string | null
  is_upcoming: boolean
}

const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
]

const DAYS = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM']

export default function ExpositionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [filteredExhibitions, setFilteredExhibitions] = useState<Exhibition[]>([])
  const [settings, setSettings] = useState<any>({})
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'month' | 'day'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('upcoming') // upcoming, past, all
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const [expoRes, settingsRes, logoRes] = await Promise.all([
        supabase.from('exhibitions').select('*').order('start_date', { ascending: true }),
        supabase.from('settings').select('*').single(),
        supabase.from('page_sections').select('custom_data').eq('page_name', 'global').eq('section_key', 'logo').single()
      ])
      const logoData = logoRes.data?.custom_data || {}
      
      if (expoRes.data) {
        setExhibitions(expoRes.data)
        // Filter upcoming by default
        const upcoming = expoRes.data.filter(e => e.is_upcoming || new Date(e.start_date) >= new Date())
        setFilteredExhibitions(upcoming)
      }
      if (settingsRes.data) setSettings({ ...settingsRes.data, ...logoData })
    }
    fetchData()

    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Group exhibitions by month
  const groupedExhibitions = filteredExhibitions.reduce((acc, expo) => {
    const date = new Date(expo.start_date)
    const key = `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
    if (!acc[key]) acc[key] = []
    acc[key].push(expo)
    return acc
  }, {} as Record<string, Exhibition[]>)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
  }

  const getDayInfo = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      dayName: DAYS[date.getDay()],
      dayNum: date.getDate()
    }
  }

  const handleFilter = (type: string) => {
    setFilterType(type)
    if (type === 'upcoming') {
      setFilteredExhibitions(exhibitions.filter(e => e.is_upcoming || new Date(e.start_date) >= new Date()))
    } else if (type === 'past') {
      setFilteredExhibitions(exhibitions.filter(e => !e.is_upcoming && new Date(e.start_date) < new Date()))
    } else {
      setFilteredExhibitions(exhibitions)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f6ec]">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#13130d]">
        {!scrolled && (
          <div className="bg-[#13130d] text-[#f7f6ec]/80 text-xs">
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
              <Link href="/expositions" className="text-[#c9a050] text-xs tracking-wider font-medium">EXPOSITIONS</Link>
              <Link href="/galerie" className="text-[#f7f6ec] text-xs tracking-wider hover:text-[#c9a050]">COLLECTIONS</Link>
            </div>
            
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Image src={settings?.logo_main || "/logo.png"} alt={settings?.artist_name || "Logo"} width={320} height={100} className="h-16 md:h-20 w-auto object-contain" />
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

        {menuOpen && (
          <div className="md:hidden bg-[#13130d] border-t border-[#f7f6ec]/10">
            <div className="px-6 py-4 space-y-4">
              <Link href="/" onClick={() => setMenuOpen(false)} className="block text-[#f7f6ec] text-sm">MAISON</Link>
              <Link href="/expositions" onClick={() => setMenuOpen(false)} className="block text-[#c9a050] text-sm font-medium">EXPOSITIONS</Link>
              <Link href="/galerie" onClick={() => setMenuOpen(false)} className="block text-[#f7f6ec] text-sm">COLLECTIONS</Link>
              <Link href="/boutique" onClick={() => setMenuOpen(false)} className="block text-[#f7f6ec] text-sm">BOUTIQUE</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="block text-[#f7f6ec] text-sm">CONTACTS</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src={settings.header_expositions || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1920&q=80"}
            alt="Événements à venir"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-['Cormorant_Garamond'] text-[#f7f6ec] mb-4">
            Événements à venir
          </h1>
          <p className="text-[#f7f6ec]/80 font-['Cormorant_Garamond'] text-lg">
            Maison / <span className="text-[#c9a050]">Événements à venir</span>
          </p>
        </div>
      </section>

      {/* Search & Controls */}
      <section className="py-12 px-6">
        <div className="max-w-[1200px] mx-auto">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Recherche d'événements"
              className="flex-1 px-6 py-4 bg-white border border-[#e8e7dd] text-[#13130d] placeholder-[#9a9588] focus:border-[#c9a050] focus:outline-none"
            />
            <button className="px-8 py-4 bg-[#c9a050] text-[#f7f6ec] text-sm tracking-wider font-medium hover:bg-[#b8923f] transition-colors">
              TROUVER DES ÉVÉNEMENTS
            </button>
            
            {/* View Mode Tabs */}
            <div className="flex border border-[#e8e7dd] bg-white">
              {(['list', 'month', 'day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-6 py-4 text-sm tracking-wider transition-colors ${
                    viewMode === mode 
                      ? 'text-[#13130d] border-b-2 border-[#13130d]' 
                      : 'text-[#9a9588] hover:text-[#13130d]'
                  }`}
                >
                  {mode === 'list' ? 'LISTE' : mode === 'month' ? 'MOIS' : 'JOUR'}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 mb-12">
            <button 
              onClick={() => handleFilter('past')}
              className="w-10 h-10 border border-[#e8e7dd] text-[#9a9588] flex items-center justify-center hover:border-[#c9a050] hover:text-[#c9a050] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => handleFilter('upcoming')}
              className="w-10 h-10 bg-[#c9a050] text-[#f7f6ec] flex items-center justify-center hover:bg-[#b8923f] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button 
              onClick={() => handleFilter('upcoming')}
              className="px-4 py-2 border border-[#e8e7dd] text-[#9a9588] text-sm hover:border-[#c9a050] hover:text-[#c9a050] transition-colors"
            >
              Aujourd'hui
            </button>
            <div className="relative">
              <button className="flex items-center gap-2 text-3xl md:text-4xl font-['Cormorant_Garamond'] text-[#13130d]">
                Prochain
                <svg className="w-5 h-5 text-[#9a9588]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Exhibitions List */}
          <div className="space-y-16">
            {Object.entries(groupedExhibitions).map(([monthYear, expos]) => (
              <div key={monthYear}>
                {/* Month Header */}
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-lg font-medium text-[#13130d] capitalize">{monthYear}</h2>
                  <div className="flex-1 h-px bg-[#e8e7dd]" />
                </div>

                {/* Exhibitions */}
                <div className="space-y-12">
                  {expos.map((expo) => {
                    const dayInfo = getDayInfo(expo.start_date)
                    
                    return (
                      <div key={expo.id} className="flex gap-8">
                        {/* Date Column */}
                        <div className="w-16 flex-shrink-0 text-center">
                          <p className="text-xs text-[#9a9588] tracking-wider">{dayInfo.dayName}</p>
                          <p className="text-4xl font-['Cormorant_Garamond'] text-[#13130d]">{dayInfo.dayNum}</p>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <p className="text-sm text-[#9a9588] mb-2">
                            {formatDate(expo.start_date)}
                            {expo.end_date && ` - ${formatDate(expo.end_date)}`}
                          </p>
                          <h3 className="text-2xl md:text-3xl font-['Cormorant_Garamond'] text-[#13130d] mb-3 hover:text-[#c9a050] transition-colors cursor-pointer">
                            {expo.title}
                          </h3>
                          <p className="text-[#13130d] mb-4">
                            <span className="font-medium">{expo.location.split(',')[0]},</span>
                            <span className="text-[#9a9588]"> {expo.location.split(',').slice(1).join(',')}</span>
                          </p>
                          {expo.description && (
                            <p className="text-[#6b6860] leading-relaxed max-w-2xl">
                              {expo.description}
                            </p>
                          )}
                        </div>

                        {/* Image */}
                        {expo.image_url && (
                          <div className="hidden md:block w-64 h-48 flex-shrink-0 relative">
                            <Image
                              src={expo.image_url}
                              alt={expo.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {filteredExhibitions.length === 0 && (
              <div className="text-center py-16 text-[#9a9588]">
                <p className="text-lg">Aucun événement trouvé</p>
              </div>
            )}
          </div>

          {/* Navigation Bottom */}
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-[#e8e7dd]">
            <button 
              onClick={() => handleFilter('past')}
              className="flex items-center gap-4 text-[#13130d] hover:text-[#c9a050] transition-colors"
            >
              <div className="w-12 h-12 border border-[#e8e7dd] flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-xs tracking-wider font-medium">ÉVÉNEMENTS PRÉCÉDENTS</span>
            </button>

            <button 
              onClick={() => handleFilter('upcoming')}
              className="flex items-center gap-4 text-[#13130d] hover:text-[#c9a050] transition-colors"
            >
              <span className="text-xs tracking-wider font-medium">PROCHAINS ÉVÉNEMENTS</span>
              <div className="w-12 h-12 border border-[#e8e7dd] flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Subscribe Button */}
          <div className="flex justify-center mt-12">
            <button className="px-12 py-4 bg-[#c9a050] text-[#f7f6ec] text-sm tracking-wider font-medium hover:bg-[#b8923f] transition-colors flex items-center gap-3">
              S'ABONNER AU CALENDRIER
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <Footer settings={settings} />

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
