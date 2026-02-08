import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Exhibition } from '@/types/database'
import { formatDateRange, isUpcoming } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Expositions | Artiste',
  description: 'Retrouvez toutes mes expositions passées et à venir. Art contemporain en France et à l\'international.',
}

async function getExhibitions(): Promise<{ upcoming: Exhibition[]; past: Exhibition[] }> {
  if (!isSupabaseConfigured) return { upcoming: [], past: [] }

  const { data, error } = await supabase
    .from('exhibitions')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) {
    console.error('Error fetching exhibitions:', error)
    return { upcoming: [], past: [] }
  }

  const now = new Date()
  const exhibitions = data || []

  return {
    upcoming: exhibitions.filter(e => new Date(e.start_date) > now),
    past: exhibitions.filter(e => new Date(e.start_date) <= now),
  }
}

export const revalidate = 60

export default async function ExhibitionsPage() {
  const { upcoming, past } = await getExhibitions()

  // Fallback data when Supabase not configured
  const fallbackPast = [
    { date: 'Fév 2024', title: 'Lumières de Provence', location: 'Galerie Moderne, Paris' },
    { date: 'Sep 2023', title: 'Impressions Nocturnes', location: 'Haven Gallery, New York' },
    { date: 'Juin 2022', title: 'Entre Terre et Ciel', location: 'Corey Helford Gallery, Los Angeles' },
    { date: 'Oct 2021', title: 'Reflets d\'Automne', location: 'Galerie Nationale, Lyon' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-[#c9a86c] text-sm uppercase tracking-[0.3em] mb-4">
            Événements
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6">
            Expositions
          </h1>
          <p className="text-[#888] font-light text-lg max-w-2xl mx-auto">
            Découvrez mes expositions passées et à venir à travers la France et le monde.
          </p>
        </div>
      </section>

      {/* Upcoming Exhibitions */}
      {upcoming.length > 0 && (
        <section className="container mx-auto px-6 lg:px-12 pb-16">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="font-serif text-3xl">À Venir</h2>
            <span className="px-3 py-1 bg-[#c9a86c]/20 text-[#c9a86c] text-sm">
              {upcoming.length}
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {upcoming.map((exhibition, index) => (
              <div 
                key={exhibition.id}
                className="group border border-[#c9a86c]/30 p-8 hover:border-[#c9a86c] transition-colors duration-500 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-6">
                  {exhibition.image_url && (
                    <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
                      <Image
                        src={exhibition.image_url}
                        alt={exhibition.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-serif text-2xl mb-3 group-hover:text-[#c9a86c] transition-colors duration-300">
                      {exhibition.title}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2 text-[#888]">
                        <MapPin size={14} className="text-[#c9a86c]" />
                        {exhibition.location}
                      </p>
                      <p className="flex items-center gap-2 text-[#888]">
                        <Calendar size={14} className="text-[#c9a86c]" />
                        {formatDateRange(exhibition.start_date, exhibition.end_date)}
                      </p>
                    </div>
                  </div>
                </div>
                {exhibition.description && (
                  <p className="text-[#555] font-light mt-6 line-clamp-2">
                    {exhibition.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Timeline - Past Exhibitions */}
      <section className="bg-[#111] py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <h2 className="font-serif text-3xl mb-16 text-center">Historique</h2>
          
          <div className="max-w-4xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-[#2a2a2a] md:-translate-x-px" />

            <div className="space-y-16">
              {past.length > 0 ? (
                past.map((exhibition, index) => {
                  const isEven = index % 2 === 0
                  const date = new Date(exhibition.start_date)
                  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
                  const shortDate = `${months[date.getMonth()]} ${date.getFullYear()}`

                  return (
                    <div 
                      key={exhibition.id}
                      className={`relative flex flex-col md:flex-row gap-8 animate-fade-in ${
                        isEven ? '' : 'md:flex-row-reverse'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-[#0a0a0a] border-2 border-[#c9a86c] rounded-full -translate-x-[6px] md:-translate-x-2 mt-1" />
                      
                      <div className={`md:w-1/2 pl-10 md:pl-0 ${
                        isEven ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'
                      }`}>
                        <span className="text-[#c9a86c] text-sm uppercase tracking-[0.2em]">
                          {shortDate}
                        </span>
                      </div>
                      
                      <div className={`md:w-1/2 pl-10 md:pl-0 ${
                        isEven ? 'md:pl-16' : 'md:pr-16 md:text-right'
                      }`}>
                        <h3 className="font-serif text-2xl mb-2 hover:text-[#c9a86c] transition-colors duration-300">
                          {exhibition.title}
                        </h3>
                        <p className="text-[#888] font-light flex items-center gap-2">
                          <MapPin size={14} className="text-[#c9a86c]" />
                          {exhibition.location}
                        </p>
                        {exhibition.description && (
                          <p className="text-[#555] text-sm font-light mt-3 line-clamp-2">
                            {exhibition.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                // Fallback timeline
                fallbackPast.map((item, index) => {
                  const isEven = index % 2 === 0
                  return (
                    <div 
                      key={index}
                      className={`relative flex flex-col md:flex-row gap-8 ${
                        isEven ? '' : 'md:flex-row-reverse'
                      }`}
                    >
                      <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-[#0a0a0a] border-2 border-[#c9a86c] rounded-full -translate-x-[6px] md:-translate-x-2 mt-1" />
                      
                      <div className={`md:w-1/2 pl-10 md:pl-0 ${
                        isEven ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'
                      }`}>
                        <span className="text-[#c9a86c] text-sm uppercase tracking-[0.2em]">
                          {item.date}
                        </span>
                      </div>
                      
                      <div className={`md:w-1/2 pl-10 md:pl-0 ${
                        isEven ? 'md:pl-16' : 'md:pr-16 md:text-right'
                      }`}>
                        <h3 className="font-serif text-2xl mb-2">{item.title}</h3>
                        <p className="text-[#888] font-light">{item.location}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-serif text-3xl md:text-4xl mb-6">
              Vous organisez une exposition ?
            </h3>
            <p className="text-[#888] font-light mb-10">
              Je suis toujours ouvert à de nouvelles collaborations avec des galeries
              et des espaces culturels.
            </p>
            <Link href="/contact" className="btn btn-outline">
              Me Contacter
              <ArrowRight size={18} className="ml-3" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
