from flask import Response, current_app, flash, redirect, render_template, request, url_for

from . import main_bp
from ..extensions import db
from ..forms import ContactForm
from ..models import ContactMessage, Project


@main_bp.get("/")
def home():
    projects = Project.query.filter_by(published=True, featured=True).order_by(Project.updated_at.desc()).limit(6).all()
    return render_template("home.html", projects=projects, contact_form=ContactForm())


@main_bp.get("/holograma")
def hologram():
    return render_template("hologram.html")


@main_bp.get("/projetos")
def projects():
    category = request.args.get("categoria", "").strip()
    query = Project.query.filter_by(published=True)
    if category:
        query = query.filter_by(category=category)
    items = query.order_by(Project.featured.desc(), Project.updated_at.desc()).all()
    categories = [row[0] for row in db.session.query(Project.category).filter_by(published=True).distinct().order_by(Project.category)]
    return render_template("projects.html", projects=items, categories=categories, active_category=category)


@main_bp.get("/projetos/<slug>")
def project_detail(slug):
    project = Project.query.filter_by(slug=slug, published=True).first_or_404()
    return render_template("project_detail.html", project=project)


@main_bp.get("/privacidade")
def privacy():
    return render_template("privacy.html")


@main_bp.post("/contato")
def contact():
    form = ContactForm()
    if form.validate_on_submit():
        item = ContactMessage(name=form.name.data.strip(), email=form.email.data.strip().lower(), subject=form.subject.data.strip(), message=form.message.data.strip())
        db.session.add(item)
        db.session.commit()
        flash("Mensagem enviada. Obrigado pelo contato!", "success")
    else:
        flash("Revise os campos do formulário e tente novamente.", "danger")
    return redirect(url_for("main.home", _anchor="contato"))


@main_bp.get("/sitemap.xml")
def sitemap():
    pages = [url_for("main.home", _external=True), url_for("main.hologram", _external=True), url_for("main.projects", _external=True), url_for("main.privacy", _external=True)]
    pages.extend(url_for("main.project_detail", slug=p.slug, _external=True) for p in Project.query.filter_by(published=True).all())
    xml = "<?xml version='1.0' encoding='UTF-8'?><urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>" + "".join(f"<url><loc>{url}</loc></url>" for url in pages) + "</urlset>"
    return Response(xml, mimetype="application/xml")


@main_bp.get("/robots.txt")
def robots():
    return Response(f"User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: {url_for('main.sitemap', _external=True)}\n", mimetype="text/plain")
