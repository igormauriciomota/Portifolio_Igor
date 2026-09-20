from pathlib import Path

from flask import abort, render_template, send_from_directory

from . import bp
from ..extensions import db
from ..models import Article, Profile, Project
from ..services.github import recent_public_activity


# As imagens oficiais do portfólio ficam na pasta public da aplicação completa.
# Esta rota permite reutilizá-las na versão Flask sem duplicar arquivos grandes.
PORTFOLIO_ASSETS = Path(__file__).resolve().parents[3] / "public"


@bp.get("/portfolio-assets/<path:filename>")
def portfolio_asset(filename):
    """Entrega somente os recursos públicos incluídos no repositório."""

    if not PORTFOLIO_ASSETS.is_dir():
        abort(404)
    return send_from_directory(PORTFOLIO_ASSETS, filename)


@bp.get("/")
def index():
    """Consulta o banco e entrega somente conteúdo publicável ao template."""

    # O perfil público é único. `session.get` é ideal quando já sabemos o ID.
    profile = db.session.get(Profile, 1)
    # Os projetos em destaque são ordenados manualmente e depois pelo mais novo.
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
    # O serviço externo fica fora da rota para manter cada arquivo com uma função.
    github_activity = recent_public_activity(profile.github_url if profile else None)

    # Jinja recebe objetos reais. O HTML decide apenas como apresentá-los.
    return render_template(
        "main/index.html",
        profile=profile,
        projects=projects,
        articles=articles,
        github_activity=github_activity,
    )
