import { Exhibition } from '@/types/database'

interface TimelineItemProps {
  exhibition: Exhibition
  index: number
}

export function TimelineItem({ exhibition, index }: TimelineItemProps) {
  // Format date as "Fév 2024"
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString)
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc']
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const isEven = index % 2 === 0

  return (
    <div 
      className={`relative flex flex-col md:flex-row gap-8 animate-fade-in ${
        isEven ? '' : 'md:flex-row-reverse'
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Timeline dot */}
      <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-[#c9a86c] rounded-full -translate-x-1 md:-translate-x-1.5 mt-2" />
      
      {/* Date */}
      <div className={`md:w-1/2 pl-8 md:pl-0 ${
        isEven ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'
      }`}>
        <span className="text-[#c9a86c] text-sm uppercase tracking-[0.2em]">
          {formatShortDate(exhibition.start_date)}
        </span>
      </div>
      
      {/* Content */}
      <div className={`md:w-1/2 pl-8 md:pl-0 ${
        isEven ? 'md:pl-12' : 'md:pr-12 md:text-right'
      }`}>
        <h3 className="font-serif text-2xl mb-2 hover:text-[#c9a86c] transition-colors duration-300 cursor-default">
          {exhibition.title}
        </h3>
        <p className="text-[#888] font-light">
          {exhibition.location}
        </p>
        {exhibition.description && (
          <p className="text-[#555] text-sm font-light mt-2 line-clamp-2">
            {exhibition.description}
          </p>
        )}
      </div>
    </div>
  )
}
