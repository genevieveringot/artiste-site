'use client'

import { useState } from 'react'
import ArtworkCard from './ArtworkCard'

interface ArtworkFiltersProps {
  oeuvres: any[]
  categories: any[]
  techniques: any[]
}

export default function ArtworkFilters({ oeuvres, categories, techniques }: ArtworkFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [filterType, setFilterType] = useState<'category' | 'technique'>('category')

  const filtered = activeFilter === 'all'
    ? oeuvres
    : filterType === 'category'
      ? oeuvres.filter((o) => o.categorie?.slug?.current === activeFilter)
      : oeuvres.filter((o) => o.techniques?.some((t: any) => t.slug?.current === activeFilter))

  return (
    <>
      <div className="gallery-filters">
        <button
          className={`gallery-filters__btn ${activeFilter === 'all' ? 'is-active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          Tout
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat._id}
            className={`gallery-filters__btn ${activeFilter === cat.slug?.current && filterType === 'category' ? 'is-active' : ''}`}
            onClick={() => { setActiveFilter(cat.slug?.current); setFilterType('category') }}
          >
            {cat.title}
          </button>
        ))}
        {techniques.map((tech: any) => (
          <button
            key={tech._id}
            className={`gallery-filters__btn ${activeFilter === tech.slug?.current && filterType === 'technique' ? 'is-active' : ''}`}
            onClick={() => { setActiveFilter(tech.slug?.current); setFilterType('technique') }}
          >
            {tech.title}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="gallery-grid">
          {filtered.map((oeuvre: any) => (
            <ArtworkCard key={oeuvre._id} oeuvre={oeuvre} />
          ))}
        </div>
      ) : (
        <p className="no-results">Aucune œuvre ne correspond à ce filtre.</p>
      )}
    </>
  )
}
