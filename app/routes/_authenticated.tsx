import { useState, useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router';
import { getSupabaseBrowserClient } from '~/lib/supabase/client';
import { AppNav } from '~/components/layout/AppNav';
import { GlobalSearchModal } from '~/components/layout/GlobalSearchModal';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    if (typeof window !== 'undefined') {
      const demo = sessionStorage.getItem('unipds_demo_session');
      if (demo) {
        return { user: JSON.parse(demo).user, isDemo: true };
      }

      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw redirect({
          to: '/auth',
          search: { redirect: location.href },
        });
      }

      return { user: session.user, isDemo: false };
    }
    return { user: null, isDemo: false };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email?: string; isDemo?: boolean }>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const demo = sessionStorage.getItem('unipds_demo_session');
      if (demo) {
        const parsed = JSON.parse(demo);
        setCurrentUser({ email: parsed.user.email, isDemo: true });
        return;
      }
      const supabase = getSupabaseBrowserClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setCurrentUser({ email: data.user.email, isDemo: false });
        }
      });
    }
  }, []);

  // Atalho global de teclado: Ctrl + K / Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-zinc-100 flex flex-col antialiased">
      <AppNav
        onOpenSearch={() => setSearchOpen(true)}
        userEmail={currentUser.email}
        isDemo={currentUser.isDemo}
      />

      <main className="flex-1 flex overflow-hidden">
        <Outlet />
      </main>

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
