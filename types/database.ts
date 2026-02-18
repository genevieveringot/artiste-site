export interface Painting {
  id: string
  title: string
  image_url: string
  price: number | null
  width: number
  height: number
  category: string
  available: boolean
  description: string | null
  created_at: string
  updated_at: string
}

export interface Exhibition {
  id: string
  title: string
  location: string
  start_date: string
  end_date: string | null
  description: string | null
  image_url: string | null
  is_upcoming: boolean
  created_at: string
  updated_at: string
}

export interface PaintingFormData {
  title: string
  image_url: string
  price: number | null
  width: number
  height: number
  category: string
  available: boolean
  description: string
}

export interface ExhibitionFormData {
  title: string
  location: string
  start_date: string
  end_date: string
  description: string
  image_url: string
}

export type Category = 
  | 'abstract'
  | 'landscape'
  | 'portrait'
  | 'still-life'
  | 'contemporary'
  | 'other'

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'abstract', label: 'Abstrait' },
  { value: 'landscape', label: 'Paysage' },
  { value: 'portrait', label: 'Portrait' },
  { value: 'still-life', label: 'Nature morte' },
  { value: 'contemporary', label: 'Contemporain' },
  { value: 'other', label: 'Autre' },
]
