import { createFileRoute, redirect } from '@tanstack/react-router';
import { getSupabaseBrowserClient } from '~/lib/supabase/client';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    if (typeof window !== 'undefined') {
      const demo = sessionStorage.getItem('unipds_demo_session');
      if (demo) {
        throw redirect({ to: '/portal' });
      }

      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        throw redirect({ to: '/portal' });
      } else {
        throw redirect({ to: '/auth' });
      }
    }
  },
  component: () => (
    <div className="min-h-screen bg-[var(--color-dark-bg)] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});
