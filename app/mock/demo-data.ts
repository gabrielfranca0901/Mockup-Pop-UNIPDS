import { PopArticle, GuiaItem } from '~/lib/types/portal.types';

export const DEMO_POP_ARTICLES: PopArticle[] = [
  {
    id: 'pop-rematricula-pendencia',
    title: 'Procedimento Padrão: Rematrícula com Pendência Financeira',
    slug: 'rematricula-com-pendencia-financeira',
    category: 'Financeiro & Cobrança',
    tags: ['#rematricula', '#financeiro', '#negociacao', '#portal_aluno', '#acordo'],
    summary: 'Diretrizes oficiais para atendimento e flexibilização de rematrícula de alunos com débitos de semestres anteriores.',
    updatedAt: '14/10/2026',
    sections: [
      {
        id: 'sec-analise-previa',
        title: '1. Diagnóstico da Situação Financeira no SIA/Colaborar',
        orderIndex: 1,
        content: 'Antes de iniciar a negociação com o aluno [Nome do Aluno], consulte a tela financeira do SIA. :::info Verifique se existem parcelas já ajuizadas ou acordos anteriores descumpridos. Caso o aluno tenha cumprido ao menos 3 parcelas de um acordo vigente, a rematrícula acadêmica pode ser liberada condicionalmente. :::',
      },
      {
        id: 'sec-script-oferta',
        title: '2. Script de Abordagem e Proposta ao Estudante',
        orderIndex: 2,
        content: 'Utilize o script institucional para apresentar as condições de quitação ou reparcelamento sem gerar atrito:',
        script: 'Olá, [Nome do Aluno]! Analisei sua solicitação de rematrícula para o próximo período letivo na Anhanguera. Identificamos uma pendência no valor de [Valor do Débito]. Conseguimos uma condição especial de renegociação: 15% de desconto à vista no Pix ou parcelamento em até 6x sem juros no cartão de crédito, liberando seu acesso ao ambiente virtual imediatamente.',
      },
      {
        id: 'sec-regras-bloqueio',
        title: '3. Diretrizes de Bloqueio e Escalonamento',
        orderIndex: 3,
        content: ':::danger Alunos beneficiários de FIES ou Prouni com pendências administrativas NÃO devem ter o acesso ao AVA bloqueado sem comunicação prévia ao Coordenador de Polo. ::: É obrigatório abrir chamado N2 com o assunto "Regularização de Bolsa/Financiamento".',
      },
      {
        id: 'sec-confirmacao',
        title: '4. Confirmação do Acordo e Protocolo',
        orderIndex: 4,
        content: 'Após o aceite do aluno, emita o termo de confissão de dívida digital via Docusign ou confirmação por SMS token [Código Token] e anexe o comprovante ao chamado do Zendesk.',
      }
    ]
  },
  {
    id: 'pop-aproveitamento-disciplinas',
    title: 'Aproveitamento de Estudos e Dispensa Curricular',
    slug: 'aproveitamento-de-estudos-e-dispensa',
    category: 'Secretaria Acadêmica',
    tags: ['#secretaria', '#dispensa', '#ementas', '#ead', '#equivalencia'],
    summary: 'Rito de análise documental e equivalência de matriz curricular para alunos transferidos ou portadores de diploma.',
    updatedAt: '11/10/2026',
    sections: [
      {
        id: 'sec-documentacao-exigida',
        title: '1. Relação de Documentos Obrigatórios',
        orderIndex: 1,
        content: 'O estudante deve anexar no Portal do Aluno: 1. Histórico Escolar Oficial assinado pela IES de origem; 2. Ementas e conteúdos programáticos das disciplinas cursadas com aprovação (nota mínima 7,0 ou equivalente). :::warning Documentos sem assinatura digital certificada (ICP-Brasil) ou carimbo legível serão sumariamente indeferidos. :::',
      },
      {
        id: 'sec-script-dispensa',
        title: '2. Script de Orientação de Envio de Ementas',
        orderIndex: 2,
        content: 'Envie as orientações ao aluno para garantir o envio correto:',
        script: 'Prezado(a) [Nome do Aluno], para darmos andamento ao seu pedido de aproveitamento de disciplinas, acesse o Portal do Aluno > Secretaria Virtual > Solicitação de Dispensa. Anexe o Histórico Oficial e o Plano de Ensino das disciplinas cursadas no formato PDF com até 15MB. O prazo regulamentar de análise pelo Colegiado de Curso é de até 10 dias úteis.',
      }
    ]
  },
  {
    id: 'pop-declaracao-matricula',
    title: 'Emissão e Validação de Declaração de Matrícula Digital',
    slug: 'emissao-declaracao-matricula',
    category: 'Secretaria Acadêmica',
    tags: ['#secretaria', '#declaracao', '#portal_aluno', '#validacao_digital'],
    summary: 'Passo a passo para orientação de emissão autônoma de atestados e validação de autenticidade.',
    updatedAt: '08/10/2026',
    sections: [
      {
        id: 'sec-emissao-imediata',
        title: '1. Emissão Gratuita pelo Portal',
        orderIndex: 1,
        content: 'Informe ao aluno que a declaração possui código de verificação autenticável e pode ser gerada gratuitamente sem necessidade de abertura de protocolo. :::info O prazo de validade da declaração é de 30 dias a partir da data de expedição com selo digital. :::',
      }
    ]
  }
];

export const DEMO_CATEGORIES = [
  { id: 'cat-1', name: 'Financeiro & Cobrança', slug: 'financeiro', count: 1 },
  { id: 'cat-2', name: 'Secretaria Acadêmica', slug: 'secretaria', count: 2 },
  { id: 'cat-3', name: 'Atendimento & Matrícula', slug: 'matricula', count: 0 },
  { id: 'cat-4', name: 'Polo & Infraestrutura', slug: 'polo', count: 0 }
];
