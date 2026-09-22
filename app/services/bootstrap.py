"""Inicialização idempotente do conteúdo público padrão."""

from datetime import datetime, timezone

from ..content import ARTICLE_DEFAULTS, PROFILE_DEFAULTS, PROJECTS
from ..extensions import db
from ..models import Article, Profile, Project


def ensure_public_content():
    """Cria somente registros ausentes, preservando edições feitas no painel."""

    if db.session.get(Profile, 1) is None:
        db.session.add(Profile(**PROFILE_DEFAULTS))

    for values in PROJECTS:
        if Project.query.filter_by(slug=values["slug"]).first() is None:
            db.session.add(Project(featured=True, **values))

    for values in ARTICLE_DEFAULTS:
        if Article.query.filter_by(slug=values["slug"]).first() is None:
            article = Article(**values)
            if article.published:
                article.published_at = datetime.now(timezone.utc)
            db.session.add(article)

    db.session.commit()
