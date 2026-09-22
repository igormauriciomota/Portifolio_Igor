"""Rotas públicas, catálogo, estudos de caso e endpoints de leitura."""

from flask import Response, abort, current_app, jsonify, render_template, request, url_for

from . import bp
from ..content import TECHNOLOGIES
from ..extensions import db
from ..models import Article, Profile, Project
from ..services.github import recent_public_activity, repository_progress


@bp.get("/")
def index():
    """Renderiza a experiência principal usando conteúdo editável do SQLite."""

    profile = db.session.get(Profile, 1)
    projects = (
        Project.query.filter_by(featured=True)
        .order_by(Project.sort_order.asc(), Project.id.desc())
        .all()
    )
    articles = (
        Article.query.filter_by(published=True)
        .order_by(Article.published_at.desc())
        .limit(3)
        .all()
    )
    github_activity = (
        recent_public_activity(profile.github_url if profile else None)
        if current_app.config["GITHUB_ENABLED"]
        else {"username": "igormauriciomota", "total": 0, "days": []}
    )
    return render_template(
        "main/index.html",
        profile=profile,
        projects=projects,
        articles=articles,
        github_activity=github_activity,
        source_download_url=current_app.config["SOURCE_DOWNLOAD_URL"],
    )


@bp.get("/projetos")
def projects():
    """Exibe o catálogo pesquisável com todos os projetos."""

    items = Project.query.order_by(Project.sort_order.asc(), Project.id.desc()).all()
    return render_template("main/projects.html", projects=items, requested_filter=request.args.get("filtro", ""))


@bp.get("/projetos/<slug>")
def project_detail(slug):
    """Abre um estudo de caso pelo slug legível ou pelo identificador."""

    project = Project.query.filter_by(slug=slug).first()
    if project is None and slug.isdigit():
        project = db.session.get(Project, int(slug))
    if project is None:
        abort(404)

    progress = (
        repository_progress()
        if project.slug == "python-practice-lab" and current_app.config["GITHUB_ENABLED"]
        else None
    )
    return render_template("main/project_detail.html", project=project, progress=progress)


@bp.get("/tecnologias/<slug>")
def technology(slug):
    """Apresenta como cada tecnologia é aplicada nos projetos."""

    technology_data = TECHNOLOGIES.get(slug)
    if technology_data is None:
        abort(404)
    return render_template("main/technology.html", technology={"slug": slug, **technology_data})


@bp.get("/artigos/<slug>")
def article_detail(slug):
    article = Article.query.filter_by(slug=slug, published=True).first_or_404()
    return render_template("articles/detail.html", article=article)


@bp.get("/api/github/python-practice-lab")
def python_practice_progress():
    """Endpoint público para atualizar o gráfico sem recarregar a página."""

    if not current_app.config["GITHUB_ENABLED"]:
        return jsonify({"source": "disabled", "days": [], "recent_commits": []})
    response = jsonify(repository_progress())
    response.headers["Cache-Control"] = "public, max-age=300"
    return response


@bp.get("/robots.txt")
def robots():
    sitemap_url = url_for("main.sitemap", _external=True)
    return Response(f"User-agent: *\nAllow: /\nSitemap: {sitemap_url}\n", mimetype="text/plain")


@bp.get("/sitemap.xml")
def sitemap():
    urls = [
        url_for("main.index", _external=True),
        url_for("main.projects", _external=True),
        *[url_for("main.technology", slug=slug, _external=True) for slug in TECHNOLOGIES],
        *[
            url_for("main.project_detail", slug=project.slug, _external=True)
            for project in Project.query.order_by(Project.id).all()
        ],
        *[
            url_for("main.article_detail", slug=article.slug, _external=True)
            for article in Article.query.filter_by(published=True).all()
        ],
    ]
    body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">"
    body += "".join(f"<url><loc>{url}</loc></url>" for url in urls)
    body += "</urlset>"
    return Response(body, mimetype="application/xml")


@bp.get("/site.webmanifest")
def manifest():
    return jsonify(
        name="Igor Mota — Python & Dados",
        short_name="Igor Mota",
        start_url="/",
        display="standalone",
        background_color="#070b17",
        theme_color="#070b17",
        icons=[{"src": url_for("static", filename="assets/favicon.svg"), "sizes": "any", "type": "image/svg+xml"}],
    )
