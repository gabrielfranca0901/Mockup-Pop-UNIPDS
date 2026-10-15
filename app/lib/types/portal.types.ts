export interface PopSection {
  id: string;
  title: string;
  content: string;
  script?: string;
  orderIndex: number;
}

export interface PopArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  summary: string;
  updatedAt: string;
  sections: PopSection[];
  viewsCount?: number;
}

export interface PopCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export type AutonomyLevel = 'total' | 'parcial' | 'escalonamento';

export interface GuiaItem {
  id: string;
  nivelEnsino: string;
  categoria: string;
  motivo: string;
  autonomia: AutonomyLevel;
  acaoRecomendada: string;
  scriptAluno: string;
  checklist: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  isDemo?: boolean;
}
