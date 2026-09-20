# Igor Mota — Portfólio Flask Profissional

Versão completa e estudável do portfólio, criada em Python/Flask. O projeto apresenta perfil, habilidades, projetos, artigos, currículo e contato. Uma área administrativa permite alterar o conteúdo sem editar o HTML, e os dados são armazenados no SQLite.

## Guias incluídos

Leia nesta ordem:

1. [`00-START-HERE.md`](00-START-HERE.md) — execução e árvore completa;
2. [`01-FILE-GUIDE.md`](01-FILE-GUIDE.md) — função de cada arquivo;
3. [`02-REQUEST-FLOWS.md`](02-REQUEST-FLOWS.md) — caminho das requisições;
4. [`03-STUDY-PLAN.md`](03-STUDY-PLAN.md) — dez dias de prática;
5. [`04-VSCODE-GUIDE.md`](04-VSCODE-GUIDE.md) — VS Code no Windows;
6. [`05-APOSTILA-GUIDE.md`](05-APOSTILA-GUIDE.md) — localização e conteúdo da apostila PDF;
7. [`ARCHITECTURE.md`](ARCHITECTURE.md) — arquitetura profissional.

Os arquivos Python possuem docstrings e comentários próximos das decisões importantes. Os templates, o CSS e o JavaScript também identificam a função de suas seções.

## O que você aprenderá

- como uma requisição percorre rota, banco, Python e template Jinja;
- Application Factory e Blueprints para separar responsabilidades;
- models e CRUD com Flask-SQLAlchemy;
- login administrativo com sessão e senha protegida por hash;
- formulários validados e protegidos por CSRF;
- upload de foto, currículo PDF e capas de projetos;
- integração com a API pública do GitHub;
- HTML, Bootstrap, CSS responsivo e JavaScript;
- testes de rotas com Pytest.

## Como abrir e executar no VS Code — Windows

1. Descompacte o arquivo baixado.
2. No VS Code, escolha **Arquivo → Abrir Pasta** e abra `igor-mota-portfolio-flask`.
3. Abra o terminal integrado com `Ctrl + '`.
4. Crie o ambiente virtual:

```powershell
python -m venv venv
```

5. Ative o ambiente:

```powershell
venv\Scripts\activate
```

6. Instale as dependências:

```powershell
pip install -r requirements.txt
```

7. Copie `.env.example` para `.env`:

```powershell
copy .env.example .env
```

8. Crie o primeiro administrador e o perfil inicial:

```powershell
python seed.py
```

9. Inicie o sistema:

```powershell
python run.py
```

10. Abra `http://127.0.0.1:5000`. Para administrar, use `http://127.0.0.1:5000/auth/login`.

O projeto também inclui `.vscode/launch.json`. Depois de selecionar o interpretador dentro de `venv`, você pode pressionar `F5` para depurar o Flask e criar breakpoints.

## Estrutura completa

```text
igor-mota-portfolio-flask/
├── .vscode/
│   ├── extensions.json         # extensões sugeridas
│   ├── launch.json             # execução e depuração com F5
│   ├── settings.json           # Pytest e análise de imports
│   └── tasks.json              # tarefas de execução e teste
├── app/
│   ├── admin/
│   │   ├── __init__.py         # cria o Blueprint admin
│   │   ├── forms.py            # formulários de perfil e projeto
│   │   └── routes.py           # CRUD protegido por login
│   ├── auth/
│   │   ├── __init__.py         # cria o Blueprint auth
│   │   ├── forms.py            # formulário de entrada
│   │   └── routes.py           # login e logout
│   ├── main/
│   │   ├── __init__.py         # cria o Blueprint público
│   │   └── routes.py           # consulta dados da página inicial
│   ├── services/
│   │   ├── github.py           # lê atividade pública no GitHub
│   │   └── storage.py          # valida e salva uploads
│   ├── static/
│   │   ├── css/app.css         # identidade visual e responsividade
│   │   ├── js/app.js           # navegação e carrossel
│   │   └── uploads/            # arquivos anexados localmente
│   ├── templates/
│   │   ├── admin/              # painel e formulários administrativos
│   │   ├── auth/login.html     # tela de autenticação
│   │   ├── main/index.html     # portfólio público
│   │   └── base.html           # layout compartilhado
│   ├── __init__.py             # Application Factory
│   ├── extensions.py           # banco, login e proteção CSRF
│   └── models.py               # tabelas User, Profile, Project e Article
├── tests/
│   ├── conftest.py             # aplicação e banco isolados para testes
│   └── test_routes.py          # testes da home e da proteção do painel
├── .env.example                # modelo de variáveis de ambiente
├── .gitignore                  # arquivos que não devem ir para o Git
├── 00-START-HERE.md            # ponto inicial de estudo
├── 01-FILE-GUIDE.md            # explicação arquivo por arquivo
├── 02-REQUEST-FLOWS.md         # fluxos do sistema
├── 03-STUDY-PLAN.md            # roteiro prático de dez dias
├── 04-VSCODE-GUIDE.md          # configuração no Windows
├── ARCHITECTURE.md             # fluxo detalhado arquivo por arquivo
├── config.py                   # configurações de desenvolvimento e teste
├── portfolio-flask.code-workspace
├── requirements-dev.txt        # Pytest e Ruff
├── requirements.txt            # dependências com versões fixadas
├── run.py                      # entrada para desenvolvimento
├── seed.py                     # cria o administrador com senha em hash
└── wsgi.py                     # entrada para Gunicorn em produção
```

## Ordem recomendada de estudo

1. `run.py` e `app/__init__.py` — como o Flask nasce.
2. `app/main/routes.py` — como uma URL chama uma função Python.
3. `app/templates/base.html` e `main/index.html` — como o Jinja recebe os dados.
4. `app/models.py` — como as tabelas são representadas por classes.
5. `app/auth/` — como login, sessão e hash funcionam.
6. `app/admin/` — CRUD real de perfil e projetos.
7. `app/services/` — upload e integração externa.
8. `tests/` — como verificar o comportamento automaticamente.

## Comandos úteis

```powershell
python run.py        # executa o site
python seed.py       # cria o primeiro administrador
pytest -v            # executa os testes
pip freeze           # mostra pacotes instalados
```

## Antes de publicar

1. Defina uma `SECRET_KEY` longa e imprevisível no ambiente.
2. Não envie o arquivo `.env`, o banco local ou a pasta de uploads ao GitHub.
3. Troque SQLite por PostgreSQL informando `DATABASE_URL` quando necessário.
4. Use R2 ou S3 para uploads persistentes em hospedagens com disco efêmero.
5. Adicione Flask-Migrate/Alembic antes de alterar tabelas em produção.
6. Execute `pytest` e nunca publique com o modo debug ligado.

Leia [ARCHITECTURE.md](ARCHITECTURE.md) depois do primeiro teste local. Ele explica o caminho completo dos dados, da URL até o HTML.
