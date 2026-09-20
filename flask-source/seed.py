"""Cria o administrador, o perfil e os projetos iniciais do portfólio."""

from getpass import getpass

from app import create_app
from app.extensions import db
from app.models import Profile, Project, User


SITE_URL = "https://igor-mota-portfolio.igormotacontabil.chatgpt.site"

INITIAL_PROJECTS = [
    {
        "title": "Gerente 360",
        "slug": "gerente-360",
        "eyebrow": "ERP em Flask · Gestão integrada",
        "description": (
            "ERP funcional desenvolvido em Flask para integrar vendas, estoque, "
            "financeiro, importações, indicadores e rotinas administrativas."
        ),
        "stack": "Python, Flask, SQLAlchemy, Bootstrap, Chart.js",
        "status": "Em evolução",
        "accent": "#4f9cff",
        "github_url": "https://github.com/igormauriciomota/gerente360",
        "live_url": f"{SITE_URL}/projetos/gerente-360",
        "video_url": f"{SITE_URL}/gerente-360-demo-30s.mp4",
        "image_filename": "asset:gerente-360-dashboard.webp",
        "sort_order": 1,
    },
    {
        "title": "Python Practice Lab",
        "slug": "python-practice-lab",
        "eyebrow": "Treinamento Python · evolução no GitHub",
        "description": (
            "Laboratório público organizado por etapas, com fundamentos, funções, "
            "arquivos, POO, testes, SQL, SQLite, CRUD e segurança."
        ),
        "stack": "Python 3.13+, Pytest, SQL, SQLite, Git",
        "status": "Em evolução",
        "accent": "#b47cff",
        "github_url": "https://github.com/igormauriciomota/python-practice-lab",
        "live_url": f"{SITE_URL}/projetos/python-practice-lab",
        "image_filename": "asset:python-practice-lab-structure.webp",
        "sort_order": 2,
    },
    {
        "title": "Data Insight Lab",
        "slug": "data-insight-lab",
        "eyebrow": "Power BI · Análise de dados",
        "description": (
            "Laboratório para importar planilhas, calcular indicadores e explicar "
            "análises descritiva, diagnóstica, preditiva e prescritiva."
        ),
        "stack": "Power BI, SQL, Pandas, Excel, Power Query",
        "status": "Em evolução",
        "accent": "#7c8cff",
        "live_url": f"{SITE_URL}/tecnologias/power-bi",
        "image_filename": "asset:igor-data-future.webp",
        "sort_order": 3,
    },
    {
        "title": "Django ERP Control Center",
        "slug": "django-erp-control-center",
        "eyebrow": "Django · ERP e gestão",
        "description": (
            "Arquitetura multiusuário para financeiro, estoque, compras, permissões, "
            "administração e APIs empresariais."
        ),
        "stack": "Django, PostgreSQL, DRF, Bootstrap, Docker",
        "status": "Planejado",
        "accent": "#44b78b",
        "live_url": f"{SITE_URL}/tecnologias/django",
        "image_filename": "asset:django-logo-positive.png",
        "sort_order": 4,
    },
    {
        "title": "Fiscal Audit Engine",
        "slug": "fiscal-audit-engine",
        "eyebrow": "Auditoria de NF-e",
        "description": (
            "Leitura de XML e validações de CFOP, CST, NCM, ICMS, PIS e COFINS "
            "com histórico de divergências."
        ),
        "stack": "Python, Pandas, Flask, XML",
        "status": "Planejado",
        "accent": "#4ae0c1",
        "sort_order": 5,
    },
    {
        "title": "Inventory Intelligence",
        "slug": "inventory-intelligence",
        "eyebrow": "Estoque e custos",
        "description": (
            "CRUD de produtos e movimentações com custo médio, margem, giro e "
            "alertas de reposição."
        ),
        "stack": "Flask, SQLAlchemy, Bootstrap, Excel",
        "status": "Planejado",
        "accent": "#ff8c68",
        "sort_order": 6,
    },
    {
        "title": "Business API",
        "slug": "business-api",
        "eyebrow": "API REST",
        "description": (
            "API para clientes, produtos e lançamentos com autenticação, "
            "validação, documentação e testes automatizados."
        ),
        "stack": "FastAPI, PostgreSQL, Pytest, OpenAPI",
        "status": "Planejado",
        "accent": "#57b8ff",
        "sort_order": 7,
    },
]


app = create_app()


with app.app_context():
    email = input("E-mail do administrador: ").strip().lower()
    user = User.query.filter_by(email=email).first()

    if user:
        print("Administrador já existente; mantendo a senha atual.")
    else:
        password = getpass("Senha forte: ")
        user = User(email=email)
        user.set_password(password)
        db.session.add(user)

    profile = db.session.get(Profile, 1)
    if profile is None:
        profile = Profile(
            id=1,
            name="Igor Mota",
            headline="Desenvolvedor Python & Analista de Dados",
            location="Belo Horizonte, MG",
            bio=(
                "Uno experiência em controladoria e contabilidade à programação "
                "para criar ERPs, APIs, automações e análises orientadas a negócio."
            ),
            github_url="https://github.com/igormauriciomota",
            photo_filename="asset:igor-avatar-realistic-v2.webp",
        )
        db.session.add(profile)
    else:
        profile.github_url = profile.github_url or "https://github.com/igormauriciomota"
        profile.photo_filename = profile.photo_filename or "asset:igor-avatar-realistic-v2.webp"

    created_projects = 0
    for project_data in INITIAL_PROJECTS:
        if Project.query.filter_by(slug=project_data["slug"]).first() is None:
            db.session.add(Project(featured=True, **project_data))
            created_projects += 1

    db.session.commit()
    print(
        "Banco preparado com perfil, administrador e "
        f"{created_projects} novo(s) projeto(s)."
    )
