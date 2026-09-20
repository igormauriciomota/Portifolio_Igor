import os
from pathlib import Path

# Caminho absoluto da raiz do projeto. Usar pathlib torna o código compatível
# com Windows, Linux e macOS sem montar caminhos manualmente com barras.
BASE_DIR = Path(__file__).resolve().parent


class Config:
    """Configuração comum a todos os ambientes da aplicação."""

    # SECRET_KEY assina cookies e tokens CSRF. O valor abaixo serve apenas para
    # desenvolvimento; em produção, defina a variável de ambiente SECRET_KEY.
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-change-me")

    # A mesma aplicação usa SQLite localmente ou outro banco em produção. Basta
    # fornecer DATABASE_URL (por exemplo, uma URL do PostgreSQL).
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", f"sqlite:///{BASE_DIR / 'instance' / 'portfolio.db'}"
    )
    # Desliga um recurso antigo do SQLAlchemy que consome memória sem necessidade.
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Impede uploads maiores que 12 MB antes que a aplicação tente processá-los.
    MAX_CONTENT_LENGTH = 12 * 1024 * 1024
    UPLOAD_FOLDER = BASE_DIR / "app" / "static" / "uploads"


class TestConfig(Config):
    """Configuração isolada usada apenas pelo Pytest."""

    TESTING = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
