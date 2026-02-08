'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface GalleryFiltersProps {
  categories: { value: string; label: string }[]
  currentCategory: string
  currentAvailability: string
}

export function GalleryFilters({ categories, currentCategory, currentAvailability }: GalleryFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    router.push(`/gallery?${params.toString()}`)
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 py-8 border-y border-[#1a1a1a]">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[#888] text-sm uppercase tracking-wider mr-4">Catégorie :</span>
        <button
          onClick={() => updateFilter('category', 'all')}
          className={`px-4 py-2 text-sm transition-all duration-300 ${
            currentCategory === 'all'
              ? 'bg-[#c9a86c] text-[#0a0a0a]'
              : 'text-[#888] hover:text-white'
          }`}
        >
          Toutes
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => updateFilter('category', cat.value)}
            className={`px-4 py-2 text-sm transition-all duration-300 ${
              currentCategory === cat.value
                ? 'bg-[#c9a86c] text-[#0a0a0a]'
                : 'text-[#888] hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Availability Filter */}
      <div className="flex items-center gap-2">
        <span className="text-[#888] text-sm uppercase tracking-wider mr-4">Disponibilité :</span>
        {[
          { value: 'all', label: 'Tout' },
          { value: 'true', label: 'Disponible' },
          { value: 'false', label: 'Vendu' },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateFilter('available', opt.value)}
            className={`px-4 py-2 text-sm transition-all duration-300 ${
              currentAvailability === opt.value
                ? 'bg-[#c9a86c] text-[#0a0a0a]'
                : 'text-[#888] hover:text-white'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
