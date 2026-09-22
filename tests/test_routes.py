def test_home_returns_success(client):
    response = client.get("/")
    html = response.get_data(as_text=True)
    assert response.status_code == 200
    assert "Tecnologia para transformar" in html
    assert "dados em decisões" in html
    assert "Entrar no holograma" in html
    assert "Flask · APIs" in html
    assert "Gerente 360" in html
    assert "Content-Security-Policy" in response.headers


def test_admin_redirects_anonymous_user(client):
    response = client.get("/admin/", follow_redirects=False)
    assert response.status_code == 302
    assert "/auth/login" in response.headers["Location"]


def test_all_main_assets_are_inside_the_flask_project(client):
    for path, mimetype in [
        ("/static/assets/igor-avatar-realistic-v2.webp", "image/webp"),
        ("/static/assets/igor-portfolio-realistic-v2.webp", "image/webp"),
        ("/static/assets/gerente-360-dashboard.webp", "image/webp"),
        ("/static/assets/gerente-360-demo-30s.mp4", "video/mp4"),
        ("/static/assets/django-logo-positive.png", "image/png"),
        ("/static/vendor/xlsx.full.min.js", "text/javascript"),
    ]:
        response = client.get(path)
        assert response.status_code == 200, path
        assert response.mimetype == mimetype, path


def test_technology_pages_and_data_lab(client):
    for slug in ["python", "django", "sql", "power-bi", "analise-de-dados"]:
        response = client.get(f"/tecnologias/{slug}")
        assert response.status_code == 200, slug

    power_bi = client.get("/tecnologias/power-bi").get_data(as_text=True)
    assert "LABORATÓRIO INTERATIVO" in power_bi
    assert "Importar planilha" in power_bi
    assert "xlsx.full.min.js" in power_bi

    django = client.get("/tecnologias/django").get_data(as_text=True)
    assert "Models e ORM" in django
    assert "Django REST Framework" in django


def test_projects_catalog_and_gerente_360_detail(client):
    catalog = client.get("/projetos")
    assert catalog.status_code == 200
    assert "08 projetos" in catalog.get_data(as_text=True)

    detail = client.get("/projetos/gerente-360")
    html = detail.get_data(as_text=True)
    assert detail.status_code == 200
    assert "github.com/igormauriciomota/gerente360" in html
    assert "gerente-360-demo-30s.mp4" in html
    assert "Vendas, estoque e financeiro integrados" in html


def test_articles_sitemap_manifest_and_robots(client):
    article = client.get("/artigos/aplicacoes-flask-modulares")
    assert article.status_code == 200
    assert "Application Factory" in article.get_data(as_text=True)

    sitemap = client.get("/sitemap.xml")
    assert sitemap.status_code == 200
    assert "/projetos/gerente-360" in sitemap.get_data(as_text=True)

    manifest = client.get("/site.webmanifest")
    assert manifest.status_code == 200
    assert manifest.get_json()["short_name"] == "Igor Mota"

    robots = client.get("/robots.txt")
    assert robots.status_code == 200
    assert "Sitemap:" in robots.get_data(as_text=True)


def test_unknown_route_uses_custom_error_page(client):
    response = client.get("/rota-inexistente")
    assert response.status_code == 404
    assert "Este caminho ainda não existe" in response.get_data(as_text=True)
