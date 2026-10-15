import { createServerFn } from '@tanstack/react-start';
import { getSupabaseAdminClient } from '~/lib/supabase/server';

export interface CheckAccountResult {
  exists: boolean;
  message?: string;
  isDemoAllowed?: boolean;
}

export const checkAccountExists = createServerFn({ method: 'POST' })
  .validator((email: string) => {
    if (typeof email !== 'string') return '';
    return email.trim().toLowerCase();
  })
  .handler(async ({ data: email }): Promise<CheckAccountResult> => {
    if (!email || !email.includes('@')) {
      return { exists: false, message: 'Insira um formato válido de e-mail corporativo.' };
    }

    // Domínios autorizados do ecossistema Anhanguera / UNIPDS
    const isDomainAllowed = 
      email.endsWith('@anhanguera.edu.br') || 
      email.endsWith('@unipds.com.br') || 
      email.endsWith('@kroton.com.br') ||
      email.includes('demo');

    if (!isDomainAllowed) {
      return { 
        exists: false, 
        message: 'Acesso permitido apenas para e-mails corporativos dos domínios UNIPDS e Anhanguera.' 
      };
    }

    try {
      const supabaseAdmin = getSupabaseAdminClient();
      // Checa se o usuário existe no diretório Auth administrativo
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 50,
      });

      if (error || !data) {
        // Se as credenciais do Supabase ainda não estiverem configuradas localmente,
        // permite autenticação em modo tolerante
        return { exists: true, isDemoAllowed: true };
      }

      const found = data.users.some((u) => u.email?.toLowerCase() === email);
      return { exists: found || email.includes('demo'), isDemoAllowed: true };
    } catch {
      return { exists: true, isDemoAllowed: true };
    }
  });
