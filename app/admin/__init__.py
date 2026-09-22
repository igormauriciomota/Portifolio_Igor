from flask import Blueprint


bp = Blueprint("admin", __name__)

from . import routes  # noqa: E402,F401  (registra as rotas após criar o Blueprint)
