export type Project = {
  id?: number;
  slug?: string;
  title: string;
  eyebrow: string;
  description: string;
  stack: string[];
  status: string;
  accent: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  videoUrl?: string | null;
  imageKey?: string | null;
  coverUrl?: string | null;
  featured?: boolean;
  sortOrder?: number;
  problem?: string;
  solution?: string;
  integrations?: string[];
  highlights?: string[];
};

export const portfolioProjects: Project[] = [
  {
    slug: "gerente-360",
    title: "Gerente 360",
    eyebrow: "ERP em Flask · Gestão integrada",
    description: "ERP funcional desenvolvido em Flask para integrar vendas, estoque, financeiro, importações, indicadores e rotinas administrativas em uma visão 360°.",
    stack: ["Python", "Flask", "SQLAlchemy", "Bootstrap", "Chart.js"],
    status: "Em evolução",
    accent: "#4f9cff",
    githubUrl: "https://github.com/igormauriciomota/gerente360",
    coverUrl: "/gerente-360-dashboard.webp",
    videoUrl: "/gerente-360-demo-30s.mp4",
    problem: "Informações comerciais, financeiras e de estoque em controles separados aumentam o retrabalho e reduzem a velocidade das decisões.",
    solution: "Aplicação Flask modular que centraliza cadastros, movimentações, indicadores e auditoria em um fluxo organizado, mensurável e fácil de acompanhar.",
    integrations: ["SQLAlchemy para persistência e regras de dados", "Excel e XML para importações", "Chart.js para dashboards", "Flask Login para controle de acesso"],
    highlights: ["Vendas, estoque e financeiro integrados", "Importação de Excel e notas fiscais XML", "Dashboards, conciliação e auditoria", "Clientes, fornecedores e perfis de acesso"],
  },
  {
    slug: "fiscal-audit-engine",
    title: "Fiscal Audit Engine",
    eyebrow: "Auditoria de NF-e",
    description: "Leitura de XML 4.00 e validações de CFOP, CST, NCM, ICMS, PIS e COFINS com trilha de auditoria.",
    stack: ["Python", "Pandas", "Flask"],
    status: "Planejado",
    accent: "#4ae0c1",
    problem: "A conferência manual de documentos fiscais consome tempo e dificulta identificar divergências recorrentes.",
    solution: "Pipeline de importação, normalização e validação que destaca inconsistências e registra a origem de cada regra aplicada.",
    integrations: ["XML NF-e 4.00", "Pandas para validação em lote", "Excel para exportação"],
    highlights: ["Regras fiscais configuráveis", "Histórico de auditoria", "Relatório de divergências"],
  },
  {
    slug: "data-insight-lab",
    title: "Data Insight Lab",
    eyebrow: "Análise de dados",
    description: "Exploração, limpeza e visualização de dados empresariais com indicadores claros para apoiar decisões.",
    stack: ["Pandas", "Power BI", "SQL"],
    status: "Em evolução",
    accent: "#7c8cff",
    problem: "Planilhas operacionais frequentemente chegam com formatos diferentes, lacunas e métricas pouco padronizadas.",
    solution: "Fluxo analítico que prepara os dados, documenta os indicadores e entrega painéis com contexto para decisão.",
    integrations: ["Excel e CSV", "SQL para consultas", "Power BI para dashboards"],
    highlights: ["Qualidade dos dados", "KPIs documentados", "Análise descritiva e diagnóstica"],
  },
  {
    slug: "inventory-intelligence",
    title: "Inventory Intelligence",
    eyebrow: "Estoque e custos",
    description: "CRUD de produtos, movimentações, custo médio, margem e alertas de reposição para pequenos negócios.",
    stack: ["Flask", "SQLAlchemy", "Bootstrap"],
    status: "Planejado",
    accent: "#ff8c68",
    problem: "Entradas, saídas e custos dispersos impedem uma visão confiável do estoque e da necessidade de compra.",
    solution: "Sistema de movimentação com saldo, custo médio, ponto de reposição e indicadores de giro por produto.",
    integrations: ["SQLAlchemy ORM", "Importação por Excel", "Relatórios PDF"],
    highlights: ["Custo médio", "Alertas de reposição", "Giro e margem"],
  },
  {
    slug: "business-api",
    title: "Business API",
    eyebrow: "API REST",
    description: "API documentada para clientes, produtos e lançamentos com autenticação, validação e testes automatizados.",
    stack: ["FastAPI", "PostgreSQL", "Pytest"],
    status: "Planejado",
    accent: "#57b8ff",
    problem: "Sistemas isolados precisam compartilhar cadastros e movimentos sem duplicar regras de negócio.",
    solution: "API REST com contratos claros, autenticação, validação e cobertura dos fluxos críticos por testes.",
    integrations: ["PostgreSQL", "OpenAPI", "Aplicações web e BI"],
    highlights: ["Documentação automática", "Autenticação", "Testes de contrato"],
  },
  {
    slug: "python-practice-lab",
    title: "Python Practice Lab",
    eyebrow: "Treinamento Python · evolução no GitHub",
    description: "Laboratório público de prática deliberada, organizado em 20 etapas: fundamentos, lógica, funções, arquivos, POO, testes, SQL, SQLite, arquitetura CRUD e segurança.",
    stack: ["Python 3.13+", "Pytest", "SQL", "SQLite", "Git"],
    status: "Em evolução",
    accent: "#b47cff",
    githubUrl: "https://github.com/igormauriciomota/python-practice-lab",
    problem: "Aprendizados soltos dificultam revisar conceitos, construir autonomia e demonstrar evolução técnica de forma verificável.",
    solution: "Repositório progressivo com teoria aplicada, exercícios, desafios, testes, mini projetos e histórico de commits organizado por competência.",
    integrations: ["GitHub para histórico verificável", "Pytest para qualidade", "SQL e SQLite para persistência", "Arquitetura CRUD e autenticação"],
    highlights: ["20 etapas de aprendizagem", "Prática diária registrada por commits", "Do fundamento à arquitetura", "Gráfico de evolução atualizado pelo GitHub"],
  },
  {
    slug: "django-erp-control-center",
    title: "Django ERP Control Center",
    eyebrow: "Django · ERP e gestão",
    description: "Arquitetura de ERP multiusuário para financeiro, estoque, compras e indicadores, com administração e permissões centralizadas.",
    stack: ["Django", "PostgreSQL", "Django REST Framework", "Bootstrap", "Docker"],
    status: "Planejado",
    accent: "#44b78b",
    problem: "Processos administrativos desconectados geram retrabalho, duplicidade de cadastro e pouca rastreabilidade entre áreas.",
    solution: "Projeto modular em Django com autenticação, grupos de permissão, ORM, painel administrativo e APIs para integrar os módulos do ERP.",
    integrations: ["Django ORM → PostgreSQL", "Django Admin → back office", "Django REST Framework → API", "Celery e Redis → tarefas", "Power BI → análise gerencial"],
    highlights: ["Multiusuário e permissões", "Módulos desacoplados", "Auditoria e indicadores"],
  },
  {
    slug: "django-data-portal",
    title: "Django Data Portal",
    eyebrow: "Django · dados e automação",
    description: "Portal seguro para importar planilhas, validar dados, executar análises e disponibilizar resultados por painel e API.",
    stack: ["Django", "Pandas", "PostgreSQL", "Celery", "Power BI"],
    status: "Planejado",
    accent: "#0c4b33",
    problem: "Análises recorrentes dependem de etapas manuais e arquivos enviados sem validação ou histórico de processamento.",
    solution: "Fluxo web com upload controlado, processamento assíncrono, registro de execuções e entrega de métricas por usuário.",
    integrations: ["Pandas → tratamento", "Celery → processamento assíncrono", "PostgreSQL → histórico", "Power BI e API → consumo"],
    highlights: ["Importação validada", "Fila de processamento", "Histórico por usuário"],
  },
];

export function slugifyProject(title: string) {
  return title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function projectHref(project: Project) {
  return `/projetos/${project.id ?? project.slug ?? slugifyProject(project.title)}`;
}

export function enrichProjects(dynamicProjects: Project[]) {
  const byTitle = new Map(portfolioProjects.map((project) => [project.title.toLowerCase(), project]));
  const canonicalTitle = (title: string) => title.toLowerCase() === "finance mindshift" ? "gerente 360" : title.toLowerCase();
  const enriched = dynamicProjects.map((project) => {
    const isLegacyGerente = project.title.toLowerCase() === "finance mindshift";
    const base = byTitle.get(canonicalTitle(project.title));
    return {
      ...base,
      ...project,
      title: isLegacyGerente && base ? base.title : project.title,
      eyebrow: isLegacyGerente && base ? base.eyebrow : project.eyebrow,
      description: isLegacyGerente && base ? base.description : project.description,
      stack: isLegacyGerente && base ? base.stack : project.stack,
      status: isLegacyGerente && base ? base.status : project.status,
      githubUrl: project.githubUrl || base?.githubUrl,
      videoUrl: project.videoUrl || base?.videoUrl,
      coverUrl: project.coverUrl || base?.coverUrl,
    };
  });
  const dynamicTitles = new Set(dynamicProjects.map((project) => canonicalTitle(project.title)));
  return [...enriched, ...portfolioProjects.filter((project) => !dynamicTitles.has(project.title.toLowerCase()))];
}

export function findCatalogProject(slug: string) {
  return portfolioProjects.find((project) => project.slug === slug || String(project.id) === slug);
}
