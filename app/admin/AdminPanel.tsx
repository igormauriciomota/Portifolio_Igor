"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type ProfileForm = {
  name: string;
  headline: string;
  location: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  photoKey: string;
  resumeKey: string;
};

type ProjectRow = {
  id: number;
  title: string;
  eyebrow: string;
  description: string;
  status: string;
  stack: string[];
  accent: string;
  githubUrl: string | null;
  liveUrl: string | null;
  videoUrl: string | null;
  imageKey: string | null;
  featured: boolean;
  sortOrder: number;
};

const emptyProfile: ProfileForm = {
  name: "Igor Mota",
  headline: "Desenvolvedor Python & Analista de Dados",
  location: "Belo Horizonte, MG",
  email: "",
  linkedinUrl: "",
  githubUrl: "",
  photoKey: "",
  resumeKey: "",
};

async function jsonOrThrow(response: Response) {
  const data = (await response.json()) as { error?: string; [key: string]: unknown };
  if (!response.ok) throw new Error(data.error ?? "Não foi possível concluir a operação.");
  return data;
}

export default function AdminPanel({ userName, userEmail, signOutPath }: { userName: string; userEmail: string; signOutPath: string }) {
  const [profile, setProfile] = useState<ProfileForm>(emptyProfile);
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [editingProject, setEditingProject] = useState<ProjectRow | null>(null);
  const [message, setMessage] = useState("Carregando dados do portfólio...");
  const [busy, setBusy] = useState(false);

  async function reload() {
    try {
      const [profileResponse, projectsResponse] = await Promise.all([fetch("/api/profile"), fetch("/api/projects")]);
      const profileData = await jsonOrThrow(profileResponse) as { profile?: Partial<ProfileForm> };
      const projectData = await jsonOrThrow(projectsResponse) as { projects?: ProjectRow[] };
      if (profileData.profile) {
        setProfile({ ...emptyProfile, ...profileData.profile, email: profileData.profile.email ?? "", linkedinUrl: profileData.profile.linkedinUrl ?? "", githubUrl: profileData.profile.githubUrl ?? "", photoKey: profileData.profile.photoKey ?? "", resumeKey: profileData.profile.resumeKey ?? "" });
      }
      setProjects(projectData.projects ?? []);
      setMessage("Painel conectado. As alterações salvas aparecem no portfólio público.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível carregar os dados.");
    }
  }

  useEffect(() => {
    const task = window.setTimeout(() => void reload(), 0);
    return () => window.clearTimeout(task);
  }, []);

  async function upload(file: File, kind: "profile" | "project" | "resume") {
    const form = new FormData();
    form.append("file", file);
    form.append("kind", kind);
    const data = await jsonOrThrow(await fetch("/api/uploads", { method: "POST", body: form })) as { key: string };
    return data.key;
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("Salvando perfil...");
    try {
      await jsonOrThrow(await fetch("/api/profile", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(profile) }));
      setMessage("Perfil atualizado com sucesso.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível salvar o perfil.");
    } finally {
      setBusy(false);
    }
  }

  async function handleProfileFile(file: File | undefined, kind: "profile" | "resume") {
    if (!file) return;
    setBusy(true);
    setMessage(kind === "profile" ? "Enviando foto..." : "Enviando currículo...");
    try {
      const key = await upload(file, kind);
      setProfile((current) => ({ ...current, [kind === "profile" ? "photoKey" : "resumeKey"]: key }));
      setMessage("Arquivo enviado. Clique em “Salvar perfil” para publicar.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar o arquivo.");
    } finally {
      setBusy(false);
    }
  }

  async function createProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setMessage("Adicionando projeto...");
    try {
      const cover = form.get("cover");
      const imageKey = cover instanceof File && cover.size ? await upload(cover, "project") : null;
      const payload = {
        title: form.get("title"),
        eyebrow: form.get("eyebrow"),
        description: form.get("description"),
        stack: String(form.get("stack") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
        status: form.get("status"),
        accent: form.get("accent"),
        githubUrl: form.get("githubUrl"),
        liveUrl: form.get("liveUrl"),
        videoUrl: form.get("videoUrl"),
        imageKey,
        featured: form.get("featured") === "on",
        sortOrder: Number(form.get("sortOrder")) || projects.length + 1,
      };
      await jsonOrThrow(await fetch("/api/projects", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }));
      event.currentTarget.reset();
      await reload();
      setMessage("Projeto adicionado e publicado.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível adicionar o projeto.");
    } finally {
      setBusy(false);
    }
  }

  async function removeProject(id: number, title: string) {
    if (!window.confirm(`Excluir “${title}” do portfólio?`)) return;
    setBusy(true);
    try {
      await jsonOrThrow(await fetch(`/api/projects/${id}`, { method: "DELETE" }));
      await reload();
      setMessage("Projeto excluído.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível excluir o projeto.");
    } finally {
      setBusy(false);
    }
  }

  async function updateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingProject) return;
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setMessage("Atualizando estudo de caso...");
    try {
      const cover = form.get("cover");
      const imageKey = cover instanceof File && cover.size ? await upload(cover, "project") : editingProject.imageKey;
      const payload = {
        title: form.get("title"), eyebrow: form.get("eyebrow"), description: form.get("description"),
        stack: String(form.get("stack") ?? "").split(",").map((item) => item.trim()).filter(Boolean),
        status: form.get("status"), accent: form.get("accent"), githubUrl: form.get("githubUrl"),
        liveUrl: form.get("liveUrl"), videoUrl: form.get("videoUrl"), imageKey,
        featured: form.get("featured") === "on", sortOrder: Number(form.get("sortOrder")) || editingProject.sortOrder,
      };
      await jsonOrThrow(await fetch(`/api/projects/${editingProject.id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) }));
      setEditingProject(null);
      await reload();
      setMessage("Projeto e página individual atualizados.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível atualizar o projeto.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <Link className="brand" href="/"><span className="brand-mark">IM</span><span><strong>Painel do Portfólio</strong><small>Conteúdo e projetos</small></span></Link>
        <div className="admin-user"><span><strong>{userName}</strong><small>{userEmail}</small></span><a href={signOutPath}>Sair</a></div>
      </header>

      <div className="admin-container">
        <div className="admin-intro">
          <div><p>ÁREA PROTEGIDA</p><h1>Gerencie sua presença profissional.</h1></div>
          <Link className="button button-ghost" href="/">Ver portfólio ↗</Link>
        </div>
        <div className="admin-message" role="status"><span />{message}</div>

        <section className="admin-card">
          <div className="admin-card-title"><span>01</span><div><h2>Perfil e contato</h2><p>Foto, currículo e links usados na página pública.</p></div></div>
          <form className="admin-form" onSubmit={saveProfile}>
            <label>Nome<input required value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label>
            <label>Título profissional<input required value={profile.headline} onChange={(event) => setProfile({ ...profile, headline: event.target.value })} /></label>
            <label>Localização<input required value={profile.location} onChange={(event) => setProfile({ ...profile, location: event.target.value })} /></label>
            <label>E-mail profissional<input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} placeholder="voce@exemplo.com" /></label>
            <label>LinkedIn<input type="url" value={profile.linkedinUrl} onChange={(event) => setProfile({ ...profile, linkedinUrl: event.target.value })} placeholder="https://linkedin.com/in/..." /></label>
            <label>GitHub<input type="url" value={profile.githubUrl} onChange={(event) => setProfile({ ...profile, githubUrl: event.target.value })} placeholder="https://github.com/..." /></label>
            <label className="file-field">Foto de perfil<input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void handleProfileFile(event.target.files?.[0], "profile")} /><span>{profile.photoKey ? "Foto pronta para salvar" : "PNG, JPG ou WebP · até 5 MB"}</span></label>
            <label className="file-field">Currículo em PDF<input type="file" accept="application/pdf" onChange={(event) => void handleProfileFile(event.target.files?.[0], "resume")} /><span>{profile.resumeKey ? "Currículo pronto para salvar" : "PDF · até 12 MB"}</span></label>
            <div className="admin-form-action"><button className="button button-primary" disabled={busy} type="submit">Salvar perfil</button></div>
          </form>
        </section>

        <section className="admin-card">
          <div className="admin-card-title"><span>02</span><div><h2>Adicionar projeto</h2><p>O cadastro gera um card e uma página individual com imagem, código, demonstração e vídeo.</p></div></div>
          <form className="admin-form" onSubmit={createProject}>
            <label>Título<input name="title" required /></label>
            <label>Categoria<input name="eyebrow" required placeholder="Ex.: API REST" /></label>
            <label className="wide">Descrição<textarea name="description" required rows={4} /></label>
            <label className="wide">Tecnologias<input name="stack" required placeholder="Flask, SQLite, Bootstrap" /><span>Separe as tecnologias por vírgula.</span></label>
            <label>Status<select name="status" defaultValue="Em desenvolvimento"><option>Em desenvolvimento</option><option>Em evolução</option><option>Publicado</option><option>Planejado</option></select></label>
            <label>Cor de destaque<input name="accent" type="color" defaultValue="#ffd24a" /></label>
            <label>GitHub<input name="githubUrl" type="url" placeholder="https://github.com/..." /></label>
            <label>Demonstração<input name="liveUrl" type="url" placeholder="https://..." /></label>
            <label>Vídeo curto<input name="videoUrl" type="url" placeholder="https://youtube.com/... ou .mp4" /><span>Recomendado: até 30 segundos, mostrando tela, fluxo e resultado.</span></label>
            <label>Ordem<input name="sortOrder" type="number" min="0" defaultValue={projects.length + 1} /></label>
            <label className="file-field wide">Imagem do projeto<input name="cover" type="file" accept="image/png,image/jpeg,image/webp" /><span>PNG, JPG ou WebP · até 8 MB</span></label>
            <label className="checkbox-field wide"><input name="featured" type="checkbox" defaultChecked /><span>Mostrar este projeto entre os destaques</span></label>
            <div className="admin-form-action"><button className="button button-primary" disabled={busy} type="submit">Adicionar projeto</button></div>
          </form>
        </section>

        {editingProject && <section className="admin-card admin-edit-card" id="editar-projeto">
          <div className="admin-card-title"><span>03</span><div><h2>Editar projeto</h2><p>Atualize “{editingProject.title}” e sua página individual.</p></div></div>
          <form key={editingProject.id} className="admin-form" onSubmit={updateProject}>
            <label>Título<input name="title" required defaultValue={editingProject.title} /></label>
            <label>Categoria<input name="eyebrow" required defaultValue={editingProject.eyebrow} /></label>
            <label className="wide">Descrição<textarea name="description" required rows={4} defaultValue={editingProject.description} /></label>
            <label className="wide">Tecnologias<input name="stack" required defaultValue={editingProject.stack.join(", ")} /><span>Separe as tecnologias por vírgula.</span></label>
            <label>Status<select name="status" defaultValue={editingProject.status}><option>Em desenvolvimento</option><option>Em evolução</option><option>Publicado</option><option>Planejado</option></select></label>
            <label>Cor de destaque<input name="accent" type="color" defaultValue={editingProject.accent} /></label>
            <label>GitHub<input name="githubUrl" type="url" defaultValue={editingProject.githubUrl ?? ""} /></label>
            <label>Demonstração<input name="liveUrl" type="url" defaultValue={editingProject.liveUrl ?? ""} /></label>
            <label>Vídeo curto<input name="videoUrl" type="url" defaultValue={editingProject.videoUrl ?? ""} /><span>YouTube, Vimeo ou arquivo MP4/WebM de até 30 segundos.</span></label>
            <label>Ordem<input name="sortOrder" type="number" min="0" defaultValue={editingProject.sortOrder} /></label>
            <label className="file-field wide">Trocar imagem<input name="cover" type="file" accept="image/png,image/jpeg,image/webp" /><span>{editingProject.imageKey ? "A imagem atual será mantida se nenhum arquivo for escolhido." : "PNG, JPG ou WebP · até 8 MB"}</span></label>
            <label className="checkbox-field wide"><input name="featured" type="checkbox" defaultChecked={editingProject.featured} /><span>Mostrar este projeto entre os destaques</span></label>
            <div className="admin-form-action admin-form-actions"><button className="button button-ghost" type="button" onClick={() => setEditingProject(null)}>Cancelar</button><button className="button button-primary" disabled={busy} type="submit">Salvar alterações</button></div>
          </form>
        </section>}

        <section className="admin-card">
          <div className="admin-card-title"><span>04</span><div><h2>Projetos publicados</h2><p>{projects.length} item(ns) cadastrado(s) no banco.</p></div></div>
          <div className="admin-project-list">
            {projects.map((project) => (
              <article key={project.id}><div><span>{project.eyebrow}</span><h3>{project.title}</h3><p>{project.stack.join(" · ")} — {project.status}</p></div><div className="admin-project-actions"><Link href={`/projetos/${project.id}`} target="_blank">Ver página</Link><button className="edit" type="button" disabled={busy} onClick={() => { setEditingProject(project); window.setTimeout(() => document.getElementById("editar-projeto")?.scrollIntoView({ behavior: "smooth" }), 0); }}>Editar</button><button type="button" disabled={busy} onClick={() => void removeProject(project.id, project.title)}>Excluir</button></div></article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
