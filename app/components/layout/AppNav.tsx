import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { 
  BookOpen, 
  Headset, 
  Search, 
  LogOut, 
  Command, 
  GraduationCap, 
  UserCircle2 
} from 'lucide-react';
import { getSupabaseBrowserClient } from '~/lib/supabase/client';
import { toast } from 'sonner';

interface AppNavProps {
  onOpenSearch: () => void;
  userEmail?: string;
  isDemo?: boolean;
}

export function AppNav({ onOpenSearch, userEmail, isDemo }: AppNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const supabase = getSupabaseBrowserClient();

  const handleLogout = async () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('unipds_demo_session');
      }
      await supabase.auth.signOut();
      toast.info('Sessão encerrada com sucesso.');
      navigate({ to: '/auth' });
    } catch {
      window.location.href = '/auth';
    }
  };

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-[var(--color-dark-border)] bg-[var(--color-dark-surface)]/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between">
      {/* Esquerda: Identidade Visual UNIPDS & Anhanguera */}
      <div className="flex items-center gap-6">
        <Link to="/portal" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white group-hover:text-blue-400 transition-colors">
                UNIPDS & Anhanguera
              </span>
              {isDemo && (
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Demo
                </span>
              )}
            </div>
            <span className="block text-[10px] text-zinc-400 leading-none">Portal POP & Guia</span>
          </div>
        </Link>

        {/* Abas Centrais: Base POP vs Guia de Atendimento */}
        <nav className="flex items-center gap-1 bg-[var(--color-dark-bg)] p-1 rounded-lg border border-[var(--color-dark-border)]">
          <Link
            to="/portal"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              location.pathname.startsWith('/portal')
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Base POP</span>
          </Link>
          <Link
            to="/guia"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              location.pathname.startsWith('/guia')
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Headset className="w-3.5 h-3.5" />
            <span>Guia de Atendimento</span>
          </Link>
        </nav>
      </div>

      {/* Direita: Botão Atalho Ctrl+K + Dados do Usuário + Sair */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 text-xs transition-colors cursor-pointer group"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
          <span className="hidden sm:inline">Pesquisa rápida...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400 font-mono">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        <div className="h-4 w-px bg-zinc-800" />

        {/* Informações do Analista */}
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
          <div className="hidden md:flex flex-col text-left">
            <span className="font-medium text-xs text-zinc-200 truncate max-w-[140px]">
              {userEmail ? userEmail.split('@')[0] : 'Analista N1'}
            </span>
            <span className="text-[10px] text-zinc-500">Operações</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Encerrar Sessão"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
