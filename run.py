"""Inicia a versão Flask a partir da raiz do repositório.

Este lançador existe para que o projeto baixado do GitHub possa ser executado
com ``py run.py`` sem exigir que a pessoa descubra a pasta ``flask-source``.
O site publicado em React/TypeScript continua disponível na mesma raiz pelos
comandos npm documentados no README.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parent
FLASK_DIR = ROOT_DIR / "flask-source"

# O pacote Flask usa imports como ``from app import create_app``. Colocar sua
# pasta no início do caminho de módulos mantém esses imports simples e claros.
sys.path.insert(0, str(FLASK_DIR))
load_dotenv(FLASK_DIR / ".env")
load_dotenv(ROOT_DIR / ".env")

from app import create_app  # noqa: E402  (import após configurar o caminho)


app = create_app()


if __name__ == "__main__":
    debug_enabled = os.getenv("FLASK_DEBUG", "0") == "1"
    app.run(host="127.0.0.1", port=5000, debug=debug_enabled)
