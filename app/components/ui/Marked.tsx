import React from 'react';

interface MarkedProps {
  text: string;
  query: string;
  className?: string;
}

export function Marked({ text, query, className = '' }: MarkedProps) {
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const sanitizedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${sanitizedQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-amber-400/30 text-amber-200 font-semibold px-0.5 rounded border border-amber-400/40"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}
