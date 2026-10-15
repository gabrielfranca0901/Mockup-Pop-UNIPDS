import { createBrowserClient } from '@supabase/ssr';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-unipds.supabase.co';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
}
