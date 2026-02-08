import Image from 'next/image'
import { MapPin, Calendar } from 'lucide-react'
import { Exhibition } from '@/types/database'
import { formatDateRange, isUpcoming } from '@/lib/utils'

interface ExhibitionCardProps {
  exhibition: Exhibition
}

export function ExhibitionCard({ exhibition }: ExhibitionCardProps) {
  const upcoming = isUpcoming(exhibition.start_date)

  return (
    <div className={`group border p-8 transition-all duration-500 ${
      upcoming 
        ? 'border-[#c9a86c]/30 hover:border-[#c9a86c]' 
        : 'border-[#1a1a1a] hover:border-[#2a2a2a]'
    }`}>
      <div className="flex flex-col md:flex-row gap-6">
        {exhibition.image_url && (
          <div className="relative w-full md:w-40 h-40 overflow-hidden flex-shrink-0">
            <Image
              src={exhibition.image_url}
              alt={exhibition.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 160px"
            />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="font-serif text-2xl group-hover:text-[#c9a86c] transition-colors duration-300">
              {exhibition.title}
            </h3>
            {upcoming && (
              <span className="shrink-0 px-3 py-1 bg-[#c9a86c]/20 text-[#c9a86c] text-xs uppercase tracking-wider">
                À venir
              </span>
            )}
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-[#888] text-sm">
              <MapPin size={14} className="text-[#c9a86c]" />
              <span>{exhibition.location}</span>
            </div>
            <div className="flex items-center gap-2 text-[#888] text-sm">
              <Calendar size={14} className="text-[#c9a86c]" />
              <span>{formatDateRange(exhibition.start_date, exhibition.end_date)}</span>
            </div>
          </div>

          {exhibition.description && (
            <p className="text-[#555] font-light line-clamp-2">
              {exhibition.description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
