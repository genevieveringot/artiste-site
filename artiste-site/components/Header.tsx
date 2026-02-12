'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useI18n } from '@/lib/i18n/context'
import { useAuth } from '@/lib/auth/context'

interface HeaderProps {
  currentPage?: string
  backgroundImage: string
  title: string
  breadcrumb?: string
}

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

export default function Header({ currentPage, backgroundImage, title, breadcrumb }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [langDropdown, setLangDropdown] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  
  const { locale, setLocale, t } = useI18n()
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fermer dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangDropdown(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#13130d]">
        {/* Top bar - only when not scrolled */}
        {!scrolled && (
          <div className="bg-[#13130d] text-[#f7f6ec]/80 text-xs">
            <div className="max-w-[1600px] mx-auto px-6 py-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                  <path strokeLinecap="round" strokeWidth="1.5" d="M12 6v6l4 2"/>
                </svg>
                <span className="hidden sm:inline">{t.header.openHours}</span>
                <span className="sm:hidden">{t.header.openHoursShort}</span>
              </div>
              <span className="hidden md:block">{t.header.location}</span>
            </div>
          </div>
        )}

        <div className="bg-[#13130d]">
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
            {/* Left nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="/" 
                className={`text-xs tracking-wider transition-colors ${
                  currentPage === 'accueil' 
                    ? 'text-[#c9a050] font-medium' 
                    : 'text-[#f7f6ec] hover:text-[#c9a050]'
                }`}
              >
                {t.nav.home}
              </Link>
              
              <Link 
                href="/expositions" 
                className={`text-xs tracking-wider transition-colors ${
                  currentPage === 'expositions'
                    ? 'text-[#c9a050] font-medium'
                    : 'text-[#f7f6ec] hover:text-[#c9a050]'
                }`}
              >
                {t.nav.exhibitions}
              </Link>

              <Link 
                href="/galerie" 
                className={`text-xs tracking-wider transition-colors ${
                  currentPage === 'galerie' 
                    ? 'text-[#c9a050] font-medium' 
                    : 'text-[#f7f6ec] hover:text-[#c9a050]'
                }`}
              >
                {t.nav.collections}
              </Link>
            </div>
            
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Image src="/logo.png" alt="J. Wattebled" width={280} height={80} className="h-14 md:h-16 w-auto object-contain" />
            </Link>
            
            {/* Right nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/boutique" 
                className={`text-xs tracking-wider transition-colors ${
                  currentPage === 'boutique' 
                    ? 'text-[#c9a050] font-medium' 
                    : 'text-[#f7f6ec] hover:text-[#c9a050]'
                }`}
              >
                {t.nav.shop}
              </Link>
              <Link 
                href="/contact" 
                className={`text-xs tracking-wider transition-colors ${
                  currentPage === 'contact' 
                    ? 'text-[#c9a050] font-medium' 
                    : 'text-[#f7f6ec] hover:text-[#c9a050]'
                }`}
              >
                {t.nav.contact}
              </Link>

              {/* Séparateur */}
              <div className="w-px h-5 bg-[#f7f6ec]/20" />

              {/* Language selector */}
              <div ref={langRef} className="relative">
                <button 
                  onClick={() => setLangDropdown(!langDropdown)}
                  className="flex items-center gap-1.5 text-[#f7f6ec] hover:text-[#c9a050] transition-colors"
                >
                  {locale === 'fr' ? <FlagFR /> : <FlagEN />}
                  <svg className={`w-3 h-3 transition-transform ${langDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {langDropdown && (
                  <div className="absolute top-full right-0 mt-2 bg-[#13130d] border border-[#f7f6ec]/10 shadow-lg min-w-[120px]">
                    <button
                      onClick={() => { setLocale('fr'); setLangDropdown(false) }}
                      className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-[#f7f6ec]/5 ${locale === 'fr' ? 'text-[#c9a050]' : 'text-[#f7f6ec]'}`}
                    >
                      <FlagFR /> Français
                    </button>
                    <button
                      onClick={() => { setLocale('en'); setLangDropdown(false) }}
                      className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-[#f7f6ec]/5 ${locale === 'en' ? 'text-[#c9a050]' : 'text-[#f7f6ec]'}`}
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
                  className="text-[#f7f6ec] hover:text-[#c9a050] transition-colors"
                  title={t.nav.account}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </button>
                
                {userDropdown && (
                  <div className="absolute top-full right-0 mt-2 bg-[#13130d] border border-[#f7f6ec]/10 shadow-lg min-w-[160px]">
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-[#f7f6ec]/10">
                          <p className="text-xs text-[#f7f6ec]/60">Connecté</p>
                          <p className="text-sm text-[#f7f6ec] truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/compte"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-sm text-[#f7f6ec] hover:bg-[#f7f6ec]/5"
                        >
                          {t.nav.account}
                        </Link>
                        <button
                          onClick={() => { signOut(); setUserDropdown(false) }}
                          className="w-full text-left px-4 py-2 text-sm text-[#f7f6ec] hover:bg-[#f7f6ec]/5"
                        >
                          {t.nav.logout}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-sm text-[#f7f6ec] hover:bg-[#f7f6ec]/5"
                        >
                          {t.nav.login}
                        </Link>
                        <Link
                          href="/auth/register"
                          onClick={() => setUserDropdown(false)}
                          className="block px-4 py-2 text-sm text-[#c9a050] hover:bg-[#f7f6ec]/5"
                        >
                          {t.nav.register}
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link 
                href="/panier" 
                className="text-[#f7f6ec] hover:text-[#c9a050] transition-colors relative"
                title={t.nav.cart}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                {/* Badge panier - à connecter avec le state du panier */}
                {/* <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c9a050] text-[#13130d] text-[10px] rounded-full flex items-center justify-center">2</span> */}
              </Link>
            </div>

            {/* Mobile: icons + burger */}
            <div className="md:hidden ml-auto flex items-center gap-4">
              {/* Language mobile */}
              <button 
                onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
                className="text-[#f7f6ec]"
              >
                {locale === 'fr' ? <FlagFR /> : <FlagEN />}
              </button>

              {/* User mobile */}
              <Link href={user ? "/compte" : "/auth/login"} className="text-[#f7f6ec]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </Link>

              {/* Cart mobile */}
              <Link href="/panier" className="text-[#f7f6ec]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </Link>

              {/* Burger menu */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-[#f7f6ec]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#13130d] border-t border-[#f7f6ec]/10">
            <div className="px-6 py-4 space-y-4">
              <Link href="/" onClick={() => setMenuOpen(false)} className={`block text-sm ${currentPage === 'accueil' ? 'text-[#c9a050]' : 'text-[#f7f6ec]'}`}>{t.nav.home}</Link>
              <Link href="/expositions" onClick={() => setMenuOpen(false)} className={`block text-sm ${currentPage === 'expositions' ? 'text-[#c9a050]' : 'text-[#f7f6ec]'}`}>{t.nav.exhibitions}</Link>
              <Link href="/galerie" onClick={() => setMenuOpen(false)} className={`block text-sm ${currentPage === 'galerie' ? 'text-[#c9a050]' : 'text-[#f7f6ec]'}`}>{t.nav.collections}</Link>
              <Link href="/boutique" onClick={() => setMenuOpen(false)} className={`block text-sm ${currentPage === 'boutique' ? 'text-[#c9a050]' : 'text-[#f7f6ec]'}`}>{t.nav.shop}</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className={`block text-sm ${currentPage === 'contact' ? 'text-[#c9a050]' : 'text-[#f7f6ec]'}`}>{t.nav.contact}</Link>
              
              <div className="pt-4 border-t border-[#f7f6ec]/10">
                {user ? (
                  <>
                    <p className="text-xs text-[#f7f6ec]/60 mb-2">{user.email}</p>
                    <Link href="/compte" onClick={() => setMenuOpen(false)} className="block text-sm text-[#f7f6ec] mb-2">{t.nav.account}</Link>
                    <button onClick={() => { signOut(); setMenuOpen(false) }} className="text-sm text-[#f7f6ec]">{t.nav.logout}</button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="block text-sm text-[#f7f6ec] mb-2">{t.nav.login}</Link>
                    <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="block text-sm text-[#c9a050]">{t.nav.register}</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl md:text-6xl font-['Cormorant_Garamond'] text-[#f7f6ec] mb-4">{title}</h1>
          {breadcrumb && (
            <p className="text-[#f7f6ec]/80 font-['Cormorant_Garamond'] text-lg">
              {t.nav.home} / <span className="text-[#c9a050]">{breadcrumb}</span>
            </p>
          )}
        </div>
      </section>
    </>
  )
}
