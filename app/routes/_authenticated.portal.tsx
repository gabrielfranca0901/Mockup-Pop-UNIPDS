import { useState, useMemo, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Search, 
  FileText, 
  ChevronRight, 
  Bookmark, 
  Clock, 
  Filter, 
  X, 
  Sparkles,
  BookOpen,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import { getSupabaseBrowserClient } from '~/lib/supabase/client';
import { PopArticle } from '~/lib/types/portal.types';
import { DEMO_POP_ARTICLES, DEMO_CATEGORIES } from '~/mock/demo-data';
import { RichTextRenderer } from '~/components/ui/RichTextRenderer';
import { CopyButton } from '~/components/ui/CopyButton';

export const Route = createFileRoute('/_authenticated/portal')({
  component: PortalPopPage,
});

function PortalPopPage() {
  const [articles, setArticles] = useState<PopArticle[]>(DEMO_POP_ARTICLES);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeArticleId, setActiveArticleId] = useState<string>(DEMO_POP_ARTICLES[0].id);

  const supabase = getSupabaseBrowserClient();

  // 1. Integração com Supabase para carregar artigos reais (com fallback para DEMO_POP_ARTICLES)
  useEffect(() => {
    async function fetchPopArticles() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('pop_articles')
          .select(`
            id,
            title,
            slug,
            category,
            tags,
            summary,
            updated_at,
            sections:pop_sections (
              id,
              title,
              content,
              script,
              order_index
            )
          `)
          .order('title', { ascending: true });

        if (error || !data || data.length === 0) {
          // Se a tabela ainda não tiver dados ou o banco estiver em modo demo, mantém dados estruturados
          setArticles(DEMO_POP_ARTICLES);
        } else {
          const mappedArticles: PopArticle[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            category: item.category,
            tags: item.tags || [],
            summary: item.summary,
            updatedAt: new Date(item.updated_at).toLocaleDateString('pt-BR'),
            sections: (item.sections || []).sort(
              (a: any, b: any) => a.order_index - b.order_index
            ).map((s: any) => ({
              id: s.id,
              title: s.title,
              content: s.content,
              script: s.script,
              orderIndex: s.order_index,
            })),
          }));
          setArticles(mappedArticles);
          if (mappedArticles.length > 0) {
            setActiveArticleId(mappedArticles[0].id);
          }
        }
      } catch {
        setArticles(DEMO_POP_ARTICLES);
      } finally {
        setLoading(false);
      }
    }

    fetchPopArticles();
  }, [supabase]);

  // Lista de tags únicas disponíveis
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    articles.forEach((a) => a.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [articles]);

  // Filtragem composta em tempo real (Busca + Tag + Categoria)
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        q === '' ||
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q)) ||
        art.sections.some(
          (s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
        );

      const matchTag = selectedTag ? art.tags.includes(selectedTag) : true;
      const matchCat = selectedCategory ? art.category === selectedCategory : true;

      return matchSearch && matchTag && matchCat;
    });
  }, [articles, searchTerm, selectedTag, selectedCategory]);

  const activeArticle =
    articles.find((a) => a.id === activeArticleId) ||
    filteredArticles[0] ||
    articles[0];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ======================================================== */}
      {/* 1. SIDEBAR LATERAL ESQUERDA: Busca, Tags e Lista de POPs */}
      {/* ======================================================== */}
      <aside className="w-80 border-r border-[var(--color-dark-border)] bg-[var(--color-dark-surface)] flex flex-col shrink-0">
        <div className="p-4 border-b border-[var(--color-dark-border)] space-y-3">
          {/* Campo de Busca em Tempo Real */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar POPs, termos..."
              className="w-full pl-9 pr-7 py-1.5 rounded-lg bg-[var(--color-dark-bg)] border border-[var(--color-dark-border)] text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Badges de Hashtags em Pílulas */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center gap-1 font-medium">
                <Filter className="w-3 h-3" /> Filtrar por Hashtag
              </span>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-[10px] text-blue-400 hover:underline"
                >
                  Limpar
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                      : 'bg-zinc-800/60 border-zinc-700/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Procedimentos Encontrados */}
        <div className="flex-1 overflow-y-auto divide-y divide-[var(--color-dark-border)]/40">
          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-500 flex flex-col items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Sincronizando base Supabase...
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              Nenhum procedimento atende aos critérios do filtro.
            </div>
          ) : (
            filteredArticles.map((article) => {
              const isSelected = activeArticle?.id === article.id;
              return (
                <button
                  key={article.id}
                  onClick={() => setActiveArticleId(article.id)}
                  className={`w-full text-left p-3.5 transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-blue-600/10 border-l-2 border-blue-500'
                      : 'hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                    <span className="font-medium text-blue-400/90 truncate max-w-[170px]">
                      {article.category}
                    </span>
                    <span className="text-zinc-500">{article.updatedAt}</span>
                  </div>
                  <h3
                    className={`text-xs font-semibold line-clamp-2 leading-snug transition-colors ${
                      isSelected
                        ? 'text-white'
                        : 'text-zinc-300 group-hover:text-zinc-100'
                    }`}
                  >
                    {article.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 line-clamp-1 mt-1">
                    {article.summary}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Rodapé da Sidebar */}
        <div className="p-2.5 border-t border-[var(--color-dark-border)] bg-[var(--color-dark-bg)] text-[10px] text-zinc-500 flex items-center justify-between">
          <span>{filteredArticles.length} procedimento(s)</span>
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-zinc-400" /> UNIPDS Hub
          </span>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. ÁREA CENTRAL: Leitor de Conteúdo Rico do POP         */}
      {/* ======================================================== */}
      <section className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[var(--color-dark-bg)]">
        {activeArticle ? (
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Cabeçalho do Artigo */}
            <div className="border-b border-[var(--color-dark-border)] pb-6 space-y-3">
              <div className="flex items-center gap-2 text-xs text-blue-400 font-medium">
                <FileText className="w-3.5 h-3.5" />
                <span>{activeArticle.category}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Atualizado em {activeArticle.updatedAt}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-white tracking-tight leading-snug">
                {activeArticle.title}
              </h1>

              <p className="text-sm text-zinc-300 leading-relaxed bg-[var(--color-dark-surface)] p-4 rounded-xl border border-[var(--color-dark-border)]">
                {activeArticle.summary}
              </p>

              {/* Tags do Artigo Atual */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-zinc-500">Palavras-chave:</span>
                {activeArticle.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Renderização das Seções do Procedimento */}
            <div className="space-y-8">
              {activeArticle.sections.map((section, idx) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-6 p-5 rounded-2xl bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] space-y-4"
                >
                  <div className="flex items-center gap-2 border-b border-[var(--color-dark-border)] pb-3">
                    <span className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h2 className="text-sm font-bold text-zinc-100 tracking-tight">
                      {section.title}
                    </h2>
                  </div>

                  {/* Conteúdo com RichText Inteligente */}
                  <RichTextRenderer
                    content={section.content}
                    onTagClick={(tag) => setSelectedTag(tag)}
                  />

                  {/* Bloco de Script ao Aluno com Cópia em 1 Clique */}
                  {section.script && (
                    <div className="mt-4 p-4 rounded-xl bg-blue-950/25 border border-blue-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                          <Bookmark className="w-3.5 h-3.5 text-blue-400" />
                          Script Institucional de Orientação
                        </span>
                        <CopyButton textToCopy={section.script} />
                      </div>
                      <div className="p-3.5 rounded-lg bg-[var(--color-dark-bg)] border border-blue-500/20 font-mono text-xs text-zinc-200 leading-relaxed shadow-inner">
                        {section.script}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
            Selecione um procedimento na barra lateral para visualizar as diretrizes.
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 3. ÍNDICE DINÂMICO DIREITO ("Nesta página" via Scrollspy) */}
      {/* ======================================================== */}
      <aside className="hidden xl:block w-64 border-l border-[var(--color-dark-border)] bg-[var(--color-dark-surface)] p-5 shrink-0 overflow-y-auto">
        <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-500" />
          Nesta página
        </h4>

        {activeArticle && activeArticle.sections.length > 0 ? (
          <nav className="space-y-1">
            {activeArticle.sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="block text-xs py-1.5 px-2 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-zinc-800/40 transition-all leading-snug truncate"
              >
                {sec.title}
              </a>
            ))}
          </nav>
        ) : (
          <span className="text-xs text-zinc-500">Sem seções disponíveis.</span>
        )}
      </aside>
    </div>
  );
}
