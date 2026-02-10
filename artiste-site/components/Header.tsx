'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface HeaderProps {
  currentPage?: string
  backgroundImage: string
  title: string
  breadcrumb?: string
}

export default function Header({ currentPage, backgroundImage, title, breadcrumb }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expoDropdown, setExpoDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
                <span className="hidden sm:inline">L'ATELIER EST OUVERT DU LUNDI AU VENDREDI DE 9H À 18H</span>
                <span className="sm:hidden">LUN-VEN 9H-18H</span>
              </div>
              <span className="hidden md:block">Nord de la France</span>
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
                MAISON
              </Link>
              
              <Link 
                href="/expositions" 
                className={`text-xs tracking-wider transition-colors ${
                  currentPage === 'expositions'
                    ? 'text-[#c9a050] font-medium'
                    : 'text-[#f7f6ec] hover:text-[#c9a050]'
                }`}
              >
                EXPOSITIONS
              </Link>

              <Link 
                href="/galerie" 
                className={`text-xs tracking-wider transition-colors ${
                  currentPage === 'galerie' 
                    ? 'text-[#c9a050] font-medium' 
                    : 'text-[#f7f6ec] hover:text-[#c9a050]'
                }`}
              >
                COLLECTIONS
              </Link>
            </div>
            
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Image src="/logo.png" alt="J. Wattebled" width={200} height={60} className="h-10 md:h-12 w-auto object-contain" />
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="/boutique" 
                className={`text-xs tracking-wider transition-colors ${
                  currentPage === 'boutique' 
                    ? 'text-[#c9a050] font-medium' 
                    : 'text-[#f7f6ec] hover:text-[#c9a050]'
                }`}
              >
                BOUTIQUE
              </Link>
              <Link 
                href="/contact" 
                className={`text-xs tracking-wider transition-colors ${
                  currentPage === 'contact' 
                    ? 'text-[#c9a050] font-medium' 
                    : 'text-[#f7f6ec] hover:text-[#c9a050]'
                }`}
              >
                CONTACTS
              </Link>
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
          <div className="md:hidden bg-[#13130d] border-t border-[#f7f6ec]/10">
            <div className="px-6 py-4 space-y-4">
              <Link href="/" onClick={() => setMenuOpen(false)} className={`block text-sm ${currentPage === 'accueil' ? 'text-[#c9a050]' : 'text-[#f7f6ec]'}`}>MAISON</Link>
              <Link href="/expositions" onClick={() => setMenuOpen(false)} className={`block text-sm ${currentPage === 'expositions' ? 'text-[#c9a050]' : 'text-[#f7f6ec]'}`}>EXPOSITIONS</Link>
              <Link href="/galerie" onClick={() => setMenuOpen(false)} className={`block text-sm ${currentPage === 'galerie' ? 'text-[#c9a050]' : 'text-[#f7f6ec]'}`}>COLLECTIONS</Link>
              <Link href="/boutique" onClick={() => setMenuOpen(false)} className={`block text-sm ${currentPage === 'boutique' ? 'text-[#c9a050]' : 'text-[#f7f6ec]'}`}>BOUTIQUE</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className={`block text-sm ${currentPage === 'contact' ? 'text-[#c9a050]' : 'text-[#f7f6ec]'}`}>CONTACTS</Link>
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
              Maison / <span className="text-[#c9a050]">{breadcrumb}</span>
            </p>
          )}
        </div>
      </section>
    </>
  )
}
