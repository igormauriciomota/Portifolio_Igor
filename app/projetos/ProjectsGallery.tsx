"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { enrichProjects, portfolioProjects, projectHref, type Project } from "../project-catalog";

const filters = ["Todos", "Django", "Web", "APIs", "Dados", "ERP"] as const;

function matchesFilter(project: Project, filter: string) {
  if (filter === "Todos") return true;
  const text = `${project.title} ${project.eyebrow} ${project.stack.join(" ")}`.toLowerCase();
  if (filter === "Web") return /flask|django|bootstrap|web/.test(text);
  if (filter === "APIs") return /api|fastapi|rest framework|drf/.test(text);
  if (filter === "Dados") return /dados|pandas|power bi|sql|analytics/.test(text);
  if (filter === "ERP") return /erp|finance|estoque|gestão/.test(text);
  return text.includes(filter.toLowerCase());
}

export default function ProjectsGallery() {
  const [projects, setProjects] = useState<Project[]>(portfolioProjects);
  const [filter, setFilter] = useState<string>("Todos");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("filtro");
    const requestedFilter = requested
      ? filters.find((item) => item.toLowerCase() === requested.toLowerCase())
      : undefined;
    if (requestedFilter) {
      queueMicrotask(() => setFilter(requestedFilter));
    }
    void fetch("/api/projects").then(async (response) => {
      if (!response.ok) return;
      const data = (await response.json()) as { projects?: Project[] };
      if (data.projects?.length) setProjects(enrichProjects(data.projects));
    }).catch(() => undefined);
  }, []);

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => matchesFilter(project, filter)).filter((project) => !normalizedQuery || `${project.title} ${project.description} ${project.stack.join(" ")}`.toLowerCase().includes(normalizedQuery));
  }, [filter, projects, query]);

  return (
    <main className="projects-page">
      <header className="projects-nav">
        <Link className="brand" href="/"><span className="brand-mark">IM</span><span><strong>Igor Mota</strong><small>Projetos e estudos de caso</small></span></Link>
        <nav><Link href="/tecnologias/django">Django</Link><Link href="/tecnologias/power-bi">Power BI</Link><Link className="technology-back" href="/">← Portfólio</Link></nav>
      </header>

      <section className="projects-page-hero">
        <p>PORTFÓLIO DE PRODUTOS DIGITAIS</p>
        <h1>Problemas reais.<br /><span>Soluções demonstráveis.</span></h1>
        <div><p>Cada card abre uma página individual com contexto, solução, tecnologias, integrações, links e vídeo quando publicado.</p><strong>{projects.length.toString().padStart(2, "0")} projetos</strong></div>
      </section>

      <section className="projects-explorer" id="django">
        <div className="project-filters" aria-label="Filtrar projetos">
          <div>{filters.map((item) => <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
          <label><span className="sr-only">Buscar projeto</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar projeto ou tecnologia" /><i aria-hidden="true">⌕</i></label>
        </div>

        <div className="projects-grid">
          {visibleProjects.map((project, index) => (
            <article className="project-showcase-card" key={`${project.id ?? project.slug}-${project.title}`} style={{ "--project-accent": project.accent } as React.CSSProperties}>
              <Link className={`showcase-cover${project.stack.includes("Django") ? " showcase-cover-django" : ""}${project.coverUrl ? " showcase-cover-real" : ""}`} href={projectHref(project)}>
                {project.imageKey ? <img src={`/api/files/${project.imageKey}`} alt={`Tela do projeto ${project.title}`} /> : project.coverUrl ? <img src={project.coverUrl} alt={`Tela principal do projeto ${project.title}`} /> : project.stack.includes("Django") ? <><img src="/django-logo-positive.png" alt="Django" /><span>Arquitetura Python para aplicações empresariais</span></> : <div className="showcase-ui" aria-hidden="true"><i /><i /><i /><b /><b /><b /><b /></div>}
                <em>CASE {String(index + 1).padStart(2, "0")}</em>
              </Link>
              <div className="showcase-content">
                <div className="showcase-meta"><span>{project.eyebrow}</span><b>{project.status}</b></div>
                <h2><Link href={projectHref(project)}>{project.title}</Link></h2>
                <p>{project.description}</p>
                <div className="project-stack">{project.stack.slice(0, 5).map((item) => <span key={item}>{item}</span>)}</div>
                <div className="showcase-actions"><Link href={projectHref(project)}>Ver estudo de caso ↗</Link><span>{project.videoUrl ? "Vídeo disponível" : "Página completa"}</span></div>
              </div>
            </article>
          ))}
        </div>

        {!visibleProjects.length && <div className="projects-empty"><h2>Nenhum projeto encontrado</h2><p>Limpe a busca ou escolha outro filtro.</p><button type="button" onClick={() => { setFilter("Todos"); setQuery(""); }}>Mostrar todos</button></div>}
      </section>

      <section className="projects-admin-note"><div><p>ÁREA DE ATUALIZAÇÃO</p><h2>Novos projetos podem entrar sem alterar o código da página.</h2></div><p>O painel protegido permite cadastrar imagem, tecnologias, status, GitHub, demonstração e vídeo curto. Cada cadastro recebe automaticamente sua própria página pública.</p><Link className="button button-primary" href="/admin">Acessar meu painel</Link></section>
      <footer className="technology-footer"><span>© Igor Mota</span><Link href="/#contato">Contato profissional ↗</Link></footer>
    </main>
  );
}
