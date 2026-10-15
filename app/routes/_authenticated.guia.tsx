import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Headset, Sparkles, CheckCircle2, ShieldAlert, Award, FileQuestion } from 'lucide-react';
import { CopyButton } from '~/components/ui/CopyButton';
import { RichTextRenderer } from '~/components/ui/RichTextRenderer';
import { AutonomyLevel, GuiaItem } from '~/lib/types/portal.types';

export const Route = createFileRoute('/_authenticated/guia')({
  component: GuiaAtendimentoPage,
});

const GUIA_BASE: GuiaItem[] = [
  {
    id: 'guia-1',
    nivelEnsino: 'Graduação EAD',
    categoria: 'Financeiro',
    motivo: 'Boleto Vencido sem Encargos',
    autonomia: 'total',
    acaoRecomendada: 'Emitir 2ª via atualizada com prorrogação de 48h sem cobrança de juros e multa.',
    scriptAluno: 'Olá, [Nome do Aluno]! Conforme solicitado, já emiti a segunda via do seu boleto de mensalidade com vencimento atualizado para [Data da Prorrogação]. O código de barras é: [Linha Digitável do Boleto]. Qualquer dúvida, estou à disposição!',
    checklist: ['Confirmar CPF e Curso do Aluno', 'Conferir se o aluno já solicitou prorrogação no mês', 'Encaminhar PDF anexado'],
  },
  {
    id: 'guia-2',
    nivelEnsino: 'Presencial',
    categoria: 'Secretaria',
    motivo: 'Trancamento de Matrícula',
    autonomia: 'parcial',
    acaoRecomendada: 'Realizar sondagem consultiva de retenção acadêmica e abrir protocolo N2 para contato da Coordenação.',
    scriptAluno: 'Entendo perfeitamente sua decisão, [Nome do Aluno]. Antes de efetivarmos o trancamento, nosso coordenador do curso gostaria de conversar com você para apresentar condições especiais de bolsa de permanência ou readequação de grade curricular.',
    checklist: ['Sondar motivo principal de desistência', 'Verificar se possui bolsa PROUNI/FIES', 'Abrir chamado N2 no sistema'],
  },
  {
    id: 'guia-3',
    nivelEnsino: 'Pós-Graduação',
    categoria: 'Acadêmico',
    motivo: 'Substituição de Orientador de TCC',
    autonomia: 'escalonamento',
    acaoRecomendada: 'Escalonamento mandatório para a Coordenação Pedagógica de Pós-Graduação. Analista N1 não tem autonomia para deferir.',
    scriptAluno: '[Nome do Aluno], sua solicitação de análise para troca de orientador de TCC foi registrada com sucesso sob o protocolo #[Protocolo]. O Colegiado de Pós-Graduação responderá diretamente no seu e-mail institucional em até 3 dias úteis.',
    checklist: ['Anexar justificativa formal enviada pelo aluno', 'Validar cronograma limite de entrega', 'Encaminhar com flag de urgência N3'],
  }
];

function GuiaAtendimentoPage() {
  const [nivel, setNivel] = useState('Graduação EAD');
  const [categoria, setCategoria] = useState('Financeiro');
  const [selectedGuia, setSelectedGuia] = useState<GuiaItem>(GUIA_BASE[0]);

  const niveis = ['Graduação EAD', 'Presencial', 'Pós-Graduação'];
  const categorias = ['Financeiro', 'Secretaria', 'Acadêmico'];

  const renderAutonomyBadge = (autonomia: AutonomyLevel) => {
    switch (autonomia) {
      case 'total':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Autonomia Total (Resolução N1)
          </span>
        );
      case 'parcial':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Autonomia Parcial (Requer Validação N2)
          </span>
        );
      case 'escalonamento':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Sem Autonomia (Escalonamento Imediato)
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-10 max-w-5xl mx-auto w-full space-y-6 overflow-y-auto">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Headset className="w-5 h-5 text-blue-500" /> Guia Tático de Atendimento Rápido
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Selecione a situação do aluno para obter o script padronizado e a respectiva alçada de decisão do atendente.
        </p>
      </div>

      {/* FILTROS EM CASCATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] shadow-md">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2.5">
            1. Nível de Ensino
          </label>
          <div className="grid grid-cols-3 gap-2">
            {niveis.map((n) => (
              <button
                key={n}
                onClick={() => setNivel(n)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  nivel === n
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-[var(--color-dark-bg)] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-2.5">
            2. Categoria do Contato
          </label>
          <div className="grid grid-cols-3 gap-2">
            {categorias.map((c) => (
              <button
                key={c}
                onClick={() => setCategoria(c)}
                className={`py-2 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  categoria === c
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-[var(--color-dark-bg)] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DIRETRIZES DA DEMANDA */}
      <div className="p-6 rounded-2xl bg-[var(--color-dark-surface)] border border-[var(--color-dark-border)] shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-dark-border)] pb-4">
          <div>
            <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
              {nivel} • {categoria}
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">{selectedGuia.motivo}</h2>
          </div>
          {renderAutonomyBadge(selectedGuia.autonomia)}
        </div>

        {/* Bloco de Ação Recomendada */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Ação Operacional do Analista
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed bg-[var(--color-dark-bg)] p-3.5 rounded-xl border border-zinc-800">
            {selectedGuia.acaoRecomendada}
          </p>
        </div>

        {/* Script ao Aluno com Copiador */}
        <div className="p-5 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Script de Resposta ao Aluno
            </span>
            <CopyButton textToCopy={selectedGuia.scriptAluno} label="Copiar Script" />
          </div>

          <div className="p-4 rounded-lg bg-[var(--color-dark-bg)] border border-blue-500/20 text-xs text-zinc-200 leading-relaxed">
            <RichTextRenderer content={selectedGuia.scriptAluno} />
          </div>
        </div>

        {/* Checklist de Validação */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2.5">
            Checklist de Validação Obrigatório
          </h3>
          <ul className="space-y-2">
            {selectedGuia.checklist.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
