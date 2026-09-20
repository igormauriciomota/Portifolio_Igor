"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import HologramPortal from "./HologramPortal";
import TechnologyIcon from "./TechnologyIcon";
import { enrichProjects, portfolioProjects, projectHref, type Project } from "./project-catalog";

type PublicProfile = {
  name: string;
  headline: string;
  location: string;
  email: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  photoKey: string | null;
  resumeKey: string | null;
};

type GitHubActivity = {
  username: string | null;
  total: number;
  days: { date: string; count: number }[];
};

const initialProfile: PublicProfile = {
  name: "Igor Mota",
  headline: "Desenvolvedor Python & Analista de Dados",
  location: "Belo Horizonte, MG",
  email: "mota.full.stack@gmail.com",
  linkedinUrl: "https://www.linkedin.com/in/igor-mota-320872274",
  githubUrl: "https://github.com/igormauriciomota",
  photoKey: null,
  resumeKey: null,
};

const navItems = [
  ["inicio", "Início", "01"],
  ["sobre", "Sobre", "02"],
  ["habilidades", "Habilidades", "03"],
  ["projetos", "Projetos", "04"],
  ["codigo", "Código-fonte", "05"],
  ["artigos", "Artigos", "06"],
  ["contato", "Contato", "07"],
] as const;

function StatusDot({ status }: { status: string }) {
  const className =
    status === "Em desenvolvimento"
      ? "status status-live"
      : status === "Em evolução"
        ? "status status-progress"
        : "status status-planned";

  return <span className={className}>{status}</span>;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("inicio");
  const [projectItems, setProjectItems] = useState<Project[]>(portfolioProjects);
  const [profile, setProfile] = useState<PublicProfile>(initialProfile);
  const [githubActivity, setGithubActivity] = useState<GitHubActivity>({ username: null, total: 0, days: [] });
  const [hologramOpen, setHologramOpen] = useState(false);
  const projectRail = useRef<HTMLDivElement>(null);
  const year = useMemo(() => new Date().getFullYear(), []);
  const portraitSrc = profile.photoKey ? `/api/files/${profile.photoKey}` : "/igor-portfolio-realistic-v2.webp";
  const avatarSrc = profile.photoKey ? `/api/files/${profile.photoKey}` : "/igor-avatar-realistic-v2.webp";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-28% 0px -55% 0px", threshold: [0.1, 0.3, 0.6] },
    );

    navItems.forEach(([id]) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // O conteúdo público é carregado do banco; o HTML inicial mantém a página útil
    // durante o primeiro instante da navegação ou se a rede estiver indisponível.
    void Promise.all([fetch("/api/projects"), fetch("/api/profile"), fetch("/api/github")]).then(async ([projectResponse, profileResponse, githubResponse]) => {
      if (projectResponse.ok) {
        const data = (await projectResponse.json()) as { projects?: Project[] };
        if (data.projects?.length) setProjectItems(enrichProjects(data.projects));
      }
      if (profileResponse.ok) {
        const data = (await profileResponse.json()) as { profile?: PublicProfile };
        if (data.profile) {
          setProfile({
            ...initialProfile,
            ...data.profile,
            email: data.profile.email || initialProfile.email,
            linkedinUrl: data.profile.linkedinUrl || initialProfile.linkedinUrl,
            githubUrl: data.profile.githubUrl || initialProfile.githubUrl,
          });
        }
      }
      if (githubResponse.ok) {
        const data = (await githubResponse.json()) as GitHubActivity;
        setGithubActivity(data);
      }
    }).catch(() => undefined);
  }, []);

  function scrollProjects(direction: -1 | 1) {
    projectRail.current?.scrollBy({ left: direction * 410, behavior: "smooth" });
  }

  return (
    <div className="site-shell">
      <aside className="sidebar" aria-label="Navegação principal">
        <a className="brand" href="#inicio" aria-label="Ir para o início">
          <span className="brand-mark">IM</span>
          <span>
            <strong>Igor Mota</strong>
            <small>Python • Dados • Negócios</small>
          </span>
        </a>

        <div className="profile-orbit" aria-label={`Foto de ${profile.name}`}>
          <img className="profile-photo" src={avatarSrc} alt={`Retrato de rosto e ombros de ${profile.name}`} />
          <span className="orbit-dot" />
        </div>

        <p className="sidebar-role">{profile.headline}</p>
        <p className="sidebar-location">{profile.location}</p>

        <nav className="side-nav">
          {navItems.map(([id, label, index]) => (
            <a
              key={id}
              className={activeSection === id ? "active" : ""}
              href={`#${id}`}
            >
              <span>{index}</span>
              {label}
            </a>
          ))}
        </nav>

        {profile.resumeKey ? (
          <a className="resume-link" href={`/api/files/${profile.resumeKey}?download=1`}>Baixar currículo <span>↓</span></a>
        ) : (
          <a className="resume-link" href="/downloads/igor-mota-portfolio-flask.zip" download>Baixar código-fonte <span>↓</span></a>
        )}

        <div className="sidebar-footer">
          <span className="availability-dot" />
          Aberto a oportunidades em tecnologia
        </div>
      </aside>

      <header className="mobile-header">
        <a className="brand" href="#inicio">
          <span className="brand-mark">IM</span>
          <strong>Igor Mota</strong>
        </a>
        <a className="mobile-cta" href="#contato">Contato</a>
      </header>

      <main className="content">
        <section className="hero section" id="inicio">
          <img className="hero-background-image" src={portraitSrc} alt="" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow hero-glow-one" aria-hidden="true" />
          <div className="hero-glow hero-glow-two" aria-hidden="true" />

          <div className="hero-copy">
            <p className="kicker"><span /> Portfólio profissional · {year}</p>
            <h1>Tecnologia para transformar<em> dados em decisões.</em></h1>
            <p className="hero-lead">
              Uno experiência em controladoria e contabilidade à programação
              para criar sistemas de negócio claros, auditáveis e úteis.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#projetos">Explorar projetos <span aria-hidden="true">↗</span></a>
              <button className="button button-hologram" type="button" onClick={() => setHologramOpen(true)}><i aria-hidden="true" /> Entrar no holograma</button>
              <a className="button button-ghost" href="#sobre">Conhecer trajetória</a>
            </div>

            <dl className="hero-metrics">
              <div><dt>02</dt><dd>áreas conectadas<br />Python + negócios</dd></div>
              <div><dt>08</dt><dd>projetos estratégicos<br />e estudos de caso</dd></div>
              <div><dt>01</dt><dd>objetivo central<br />resolver problemas reais</dd></div>
            </dl>
          </div>

          <nav className="hero-tech-paths" aria-label="Explorar competências">
            <Link className="tech-path-python" href="/tecnologias/python"><TechnologyIcon kind="python" /><b>Python</b><small>Web · APIs · automação</small><i>↗</i></Link>
            <Link className="tech-path-django" href="/tecnologias/django"><TechnologyIcon kind="django" /><b>Django</b><small>ERP · portais · integrações</small><i>↗</i></Link>
            <Link className="tech-path-sql" href="/tecnologias/sql"><TechnologyIcon kind="sql" /><b>SQL</b><small>Modelagem · consultas</small><i>↗</i></Link>
            <Link className="tech-path-power-bi" href="/tecnologias/power-bi"><TechnologyIcon kind="power-bi" /><b>Power BI</b><small>Dashboard interativo</small><i>↗</i></Link>
            <Link className="tech-path-analytics" href="/tecnologias/analise-de-dados"><TechnologyIcon kind="analytics" /><b>Análise de Dados</b><small>Da pergunta à decisão</small><i>↗</i></Link>
          </nav>

          <a className="scroll-cue" href="#sobre"><span>SCROLL</span><i /></a>
        </section>

        <section className="section about" id="sobre">
          <div className="section-heading">
            <p>01 · SOBRE MIM</p>
            <h2>Negócio por experiência.<br /><span>Tecnologia por escolha.</span></h2>
          </div>

          <div className="about-grid">
            <div className="about-story">
              <p className="lead-paragraph">
                Sou <strong>Igor Mota</strong>, profissional de controladoria e
                formado em Ciências Contábeis e Análise e Desenvolvimento de Sistemas.
              </p>
              <p>
                Minha transição para tecnologia nasce da prática: entendo os dados,
                regras e controles que sustentam uma empresa e estou transformando
                esse repertório em aplicações Python, APIs e análises acionáveis.
              </p>
              <p>
                Gosto de resolver problemas que reduzem trabalho manual, deixam
                números rastreáveis e ajudam pessoas a decidir com mais segurança.
              </p>
              <div className="quote-card"><span>“</span><p>Meu diferencial não é apenas programar: é compreender o problema de negócio antes de escrever a solução.</p></div>
            </div>

            <div className="timeline" aria-label="Trajetória profissional">
              <article><time>2025 — atual</time><h3>Assistente de Controladoria</h3><p>Integração e conferência fiscal, faturamento, relatórios e ERP RM.</p></article>
              <article><time>Formação</time><h3>Contabilidade + ADS</h3><p>Base multidisciplinar para criar tecnologia aplicada a processos empresariais.</p></article>
              <article><time>Próximo capítulo</time><h3>Desenvolvimento Python &amp; Dados</h3><p>Portfólio orientado a sistemas ERP, automação, APIs e inteligência analítica.</p></article>
            </div>
          </div>
        </section>

        <section className="section skills" id="habilidades">
          <div className="section-heading split-heading">
            <div><p>02 · STACK TÉCNICA</p><h2>Ferramentas com<br /><span>propósito.</span></h2></div>
            <p className="heading-note">Níveis descritos com honestidade: o que já aplico, o que estou consolidando e o que integra meu roadmap.</p>
          </div>

          <div className="skill-board">
            <Link className="skill-featured skill-python" href="/tecnologias/python"><div className="skill-number">01</div><p className="skill-label">Base principal</p><TechnologyIcon kind="python" className="skill-tech-icon" /><h3>Python</h3><p>Fundamentos, funções, módulos, POO, arquivos, SQLite, CRUD e evolução para aplicações web.</p><span className="level-tag">Explorar aplicações ↗</span></Link>
            <Link className="skill-api" href="/tecnologias/python"><div className="skill-number">02</div><p className="skill-label">Web</p><TechnologyIcon kind="api" className="skill-tech-icon" /><h3>Flask · APIs</h3><p>Rotas, Jinja, templates, formulários, Blueprints e arquitetura modular.</p><span className="level-tag">Ver desenvolvimento web ↗</span></Link>
            <Link className="skill-django" href="/tecnologias/django"><div className="skill-number">03</div><p className="skill-label">Framework completo</p><TechnologyIcon kind="django" className="skill-tech-icon" /><h3>Django</h3><p>ORM, autenticação, administração, segurança e APIs para aplicações empresariais escaláveis.</p><span className="level-tag">Explorar Django ↗</span></Link>
            <Link className="skill-sql" href="/tecnologias/sql"><div className="skill-number">04</div><p className="skill-label">Dados</p><TechnologyIcon kind="sql" className="skill-tech-icon" /><h3>SQL · Pandas</h3><p>Consultas, limpeza, exploração, indicadores e integração com Excel.</p><span className="level-tag">Entender a camada de dados ↗</span></Link>
            <Link className="skill-power-bi" href="/tecnologias/power-bi"><div className="skill-number">05</div><p className="skill-label">Visualização</p><TechnologyIcon kind="power-bi" className="skill-tech-icon" /><h3>Power BI</h3><p>Modelagem, medidas, dashboards executivos e comunicação visual.</p><span className="level-tag">Testar laboratório de dados ↗</span></Link>
          </div>

          <div className="stack-strip" aria-label="Tecnologias do roadmap">
            {["Flask", "Django", "FastAPI", "Bootstrap", "PostgreSQL", "Docker", "GitHub", "Pytest"].map((item) => <span key={item}>{item}</span>)}
          </div>
        </section>

        <section className="section projects" id="projetos">
          <div className="section-heading project-heading">
            <div><p>03 · PROJETOS</p><h2>Problemas reais.<br /><span>Soluções demonstráveis.</span></h2></div>
            <div className="project-heading-actions"><Link className="button button-ghost" href="/projetos">Ver todos os projetos ↗</Link><div className="rail-controls" aria-label="Controles do carrossel">
              <button type="button" onClick={() => scrollProjects(-1)} aria-label="Projetos anteriores">←</button>
              <button type="button" onClick={() => scrollProjects(1)} aria-label="Próximos projetos">→</button>
            </div></div>
          </div>

          <div className="project-rail" ref={projectRail}>
            {projectItems.map((project, index) => (
              <article className="project-card" key={project.title} style={{ "--project-accent": project.accent } as React.CSSProperties}>
                <div className="project-index">0{index + 1}</div>
                {project.imageKey ? (
                  <Link href={projectHref(project)} className="project-visual"><img className="project-cover" src={`/api/files/${project.imageKey}`} alt={`Tela do projeto ${project.title}`} /></Link>
                ) : project.coverUrl ? (
                  <Link href={projectHref(project)} className="project-visual project-visual-real"><img className="project-cover" src={project.coverUrl} alt={`Tela principal do projeto ${project.title}`} /></Link>
                ) : project.stack.includes("Django") ? (
                  <Link href={projectHref(project)} className="project-visual project-visual-django"><img src="/django-logo-positive.png" alt="Django" /><span>Python · Web · Business</span></Link>
                ) : (
                  <Link href={projectHref(project)} className="project-visual" aria-label={`Abrir estudo de caso ${project.title}`}>
                    <div className="mini-sidebar" />
                    <div className="mini-panel"><i /><i /><i /><span /><span /></div>
                    <div className="mini-chart"><b /><b /><b /><b /></div>
                  </Link>
                )}
                <p className="project-eyebrow">{project.eyebrow}</p>
                <h3>{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                <div className="project-footer">
                  <StatusDot status={project.status} />
                  <div className="project-links">
                    <Link href={projectHref(project)}>Estudo de caso</Link>
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">Código</a>}
                    {project.videoUrl && <a href={project.videoUrl} target="_blank" rel="noreferrer">Vídeo</a>}
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Testar ↗</a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="rail-note">Arraste horizontalmente ou abra a página completa para explorar todos os projetos.</p>
        </section>

        {/* Pacote completo: site publicado, versão Flask, documentação e recursos. */}
        <section className="section source-code" id="codigo">
          <div className="section-heading split-heading">
            <div>
              <p>04 · CÓDIGO-FONTE</p>
              <h2>Abra, modifique<br /><span>e aprenda no VS Code.</span></h2>
            </div>
            <p className="heading-note">
              O pacote reúne o site atual em React + TypeScript e a versão
              completa em Python + Flask, com documentação, imagens, vídeo,
              banco, painel administrativo e testes.
            </p>
          </div>

          <div className="source-layout">
            <div className="source-tree" aria-label="Arquitetura principal do pacote completo">
              <div className="source-window-top"><span /><span /><span /><small>portfolio-igor-mota-github/</small></div>
              <pre><code>{`README.md          # Guia completo e árvore de arquivos
run.py             # Inicia o Flask pela raiz
seed.py            # Cria banco, perfil e administrador
requirements.txt   # Dependências Python pela raiz
app/               # React, TypeScript e páginas públicas
├── admin/         # Painel administrativo
├── api/           # APIs de perfil, projetos e GitHub
├── projetos/      # Catálogo e estudos de caso
└── tecnologias/   # Python, Django, SQL e Power BI
db/                # Schema e acesso aos dados
drizzle/           # Migrações do banco
public/            # Imagens, ícones, vídeo e downloads
flask-source/      # Versão completa Python + Flask
├── app/           # Rotas, models, serviços e templates
├── tests/         # Testes automatizados com Pytest
└── .vscode/       # Execução e depuração no VS Code
scripts/           # Instalação e build
tests/             # Testes do site atual
worker/            # Entrada para Cloudflare
package.json       # Dependências e comandos`}</code></pre>
            </div>

            <div className="source-guide">
              <article><span>01</span><div><h3>Site publicado completo</h3><p>React, TypeScript, rotas, APIs, banco, imagens, vídeo e experiência interativa.</p></div></article>
              <article><span>02</span><div><h3>Versão Flask completa</h3><p>Python, Jinja, Bootstrap, SQLite, autenticação, CRUD, uploads e testes.</p></div></article>
              <article><span>03</span><div><h3>Preparado para o GitHub</h3><p>Run.py na raiz, guia de publicação, .gitignore, dependências e estrutura conferida.</p></div></article>
              <article><span>04</span><div><h3>Fotos e recursos incluídos</h3><p>Retratos, capas, vídeo do Gerente 360, ícones e documentação acompanham o código.</p></div></article>

              <a className="button button-primary source-download" href="/downloads/portfolio-igor-mota-github.zip" download>
                Baixar pacote completo para GitHub <span aria-hidden="true">↓</span>
              </a>
              <p className="source-help">Descompacte e abra primeiro README.md ou COMO-PUBLICAR-NO-GITHUB.md.</p>
            </div>
          </div>
        </section>

        <section className="section articles" id="artigos">
          <div className="section-heading"><p>05 · CONTEÚDO</p><h2>Aprender, resolver,<br /><span>documentar.</span></h2></div>
          <div className="github-activity">
            <div>
              <p>ATIVIDADE PÚBLICA RECENTE</p>
              <h3>{githubActivity.username ? `github.com/${githubActivity.username}` : "GitHub será conectado pelo painel"}</h3>
              <span>{githubActivity.username ? `${githubActivity.total} eventos públicos recentes` : "O gráfico passa a usar a API pública após cadastrar o perfil correto."}</span>
            </div>
            <div className="contribution-grid" aria-label="Atividade pública recente no GitHub">
              {(githubActivity.days.length ? githubActivity.days : Array.from({ length: 49 }, (_, index) => ({ date: `dia-${index + 1}`, count: 0 }))).map((day) => (
                <i key={day.date} className={`level-${Math.min(day.count, 4)}`} title={`${day.date}: ${day.count} evento(s)`} />
              ))}
            </div>
            {profile.githubUrl ? <a href={profile.githubUrl} target="_blank" rel="noreferrer">Abrir perfil ↗</a> : <a href="/admin">Conectar GitHub →</a>}
          </div>
          <div className="article-grid">
            <article><span className="article-tag">FLASK</span><time>LEITURA · 6 MIN</time><h3>Do erro “view retornou None” ao fluxo completo de uma rota Flask</h3><p>Um bug simples como ponto de partida para entender requisição, retorno e renderização de templates.</p><span className="text-link">Rascunho editorial →</span></article>
            <article><span className="article-tag">PYTHON</span><time>LEITURA · 8 MIN</time><h3>Como um CRUD com listas prepara o caminho para SQLite</h3><p>O que permanece igual — e o que muda — quando os dados deixam a memória e chegam ao banco.</p><span className="text-link">Rascunho editorial →</span></article>
            <article className="article-cta"><span>+ artigos</span><h3>Uma base de conhecimento construída junto com o portfólio.</h3><p>Erros, decisões de arquitetura e aprendizados serão transformados em conteúdo verificável.</p></article>
          </div>
        </section>

        <section className="section contact" id="contato">
          <div className="contact-card">
            <p className="kicker"><span /> VAMOS CONVERSAR</p>
            <h2>Tem um problema de negócio que pode virar uma <em>boa solução?</em></h2>
            <p>Busco oportunidades em desenvolvimento Python, sistemas empresariais e análise de dados — especialmente onde experiência de negócio também importa.</p>
            <div className="contact-actions">
              {profile.email ? <a className="button button-primary" href={`mailto:${profile.email}`}>Enviar e-mail</a> : <a className="button button-primary button-disabled" href="/admin">Adicionar e-mail profissional</a>}
              {profile.linkedinUrl ? <a className="button button-ghost" href={profile.linkedinUrl} target="_blank" rel="noreferrer">LinkedIn ↗</a> : <a className="button button-ghost button-disabled" href="/admin">Adicionar LinkedIn</a>}
              {profile.githubUrl && <a className="button button-ghost" href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a>}
              <a className="button button-ghost" href="https://wa.me/5531975340765" target="_blank" rel="noreferrer">WhatsApp ↗</a>
            </div>
            <small>Contato direto para oportunidades em Python, dados, BI, automação e sistemas empresariais.</small>
          </div>
        </section>

        <footer className="footer"><span>© {year} Igor Mota</span><span>Projetado com estratégia · Construído com código</span><a href="#inicio">Voltar ao topo ↑</a></footer>
      </main>
      <HologramPortal open={hologramOpen} onClose={() => setHologramOpen(false)} portraitSrc={portraitSrc} />
    </div>
  );
}
