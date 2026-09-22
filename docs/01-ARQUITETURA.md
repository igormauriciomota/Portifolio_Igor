# Arquitetura modular

## Fluxo de uma requisição

1. **run.py** chama create_app.
2. **app/__init__.py** carrega configuração, extensões, Blueprints, banco e conteúdo inicial.
3. O Blueprint escolhe a função de rota.
4. A rota consulta models ou services.
5. O Jinja recebe objetos prontos e renderiza HTML.
6. CSS e JavaScript acrescentam apresentação e comportamento progressivo.

## Camadas

- **main**: experiência pública, catálogo, tecnologias, artigos, APIs de leitura e SEO.
- **auth**: login, sessão e logout.
- **admin**: CRUD protegido de perfil, projetos e artigos.
- **models**: persistência com SQLAlchemy.
- **services**: GitHub, uploads e inicialização idempotente.
- **templates**: HTML semântico e macros reutilizáveis.
- **static**: recursos versionáveis, sem lógica de servidor.

## Decisões importantes

A Application Factory permite criar uma aplicação isolada para testes. As extensões são instanciadas sem app em extensions.py e conectadas dentro de create_app, evitando importações circulares.

O conteúdo editorial inicial fica em content.py. bootstrap.py só cria registros ausentes, portanto alterações do painel não são sobrescritas a cada reinício.

Arquivos oficiais usam o prefixo asset: no banco. Uploads do painel usam caminhos relativos dentro de static/uploads. O helper media_url centraliza essa diferença.

O Data Lab processa planilhas no navegador. Essa escolha reduz transferência de dados pessoais e mantém o servidor Flask leve.

## Banco

- User: administrador e hash de senha.
- Profile: apresentação, contatos, foto e currículo.
- Project: estudo de caso, stack, mídia, links e ordem.
- Article: conteúdo em rascunho ou publicado.

Para evolução de schema em produção, acrescente Flask-Migrate/Alembic antes de alterar colunas.

