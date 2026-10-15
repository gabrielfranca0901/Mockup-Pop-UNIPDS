-- Esquema PostgreSQL para o Portal POP & Guia de Atendimento (UNIPDS & Anhanguera)
-- Execute este script no SQL Editor do seu Dashboard Supabase

CREATE TABLE IF NOT EXISTS public.pop_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    summary TEXT NOT NULL,
    views_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.pop_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES public.pop_articles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    script TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ativação de Row Level Security (RLS)
ALTER TABLE public.pop_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pop_sections ENABLE ROW LEVEL SECURITY;

-- Política de Leitura Pública para Usuários Autenticados
CREATE POLICY "Leitura de POPs permitida para usuarios autenticados"
ON public.pop_articles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Leitura de secoes permitida para usuarios autenticados"
ON public.pop_sections
FOR SELECT
TO authenticated
USING (true);

-- Índices de Performance para Busca
CREATE INDEX IF NOT EXISTS idx_pop_articles_category ON public.pop_articles(category);
CREATE INDEX IF NOT EXISTS idx_pop_articles_tags ON public.pop_articles USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_pop_sections_article_id ON public.pop_sections(article_id);
