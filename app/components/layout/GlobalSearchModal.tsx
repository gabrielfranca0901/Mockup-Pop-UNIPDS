import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, ChevronRight, Hash, ArrowRight } from 'lucide-react';
import { Marked } from '~/components/ui/Marked';
import { DEMO_POP_ARTICLES } from '~/mock/demo-data';
import { useNavigate } from '@tanstack/react-router';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle?: (articleId: string) => void;
}

export function GlobalSearchModal({ isOpen, onClose, onSelectArticle }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? DEMO_POP_ARTICLES.filter((art) => {
        const q = query.toLowerCase();
        return (
          art.title.toLowerCase().includes(q) ||
          art.summary.toLowerCase().includes(q) ||
          art.tags.some((t) => t.toLowerCase().includes(q)) ||
          art.sections.some(
            (s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q)
          )
        );
      })
    : [];

  const handleSelect = (articleId: string) => {
    if (onSelectArticle) {
      onSelectArticle(articleId);
    } else {
      navigate({ to: '/portal' });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50">
      <div 
        className="w-full max-w-2xl bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra de Entrada de Pesquisa */}
        <div className="p-4 border-b border-[var(--color-dark-border)] flex items-center gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquise por títulos, procedimentos, termos ou #hashtags..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-zinc-400 hover:text-zinc-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Resultados */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-[var(--color-dark-border)]/40">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              Digite uma palavra-chave para buscar procedimentos em tempo real...
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400">
              Nenhum procedimento encontrado para &ldquo;<span className="text-zinc-200">{query}</span>&rdquo;.
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="w-full text-left p-3.5 rounded-xl hover:bg-zinc-800/50 transition-colors group flex items-start justify-between gap-3 cursor-pointer"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-blue-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{item.category}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-blue-400 transition-colors">
                    <Marked text={item.title} query={query} />
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    <Marked text={item.summary} query={query} />
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60"
                      >
                        <Marked text={tag} query={query} />
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 shrink-0 mt-2 transition-transform group-hover:translate-x-1" />
              </button>
            ))
          )}
        </div>

        {/* Rodapé Informativo */}
        <div className="p-3 bg-[var(--color-dark-bg)] border-t border-[var(--color-dark-border)] flex items-center justify-between text-[11px] text-zinc-500">
          <span>{results.length} resultados encontrados</span>
          <span>Navegue com o mouse ou teclado</span>
        </div>
      </div>
    </div>
  );
}
