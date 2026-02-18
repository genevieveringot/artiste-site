import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPrice(price: number | null): string {
  if (price === null) return 'Prix sur demande'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatDimensions(width: number, height: number): string {
  return `${width} × ${height} cm`
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function formatDateRange(start: string, end: string | null): string {
  const startDate = formatDate(start)
  if (!end) return `À partir du ${startDate}`
  const endDate = formatDate(end)
  return `${startDate} - ${endDate}`
}

export function isUpcoming(startDate: string): boolean {
  return new Date(startDate) > new Date()
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'abstract': 'Abstrait',
    'landscape': 'Paysage',
    'portrait': 'Portrait',
    'still-life': 'Nature morte',
    'contemporary': 'Contemporain',
    'other': 'Autre',
  }
  return labels[category] || category
}
