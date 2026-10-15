import React from 'react';
import { Info, AlertTriangle, AlertOctagon } from 'lucide-react';

interface RichTextRendererProps {
  content: string;
  onTagClick?: (tag: string) => void;
  className?: string;
}

export function RichTextRenderer({ content, onTagClick, className = '' }: RichTextRendererProps) {
  if (!content) return null;

  // 1. Processamento de Callouts :::tipo ... :::
  const renderBlocks = () => {
    const parts = content.split(/(:::(?:info|warning|danger)[\s\S]*?:::)/g);

    return parts.map((part, index) => {
      if (part.startsWith(':::info')) {
        const text = part.replace(/^:::info\s*/, '').replace(/\s*:::$/, '');
        return (
          <div
            key={index}
            className="my-3 p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/40 text-blue-200 text-xs flex gap-3 items-start shadow-inner"
          >
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed flex-1">{renderInlineChips(text)}</div>
          </div>
        );
      }

      if (part.startsWith(':::warning')) {
        const text = part.replace(/^:::warning\s*/, '').replace(/\s*:::$/, '');
        return (
          <div
            key={index}
            className="my-3 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs flex gap-3 items-start shadow-inner"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed flex-1">{renderInlineChips(text)}</div>
          </div>
        );
      }

      if (part.startsWith(':::danger')) {
        const text = part.replace(/^:::danger\s*/, '').replace(/\s*:::$/, '');
        return (
          <div
            key={index}
            className="my-3 p-3.5 rounded-xl bg-red-950/30 border border-red-500/40 text-red-200 text-xs flex gap-3 items-start shadow-inner"
          >
            <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed flex-1">{renderInlineChips(text)}</div>
          </div>
        );
      }

      return (
        <div key={index} className="leading-relaxed text-zinc-300 text-xs my-1">
          {renderInlineChips(part)}
        </div>
      );
    });
  };

  // 2. Processamento inline: #hashtags e [variáveis]
  const renderInlineChips = (text: string) => {
    const tokenRegex = /(#[\w_]+|\[[^\]]+\])/g;
    const tokens = text.split(tokenRegex);

    return tokens.map((token, i) => {
      if (token.startsWith('#')) {
        return (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTagClick?.(token);
            }}
            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-medium hover:bg-blue-500/25 hover:border-blue-400/40 transition-colors cursor-pointer"
          >
            {token}
          </button>
        );
      }

      if (token.startsWith('[') && token.endsWith(']')) {
        return (
          <span
            key={i}
            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono text-[11px] font-semibold tracking-tight shadow-sm"
          >
            {token}
          </span>
        );
      }

      return token;
    });
  };

  return <div className={`space-y-1.5 ${className}`}>{renderBlocks()}</div>;
}
