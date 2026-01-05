import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// This is the Publishable key (also called "anon key") from Supabase dashboard
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type GalleryImage = {
  id: string
  created_at: string
  storage_path: string
  alt_text: string
  display_order: number
  width?: number
  height?: number
  deleted_at?: string | null
}
