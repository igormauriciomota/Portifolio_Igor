# Comece por aqui

Este pacote contém o código completo do portfólio profissional de Igor Mota em Python/Flask. Ele foi organizado para que você consiga executar a aplicação e, ao mesmo tempo, estudar cada camada no VS Code.

## Ordem recomendada dos arquivos

Não comece pelo CSS. Primeiro acompanhe o caminho percorrido por uma requisição:

1. `run.py` — inicia o programa.
2. `app/__init__.py` — monta a aplicação Flask.
3. `app/extensions.py` — prepara banco, login e CSRF.
4. `app/models.py` — define as tabelas.
5. `app/main/routes.py` — consulta o banco para montar a página inicial.
6. `app/templates/main/index.html` — apresenta os dados com Jinja.
7. `app/static/css/app.css` — define o visual.
8. `app/static/js/app.js` — adiciona interações leves.
9. `app/auth/` — autenticação.
10. `app/admin/` — CRUD e uploads.
11. `tests/` — verificação automática.

## Árvore completa

```text
flask-source/
├── .vscode/
│   ├── extensions.json          # extensões sugeridas
│   ├── launch.json              # execução pelo depurador
│   ├── settings.json            # configuração Python do projeto
│   └── tasks.json               # tarefas do terminal
├── app/
│   ├── admin/
│   │   ├── __init__.py          # cria Blueprint admin
│   │   ├── forms.py             # formulários de perfil e projeto
│   │   └── routes.py            # CRUD protegido
│   ├── auth/
│   │   ├── __init__.py          # cria Blueprint auth
│   │   ├── forms.py             # formulário de login
│   │   └── routes.py            # login e logout
│   ├── main/
│   │   ├── __init__.py          # cria Blueprint público
│   │   └── routes.py            # rota da página inicial
│   ├── services/
│   │   ├── github.py            # consome API pública do GitHub
│   │   └── storage.py           # valida e salva uploads
│   ├── static/
│   │   ├── css/app.css          # identidade visual e responsividade
│   │   ├── js/app.js            # scroll spy e carrossel
│   │   └── uploads/             # arquivos enviados pelo painel
│   ├── templates/
│   │   ├── admin/               # painel e formulários CRUD
│   │   ├── auth/login.html      # tela de login
│   │   ├── main/index.html      # portfólio público
│   │   └── base.html            # template compartilhado
│   ├── __init__.py              # Application Factory
│   ├── extensions.py            # SQLAlchemy, LoginManager e CSRF
│   └── models.py                # User, Profile, Project e Article
├── tests/
│   ├── conftest.py              # aplicação isolada para testes
│   └── test_routes.py           # testes das rotas principais
├── .env.example                 # modelo das variáveis de ambiente
├── .gitignore                   # arquivos que o Git não deve publicar
├── 00-START-HERE.md             # este arquivo
├── 01-FILE-GUIDE.md             # explicação arquivo por arquivo
├── 02-REQUEST-FLOWS.md          # fluxos completos do sistema
├── 03-STUDY-PLAN.md             # roteiro de estudo e exercícios
├── 04-VSCODE-GUIDE.md           # uso no VS Code/Windows
├── ARCHITECTURE.md              # visão profissional da arquitetura
├── config.py                    # desenvolvimento e testes
├── portfolio-flask.code-workspace
├── requirements.txt             # bibliotecas da aplicação
├── requirements-dev.txt         # ferramentas de desenvolvimento
├── run.py                       # servidor local
├── seed.py                      # primeiro administrador e perfil
└── wsgi.py                      # entrada para Gunicorn
```

## Primeiro funcionamento

Abra `portfolio-flask.code-workspace` no VS Code e execute no terminal:

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
python seed.py
python run.py
```

Depois acesse:

- Portfólio: `http://127.0.0.1:5000/`
- Login: `http://127.0.0.1:5000/auth/login`
- Administração: `http://127.0.0.1:5000/admin/`

## Regra didática

Antes de alterar qualquer código:

1. execute a versão original;
2. mude uma única coisa;
3. atualize o navegador;
4. explique com suas palavras o efeito;
5. reverta ou faça um commit no Git.

Assim você aprende a ligação entre Python, SQL, HTML, CSS e JavaScript sem se perder em várias mudanças ao mesmo tempo.
