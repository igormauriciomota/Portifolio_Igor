import os
from pathlib import Path

import click
import sentry_sdk
from dotenv import load_dotenv
from flask import Flask, request

from config import Config
from .extensions import csrf, db, login_manager
from .models import AdminUser, Project


def create_app(config_object=Config):
    load_dotenv()
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_object)
    if os.getenv("SENTRY_DSN"):
        sentry_sdk.init(dsn=os.getenv("SENTRY_DSN"), traces_sample_rate=0.1, send_default_pii=False)
    Path(app.instance_path).mkdir(parents=True, exist_ok=True)

    db.init_app(app)
    login_manager.init_app(app)
    csrf.init_app(app)
    login_manager.login_view = "admin.login"
    login_manager.login_message = "Entre para acessar a área administrativa."
    login_manager.login_message_category = "warning"

    from .main import main_bp
    from .admin import admin_bp
    from .api import api_bp
    app.register_blueprint(main_bp)
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(api_bp, url_prefix="/api")

    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(AdminUser, int(user_id))

    @app.after_request
    def security_headers(response):
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' "
            "https://cdn.jsdelivr.net; script-src 'self' https://cdn.jsdelivr.net https://plausible.io; "
            "font-src 'self' data:; connect-src 'self' https://plausible.io; frame-ancestors 'self'"
        )
        if request.is_secure:
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response

    @app.context_processor
    def public_settings():
        return {"plausible_domain": os.getenv("PLAUSIBLE_DOMAIN", "")}

    @app.cli.command("init-db")
    def init_db_command():
        """Cria as tabelas, o administrador e projetos iniciais."""
        db.create_all()
        username = os.getenv("ADMIN_USERNAME", "igor")
        password = os.getenv("ADMIN_PASSWORD")
        if not password:
            raise click.ClickException("Defina ADMIN_PASSWORD no arquivo .env antes de iniciar.")
        user = AdminUser.query.filter_by(username=username).first()
        if not user:
            user = AdminUser(username=username)
            user.set_password(password)
            db.session.add(user)
        if Project.query.count() == 0:
            db.session.add_all(_starter_projects())
        db.session.commit()
        click.echo("Banco inicializado com segurança.")

    return app


def _starter_projects():
    return [
        Project(title="Gerente 360", slug="gerente-360", summary="Gestão integrada com indicadores, cadastros e visão executiva.", description="Aplicação Flask modular para transformar rotinas administrativas em um fluxo organizado, mensurável e fácil de acompanhar.", technologies="Python, Flask, SQLAlchemy, Bootstrap, Chart.js", category="ERP", level="Avançado", status="Em evolução", featured=True),
        Project(title="Importador Inteligente de NF-e", slug="importador-nfe", summary="Leitura de XML e planilhas para centralizar dados fiscais.", description="Projeto que importa documentos fiscais, valida campos essenciais e prepara informações para conferência, análise e integração com banco de dados.", technologies="Python, Flask, XML, Pandas, SQLite", category="Automação", level="Avançado", status="Em evolução", featured=True),
        Project(title="Dashboard de Controladoria", slug="dashboard-controladoria", summary="Indicadores financeiros e fiscais para apoiar decisões.", description="Painel analítico com métricas de faturamento, divergências, tributos e evolução operacional, unindo experiência contábil e análise de dados.", technologies="Power BI, Power Query, Excel, Python", category="Dados", level="Profissional", status="Planejado", featured=True),
        Project(title="API Financeira", slug="api-financeira", summary="Serviços REST para contas, categorias e relatórios.", description="API organizada em camadas com validação, autenticação e documentação para integrar aplicações financeiras.", technologies="Python, FastAPI, SQL, REST", category="API", level="Intermediário", status="Planejado"),
    ]
