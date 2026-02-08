'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Eye, ShoppingBag, X } from 'lucide-react'
import { Painting } from '@/types/database'
import { formatPrice, formatDimensions, getCategoryLabel } from '@/lib/utils'

interface PaintingCardProps {
  painting: Painting
}

export function PaintingCard({ painting }: PaintingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Card */}
      <div className="group cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-[#1a1a1a]">
          <Image
            src={painting.image_url}
            alt={painting.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Sold Badge */}
          {!painting.available && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-[#0a0a0a]/90 text-xs uppercase tracking-wider">
              Vendu
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-[#0a0a0a]/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsModalOpen(true)
              }}
              className="w-12 h-12 bg-white text-[#0a0a0a] flex items-center justify-center hover:bg-[#c9a86c] transition-colors duration-300"
            >
              <Eye size={20} />
            </button>
            {painting.available && (
              <Link
                href={`/contact?subject=Intéressé par "${painting.title}"`}
                onClick={(e) => e.stopPropagation()}
                className="w-12 h-12 bg-white text-[#0a0a0a] flex items-center justify-center hover:bg-[#c9a86c] transition-colors duration-300"
              >
                <ShoppingBag size={20} />
              </Link>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2" onClick={() => setIsModalOpen(true)}>
          <span className="text-[#888] text-xs uppercase tracking-wider">
            {getCategoryLabel(painting.category)}
          </span>
          <h3 className="font-serif text-xl group-hover:text-[#c9a86c] transition-colors duration-300">
            {painting.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-[#555] text-sm">
              {formatDimensions(painting.width, painting.height)}
            </span>
            <span className="text-[#c9a86c]">
              {formatPrice(painting.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/95 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 p-2 text-white/60 hover:text-white transition-colors z-10"
          >
            <X size={32} />
          </button>
          
          <div 
            className="max-w-6xl w-full grid md:grid-cols-2 gap-8 lg:gap-16 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={painting.image_url}
                alt={painting.title}
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            
            <div className="flex flex-col justify-center py-8">
              <span className="text-[#c9a86c] text-sm uppercase tracking-[0.2em] mb-4">
                {getCategoryLabel(painting.category)}
              </span>
              
              <h2 className="font-serif text-4xl md:text-5xl mb-6">
                {painting.title}
              </h2>
              
              <div className="w-12 h-px bg-[#2a2a2a] mb-6" />
              
              <div className="text-[#c9a86c] text-2xl mb-8">
                {formatPrice(painting.price)}
              </div>

              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between border-b border-[#1a1a1a] pb-4">
                  <span className="text-[#888]">Dimensions</span>
                  <span>{formatDimensions(painting.width, painting.height)}</span>
                </div>
                <div className="flex justify-between border-b border-[#1a1a1a] pb-4">
                  <span className="text-[#888]">Catégorie</span>
                  <span>{getCategoryLabel(painting.category)}</span>
                </div>
                <div className="flex justify-between border-b border-[#1a1a1a] pb-4">
                  <span className="text-[#888]">Disponibilité</span>
                  <span className={painting.available ? 'text-green-500' : 'text-red-400'}>
                    {painting.available ? 'Disponible' : 'Vendu'}
                  </span>
                </div>
              </div>

              {painting.description && (
                <p className="text-[#888] font-light leading-relaxed mb-8">
                  {painting.description}
                </p>
              )}

              {painting.available && (
                <Link 
                  href={`/contact?subject=Intéressé par "${painting.title}"`}
                  className="btn btn-primary self-start"
                >
                  Demander des informations
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
