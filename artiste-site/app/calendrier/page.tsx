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
  date: string
  year: number
  month: string
  day?: number
}

const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
]

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

export default function CalendrierPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [settings, setSettings] = useState<any>({})
  const [currentDate, setCurrentDate] = useState(new Date())
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [expoDropdown, setExpoDropdown] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'month' | 'day'>('month')
  const [searchQuery, setSearchQuery] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const [expoRes, settingsRes] = await Promise.all([
        supabase.from('exhibitions').select('*'),
        supabase.from('settings').select('*').single()
      ])
      
      if (expoRes.data) setExhibitions(expoRes.data)
      if (settingsRes.data) setSettings(settingsRes.data)
    }
    fetchData()

    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  
  let startDay = firstDay.getDay() - 1
  if (startDay < 0) startDay = 6
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const today = () => setCurrentDate(new Date())

  const getExhibitionsForDay = (day: number) => {
    return exhibitions.filter(expo => {
      const monthIndex = MONTHS.findIndex(m => expo.month?.toLowerCase().includes(m))
      return expo.year === year && monthIndex === month && expo.day === day
    })
  }

  const calendarDays: (number | null)[] = []
  for (let i = 0; i < startDay; i++) calendarDays.push(null)
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day)

  // Previous month days to show
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  const prevMonthDays: number[] = []
  for (let i = startDay - 1; i >= 0; i--) {
    prevMonthDays.push(prevMonthLastDay - i)
  }

  return (
    <main className="min-h-screen bg-white">
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
              <Link href="/expositions" className="text-[#c9a050] text-xs tracking-wider font-medium">EXPOSITIONS</Link>
              <Link href="/galerie" className="text-[#f7f6ec] text-xs tracking-wider hover:text-[#c9a050]">COLLECTIONS</Link>
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
              <Link href="/expositions" onClick={() => setMenuOpen(false)} className="block text-[#c9a050] text-sm font-medium">EXPOSITIONS</Link>
              <Link href="/galerie" onClick={() => setMenuOpen(false)} className="block text-[#f7f6ec] text-sm">COLLECTIONS</Link>
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
            src={settings.header_calendrier || "https://images.unsplash.com/photo-1594732832278-abd644401426?w=1920&q=80"}
            alt="Calendrier"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-['Cormorant_Garamond'] text-white mb-4">
            Événements de {MONTHS[month]} {year}
          </h1>
          <p className="text-white/80 font-['Cormorant_Garamond'] text-lg">
            Maison / <span className="text-[#c9a050]">Événements de {MONTHS[month]} {year}</span>
          </p>
        </div>
      </section>

      {/* Calendar Controls */}
      <section className="py-12 px-6 bg-[#13130d]">
        <div className="max-w-[1200px] mx-auto">
          {/* Search & Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Recherche d'événements"
              className="flex-1 px-6 py-4 bg-[#1a1a14] border border-[#13130d] text-white placeholder-[#6b6860] focus:border-[#c9a050] focus:outline-none"
            />
            <button className="px-8 py-4 bg-[#c9a050] text-[#13130d] text-sm tracking-wider font-medium hover:bg-[#b8923f] transition-colors">
              TROUVER DES ÉVÉNEMENTS
            </button>
            
            {/* View Mode Tabs */}
            <div className="flex border border-[#13130d] bg-[#1a1a14]">
              {(['list', 'month', 'day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-6 py-4 text-sm tracking-wider ${
                    viewMode === mode 
                      ? 'text-[#c9a050] border-b-2 border-[#c9a050]' 
                      : 'text-[#9a9588] hover:text-[#c9a050]'
                  }`}
                >
                  {mode === 'list' ? 'LISTE' : mode === 'month' ? 'MOIS' : 'JOUR'}
                </button>
              ))}
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={prevMonth} className="w-10 h-10 border border-[#13130d] text-[#9a9588] flex items-center justify-center hover:bg-[#c9a050] hover:text-[#13130d] hover:border-[#c9a050] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={nextMonth} className="w-10 h-10 bg-[#c9a050] text-[#13130d] flex items-center justify-center hover:bg-[#b8923f] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button onClick={today} className="px-4 py-2 border border-[#13130d] text-[#9a9588] text-sm hover:border-[#c9a050] hover:text-[#c9a050] transition-colors">
              Ce mois-ci
            </button>
            <h2 className="text-2xl md:text-3xl font-['Cormorant_Garamond'] text-[#c9a050] capitalize flex items-center gap-2">
              {MONTHS[month]} {year}
              <svg className="w-4 h-4 text-[#6b6860]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </h2>
          </div>

          {/* Calendar Grid */}
          <div className="border border-[#13130d]">
            {/* Days header */}
            <div className="grid grid-cols-7 bg-[#1a1a14]">
              {DAYS.map(day => (
                <div key={day} className="p-4 text-center text-[#c9a050] font-['Cormorant_Garamond'] text-lg border-r border-[#13130d] last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar rows */}
            <div className="grid grid-cols-7">
              {/* Previous month days */}
              {prevMonthDays.map((day, index) => (
                <div key={`prev-${index}`} className="min-h-[120px] p-3 border-b border-r border-[#13130d] bg-[#13130d]/50">
                  <span className="text-[#4a4640] text-lg">{day}</span>
                </div>
              ))}
              
              {/* Current month days */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()
                const dayExpos = getExhibitionsForDay(day)
                
                return (
                  <div 
                    key={day}
                    className={`min-h-[120px] p-3 border-b border-r border-[#13130d] ${
                      isToday ? 'bg-[#1a1a14]' : 'bg-[#13130d] hover:bg-[#1a1a14]'
                    }`}
                  >
                    <span className={`text-lg ${isToday ? 'text-[#c9a050] font-bold' : 'text-[#e8e7dd]'}`}>
                      {day}
                    </span>
                    
                    {/* Events */}
                    <div className="mt-2 space-y-1">
                      {dayExpos.map(expo => (
                        <Link 
                          key={expo.id}
                          href={`/expositions/${expo.id}`}
                          className="block p-2 bg-[#c9a050] text-xs text-[#13130d] hover:bg-[#b8923f] transition-colors truncate font-medium"
                        >
                          {expo.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Subscribe Button */}
          <div className="text-center mt-12">
            <button className="px-10 py-4 bg-[#c9a050] text-[#13130d] text-sm tracking-wider font-medium hover:bg-[#b8923f] transition-colors flex items-center gap-3 mx-auto">
              S'ABONNER AU CALENDRIER
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
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
