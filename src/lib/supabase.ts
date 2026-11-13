import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || '';

export const APARTMENT_GALLERY_BUCKET = 'apartment-gallery';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('YOUR_SUPABASE')
);

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase ortam değişkenleri (VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY) tanımlanmadı. Yerel varsayılan veriler kullanılıyor.'
  );
}

// Create client safely without crashing module evaluation if env vars are not yet populated
export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
