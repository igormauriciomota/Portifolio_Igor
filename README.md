# Portfólio Igor Mota

Portfólio profissional desenvolvido com Python e Flask. O projeto apresenta a união entre Controladoria, Dados e Tecnologia e inclui catálogo de projetos, painel administrativo, formulário de contato, API pública de indicadores e experiência visual responsiva.

## Recursos principais

- Design mobile-first, tema claro/escuro e navegação por teclado.
- Modo Holograma com computador virtual, cinco rotas interativas, perspectiva 3D e alternativa acessível.
- Personagem futurista de corpo inteiro com o rosto de Igor e painéis dedicados a Python, Power BI, SQL, análise de dados e sistemas.
- Estudos de caso dinâmicos em janela interativa, com contexto, solução, stack e estágio de cada projeto.
- Página inicial com perfil, competências, trajetória, projetos e contato.
- Catálogo filtrável e páginas individuais dos projetos.
- Área administrativa com autenticação e CRUD de projetos.
- Dashboard com projetos, mensagens e tecnologias.
- SQLite com SQLAlchemy, CSRF, senhas com hash e cabeçalhos de segurança.
- Política de privacidade, consentimento no contato e analytics opcional sem ativação padrão.
- Sitemap, robots.txt, Open Graph, PWA manifest e URLs amigáveis.
- Canvas tridimensional leve, carregamento de imagem WebP e animações que respeitam `prefers-reduced-motion`.

## Executar no Windows (PowerShell)

```powershell
cd C:\caminho\portfolio-igor-mota
py -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\.venv\Scripts\Activate.ps1
py -m pip install --upgrade pip
py -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Abra o arquivo `.env`, troque `SECRET_KEY` e `ADMIN_PASSWORD`, depois rode:

```powershell
py -m flask --app run.py init-db
py -m flask --app run.py run --debug
```

Acesse `http://127.0.0.1:5000`. O painel fica em `http://127.0.0.1:5000/admin/login`.

## Personalização

- Textos públicos: `app/templates/home.html`.
- Cores, espaçamentos e responsividade: `app/static/css/style.css`.
- Animações, modo escuro e canvas 3D: `app/static/js/main.js`.
- Computador virtual e navegação holográfica: `app/templates/hologram.html`, `app/static/css/hologram.css` e `app/static/js/hologram.js`.
- Interação dos estudos de caso: `app/static/css/case-studies.css` e `app/static/js/case-studies.js`.
- Foto principal: `app/static/img/igor-data-future.webp`.
- Conteúdo dinâmico: cadastre no painel; não é preciso alterar o HTML.

## Produção

Use variáveis de ambiente reais, HTTPS e um servidor WSGI:

```bash
gunicorn -w 3 -b 0.0.0.0:8000 run:app
```

Para PostgreSQL, troque `DATABASE_URL`. Em produção, configure CDN/cache para imagens e CSS, monitoramento e rotina de backup do banco.

O projeto também inclui `Dockerfile`, `docker-compose.yml` e pipeline de testes no GitHub Actions. Para monitoramento de erros, defina `SENTRY_DSN`; para métricas opcionais, defina `PLAUSIBLE_DOMAIN` e revise a política de privacidade antes da publicação.

## Estrutura

```text
app/
├── admin/       # autenticação, dashboard e CRUD
├── api/         # endpoint público de indicadores
├── main/        # páginas públicas, contato e SEO
├── static/      # CSS, JavaScript e imagens
└── templates/   # páginas Jinja organizadas por contexto
tests/           # testes básicos de rotas e proteção
config.py        # configurações por ambiente
run.py           # ponto de entrada
```
