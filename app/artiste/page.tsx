'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface ArtistSection {
  id: string
  section_key: string
  section_order: number
  is_visible: boolean
  title: string | null
  subtitle: string | null
  description: string | null
  button_text: string | null
  button_link: string | null
  image_url: string | null
  background_color: string
  text_color: string
  accent_color: string
  custom_data?: any
}

interface Settings {
  artist_name: string
  artist_title: string
  hero_image: string
  contact_email: string
  footer_phone?: string
  footer_address?: string
}

export default function ArtistePage() {
  const [sections, setSections] = useState<ArtistSection[]>([])
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  const getSection = (key: string) => sections.find(s => s.section_key === key && s.is_visible)

  useEffect(() => {
    async function fetchData() {
      const [sectionsRes, settingsRes] = await Promise.all([
        supabase.from('page_sections').select('*').eq('page_name', 'artiste').order('section_order'),
        supabase.from('settings').select('*').single()
      ])
      
      if (sectionsRes.data) setSections(sectionsRes.data)
      if (settingsRes.data) setSettings(settingsRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f6ec] flex items-center justify-center">
        <div className="text-[#c9a050] text-xl font-['Cormorant_Garamond']">Chargement...</div>
      </main>
    )
  }

  const heroSection = getSection('hero')
  const bioSection = getSection('bio')
  const parcoursSection = getSection('parcours')
  const atelierSection = getSection('atelier')
  const exposSection = getSection('expositions')
  const temoignagesSection = getSection('temoignages')

  return (
    <main className="min-h-screen bg-[#f7f6ec]">
      <Header 
        currentPage="artiste"
        backgroundImage={heroSection?.image_url || settings?.hero_image || "/hero.jpg"}
        title={heroSection?.title || "L'artiste"}
        breadcrumb="L'artiste"
      />

      {/* Section Bio principale */}
      {bioSection && (
        <section 
          className="py-20 md:py-32"
          style={{ backgroundColor: bioSection.background_color || '#f7f6ec' }}
        >
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              {/* Image */}
              <div className="relative">
                {bioSection.image_url && (
                  <div 
                    className="relative overflow-hidden"
                    style={{
                      aspectRatio: bioSection.custom_data?.image_ratio || '3/4',
                    }}
                  >
                    <Image
                      src={bioSection.image_url}
                      alt={settings?.artist_name || "L'artiste"}
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: `${bioSection.custom_data?.image_pos_x || 50}% ${bioSection.custom_data?.image_pos_y || 50}%`,
                        transform: `scale(${(bioSection.custom_data?.image_scale || 100) / 100})`,
                      }}
                    />
                  </div>
                )}
                {/* Cadre décoratif */}
                {bioSection.custom_data?.show_frame && (
                  <div 
                    className="absolute -top-4 -left-4 w-full h-full border-2 -z-10"
                    style={{ borderColor: bioSection.accent_color || '#c9a050' }}
                  />
                )}
              </div>

              {/* Texte */}
              <div>
                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-['Cormorant_Garamond'] mb-6"
                  style={{ color: bioSection.text_color || '#13130d' }}
                >
                  {bioSection.title || settings?.artist_name}
                </h2>
                {bioSection.subtitle && (
                  <p 
                    className="text-xl font-['Cormorant_Garamond'] italic mb-8"
                    style={{ color: bioSection.accent_color || '#c9a050' }}
                  >
                    {bioSection.subtitle}
                  </p>
                )}
                {bioSection.description && (
                  <div 
                    className="prose prose-lg max-w-none rich-content"
                    style={{ color: `${bioSection.text_color || '#13130d'}cc` }}
                    dangerouslySetInnerHTML={{ __html: bioSection.description }}
                  />
                )}
                {bioSection.button_text && (
                  <Link 
                    href={bioSection.button_link || '/contact'}
                    className="inline-block mt-8 px-8 py-4 text-sm tracking-wider transition-colors hover:opacity-80"
                    style={{ 
                      backgroundColor: bioSection.accent_color || '#c9a050', 
                      color: '#fff' 
                    }}
                  >
                    {bioSection.button_text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section Parcours */}
      {parcoursSection && (
        <section 
          className="py-20 md:py-32"
          style={{ backgroundColor: parcoursSection.background_color || '#13130d' }}
        >
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              {/* Texte */}
              <div className="order-2 md:order-1">
                {parcoursSection.subtitle && (
                  <p 
                    className="text-xs tracking-[0.3em] uppercase mb-4"
                    style={{ color: parcoursSection.accent_color || '#c9a050' }}
                  >
                    {parcoursSection.subtitle}
                  </p>
                )}
                <h2 
                  className="text-4xl md:text-5xl font-['Cormorant_Garamond'] mb-8"
                  style={{ color: parcoursSection.text_color || '#f7f6ec' }}
                >
                  {parcoursSection.title || 'Mon parcours'}
                </h2>
                {parcoursSection.description && (
                  <div 
                    className="prose prose-lg max-w-none rich-content prose-invert"
                    style={{ color: `${parcoursSection.text_color || '#f7f6ec'}cc` }}
                    dangerouslySetInnerHTML={{ __html: parcoursSection.description }}
                  />
                )}
                {parcoursSection.button_text && (
                  <Link 
                    href={parcoursSection.button_link || '/galerie'}
                    className="inline-flex items-center gap-4 mt-8 text-sm tracking-wider hover:opacity-70 transition-colors"
                    style={{ color: parcoursSection.accent_color || '#c9a050' }}
                  >
                    {parcoursSection.button_text}
                    <svg className="w-6 h-[1px] bg-current" />
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                )}
              </div>

              {/* Image */}
              <div className="order-1 md:order-2">
                {parcoursSection.image_url && (
                  <div 
                    className="relative overflow-hidden"
                    style={{
                      aspectRatio: parcoursSection.custom_data?.image_ratio || '4/3',
                    }}
                  >
                    <Image
                      src={parcoursSection.image_url}
                      alt={parcoursSection.title || 'Parcours'}
                      fill
                      className="object-cover"
                      style={{
                        objectPosition: `${parcoursSection.custom_data?.image_pos_x || 50}% ${parcoursSection.custom_data?.image_pos_y || 50}%`,
                        transform: `scale(${(parcoursSection.custom_data?.image_scale || 100) / 100})`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section Atelier / Vidéo */}
      {atelierSection && (
        <section 
          className="py-20 md:py-32"
          style={{ backgroundColor: atelierSection.background_color || '#f7f6ec' }}
        >
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-12">
              {atelierSection.subtitle && (
                <p 
                  className="text-xs tracking-[0.3em] uppercase mb-4"
                  style={{ color: atelierSection.accent_color || '#c9a050' }}
                >
                  {atelierSection.subtitle}
                </p>
              )}
              <h2 
                className="text-4xl md:text-5xl font-['Cormorant_Garamond'] mb-4"
                style={{ color: atelierSection.text_color || '#13130d' }}
              >
                {atelierSection.title || "L'atelier"}
              </h2>
              {atelierSection.description && (
                <p 
                  className="max-w-2xl mx-auto"
                  style={{ color: `${atelierSection.text_color || '#13130d'}99` }}
                >
                  {atelierSection.description}
                </p>
              )}
            </div>

            {/* Vidéo ou Image */}
            <div className="relative aspect-video max-w-4xl mx-auto overflow-hidden">
              {atelierSection.custom_data?.video_url ? (
                <iframe
                  src={atelierSection.custom_data.video_url}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : atelierSection.image_url ? (
                <>
                  <Image
                    src={atelierSection.image_url}
                    alt={atelierSection.title || "L'atelier"}
                    fill
                    className="object-cover"
                    style={{
                      objectPosition: `${atelierSection.custom_data?.image_pos_x || 50}% ${atelierSection.custom_data?.image_pos_y || 50}%`,
                      transform: `scale(${(atelierSection.custom_data?.image_scale || 100) / 100})`,
                    }}
                  />
                  {/* Bouton play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: atelierSection.accent_color || '#c9a050' }}
                    >
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {atelierSection.button_text && (
              <div className="text-center mt-10">
                <Link 
                  href={atelierSection.button_link || '/galerie'}
                  className="inline-block px-10 py-4 text-sm tracking-wider transition-colors hover:opacity-80"
                  style={{ 
                    backgroundColor: atelierSection.accent_color || '#c9a050', 
                    color: '#fff' 
                  }}
                >
                  {atelierSection.button_text}
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section Expositions */}
      {exposSection && (
        <section 
          className="py-20 md:py-32"
          style={{ backgroundColor: exposSection.background_color || '#13130d' }}
        >
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              {exposSection.image_url && (
                <div 
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: exposSection.custom_data?.image_ratio || '4/3',
                  }}
                >
                  <Image
                    src={exposSection.image_url}
                    alt={exposSection.title || 'Expositions'}
                    fill
                    className="object-cover"
                    style={{
                      objectPosition: `${exposSection.custom_data?.image_pos_x || 50}% ${exposSection.custom_data?.image_pos_y || 50}%`,
                      transform: `scale(${(exposSection.custom_data?.image_scale || 100) / 100})`,
                    }}
                  />
                </div>
              )}

              {/* Texte */}
              <div>
                {exposSection.subtitle && (
                  <p 
                    className="text-xs tracking-[0.3em] uppercase mb-4"
                    style={{ color: exposSection.accent_color || '#c9a050' }}
                  >
                    {exposSection.subtitle}
                  </p>
                )}
                <h2 
                  className="text-4xl md:text-5xl font-['Cormorant_Garamond'] mb-6"
                  style={{ color: exposSection.text_color || '#f7f6ec' }}
                >
                  {exposSection.title || 'Expositions'}
                </h2>
                {exposSection.description && (
                  <p 
                    className="mb-8"
                    style={{ color: `${exposSection.text_color || '#f7f6ec'}cc` }}
                  >
                    {exposSection.description}
                  </p>
                )}
                {exposSection.button_text && (
                  <Link 
                    href={exposSection.button_link || '/expositions'}
                    className="inline-block px-8 py-4 text-sm tracking-wider border transition-colors hover:opacity-80"
                    style={{ 
                      borderColor: exposSection.accent_color || '#c9a050',
                      color: exposSection.accent_color || '#c9a050'
                    }}
                  >
                    {exposSection.button_text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section Témoignages */}
      {temoignagesSection && temoignagesSection.custom_data?.testimonials?.length > 0 && (
        <section 
          className="py-20 md:py-32"
          style={{ backgroundColor: temoignagesSection.background_color || '#f7f6ec' }}
        >
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-16">
              {temoignagesSection.subtitle && (
                <p 
                  className="text-xs tracking-[0.3em] uppercase mb-4"
                  style={{ color: temoignagesSection.accent_color || '#c9a050' }}
                >
                  {temoignagesSection.subtitle}
                </p>
              )}
              <h2 
                className="text-4xl md:text-5xl font-['Cormorant_Garamond']"
                style={{ color: temoignagesSection.text_color || '#13130d' }}
              >
                {temoignagesSection.title || 'Témoignages'}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {temoignagesSection.custom_data.testimonials.map((testimonial: any, index: number) => (
                <div 
                  key={index}
                  className="p-8 border"
                  style={{ 
                    borderColor: `${temoignagesSection.accent_color || '#c9a050'}30`,
                    backgroundColor: `${temoignagesSection.background_color || '#f7f6ec'}` 
                  }}
                >
                  {/* Étoiles */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className="w-4 h-4" 
                        fill={i < (testimonial.rating || 5) ? (temoignagesSection.accent_color || '#c9a050') : 'none'} 
                        stroke={temoignagesSection.accent_color || '#c9a050'} 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    ))}
                  </div>
                  
                  <h3 
                    className="font-medium mb-3"
                    style={{ color: temoignagesSection.text_color || '#13130d' }}
                  >
                    {testimonial.title}
                  </h3>
                  <p 
                    className="text-sm mb-4"
                    style={{ color: `${temoignagesSection.text_color || '#13130d'}99` }}
                  >
                    {testimonial.text}
                  </p>
                  <p 
                    className="text-sm font-medium"
                    style={{ color: temoignagesSection.accent_color || '#c9a050' }}
                  >
                    — {testimonial.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="py-20 bg-[#13130d]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] text-[#f7f6ec] mb-6">
            Découvrez mes œuvres
          </h2>
          <p className="text-[#f7f6ec]/80 mb-10">
            Explorez ma collection complète de peintures et trouvez l'œuvre qui vous correspond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/galerie"
              className="px-10 py-4 bg-[#c9a050] text-white text-sm tracking-wider hover:bg-[#b8923f] transition-colors"
            >
              VOIR LA GALERIE
            </Link>
            <Link 
              href="/contact"
              className="px-10 py-4 border border-[#c9a050] text-[#c9a050] text-sm tracking-wider hover:bg-[#c9a050] hover:text-white transition-colors"
            >
              ME CONTACTER
            </Link>
          </div>
        </div>
      </section>

      <Footer settings={settings || undefined} />
    </main>
  )
}
