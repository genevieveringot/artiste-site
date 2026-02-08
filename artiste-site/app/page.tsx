import Link from 'next/link'
import { ArrowRight, ArrowDown } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { Painting, Exhibition } from '@/types/database'
import { NewsletterForm } from '@/components/NewsletterForm'
import { ShopCard } from '@/components/ShopCard'
import { TimelineItem } from '@/components/TimelineItem'

async function getFeaturedPaintings(): Promise<Painting[]> {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase
    .from('paintings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)
  return data || []
}

async function getExhibitions(): Promise<Exhibition[]> {
  if (!isSupabaseConfigured) return []
  const { data } = await supabase
    .from('exhibitions')
    .select('*')
    .order('start_date', { ascending: false })
    .limit(4)
  return data || []
}

export const revalidate = 60

export default async function HomePage() {
  const [paintings, exhibitions] = await Promise.all([
    getFeaturedPaintings(),
    getExhibitions(),
  ])

  return (
    <>
      {/* ============================================
          HERO SECTION - Fullscreen with overlay
      ============================================ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-[#0a0a0a]/30 to-[#0a0a0a]" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <p className="text-[#c9a86c] text-sm md:text-base uppercase tracking-[0.3em] mb-6 animate-fade-in">
            Paysages et Scènes
          </p>
          
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-normal mb-8 animate-slide-up">
            Marie Dupont
          </h1>
          
          <p className="text-white/60 text-lg md:text-xl font-light max-w-xl mx-auto mb-12 animate-slide-up delay-200">
            L'art de capturer la lumière et l'émotion à travers la peinture impressionniste
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-300">
            <Link href="/gallery" className="btn btn-primary">
              Découvrir mes œuvres
            </Link>
            <Link href="/contact" className="btn btn-white">
              Me contacter
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown size={24} className="text-white/40" />
        </div>
      </section>

      {/* ============================================
          ABOUT SECTION - "I'm [Name] - [Profession]"
      ============================================ */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/5] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1000')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-[#0a0a0a]/20" />
              </div>
              {/* Decorative frame */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-[#c9a86c]/30 -z-10" />
            </div>

            {/* Content */}
            <div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-8">
                Je suis Marie Dupont
                <span className="block text-[#c9a86c] mt-2">Peintre impressionniste</span>
              </h2>
              
              <div className="w-16 h-px bg-[#c9a86c] mb-8" />
              
              <div className="space-y-6 text-[#888] font-light leading-relaxed">
                <p>
                  Ma nouvelle collection de peintures contient plus de 30 œuvres d'art 
                  dans le style impressionniste et est actuellement exposée dans la 
                  section moderne du musée.
                </p>
                <p>
                  Chaque toile est une invitation à explorer les profondeurs de l'âme, 
                  où les couleurs dansent avec les émotions et la lumière révèle 
                  l'invisible.
                </p>
              </div>

              <Link 
                href="/contact" 
                className="inline-flex items-center gap-3 mt-10 text-[#c9a86c] text-sm uppercase tracking-[0.15em] group"
              >
                En savoir plus
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          AWARDS/EXHIBITIONS TIMELINE
      ============================================ */}
      <section className="py-24 lg:py-32 bg-[#111]">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-24">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
              Mes Distinctions
            </h2>
            <p className="text-[#888] font-light max-w-2xl mx-auto">
              Certaines de mes peintures ont été récompensées par l'Académie des Arts 
              et exposées dans le monde entier.
            </p>
          </div>

          {/* Timeline */}
          <div className="max-w-4xl mx-auto">
            {exhibitions.length > 0 ? (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-[#2a2a2a] md:-translate-x-px" />
                
                <div className="space-y-12">
                  {exhibitions.map((exhibition, index) => (
                    <TimelineItem 
                      key={exhibition.id} 
                      exhibition={exhibition} 
                      index={index} 
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* Fallback content */
              <div className="relative">
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-[#2a2a2a] md:-translate-x-px" />
                
                <div className="space-y-12">
                  {[
                    { date: 'Fév 2024', title: 'Lumières de Provence', location: 'Galerie Moderne, Paris' },
                    { date: 'Sep 2023', title: 'Impressions Nocturnes', location: 'Haven Gallery, New York' },
                    { date: 'Juin 2022', title: 'Entre Terre et Ciel', location: 'Corey Helford Gallery, Los Angeles' },
                    { date: 'Oct 2021', title: 'Reflets d\'Automne', location: 'Galerie Nationale, Lyon' },
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className={`relative flex flex-col md:flex-row gap-8 ${
                        index % 2 === 0 ? '' : 'md:flex-row-reverse'
                      }`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-[#c9a86c] rounded-full -translate-x-1 md:-translate-x-1.5 mt-2" />
                      
                      {/* Date */}
                      <div className={`md:w-1/2 pl-8 md:pl-0 ${
                        index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'
                      }`}>
                        <span className="text-[#c9a86c] text-sm uppercase tracking-[0.2em]">
                          {item.date}
                        </span>
                      </div>
                      
                      {/* Content */}
                      <div className={`md:w-1/2 pl-8 md:pl-0 ${
                        index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'
                      }`}>
                        <h3 className="font-serif text-2xl mb-2">{item.title}</h3>
                        <p className="text-[#888] font-light">{item.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-16">
            <Link href="/exhibitions" className="btn btn-outline">
              Voir toutes les expositions
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          SHOP / GALLERY SECTION
      ============================================ */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a]">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="max-w-3xl mb-16">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
              Boutique
            </h2>
            <p className="text-[#888] font-light text-lg">
              Achetez des œuvres originales directement sur ce site et soutenez 
              mon travail. Paiement sécurisé et garantie complète.
            </p>
          </div>

          {/* Products Grid */}
          {paintings.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {paintings.map((painting, index) => (
                <ShopCard key={painting.id} painting={painting} index={index} />
              ))}
            </div>
          ) : (
            /* Fallback */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-[3/4] bg-[#1a1a1a] mb-4 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl">Œuvre {i}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-[#888] line-through text-sm">1 500 €</span>
                      <span className="text-[#c9a86c]">1 200 €</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link href="/gallery" className="btn btn-outline">
              Voir toute la galerie
              <ArrowRight size={18} className="ml-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          NEWSLETTER SECTION
      ============================================ */}
      <section className="py-24 lg:py-32 bg-[#111] border-t border-[#1a1a1a]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Newsletter
            </h2>
            <p className="text-[#888] font-light mb-10">
              Recevez des informations sur mes expositions, événements et nouvelles œuvres.
            </p>
            
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  )
}
