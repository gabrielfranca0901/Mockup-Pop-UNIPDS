import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { getSupabaseBrowserClient } from '~/lib/supabase/client';
import { checkAccountExists } from '~/server/auth.server';
import { toast } from 'sonner';
import { 
  ShieldCheck, 
  LogIn, 
  KeyRound, 
  Sparkles, 
  AlertCircle, 
  ArrowLeft,
  GraduationCap,
  Eye,
  EyeOff,
  CheckCircle2
} from 'lucide-react';

interface AuthSearchParams {
  mode?: 'login' | 'forgot_password' | 'reset_password';
  redirect?: string;
}

export const Route = createFileRoute('/auth')({
  validateSearch: (search: Record<string, unknown>): AuthSearchParams => {
    return {
      mode: (search.mode as AuthSearchParams['mode']) || 'login',
      redirect: (search.redirect as string) || '/portal',
    };
  },
  component: AuthPage,
});

function AuthPage() {
  const search = useSearch({ from: '/auth' });
  const [mode, setMode] = useState<'login' | 'forgot_password' | 'reset_password'>(
    search.mode || 'login'
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const supabase = getSupabaseBrowserClient();

  // Se já estiver logado, redireciona diretamente
  useEffect(() => {
    const checkActiveSession = async () => {
      const demo = sessionStorage.getItem('unipds_demo_session');
      if (demo) {
        navigate({ to: '/portal' });
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate({ to: '/portal' });
      }
    };
    checkActiveSession();
  }, [supabase, navigate]);

  // Fluxo de Login com Validação Segura e Supabase Auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedEmail || !password) {
      toast.error('Informe o e-mail corporativo e a senha.');
      return;
    }

    setLoading(true);
    try {
      // 1. Validação no Servidor via Server Function
      const checkResult = await checkAccountExists({ data: sanitizedEmail });
      if (!checkResult.exists) {
        toast.error(checkResult.message || 'Conta corporativa não localizada.');
        setLoading(false);
        return;
      }

      // 2. Autenticação no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) {
        // Fallback inteligente para ambiente de testes caso Supabase não esteja conectado
        if (sanitizedEmail.includes('demo') || error.message.includes('Invalid login credentials')) {
          toast.warning('Credenciais inválidas no Supabase Auth. Você pode usar o "Modo Demo" abaixo.');
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.session) {
        toast.success('Autenticação realizada com sucesso!', {
          description: `Bem-vindo, ${data.user.email?.split('@')[0]}`,
        });
        navigate({ to: search.redirect || '/portal' });
      }
    } catch {
      toast.error('Erro de comunicação com o servidor de autenticação.');
    } finally {
      setLoading(false);
    }
  };

  // Fluxo de Esqueci Minha Senha
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedEmail = email.trim().toLowerCase();

    if (!sanitizedEmail) {
      toast.error('Informe seu e-mail institucional.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/auth?mode=reset_password`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Instruções enviadas para seu e-mail!', {
          description: 'Acesse o link recebido para redefinir sua senha.',
        });
        setMode('login');
      }
    } catch {
      toast.error('Falha ao processar redefinição de senha.');
    } finally {
      setLoading(false);
    }
  };

  // Fluxo de Redefinição de Nova Senha
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('A nova senha deve possuir no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Senha atualizada com sucesso! Faça login com a nova credencial.');
        setMode('login');
      }
    } catch {
      toast.error('Não foi possível atualizar a senha.');
    } finally {
      setLoading(false);
    }
  };

  // Modo Demo: Bypass Operacional Controlado para Homologação e Demonstrações Rápidas
  const handleDemoBypass = () => {
    const demoUser = {
      id: 'demo-analista-unipds',
      email: 'analista.demo@anhanguera.edu.br',
      name: 'Analista de Operações N1 (Demo)',
      role: 'Atendente N1',
      isDemo: true,
    };

    sessionStorage.setItem('unipds_demo_session', JSON.stringify({ user: demoUser }));
    toast.success('Acesso em Modo Demonstração ativado!', {
      description: 'Sessão iniciada como Analista N1 (UNIPDS & Anhanguera).',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    });
    navigate({ to: '/portal' });
  };

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] flex items-center justify-center p-4 selection:bg-blue-600/30">
      <div className="w-full max-w-md bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow de ambientação no topo */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Cabeçalho */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/30 mb-3.5">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Portal POP & Guia de Atendimento</h1>
          <p className="text-xs text-zinc-400 tracking-wider uppercase mt-1">UNIPDS & Anhanguera Educacional</p>
        </div>

        {/* MODO 1: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                E-mail Institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome.sobrenome@anhanguera.edu.br"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-300">Senha</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot_password')}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors hover:underline cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Entrar no Portal
                </>
              )}
            </button>
          </form>
        )}

        {/* MODO 2: ESQUECI MINHA SENHA */}
        {mode === 'forgot_password' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs text-zinc-400 leading-relaxed">
              Informe seu e-mail corporativo. Enviaremos as instruções oficiais para recuperação de acesso.
            </p>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                E-mail Institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome.sobrenome@anhanguera.edu.br"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" /> Enviar Link de Recuperação
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-xs text-zinc-400 hover:text-zinc-200 flex items-center justify-center gap-1.5 py-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Login
            </button>
          </form>
        )}

        {/* MODO 3: REDEFINIÇÃO DE SENHA */}
        {mode === 'reset_password' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="text-xs text-zinc-400 leading-relaxed">
              Defina sua nova credencial de acesso ao Portal POP & Guia.
            </p>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Nova Senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" /> Salvar Nova Senha
            </button>
          </form>
        )}

        {/* SEÇÃO INFERIOR: MODO DEMONSTRAÇÃO (BYPASS CONTROLADO) */}
        <div className="mt-6 pt-6 border-t border-[var(--color-dark-border)] space-y-3">
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 justify-center">
            <AlertCircle className="w-3.5 h-3.5" /> Ambiente exclusivo para operadores e analistas
          </div>

          <button
            type="button"
            onClick={handleDemoBypass}
            className="w-full py-2.5 px-3 rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            Entrar em Modo Demo (Bypass Operacional)
          </button>
        </div>
      </div>
    </div>
  );
}
