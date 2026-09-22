import re
import unicodedata
from datetime import datetime, timezone

from flask import flash, redirect, render_template, url_for
from flask_login import login_required

from ..extensions import db
from ..models import Article, Profile, Project
from ..services.storage import DOCUMENT_EXTENSIONS, IMAGE_EXTENSIONS, VIDEO_EXTENSIONS, save_upload
from . import bp
from .forms import ArticleForm, ProfileForm, ProjectForm


def slugify(value):
    """Transforma 'Meu Projeto Ágil' em 'meu-projeto-agil'."""
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-")


@bp.get("/")
@login_required
def dashboard():
    """Lista todo o conteúdo gerenciável para o administrador."""
    projects = Project.query.order_by(Project.sort_order.asc(), Project.id.desc()).all()
    articles = Article.query.order_by(Article.id.desc()).all()
    return render_template("admin/dashboard.html", projects=projects, articles=articles)


@bp.route("/perfil", methods=["GET", "POST"])
@login_required
def profile_edit():
    """Cria ou atualiza o perfil público e seus arquivos anexos."""
    profile = db.session.get(Profile, 1) or Profile(id=1, headline="Desenvolvedor Python & Analista de Dados", location="Belo Horizonte, MG")
    form = ProfileForm(obj=profile)
    if form.validate_on_submit():
        form.populate_obj(profile)
        try:
            photo = save_upload(form.photo.data, "profile", IMAGE_EXTENSIONS)
            resume = save_upload(form.resume.data, "resume", DOCUMENT_EXTENSIONS)
        except ValueError as error:
            flash(str(error), "danger")
            return render_template("admin/profile_form.html", form=form, profile=profile)

        if photo:
            profile.photo_filename = photo
        if resume:
            profile.resume_filename = resume
        db.session.add(profile)
        db.session.commit()
        flash("Perfil atualizado.", "success")
        return redirect(url_for("admin.dashboard"))
    return render_template("admin/profile_form.html", form=form, profile=profile)


@bp.route("/projetos/novo", methods=["GET", "POST"])
@login_required
def project_create():
    """Valida o formulário e grava um projeto novo no banco."""
    form = ProjectForm()
    if form.validate_on_submit():
        project = Project()
        form.populate_obj(project)
        project.slug = unique_slug(form.title.data)
        try:
            project.image_filename = save_upload(form.image.data, "projects", IMAGE_EXTENSIONS)
            uploaded_video = save_upload(form.video.data, "videos", VIDEO_EXTENSIONS)
        except ValueError as error:
            flash(str(error), "danger")
            return render_template("admin/project_form.html", form=form, title="Novo projeto")
        if uploaded_video:
            project.video_url = uploaded_video
        db.session.add(project)
        db.session.commit()
        flash("Projeto publicado.", "success")
        return redirect(url_for("admin.dashboard"))
    return render_template("admin/project_form.html", form=form, title="Novo projeto")


@bp.route("/projetos/<int:project_id>/editar", methods=["GET", "POST"])
@login_required
def project_edit(project_id):
    """Atualiza o projeto indicado na própria URL."""
    project = db.get_or_404(Project, project_id)
    form = ProjectForm(obj=project)
    if form.validate_on_submit():
        form.populate_obj(project)
        project.slug = unique_slug(form.title.data, project.id)
        try:
            image = save_upload(form.image.data, "projects", IMAGE_EXTENSIONS)
            uploaded_video = save_upload(form.video.data, "videos", VIDEO_EXTENSIONS)
        except ValueError as error:
            flash(str(error), "danger")
            return render_template("admin/project_form.html", form=form, title="Editar projeto")
        if image:
            project.image_filename = image
        if uploaded_video:
            project.video_url = uploaded_video
        db.session.commit()
        flash("Projeto atualizado.", "success")
        return redirect(url_for("admin.dashboard"))
    return render_template("admin/project_form.html", form=form, title="Editar projeto")


@bp.post("/projetos/<int:project_id>/excluir")
@login_required
def project_delete(project_id):
    """Exclui um projeto por POST para evitar remoção por simples link."""
    project = db.get_or_404(Project, project_id)
    db.session.delete(project)
    db.session.commit()
    flash("Projeto excluído.", "success")
    return redirect(url_for("admin.dashboard"))


@bp.route("/artigos/novo", methods=["GET", "POST"])
@login_required
def article_create():
    form = ArticleForm()
    if form.validate_on_submit():
        article = Article()
        form.populate_obj(article)
        article.slug = unique_article_slug(form.title.data)
        article.published_at = datetime.now(timezone.utc) if article.published else None
        db.session.add(article)
        db.session.commit()
        flash("Artigo salvo.", "success")
        return redirect(url_for("admin.dashboard"))
    return render_template("admin/article_form.html", form=form, title="Novo artigo")


@bp.route("/artigos/<int:article_id>/editar", methods=["GET", "POST"])
@login_required
def article_edit(article_id):
    article = db.get_or_404(Article, article_id)
    form = ArticleForm(obj=article)
    if form.validate_on_submit():
        was_published = article.published
        form.populate_obj(article)
        article.slug = unique_article_slug(form.title.data, article.id)
        if article.published and not was_published:
            article.published_at = datetime.now(timezone.utc)
        if not article.published:
            article.published_at = None
        db.session.commit()
        flash("Artigo atualizado.", "success")
        return redirect(url_for("admin.dashboard"))
    return render_template("admin/article_form.html", form=form, title="Editar artigo")


@bp.post("/artigos/<int:article_id>/excluir")
@login_required
def article_delete(article_id):
    article = db.get_or_404(Article, article_id)
    db.session.delete(article)
    db.session.commit()
    flash("Artigo excluído.", "success")
    return redirect(url_for("admin.dashboard"))


def unique_slug(title, current_id=None):
    """Garante slugs únicos acrescentando -2, -3 e assim por diante."""
    base = slugify(title) or "projeto"
    candidate = base
    counter = 2
    while True:
        query = Project.query.filter_by(slug=candidate)
        if current_id:
            query = query.filter(Project.id != current_id)
        if not query.first():
            return candidate
        candidate = f"{base}-{counter}"
        counter += 1


def unique_article_slug(title, current_id=None):
    base = slugify(title) or "artigo"
    candidate = base
    counter = 2
    while True:
        query = Article.query.filter_by(slug=candidate)
        if current_id:
            query = query.filter(Article.id != current_id)
        if not query.first():
            return candidate
        candidate = f"{base}-{counter}"
        counter += 1
