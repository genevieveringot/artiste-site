/**
 * Format a price in euros.
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format a date string to French locale.
 */
export function formatDateFr(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Get exhibition status based on dates.
 */
export function getExpoStatus(
  dateDebut: string,
  dateFin?: string
): 'upcoming' | 'ongoing' | 'past' {
  const now = new Date()
  const start = new Date(dateDebut)
  const end = dateFin ? new Date(dateFin) : start

  if (now < start) return 'upcoming'
  if (now > end) return 'past'
  return 'ongoing'
}

/**
 * Status labels in French.
 */
export const expoStatusLabels: Record<string, string> = {
  upcoming: 'À venir',
  ongoing: 'En cours',
  past: 'Passée',
}

/**
 * Availability labels in French.
 */
export const dispoLabels: Record<string, string> = {
  disponible: 'Disponible',
  vendu: 'Vendu',
  sur_demande: 'Sur demande',
  reserve: 'Réservé',
}

/**
 * Encadrement labels in French.
 */
export const encadrementLabels: Record<string, string> = {
  avec_cadre: 'Avec cadre',
  sans_cadre: 'Sans cadre',
  non_applicable: 'Non applicable',
}

/**
 * Build dimensions string.
 */
export function formatDimensions(
  largeur?: number,
  hauteur?: number,
  profondeur?: number
): string {
  if (!largeur || !hauteur) return ''
  let str = `${largeur} × ${hauteur} cm`
  if (profondeur) str += ` × ${profondeur} cm`
  return str
}
