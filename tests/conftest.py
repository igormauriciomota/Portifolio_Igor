import pytest

from app import create_app
from app.extensions import db
from config import TestConfig


@pytest.fixture()
def app():
    """Cria uma aplicação e um banco novos para cada teste."""

    app = create_app(TestConfig)
    with app.app_context():
        # yield entrega a aplicação ao teste; o código seguinte faz a limpeza.
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    """Simula um navegador sem abrir servidor ou porta de rede."""
    return app.test_client()
