import { Metadata } from 'next'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { PaintingCard } from '@/components/PaintingCard'
import { GalleryFilters } from './GalleryFilters'
import { Painting } from '@/types/database'
import { CATEGORIES } from '@/types/database'

export const metadata: Metadata = {
  title: 'Galerie | Artiste',
  description: 'Explorez la collection complète de tableaux. Peintures originales disponibles à la vente.',
}

interface GalleryPageProps {
  searchParams: { category?: string; available?: string }
}

async function getPaintings(category?: string, available?: string): Promise<Painting[]> {
  if (!isSupabaseConfigured) return []

  let query = supabase
    .from('paintings')
    .select('*')
    .order('created_at', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (available === 'true') {
    query = query.eq('available', true)
  } else if (available === 'false') {
    query = query.eq('available', false)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching paintings:', error)
    return []
  }

  return data || []
}

export const revalidate = 60

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const paintings = await getPaintings(searchParams.category, searchParams.available)

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <p className="text-[#c9a86c] text-sm uppercase tracking-[0.3em] mb-4">
            Collection
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-6">
            Galerie
          </h1>
          <p className="text-[#888] font-light text-lg max-w-2xl mx-auto">
            Découvrez ma collection de tableaux, chaque œuvre étant une pièce unique
            créée avec passion et authenticité.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container mx-auto px-6 lg:px-12 mb-12">
        <GalleryFilters 
          categories={CATEGORIES} 
          currentCategory={searchParams.category || 'all'}
          currentAvailability={searchParams.available || 'all'}
        />
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-6 lg:px-12 pb-24">
        {paintings.length > 0 ? (
          <>
            <p className="text-[#555] mb-8 text-sm">
              {paintings.length} œuvre{paintings.length > 1 ? 's' : ''} trouvée{paintings.length > 1 ? 's' : ''}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {paintings.map((painting, index) => (
                <div 
                  key={painting.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <PaintingCard painting={painting} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <p className="text-[#888] text-lg font-light">
              {isSupabaseConfigured 
                ? 'Aucune œuvre trouvée avec ces critères.'
                : 'Configurez Supabase pour afficher les œuvres.'}
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
