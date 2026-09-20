from pathlib import Path

from flask import Flask

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
    from .main import bp as main_bp
    from .auth import bp as auth_bp
    from .admin import bp as admin_bp

    # Cada Blueprint cuida de uma área e de seu prefixo de URL.
    app.register_blueprint(main_bp)
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    # Cria as tabelas ausentes no primeiro uso. Em projetos maiores, substitua
    # esta linha por migrações versionadas com Flask-Migrate/Alembic.
    with app.app_context():
        db.create_all()

    return app
