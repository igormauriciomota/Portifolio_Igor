"use client";

import { useEffect, useMemo, useState } from "react";

type CommitDay = { date: string; count: number };
type CommitItem = { sha: string; message: string; date: string | null; url: string };
type GitHubApiCommit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author?: { date?: string | null } | null;
    committer?: { date?: string | null } | null;
  };
};
type RepositoryProgress = {
  repository: string;
  repositoryUrl: string;
  defaultBranch?: string;
  moduleCount?: number;
  commitCount?: number;
  commitHistoryComplete?: boolean;
  latestCommitAt?: string | null;
  days?: CommitDay[];
  recentCommits?: CommitItem[];
  updatedAt?: string;
  source?: "live" | "snapshot";
  error?: string;
};

const repository = "igormauriciomota/python-practice-lab";
const repositoryUrl = `https://github.com/${repository}`;
const commitsApiUrl = `https://api.github.com/repos/${repository}/commits?per_page=100`;

function buildCommitDays(commits: GitHubApiCommit[]) {
  const counts = new Map<string, number>();

  for (const item of commits) {
    const date = (item.commit.author?.date ?? item.commit.committer?.date)?.slice(0, 10);
    if (date) counts.set(date, (counts.get(date) ?? 0) + 1);
  }

  return Array.from({ length: 35 }, (_, index) => {
    const date = new Date();
    date.setUTCHours(12, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (34 - index));
    const key = date.toISOString().slice(0, 10);
    return { date: key, count: counts.get(key) ?? 0 };
  });
}

function progressFromCommits(commits: GitHubApiCommit[]): RepositoryProgress {
  return {
    repository,
    repositoryUrl,
    defaultBranch: "main",
    moduleCount: 20,
    commitCount: commits.length,
    commitHistoryComplete: commits.length < 100,
    latestCommitAt: commits[0]?.commit.author?.date ?? commits[0]?.commit.committer?.date ?? null,
    days: buildCommitDays(commits),
    recentCommits: commits.slice(0, 6).map((item) => ({
      sha: item.sha.slice(0, 7),
      message: item.commit.message.split("\n")[0],
      date: item.commit.author?.date ?? item.commit.committer?.date ?? null,
      url: item.html_url,
    })),
    updatedAt: new Date().toISOString(),
    source: "live",
  };
}

const phases = [
  { number: "01", title: "Fundamentos e lógica", range: "01–06", text: "Sintaxe, strings, coleções, condicionais, laços e funções." },
  { number: "02", title: "Domínio da linguagem", range: "07–13", text: "Erros, arquivos, módulos, ambientes, POO e biblioteca padrão." },
  { number: "03", title: "Pensamento computacional", range: "14–15", text: "Algoritmos, complexidade e estruturas de dados clássicas." },
  { number: "04", title: "Qualidade e persistência", range: "16–18", text: "Pytest, modelagem relacional, SQL e integração com SQLite." },
  { number: "05", title: "Arquitetura e segurança", range: "19–20", text: "CRUD em camadas, autenticação, permissões e práticas seguras." },
] as const;

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

export default function GitHubProgress() {
  const [data, setData] = useState<RepositoryProgress | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(commitsApiUrl, {
          headers: { accept: "application/vnd.github+json" },
          cache: "no-store",
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("GitHub API indisponível");
        const commits = (await response.json()) as GitHubApiCommit[];
        if (active) setData(progressFromCommits(commits));
      } catch {
        if (!active) return;
        try {
          const fallback = await fetch("/api/github/python-practice-lab", { signal: controller.signal });
          const payload = (await fallback.json()) as RepositoryProgress;
          if (active) setData(payload);
        } catch {
          if (active) setData({ repository, repositoryUrl, source: "snapshot", error: "GitHub temporariamente indisponível." });
        }
      }
    };

    void load();
    const interval = window.setInterval(() => void load(), 300_000);
    return () => { active = false; controller.abort(); window.clearInterval(interval); };
  }, []);

  const activity = useMemo(() => {
    const days = data?.days ?? [];
    const maximum = Math.max(1, ...days.map((day) => day.count));
    return {
      days,
      maximum,
      activeDays: days.filter((day) => day.count > 0).length,
      commitsInWindow: days.reduce((total, day) => total + day.count, 0),
    };
  }, [data?.days]);

  return (
    <section className="github-progress" aria-labelledby="github-progress-title">
      <div className="github-progress-heading">
        <div>
          <p>EVOLUÇÃO VERIFICÁVEL NO GITHUB</p>
          <h2 id="github-progress-title">Cada commit registra <span>um passo do aprendizado.</span></h2>
        </div>
        <a href="https://github.com/igormauriciomota/python-practice-lab" target="_blank" rel="noreferrer">Abrir repositório no GitHub ↗</a>
      </div>

      <div className="github-progress-layout">
        <div className="github-progress-main">
          <div className="github-live-bar">
            <span><i /> {data?.source === "live" ? "GITHUB AO VIVO" : "DADOS DO REPOSITÓRIO"}</span>
            <small>{data?.source === "live" ? `Atualizado em ${formatDate(data.updatedAt)} · nova leitura a cada 5 minutos` : data?.error ? `${data.error} · exibindo a última leitura verificada` : "Conectando ao GitHub…"}</small>
          </div>

          <div className="github-kpis">
            <article><span>COMMITS</span><strong>{data?.commitCount ?? "—"}</strong><small>{data?.commitHistoryComplete === false ? "últimos 100 analisados" : "histórico mapeado"}</small></article>
            <article><span>DIAS ATIVOS</span><strong>{data ? activity.activeDays : "—"}</strong><small>nos últimos 35 dias</small></article>
            <article><span>MÓDULOS</span><strong>{data?.moduleCount ?? "20"}</strong><small>trilha progressiva</small></article>
            <article><span>ÚLTIMO REGISTRO</span><strong className="is-date">{formatDate(data?.latestCommitAt)}</strong><small>branch {data?.defaultBranch ?? "main"}</small></article>
          </div>

          <div className="github-chart-card">
            <div><span>ATIVIDADE POR DIA</span><b>{activity.commitsInWindow} commits na janela atual</b></div>
            <div className="github-chart" role="img" aria-label="Gráfico de commits por dia nos últimos 35 dias">
              {(activity.days.length ? activity.days : Array.from({ length: 35 }, (_, index) => ({ date: String(index), count: 0 }))).map((day) => (
                <span key={day.date} style={{ "--commit-height": `${Math.max(7, (day.count / activity.maximum) * 100)}%` } as React.CSSProperties} title={`${day.date}: ${day.count} commit${day.count === 1 ? "" : "s"}`} className={day.count ? "has-commits" : ""}><i /></span>
              ))}
            </div>
            <div className="github-chart-axis"><span>35 dias atrás</span><span>Hoje</span></div>
          </div>

          <div className="github-commits">
            <div className="github-commits-title"><span>COMMITS RECENTES</span><small>mensagens reais do repositório</small></div>
            {data?.recentCommits?.length ? data.recentCommits.map((commit) => (
              <a key={commit.sha} href={commit.url} target="_blank" rel="noreferrer">
                <code>{commit.sha}</code><span>{commit.message}</span><time dateTime={commit.date ?? undefined}>{formatDate(commit.date)}</time><i>↗</i>
              </a>
            )) : <div className="github-commits-empty">Aguardando os dados mais recentes do GitHub.</div>}
          </div>
        </div>

        <aside className="github-repository-map">
          <div className="repository-image"><img src="/python-practice-lab-structure.webp" alt="Estrutura de pastas do repositório Python Practice Lab no VS Code" /><span>ESTRUTURA REAL DO REPOSITÓRIO</span></div>
          <p>O laboratório separa cada competência para tornar a evolução fácil de revisar, testar e demonstrar.</p>
          <div className="repository-cycle"><span>COMPREENDER</span><i>→</i><span>PRATICAR</span><i>→</i><span>TESTAR</span><i>→</i><span>REGISTRAR</span></div>
        </aside>
      </div>

      <div className="learning-roadmap">
        <div className="learning-roadmap-heading"><p>TRILHA DE TREINAMENTO</p><h3>Do fundamento à <span>engenharia de software.</span></h3></div>
        <div>{phases.map((phase) => <article key={phase.number}><span>{phase.number}</span><small>MÓDULOS {phase.range}</small><h4>{phase.title}</h4><p>{phase.text}</p></article>)}</div>
      </div>
    </section>
  );
}
