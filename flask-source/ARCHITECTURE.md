# Arquitetura: como todo o projeto se conecta

## Visão geral do fluxo

Quando o navegador abre `/`, o Flask localiza a rota `index()`. A rota consulta os models no SQLite, chama o serviço do GitHub e envia os objetos ao template. O Jinja transforma esses dados em HTML; CSS e JavaScript completam a experiência no navegador.

```text
Navegador
   ↓ GET /
Blueprint main → routes.py → models.py → SQLAlchemy → SQLite
                         ↘ services/github.py → API do GitHub
   ↓ render_template(...)
base.html + main/index.html
   ↓
HTML + app.css + app.js
```

## 1. Entradas da aplicação

- `run.py`: usado no estudo local com `python run.py`.
- `wsgi.py`: expõe `app` para um servidor como Gunicorn.
- `seed.py`: cria o administrador e o perfil inicial dentro de um `app_context`.

Todos usam `create_app()`. Assim, não existem três aplicações diferentes: são três formas de iniciar a mesma arquitetura.

## 2. Application Factory

`app/__init__.py` concentra a montagem:

1. cria `Flask(__name__)`;
2. carrega `Config`;
3. garante as pastas de instância e upload;
4. conecta SQLAlchemy, Flask-Login e CSRF;
5. registra os Blueprints público, autenticação e administração;
6. cria as tabelas ausentes no desenvolvimento.

Essa fábrica permite que o Pytest crie outra instância com banco em memória, sem tocar nos dados reais.

## 3. Configuração

`config.py` lê valores com `os.getenv()`. Isso separa código e segredos. O desenvolvedor usa SQLite; a hospedagem pode definir `DATABASE_URL` com PostgreSQL sem alterar uma linha da aplicação.

`TestConfig` desliga CSRF e usa `sqlite:///:memory:` para que cada teste seja rápido e independente.

## 4. Extensões sem importação circular

`app/extensions.py` cria `db`, `login_manager` e `csrf` sem receber `app`. A fábrica chama `init_app(app)` depois. Esse padrão evita o problema clássico em que `models.py` importa a aplicação e a aplicação importa os models.

## 5. Models e banco de dados

`app/models.py` representa quatro tabelas:

- `User`: administrador; salva `password_hash`, nunca a senha original;
- `Profile`: apresentação, contato, foto e currículo;
- `Project`: descrição, stack, status, capa, código, vídeo e demonstração;
- `Article`: título, resumo, corpo e controle de publicação.

Cada objeto criado em Python entra na sessão com `db.session.add()`. `db.session.commit()` confirma a transação no banco. Excluir usa `db.session.delete()` seguido de `commit()`.

## 6. Blueprints e rotas

### `main`

`app/main/routes.py` atende a página pública. Ele busca somente projetos destacados e artigos publicados. Dados inexistentes têm estados vazios no template; a versão final não inventa registros.

### `auth`

`app/auth/routes.py` recebe o formulário de login. `validate_on_submit()` valida campos e CSRF. Depois, `check_password_hash()` confere a senha, e `login_user()` guarda apenas o identificador do usuário na sessão assinada.

### `admin`

`app/admin/routes.py` protege todas as operações com `@login_required`. O administrador pode editar o perfil, anexar currículo e foto, cadastrar, editar ou excluir projetos e informar links de código, vídeo e demonstração.

## 7. Formulários e segurança

Os formulários ficam em `forms.py`, separados das rotas. Os validators conferem campos obrigatórios, tamanho, e-mail e URLs. `FileAllowed` limita formatos. O token CSRF impede que outro site envie um formulário em nome do administrador.

Exclusões usam POST. Uma URL GET deve consultar páginas; não deve apagar registros apenas por ser aberta.

## 8. Serviços

- `storage.py`: normaliza nomes, valida extensões, cria nomes aleatórios e grava na pasta configurada;
- `github.py`: extrai o usuário de uma URL válida e consulta eventos públicos com timeout e tratamento de erros.

Serviços retiram detalhes técnicos das rotas. A rota coordena o caso de uso; o serviço realiza uma tarefa especializada.

## 9. Templates e front-end

`base.html` contém metadados, Bootstrap, CSS, JavaScript, mensagens flash e blocos Jinja. Os templates filhos usam `{% extends %}` e substituem apenas os blocos necessários.

`main/index.html` usa:

- `{{ valor }}` para imprimir dados com escape automático;
- `{% if %}` para conteúdo opcional;
- `{% for %}` para repetir cards vindos do banco;
- `url_for()` para construir URLs sem escrevê-las manualmente.

`app.css` mantém toda a identidade visual navy/amarelo e as regras responsivas. `app.js` usa `IntersectionObserver` para destacar a seção visível e `scrollBy()` para controlar o carrossel.

## 10. Testes

`tests/conftest.py` cria fixtures reutilizáveis. A fixture `app` abre uma aplicação de teste e monta o banco em memória; `client` simula um navegador sem iniciar servidor real.

`test_routes.py` confirma que:

- a página inicial responde com status 200;
- visitante anônimo é redirecionado ao tentar abrir o painel.

Próximos testes recomendados: login correto/incorreto, criação de projeto, validação de upload e exclusão protegida.

## 11. Onde modificar cada coisa

| Quero alterar | Arquivo principal |
|---|---|
| Textos e estrutura da página | `app/templates/main/index.html` |
| Cores, tamanhos e responsividade | `app/static/css/app.css` |
| Navegação e carrossel | `app/static/js/app.js` |
| Campos do banco | `app/models.py` |
| Regras do formulário | `app/admin/forms.py` |
| Processo de salvar projetos | `app/admin/routes.py` |
| Configuração de banco e uploads | `config.py` |
| Login e sessão | `app/auth/` |

## 12. Evolução profissional

Depois de dominar esta versão, evolua nesta ordem:

1. Flask-Migrate/Alembic para migrations;
2. páginas reais de artigos com Markdown seguro;
3. PostgreSQL na hospedagem;
4. uploads persistentes em R2 ou S3;
5. cache da API GitHub;
6. testes de formulário e CRUD;
7. CI no GitHub Actions com Ruff, Pytest e cobertura;
8. Docker e configuração separada para produção.
