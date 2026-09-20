import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import TechnologyIcon, { type TechnologyIconKind } from "../../TechnologyIcon";
import DataLab from "../power-bi/DataLab";

type Technology = {
  slug: string;
  icon: TechnologyIconKind;
  title: string;
  eyebrow: string;
  summary: string;
  impact: string;
  applications: { title: string; text: string; tag: string }[];
  process: { number: string; title: string; text: string }[];
  stack: string[];
  officialUrl?: string;
};

const technologies: Record<string, Technology> = {
  python: {
    slug: "python", icon: "python", title: "Python", eyebrow: "DESENVOLVIMENTO · AUTOMAÇÃO · APIs",
    summary: "Uso Python para transformar regras de negócio em sistemas claros, integrações reutilizáveis e rotinas que reduzem trabalho manual.",
    impact: "Minha base contábil ajuda a programar com atenção a validação, rastreabilidade e significado dos números — não apenas à sintaxe.",
    applications: [
      { title: "Desenvolvimento web", text: "Aplicações Flask com rotas, templates, formulários, autenticação e arquitetura modular.", tag: "FLASK · HTML · CSS" },
      { title: "APIs", text: "Endpoints REST para conectar clientes, produtos, lançamentos e serviços com validação e documentação.", tag: "FASTAPI · JSON · TESTES" },
      { title: "Automação", text: "Leitura de planilhas e XML, conferências, padronização de dados e geração de relatórios repetíveis.", tag: "PANDAS · EXCEL · XML" },
    ],
    process: [
      { number: "01", title: "Entender", text: "Mapeio a regra, os usuários e o resultado esperado." },
      { number: "02", title: "Modelar", text: "Organizo módulos, dados, validações e casos de erro." },
      { number: "03", title: "Construir", text: "Implemento a solução em partes pequenas e testáveis." },
      { number: "04", title: "Evoluir", text: "Meço uso, documento decisões e planejo melhorias." },
    ],
    stack: ["Python", "Flask", "FastAPI", "Pandas", "Pytest", "SQLite", "PostgreSQL"],
  },
  django: {
    slug: "django", icon: "django", title: "Django", eyebrow: "PYTHON · FRAMEWORK WEB DE ALTO NÍVEL",
    summary: "Django é um framework web de alto nível escrito em Python para desenvolver aplicações completas com rapidez, segurança e organização.",
    impact: "Uso Django como caminho para sistemas empresariais maiores: seus componentes integrados ajudam a manter regras, usuários, dados e administração dentro de uma arquitetura consistente.",
    applications: [
      { title: "Sistemas empresariais", text: "ERP, portais internos e aplicações multiusuário com módulos, regras de acesso e rotinas administrativas.", tag: "ERP · ADMIN · PERMISSÕES" },
      { title: "Dados e segurança", text: "Models descrevem o domínio, o ORM conversa com o banco e recursos nativos apoiam autenticação e proteção contra ataques comuns.", tag: "ORM · AUTH · MIGRATIONS" },
      { title: "APIs e integrações", text: "Django REST Framework conecta front-ends, aplicativos, Power BI e serviços externos sem duplicar regras de negócio.", tag: "DRF · JSON · WEBHOOKS" },
    ],
    process: [
      { number: "01", title: "Modelar o domínio", text: "Transformo clientes, produtos, documentos e lançamentos em models e relacionamentos." },
      { number: "02", title: "Organizar aplicações", text: "Divido o sistema em apps com responsabilidades claras e URLs previsíveis." },
      { number: "03", title: "Entregar interfaces e APIs", text: "Views, templates e serializers apresentam os dados conforme cada público." },
      { number: "04", title: "Operar com segurança", text: "Administração, permissões, testes, tarefas assíncronas e deploy sustentam a evolução." },
    ],
    stack: ["Django", "Django REST Framework", "PostgreSQL", "Celery", "Redis", "Docker", "Bootstrap", "Power BI"],
    officialUrl: "https://www.djangoproject.com/start/overview/",
  },
  sql: {
    slug: "sql", icon: "sql", title: "SQL", eyebrow: "MODELAGEM · CONSULTAS · QUALIDADE",
    summary: "Estruturo e consulto dados relacionais para que sistemas e análises trabalhem sobre informações consistentes, explicáveis e recuperáveis.",
    impact: "Em projetos de ERP e BI, SQL é a ponte entre a operação diária e a visão gerencial: uma consulta correta evita decisões baseadas em números incompletos.",
    applications: [
      { title: "Modelagem de dados", text: "Entidades, relacionamentos, chaves e regras que representam clientes, produtos e movimentos financeiros.", tag: "SCHEMA · INTEGRIDADE" },
      { title: "Consultas analíticas", text: "Filtros, junções, agregações e indicadores para revelar desempenho por período, produto ou região.", tag: "JOIN · CTE · GROUP BY" },
      { title: "Integração", text: "Camada de dados para aplicações Python, APIs e painéis com consistência entre cadastro e análise.", tag: "PYTHON · API · BI" },
    ],
    process: [
      { number: "01", title: "Definir", text: "Traduzo processos em entidades e regras de integridade." },
      { number: "02", title: "Organizar", text: "Reduzo duplicidade e estabeleço relacionamentos claros." },
      { number: "03", title: "Consultar", text: "Crio consultas legíveis e verificáveis para cada pergunta." },
      { number: "04", title: "Otimizar", text: "Reviso índices, volume e uso antes de escalar." },
    ],
    stack: ["SQL", "PostgreSQL", "SQLite", "Modelagem relacional", "ETL", "Power Query"],
  },
  "power-bi": {
    slug: "power-bi", icon: "power-bi", title: "Power BI & Dashboards", eyebrow: "POWER QUERY · KPIs · STORYTELLING",
    summary: "Converto dados operacionais em indicadores visuais que ajudam lideranças a localizar variações, comparar resultados e agir com contexto.",
    impact: "O painel é o fim de uma cadeia: primeiro vêm qualidade, modelagem e definição do indicador. Só então o gráfico se torna confiável.",
    applications: [
      { title: "Preparação", text: "Limpeza, tipos corretos, tratamento de ausências e padronização com Power Query.", tag: "POWER QUERY · ETL" },
      { title: "Modelo e métricas", text: "Relacionamentos, calendário, medidas e KPIs alinhados às perguntas do negócio.", tag: "DAX · MODELO ESTRELA" },
      { title: "Dashboard", text: "Hierarquia visual, filtros e narrativa para leitura rápida sem perder a possibilidade de investigar.", tag: "UX · KPIs · INSIGHTS" },
    ],
    process: [
      { number: "01", title: "Pergunta", text: "Defino qual decisão o painel precisa apoiar." },
      { number: "02", title: "Qualidade", text: "Perfilo e preparo os dados antes dos cálculos." },
      { number: "03", title: "Modelo", text: "Crio medidas e dimensões com regras explícitas." },
      { number: "04", title: "Comunicação", text: "Apresento o indicador, o contexto e a próxima ação." },
    ],
    stack: ["Power BI", "Power Query", "DAX", "Excel", "SQL", "Python", "Storytelling"],
  },
  "analise-de-dados": {
    slug: "analise-de-dados", icon: "analytics", title: "Análise de Dados", eyebrow: "DESCREVER · EXPLICAR · PREVER · RECOMENDAR",
    summary: "Estruturo a análise como uma conversa entre pergunta, evidência e decisão — do resumo do passado à recomendação responsável.",
    impact: "Combino visão contábil e tecnologia para questionar origem, conceito e qualidade do dado antes de comunicar qualquer conclusão.",
    applications: [
      { title: "Descritiva", text: "Mostra o que aconteceu por meio de totais, médias, frequências, tendências e distribuições.", tag: "O QUE ACONTECEU?" },
      { title: "Diagnóstica", text: "Compara segmentos, períodos e anomalias para levantar hipóteses sobre causas e padrões.", tag: "POR QUE ACONTECEU?" },
      { title: "Preditiva e prescritiva", text: "Estima cenários e traduz resultados em opções de ação, sempre explicitando limites e premissas.", tag: "O QUE PODEMOS FAZER?" },
    ],
    process: [
      { number: "01", title: "Coletar", text: "Confirmo fonte, granularidade, período e significado." },
      { number: "02", title: "Preparar", text: "Trato tipos, ausências, duplicidades e inconsistências." },
      { number: "03", title: "Analisar", text: "Aplico métricas e comparações adequadas à pergunta." },
      { number: "04", title: "Comunicar", text: "Separo fato, hipótese, previsão e recomendação." },
    ],
    stack: ["Pandas", "Excel", "Power BI", "SQL", "Estatística", "Visualização"],
  },
};

export function generateStaticParams() {
  return Object.keys(technologies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const technology = technologies[(await params).slug];
  if (!technology) return {};
  return { title: `${technology.title} | Igor Mota`, description: technology.summary };
}

export default async function TechnologyPage({ params }: { params: Promise<{ slug: string }> }) {
  const technology = technologies[(await params).slug];
  if (!technology) notFound();

  return (
    <main className="technology-page">
      <img className="technology-backdrop" src="/igor-portfolio-realistic-v2.webp" alt="" aria-hidden="true" />
      <header className="technology-nav"><Link className="brand" href="/"><span className="brand-mark">IM</span><span><strong>Igor Mota</strong><small>Python • Dados • Negócios</small></span></Link><nav><Link href="/#projetos">Projetos</Link><Link href="/#contato">Contato</Link><Link className="technology-back" href="/">← Voltar ao portfólio</Link></nav></header>

      <section className="technology-hero">
        <div className="technology-hero-copy"><p>{technology.eyebrow}</p><TechnologyIcon kind={technology.icon} className={`technology-mark${technology.slug === "django" ? " technology-mark-django" : ""}`} label={`Ícone de ${technology.title}`} /><h1>{technology.title}</h1><strong>{technology.summary}</strong><span>{technology.impact}</span><div className="technology-actions">{technology.slug === "power-bi" && <a className="button button-primary" href="#laboratorio">Testar com uma planilha ↓</a>}{technology.slug === "django" && <Link className="button button-primary" href="/projetos?filtro=Django">Ver projetos em Django ↗</Link>}<Link className="button button-ghost" href="/projetos">Ver todos os projetos ↗</Link></div></div>
      </section>

      <section className="technology-content">
        <div className="technology-heading"><p>COMO EU APLICO</p><h2>Conhecimento demonstrado em <span>problemas reais.</span></h2></div>
        <div className="application-grid">{technology.applications.map((item, index) => <article key={item.title}><span>0{index + 1} · {item.tag}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        <div className="technology-process"><div><p>MÉTODO DE TRABALHO</p><h2>Da necessidade à <span>entrega verificável.</span></h2></div><ol>{technology.process.map((step) => <li key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol></div>
        <div className="technology-stack" aria-label="Tecnologias relacionadas">{technology.stack.map((item) => <span key={item}>{item}</span>)}</div>
        {technology.slug === "django" && (
          <section className="django-integration" aria-labelledby="django-integration-title">
            <div><p>COMO O DJANGO FUNCIONA</p><h2 id="django-integration-title">Uma arquitetura conectada do navegador ao banco de dados.</h2><span>A URL recebe a requisição, a view coordena a regra, o model acessa os dados pelo ORM e o template ou a API devolve a resposta.</span></div>
            <div className="django-flow" aria-label="Fluxo simplificado de uma aplicação Django">
              <article><b>01</b><strong>URLs</strong><span>Direcionam cada requisição</span></article><i>→</i>
              <article><b>02</b><strong>Views</strong><span>Orquestram a regra de negócio</span></article><i>→</i>
              <article><b>03</b><strong>Models e ORM</strong><span>Validam e consultam dados</span></article><i>→</i>
              <article><b>04</b><strong>Template ou API</strong><span>Entrega HTML ou JSON</span></article>
            </div>
            <div className="django-connections">
              <article><span>POSTGRESQL</span><p>Persistência relacional, transações e consultas estruturadas.</p></article>
              <article><span>DRF</span><p>APIs REST para React, aplicativos, parceiros e automações.</p></article>
              <article><span>CELERY + REDIS</span><p>Importações, relatórios e tarefas demoradas fora da requisição.</p></article>
              <article><span>POWER BI</span><p>Dados preparados por consultas, APIs ou camadas analíticas.</p></article>
            </div>
            <a className="django-official-link" href={technology.officialUrl} target="_blank" rel="noreferrer">Conhecer a visão geral oficial do Django ↗</a>
          </section>
        )}
      </section>

      {technology.slug === "power-bi" && <DataLab />}

      <section className="technology-cta"><p>VISÃO DE NEGÓCIO + TECNOLOGIA</p><h2>Procura alguém capaz de conectar processos, dados e desenvolvimento?</h2><div><a className="button button-primary" href="mailto:mota.full.stack@gmail.com">Conversar por e-mail</a><a className="button button-ghost" href="https://www.linkedin.com/in/igor-mota-320872274" target="_blank" rel="noreferrer">LinkedIn ↗</a></div></section>
      <footer className="technology-footer"><span>© Igor Mota</span><Link href="/">Portfólio principal</Link></footer>
    </main>
  );
}
