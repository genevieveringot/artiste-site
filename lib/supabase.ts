import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Vrai singleton global pour éviter les multiples instances GoTrueClient
const globalForSupabase = globalThis as typeof globalThis & {
  supabaseClient?: SupabaseClient
}

export function createClient() {
  if (!globalForSupabase.supabaseClient) {
    globalForSupabase.supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }
  return globalForSupabase.supabaseClient
}

export const supabase = createClient()
