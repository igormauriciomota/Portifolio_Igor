"""Executa o inicializador do banco Flask a partir da raiz do repositório."""

from __future__ import annotations

import os
import runpy
import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parent
FLASK_DIR = ROOT_DIR / "flask-source"
sys.path.insert(0, str(FLASK_DIR))

# Executar dentro de flask-source mantém banco, configuração e uploads juntos.
os.chdir(FLASK_DIR)
runpy.run_path(str(FLASK_DIR / "seed.py"), run_name="__main__")
