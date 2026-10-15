import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
}

export function CopyButton({ textToCopy, label = 'Copiar Script', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Script copiado com sucesso!', {
        description: 'Texto pronto para envio no WhatsApp ou canal de atendimento.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Não foi possível copiar para a área de transferência.');
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-md shadow-blue-600/20 active:scale-95 cursor-pointer ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-300 animate-in zoom-in-50" />
          <span className="text-emerald-200">Copiado!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
