"""Cria ou atualiza o administrador do portfólio.

O perfil, os projetos e os artigos públicos são criados automaticamente pela
Application Factory. Este comando cuida apenas da credencial privada.
"""

import os
from getpass import getpass

from dotenv import load_dotenv

from app import create_app
from app.extensions import db
from app.models import User


load_dotenv()
app = create_app()


with app.app_context():
    email = (os.getenv("ADMIN_EMAIL") or input("E-mail do administrador: ")).strip().lower()
    password = os.getenv("ADMIN_PASSWORD") or getpass("Senha forte: ")
    if not email or not password:
        raise SystemExit("Informe e-mail e senha para criar o administrador.")

    user = User.query.filter_by(email=email).first() or User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    print(f"Administrador {email} preparado com sucesso.")
