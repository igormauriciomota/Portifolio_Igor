# Plano de estudo do projeto

## Dia 1 — execução e estrutura

- Crie o ambiente virtual.
- Instale as dependências.
- Execute `seed.py` e `run.py`.
- Desenhe a árvore de arquivos no caderno.

Exercício: altere apenas o título do navegador em `base.html`.

## Dia 2 — Factory e Blueprints

- Estude `run.py`, `app/__init__.py` e os três `__init__.py` dos Blueprints.
- Coloque temporariamente `print()` em `create_app()` para observar a inicialização.

Exercício: crie um Blueprint `health` com uma rota `/health` que devolva `{"status": "ok"}`.

## Dia 3 — models e SQLite

- Estude `extensions.py`, `models.py` e `seed.py`.
- Abra `instance/portfolio.db` com uma extensão SQLite do VS Code.

Exercício: adicione o campo `available_for_work` ao perfil.

## Dia 4 — rotas e consultas

- Estude `main/routes.py`.
- Observe `filter_by()`, `order_by()`, `limit()` e `.all()`.

Exercício: faça a home mostrar somente quatro projetos em destaque.

## Dia 5 — Jinja

- Estude `base.html` e `main/index.html`.
- Localize `extends`, `block`, `if`, `for` e `url_for`.

Exercício: crie uma seção “Roadmap” alimentada por uma lista enviada pela rota.

## Dia 6 — formulários e autenticação

- Estude `auth/forms.py`, `auth/routes.py` e `login.html`.
- Acompanhe o caminho da senha até `check_password()`.

Exercício: acrescente a opção “lembrar de mim” ao login.

## Dia 7 — CRUD

- Estude `admin/forms.py` e `admin/routes.py`.
- Cadastre, edite e exclua um projeto pelo painel.

Exercício: adicione um campo `category` com filtro no dashboard.

## Dia 8 — uploads e API

- Estude `storage.py` e `github.py`.
- Teste foto, PDF e capa.

Exercício: rejeite imagens acima de 8 MB com mensagem específica.

## Dia 9 — CSS e JavaScript

- Altere as variáveis em `:root`.
- Estude `IntersectionObserver` e `scrollBy()`.

Exercício: implemente tema claro/escuro usando uma classe no `<body>`.

## Dia 10 — testes e GitHub

- Execute `pytest -v`.
- Leia `conftest.py` e `test_routes.py`.
- Faça commits pequenos e escreva um README do que aprendeu.

Exercício: teste login correto, login inválido e cadastro de projeto.

## Critério para dizer “eu entendi”

Você deve conseguir explicar sem consultar:

- por que a Factory existe;
- como um Blueprint é registrado;
- como model vira tabela;
- como rota envia dados para Jinja;
- por que senha não pode ser salva diretamente;
- por que exclusão deve usar POST;
- o que `db.session.commit()` faz;
- onde alterar conteúdo, regra e aparência.
