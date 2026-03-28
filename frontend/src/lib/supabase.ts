// Supabase client initialization

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here'

let supabaseInstance: SupabaseClient | null = null

export function initializeSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    })
  }
  return supabaseInstance
}

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    throw new Error('Supabase not initialized. Call initializeSupabase() first.')
  }
  return supabaseInstance
}

// Type definitions
export interface Shelter {
  id: string
  name: string
  address: string
  region: string
  latitude: number
  longitude: number
  max_capacity: number
  current_occupancy: number
  coordinator_phone: string
  status: 'GREEN' | 'YELLOW' | 'RED'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SmsLog {
  id: string
  shelter_id: string
  message: string
  recipient: string
  status: 'sent' | 'failed'
  sent_at: string
}
