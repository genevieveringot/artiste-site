import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Use window property for browser singleton - survives HMR and chunk splits
const SUPABASE_CLIENT_KEY = '__supabase_client__'

declare global {
  interface Window {
    [SUPABASE_CLIENT_KEY]?: SupabaseClient
  }
}

export function createClient(): SupabaseClient {
  // Check if env vars are available
  if (!supabaseUrl || !supabaseAnonKey) {
    // During build/SSG, return a dummy client that won't crash
    // This is safe because SSG pages will re-fetch on client
    console.warn('Supabase env vars not available, using placeholder')
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ error: { message: 'Not initialized' } }),
        signUp: async () => ({ error: { message: 'Not initialized' } }),
        signOut: async () => {},
        resetPasswordForEmail: async () => ({ error: { message: 'Not initialized' } }),
      },
      from: () => ({
        select: () => ({ 
          eq: () => ({ 
            eq: () => ({ single: async () => ({ data: null, error: null }) }),
            order: () => ({ data: [], error: null }),
            single: async () => ({ data: null, error: null }),
            data: [],
            error: null
          }),
          order: () => ({ data: [], error: null }),
          single: async () => ({ data: null, error: null }),
          data: [],
          error: null
        }),
      }),
    } as unknown as SupabaseClient
  }

  // Server-side: create fresh client each time
  if (typeof window === 'undefined') {
    return createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }
  
  // Browser-side: true singleton attached to window
  if (!window[SUPABASE_CLIENT_KEY]) {
    window[SUPABASE_CLIENT_KEY] = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }
  return window[SUPABASE_CLIENT_KEY]
}

// For backwards compatibility
export function getSupabase(): SupabaseClient {
  return createClient()
}
