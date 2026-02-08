import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create client only if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Helper pour upload d'images
export async function uploadImage(file: File, folder: string = 'paintings'): Promise<string | null> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured')
    return null
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('artiste-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('artiste-images')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

// Helper pour supprimer une image
export async function deleteImage(imageUrl: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false

  try {
    const url = new URL(imageUrl)
    const pathParts = url.pathname.split('/storage/v1/object/public/artiste-images/')
    if (pathParts.length < 2) return false
    
    const filePath = pathParts[1]
    const { error } = await supabase.storage
      .from('artiste-images')
      .remove([filePath])

    return !error
  } catch {
    return false
  }
}
