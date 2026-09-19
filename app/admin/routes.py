import re
from collections import Counter

from flask import abort, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required, login_user, logout_user

from . import admin_bp
from ..extensions import db
from ..forms import LoginForm, ProjectForm
from ..models import AdminUser, ContactMessage, Project


def safe_next_url(target):
    return target if target and target.startswith("/") and not target.startswith("//") else url_for("admin.dashboard")


@admin_bp.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated:
        return redirect(url_for("admin.dashboard"))
    form = LoginForm()
    if form.validate_on_submit():
        user = AdminUser.query.filter_by(username=form.username.data.strip()).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember.data)
            return redirect(safe_next_url(request.args.get("next")))
        flash("Usuário ou senha inválidos.", "danger")
    return render_template("admin/login.html", form=form)


@admin_bp.post("/logout")
@login_required
def logout():
    logout_user()
    flash("Sessão encerrada.", "info")
    return redirect(url_for("main.home"))


@admin_bp.get("/")
@login_required
def dashboard():
    projects = Project.query.order_by(Project.updated_at.desc()).all()
    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).limit(6).all()
    tech = Counter(t for p in projects for t in p.technology_list)
    return render_template("admin/dashboard.html", projects=projects, messages=messages, tech_labels=list(tech.keys())[:8], tech_values=list(tech.values())[:8])


@admin_bp.get("/projetos")
@login_required
def projects():
    return render_template("admin/projects.html", projects=Project.query.order_by(Project.updated_at.desc()).all())


def apply_project_form(project, form):
    project.title = form.title.data.strip()
    project.slug = re.sub(r"[^a-z0-9-]", "", form.slug.data.strip().lower().replace(" ", "-"))
    project.summary = form.summary.data.strip()
    project.description = form.description.data.strip()
    project.technologies = form.technologies.data.strip()
    project.category = form.category.data
    project.level = form.level.data
    project.status = form.status.data
    project.year = form.year.data
    project.repo_url = form.repo_url.data or None
    project.demo_url = form.demo_url.data or None
    project.image_url = form.image_url.data or None
    project.featured = form.featured.data
    project.published = form.published.data


@admin_bp.route("/projetos/novo", methods=["GET", "POST"])
@login_required
def project_create():
    form = ProjectForm()
    if form.validate_on_submit():
        if Project.query.filter_by(slug=form.slug.data.strip().lower()).first():
            flash("Este slug já está em uso.", "danger")
        else:
            project = Project()
            apply_project_form(project, form)
            db.session.add(project)
            db.session.commit()
            flash("Projeto criado.", "success")
            return redirect(url_for("admin.projects"))
    return render_template("admin/project_form.html", form=form, title="Novo projeto")


@admin_bp.route("/projetos/<int:project_id>/editar", methods=["GET", "POST"])
@login_required
def project_edit(project_id):
    project = db.get_or_404(Project, project_id)
    form = ProjectForm(obj=project)
    if form.validate_on_submit():
        duplicate = Project.query.filter(Project.slug == form.slug.data.strip().lower(), Project.id != project.id).first()
        if duplicate:
            flash("Este slug já está em uso.", "danger")
        else:
            apply_project_form(project, form)
            db.session.commit()
            flash("Projeto atualizado.", "success")
            return redirect(url_for("admin.projects"))
    return render_template("admin/project_form.html", form=form, title="Editar projeto")


@admin_bp.post("/projetos/<int:project_id>/excluir")
@login_required
def project_delete(project_id):
    project = db.get_or_404(Project, project_id)
    db.session.delete(project)
    db.session.commit()
    flash("Projeto excluído.", "info")
    return redirect(url_for("admin.projects"))


@admin_bp.post("/mensagens/<int:message_id>/lida")
@login_required
def message_read(message_id):
    message = db.get_or_404(ContactMessage, message_id)
    message.read = True
    db.session.commit()
    return redirect(url_for("admin.dashboard"))

