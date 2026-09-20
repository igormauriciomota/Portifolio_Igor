"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { enrichProjects, findCatalogProject, type Project } from "../../project-catalog";
import GitHubProgress from "./GitHubProgress";

function videoSource(url?: string | null) {
  if (!url) return null;
  if (/^\/(?:[^?#]+)\.(?:mp4|webm)(?:[?#].*)?$/i.test(url)) return { type: "video", url };
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return { type: "embed", url: `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}` };
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
      if (id) return { type: "embed", url: `https://www.youtube-nocookie.com/embed/${id}` };
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) return { type: "embed", url: `https://player.vimeo.com/video/${id}` };
    }
    if (/\.(mp4|webm)(\?|$)/i.test(parsed.pathname)) return { type: "video", url };
    return { type: "link", url };
  } catch {
    return null;
  }
}

export default function ProjectDetail({ slug }: { slug: string }) {
  const [project, setProject] = useState<Project | null>(() => findCatalogProject(slug) ?? null);
  const [loading, setLoading] = useState(/^\d+$/.test(slug));

  useEffect(() => {
    if (!/^\d+$/.test(slug)) return;
    void fetch(`/api/projects/${slug}`).then(async (response) => {
      if (!response.ok) throw new Error();
      const data = (await response.json()) as { project: Project };
      setProject(enrichProjects([data.project])[0]);
    }).catch(() => setProject(null)).finally(() => setLoading(false));
  }, [slug]);

  const media = useMemo(() => videoSource(project?.videoUrl), [project?.videoUrl]);

  if (loading) return <main className="project-detail-state"><span>Carregando estudo de caso…</span></main>;
  if (!project) return <main className="project-detail-state"><h1>Projeto não encontrado</h1><Link className="button button-primary" href="/projetos">Voltar aos projetos</Link></main>;

  const problem = project.problem ?? `O projeto nasceu para organizar e automatizar o processo de ${project.eyebrow.toLowerCase()}, reduzindo etapas manuais e melhorando a confiabilidade das informações.`;
  const solution = project.solution ?? `${project.description} A solução foi estruturada para crescer por módulos, manter regras explícitas e facilitar integrações futuras.`;
  const integrations = project.integrations ?? project.stack.map((item) => `${item} integrado à arquitetura do projeto`);
  const highlights = project.highlights ?? ["Arquitetura organizada", "Validação das regras", "Evolução documentada"];
  const isPythonPracticeLab = project.slug === "python-practice-lab" || project.title.toLowerCase() === "python practice lab";

  return (
    <main className="project-detail" style={{ "--project-accent": project.accent } as React.CSSProperties}>
      <header className="projects-nav"><Link className="brand" href="/"><span className="brand-mark">IM</span><span><strong>Igor Mota</strong><small>Estudo de caso</small></span></Link><nav><Link href="/projetos">Todos os projetos</Link><Link className="technology-back" href="/">← Portfólio</Link></nav></header>

      <section className="project-detail-hero">
        <div className="project-detail-copy"><Link href="/projetos">← Todos os projetos</Link><p>{project.eyebrow} · 2026</p><h1>{project.title}</h1><strong>{project.description}</strong><div><span>{project.status}</span>{project.stack.includes("Django") && <img src="/django-logo-positive.png" alt="Django" />}</div></div>
        <div className={`project-detail-cover${project.stack.includes("Django") ? " is-django" : ""}${project.coverUrl ? " has-product-screen" : ""}`}>
          {project.imageKey ? <img src={`/api/files/${project.imageKey}`} alt={`Tela principal do projeto ${project.title}`} /> : project.coverUrl ? <img src={project.coverUrl} alt={`Tela principal do projeto ${project.title}`} /> : project.stack.includes("Django") ? <><img src="/django-logo-positive.png" alt="Django" /><p>Aplicação empresarial em Python</p></> : <div className="detail-ui" aria-hidden="true"><div /><div><i /><i /><i /><i /></div><span /><span /></div>}
        </div>
      </section>

      <section className="project-case-content">
        <div className="case-intro"><div><p>SOBRE O PROJETO</p><h2>Da necessidade à solução.</h2></div><dl><div><dt>Status</dt><dd>{project.status}</dd></div><div><dt>Foco</dt><dd>{project.eyebrow}</dd></div><div><dt>Tecnologias</dt><dd>{project.stack.join(", ")}</dd></div></dl></div>
        <div className="case-story"><article><span>01 · CONTEXTO</span><h3>O problema observado</h3><p>{problem}</p></article><article><span>02 · SOLUÇÃO</span><h3>Como o projeto responde</h3><p>{solution}</p></article></div>
        <div className="case-story"><article><span>03 · DESTAQUES</span><h3>O que será demonstrado</h3><ul>{highlights.map((item) => <li key={item}>{item}</li>)}</ul></article><article><span>04 · INTEGRAÇÕES</span><h3>Como as partes se conectam</h3><ul>{integrations.map((item) => <li key={item}>{item}</li>)}</ul></article></div>
        <div className="case-stack"><p>STACK UTILIZADA</p><div>{project.stack.map((item) => <span key={item}>{item}</span>)}</div></div>

        {isPythonPracticeLab && <GitHubProgress />}

        {media && <section className="case-video"><div><p>DEMONSTRAÇÃO DO PROJETO</p><h2>30 segundos pelas funções principais.</h2><span>Uma apresentação objetiva da visão geral, dos módulos operacionais e dos indicadores do sistema.</span></div>{media.type === "embed" ? <iframe src={media.url} title={`Demonstração de ${project.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : media.type === "video" ? <video controls preload="metadata" poster={project.coverUrl || undefined} src={media.url} aria-label={`Demonstração de 30 segundos do projeto ${project.title}`} /> : <a className="button button-primary" href={media.url} target="_blank" rel="noreferrer">Assistir demonstração ↗</a>}</section>}

        <div className="case-links"><div><p>TELA INICIAL E ACESSO</p><h2>Código, demonstração e publicação.</h2><span>Consulte o repositório público, assista à demonstração disponível e acompanhe a futura publicação do sistema.</span></div><div>{project.githubUrl ? <a className="button button-ghost" href={project.githubUrl} target="_blank" rel="noreferrer">GitHub ↗</a> : <span className="case-link-pending">GitHub · link em breve</span>}{project.liveUrl ? <a className="button button-primary" href={project.liveUrl} target="_blank" rel="noreferrer">Abrir projeto ↗</a> : <span className="case-link-pending">Site · publicação em breve</span>}{project.videoUrl && <a className="button button-ghost" href={project.videoUrl} target="_blank" rel="noreferrer">Abrir vídeo ↗</a>}<Link className="button button-ghost" href="/projetos">Outros projetos</Link></div></div>
      </section>
      <footer className="technology-footer"><span>© Igor Mota</span><Link href="/#contato">Conversar sobre uma oportunidade ↗</Link></footer>
    </main>
  );
}
