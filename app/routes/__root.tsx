import { createRootRoute, Outlet, ScrollRestoration } from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/react-start';
import { Toaster } from 'sonner';
import appCss from '~/styles/app.css?url';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Portal POP & Guia de Atendimento | UNIPDS & Anhanguera' },
      { name: 'description', content: 'Base de Conhecimento Operacional e Guia de Atendimento ao Aluno UNIPDS & Anhanguera' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <Meta />
      </head>
      <body className="min-h-screen bg-[var(--color-dark-bg)] text-zinc-100 antialiased selection:bg-blue-600/30 selection:text-blue-200">
        <Outlet />
        <Toaster
          position="top-right"
          theme="dark"
          closeButton
          richColors
          toastOptions={{
            style: {
              background: '#18181b',
              border: '1px solid #2e2e32',
              color: '#f4f4f5',
            },
          }}
        />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
