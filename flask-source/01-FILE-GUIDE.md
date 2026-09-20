# Guia arquivo por arquivo

## Arquivos da raiz

### `run.py`

É o ponto de entrada durante o desenvolvimento. Ele importa `create_app()`, recebe uma aplicação pronta e chama `app.run()` somente quando executado diretamente.

Conceitos: `if __name__ == "__main__"`, importação e servidor de desenvolvimento.

### `wsgi.py`

Cria a mesma aplicação, mas não chama `app.run()`. Um servidor de produção, como Gunicorn, importa a variável `app` deste arquivo.

### `config.py`

Centraliza configurações. `os.getenv()` busca valores no ambiente e `pathlib.Path` constrói caminhos compatíveis com Windows e Linux. `TestConfig` usa SQLite em memória e desliga CSRF somente nos testes.

### `.env.example`

Mostra quais variáveis precisam existir sem revelar os valores reais. O arquivo `.env` verdadeiro fica fora do Git.

### `requirements.txt`

Registra as versões das bibliotecas. Isso permite reconstruir o mesmo ambiente em outra máquina.

### `seed.py`

Cria o primeiro administrador e o perfil inicial. `getpass()` oculta a senha digitada; `set_password()` salva apenas o hash.

## Núcleo da aplicação

### `app/__init__.py`

Contém a Application Factory. A função `create_app()`:

1. cria o objeto Flask;
2. carrega configurações;
3. garante pastas necessárias;
4. conecta extensões;
5. registra Blueprints;
6. cria tabelas ausentes;
7. devolve a aplicação pronta.

Esse padrão permite criar outra aplicação usando `TestConfig`, evitando que os testes usem o banco real.

### `app/extensions.py`

Cria `db`, `login_manager` e `csrf` sem ligá-los imediatamente a uma aplicação. A ligação acontece em `create_app()`. Isso evita importações circulares.

### `app/models.py`

Representa o banco por classes Python:

- `User`: acesso ao painel e hash de senha;
- `Profile`: biografia, contatos, foto e currículo;
- `Project`: conteúdo de cada card do carrossel;
- `Article`: rascunhos e artigos publicados.

Cada `db.Column()` vira uma coluna SQL. `nullable=False` torna o valor obrigatório; `unique=True` impede duplicidade; `index=True` acelera buscas frequentes.

## Blueprint público

### `app/main/__init__.py`

Cria `Blueprint("main", __name__)`. O Blueprint agrupa rotas relacionadas e será registrado na fábrica.

### `app/main/routes.py`

Atende `GET /`. Consulta perfil, projetos destacados e artigos publicados. O serviço do GitHub é chamado fora do template. Por fim, `render_template()` entrega todos os objetos ao Jinja.

## Autenticação

### `app/auth/forms.py`

Define `LoginForm`. Os validadores rejeitam campos vazios e e-mails inválidos antes de consultar o banco.

### `app/auth/routes.py`

No login:

1. Flask-WTF valida formulário e CSRF;
2. SQLAlchemy procura o e-mail;
3. Werkzeug compara a senha ao hash;
4. Flask-Login cria a sessão;
5. o usuário é redirecionado ao painel.

O logout remove a sessão e redireciona para a página pública.

## Administração e CRUD

### `app/admin/forms.py`

Define campos, limites e formatos aceitos. `FileAllowed` restringe imagens e currículo; `URL` valida links; `Length` protege o banco de textos fora do limite.

### `app/admin/routes.py`

Implementa:

- Read: `dashboard()` lista projetos;
- Create: `project_create()` cadastra;
- Update: `project_edit()` altera;
- Delete: `project_delete()` remove;
- edição do perfil: `profile_edit()`.

Todas as rotas administrativas usam `@login_required`.

`slugify()` converte um título em parte segura de URL. `unique_slug()` evita dois projetos com o mesmo slug.

## Serviços

### `app/services/storage.py`

Centraliza uploads. `secure_filename()` remove caracteres perigosos, `uuid4()` evita colisões e a lista de extensões impede arquivos não autorizados.

### `app/services/github.py`

Extrai o usuário do link cadastrado, consulta a API pública do GitHub, agrupa eventos por dia e devolve uma estrutura simples para o template.

Uma falha externa não derruba o portfólio: o `except` devolve uma atividade vazia.

## Templates Jinja

### `app/templates/base.html`

É herdado pelas outras páginas. Ele define `<head>`, Bootstrap, CSS, mensagens flash, JavaScript e os blocos `{% block %}`.

### `app/templates/main/index.html`

Recebe dados reais da rota principal. Os principais mecanismos Jinja são:

- `{{ valor }}`: imprime um valor com escape;
- `{% if %}`: exibe conteúdo somente quando existe;
- `{% for %}`: cria cards conforme os registros;
- `{% else %}` dentro do `for`: apresenta o estado vazio;
- `url_for()`: gera URLs sem escrever caminhos fixos.

### `app/templates/auth/login.html`

Renderiza campos WTForms e seus erros. `hidden_tag()` inclui o token CSRF.

### `app/templates/admin/`

Contém dashboard e formulários. Os botões de exclusão usam `POST` e CSRF; um link `GET` nunca deve apagar registros.

## Front-end

### `app/static/css/app.css`

Está dividido por comentários:

1. variáveis visuais;
2. componentes globais;
3. sidebar e hero;
4. seções públicas;
5. login e painel;
6. media queries.

As variáveis em `:root` permitem alterar cores e largura da sidebar sem procurar valores em todo o arquivo.

### `app/static/js/app.js`

Possui apenas duas responsabilidades:

- `IntersectionObserver`: identifica a seção visível e atualiza o menu;
- `scrollBy()`: movimenta o carrossel de projetos.

O sistema não depende de animações pesadas nem de framework JavaScript.

## Testes

### `tests/conftest.py`

Cria fixtures reutilizáveis. Cada teste recebe aplicação e banco isolados em memória.

### `tests/test_routes.py`

Verifica se a home responde e se um usuário anônimo é redirecionado ao tentar abrir o painel.
