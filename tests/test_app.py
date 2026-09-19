from app import create_app
from app.extensions import db
from app.models import Project
from config import TestingConfig


def test_home_and_api():
    app = create_app(TestingConfig)
    with app.app_context():
        db.create_all()
        db.session.add(Project(title="Teste", slug="teste", summary="Resumo", description="Descrição suficientemente completa.", technologies="Python, Flask", category="Web", level="Intermediário", status="Concluído", published=True))
        db.session.commit()
    client = app.test_client()
    assert client.get("/").status_code == 200
    assert client.get("/holograma").status_code == 200
    projects_page = client.get("/projetos")
    assert projects_page.status_code == 200
    assert b"case-dialog" in projects_page.data
    response = client.get("/api/portfolio/stats")
    assert response.status_code == 200
    assert response.get_json()["projects"] == 1


def test_admin_requires_login():
    app = create_app(TestingConfig)
    with app.app_context(): db.create_all()
    response = app.test_client().get("/admin/", follow_redirects=False)
    assert response.status_code == 302
    assert "/admin/login" in response.headers["Location"]
