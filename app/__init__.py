from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, render_template, request, url_for

from config import Config

from .extensions import csrf, db, login_manager


def create_app(config_class=Config):
    """Cria e devolve uma aplicação Flask completamente configurada.

    Receber a classe de configuração por parâmetro permite usar Config durante
    o desenvolvimento e TestConfig durante os testes automatizados.
    """

    # instance_relative_config mantém banco e segredos fora do pacote `app`.
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    Path(app.instance_path).mkdir(parents=True, exist_ok=True)
    Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)

    # As extensões foram criadas em extensions.py sem vínculo com uma aplicação.
    # Aqui elas são conectadas à instância atual, evitando importação circular.
    db.init_app(app)
    login_manager.init_app(app)
    csrf.init_app(app)

    # Imports locais: os Blueprints só são importados depois que o Flask existe.
    from .admin import bp as admin_bp
    from .auth import bp as auth_bp
    from .main import bp as main_bp

    # Cada Blueprint cuida de uma área e de seu prefixo de URL.
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    # Cria as tabelas ausentes no primeiro uso. Em projetos maiores, substitua
    # esta linha por migrações versionadas com Flask-Migrate/Alembic.
    with app.app_context():
        db.create_all()
        from .services.bootstrap import ensure_public_content

        ensure_public_content()

    @app.context_processor
    def shared_template_helpers():
        """Disponibiliza mídia local e ano sem duplicar lógica no Jinja."""

        def media_url(filename):
            if not filename:
                return None
            if filename.startswith("asset:"):
                return url_for("static", filename=f"assets/{filename[6:]}")
            if filename.startswith(("http://", "https://", "/")):
                return filename
            return url_for("static", filename=f"uploads/{filename}")

        return {
            "media_url": media_url,
            "current_year": datetime.now(timezone.utc).year,
        }

    @app.after_request
    def add_security_headers(response):
        """Adiciona proteções adequadas a um portfólio público moderno."""

        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        response.headers.setdefault(
            "Content-Security-Policy",
            "default-src 'self'; img-src 'self' data:; media-src 'self' https:; "
            "script-src 'self' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "frame-src https://www.youtube-nocookie.com https://player.vimeo.com; "
            "form-action 'self'; base-uri 'self'; frame-ancestors 'self'",
        )
        if request.is_secure:
            response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        return response

    @app.errorhandler(404)
    def not_found(_error):
        return render_template("errors/404.html"), 404

    @app.errorhandler(500)
    def internal_error(_error):
        db.session.rollback()
        return render_template("errors/500.html"), 500

    return app
