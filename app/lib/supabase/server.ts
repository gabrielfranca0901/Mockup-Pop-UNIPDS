import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export function getSupabaseServerClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder-unipds.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // Manipulação segura de cookies no servidor
      },
    },
  });
}

export function getSupabaseAdminClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder-unipds.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
