# Portfólio Profissional — Igor Mota

Portfólio responsivo e interativo que apresenta minha atuação na união entre
tecnologia, dados, contabilidade e visão de negócios. O projeto reúne uma
experiência publicada em React + TypeScript e uma versão completa para estudo
em Python + Flask.

## Acessos rápidos

- [Portfólio publicado](https://igor-mota-portfolio.igormotacontabil.chatgpt.site)
- [Todos os projetos](https://igor-mota-portfolio.igormotacontabil.chatgpt.site/projetos)
- [Estudo de caso Gerente 360](https://igor-mota-portfolio.igormotacontabil.chatgpt.site/projetos/gerente-360)
- [Código do Gerente 360](https://github.com/igormauriciomota/gerente360)
- [Python Practice Lab](https://github.com/igormauriciomota/python-practice-lab)

## O que acompanha o pacote completo

O arquivo de download entregue pelo próprio site contém:

- a aplicação publicada em React 19, TypeScript, Vinext, Vite e Cloudflare;
- a versão didática e funcional em Python, Flask, Jinja, Bootstrap e SQLite;
- páginas de Python, Flask, Django, SQL, Power BI e análise de dados;
- laboratório local de planilhas com KPIs, gráficos e quatro tipos de análise;
- catálogo de projetos e estudos de caso do Gerente 360 e Python Practice Lab;
- demonstração em vídeo de 30 segundos do Gerente 360;
- painel administrativo, autenticação, banco, uploads e testes na versão Flask;
- imagens, ícones, vídeo, configurações, scripts e documentação;
- este README com a estrutura completa e instruções de execução.

Dependências geradas, ambientes virtuais, caches, segredos e arquivos locais
como `.env` não entram no ZIP. Eles são recriados pelas instruções abaixo.

## Pacote preparado para o GitHub

O download `portfolio-igor-mota-github.zip` abre como um repositório completo.
Os arquivos `run.py`, `seed.py`, `requirements.txt`, `.env.example` e
`README.md` ficam na raiz. Assim, a versão Flask pode ser instalada e iniciada
sem procurar comandos dentro de subpastas.

Leia também [COMO-PUBLICAR-NO-GITHUB.md](COMO-PUBLICAR-NO-GITHUB.md), que contém
o passo a passo para publicar pelo navegador ou pelo terminal.

As funcionalidades do site atualmente publicado permanecem em `app/`, enquanto
a implementação didática em Flask permanece organizada em `flask-source/`. As
duas versões, todas as fotos, capas, ícones e o vídeo acompanham o mesmo pacote.

## Principais recursos

- design mobile-first, responsivo, acessível e com modo escuro;
- experiência holográfica opcional, navegação por mouse, toque e teclado;
- retrato profissional, animações suaves e respeito a movimento reduzido;
- cards interativos de tecnologias e projetos;
- SEO estrutural, sitemap, Open Graph e URLs amigáveis;
- projetos armazenados em banco e painel administrativo protegido;
- integração com atividade pública do GitHub;
- importação local de CSV, XLS e XLSX no laboratório de dados;
- código organizado em componentes, rotas, serviços, modelos e testes.

## Fotos e recursos visuais incluídos

| Arquivo | Uso |
| --- | --- |
| `public/igor-avatar-realistic-v2.webp` | Foto de rosto e ombros na versão Flask |
| `public/igor-portfolio-realistic-v2.webp` | Retrato profissional principal |
| `public/igor-data-future.webp` | Ambiente futurista de dados |
| `public/gerente-360-dashboard.webp` | Tela real do ERP Gerente 360 |
| `public/gerente-360-demo-30s.mp4` | Demonstração de 30 segundos |
| `public/python-practice-lab-structure.webp` | Estrutura do laboratório Python |
| `public/django-logo-positive.png` | Identidade visual da página Django |
| `public/og.png` | Imagem de compartilhamento do portfólio |

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Site publicado | React, TypeScript, Vinext, Vite, CSS, Cloudflare Workers |
| Dados do site | D1, Drizzle ORM e R2 |
| Versão Python | Python, Flask, Jinja, Bootstrap, SQLAlchemy e SQLite |
| Qualidade | ESLint, TypeScript, Node Test Runner e Pytest |
| Dados | SQL, Pandas, Excel, Power Query, Power BI e SheetJS |
| Integrações | GitHub API, APIs REST e armazenamento de arquivos |

## Estrutura completa

```text
portfolio-igor-mota-github/
├── .openai/
│   └── hosting.json
├── .env.example
├── COMO-PUBLICAR-NO-GITHUB.md
├── app/
│   ├── admin/
│   │   ├── AdminPanel.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── files/[...key]/route.ts
│   │   ├── github/python-practice-lab/route.ts
│   │   ├── github/route.ts
│   │   ├── profile/route.ts
│   │   ├── projects/[id]/route.ts
│   │   ├── projects/route.ts
│   │   ├── uploads/route.ts
│   │   └── _shared.ts
│   ├── projetos/
│   │   ├── [slug]/
│   │   │   ├── GitHubProgress.tsx
│   │   │   ├── ProjectDetail.tsx
│   │   │   └── page.tsx
│   │   ├── ProjectsGallery.tsx
│   │   └── page.tsx
│   ├── tecnologias/
│   │   ├── [slug]/page.tsx
│   │   └── power-bi/DataLab.tsx
│   ├── HologramPortal.tsx
│   ├── TechnologyIcon.tsx
│   ├── chatgpt-auth.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── project-catalog.ts
│   └── sitemap.ts
├── build/
│   └── sites-vite-plugin.ts
├── db/
│   ├── index.ts
│   └── schema.ts
├── drizzle/
│   ├── meta/
│   │   ├── 0000_snapshot.json
│   │   └── _journal.json
│   └── 0000_redundant_master_chief.sql
├── examples/
│   └── d1/
│       ├── app/api/notes/route.ts
│       └── db/schema.ts
├── flask-source/
│   ├── .vscode/
│   │   ├── extensions.json
│   │   ├── launch.json
│   │   ├── settings.json
│   │   └── tasks.json
│   ├── app/
│   │   ├── admin/
│   │   │   ├── __init__.py
│   │   │   ├── forms.py
│   │   │   └── routes.py
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── forms.py
│   │   │   └── routes.py
│   │   ├── main/
│   │   │   ├── __init__.py
│   │   │   └── routes.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── github.py
│   │   │   └── storage.py
│   │   ├── static/
│   │   │   ├── css/app.css
│   │   │   ├── js/app.js
│   │   │   └── uploads/.gitkeep
│   │   ├── templates/
│   │   │   ├── admin/
│   │   │   │   ├── dashboard.html
│   │   │   │   ├── profile_form.html
│   │   │   │   └── project_form.html
│   │   │   ├── auth/login.html
│   │   │   ├── main/index.html
│   │   │   └── base.html
│   │   ├── __init__.py
│   │   ├── extensions.py
│   │   └── models.py
│   ├── tests/
│   │   ├── conftest.py
│   │   └── test_routes.py
│   ├── .env.example
│   ├── .gitignore
│   ├── 00-START-HERE.md
│   ├── 01-FILE-GUIDE.md
│   ├── 02-REQUEST-FLOWS.md
│   ├── 03-STUDY-PLAN.md
│   ├── 04-VSCODE-GUIDE.md
│   ├── 05-APOSTILA-GUIDE.md
│   ├── ARCHITECTURE.md
│   ├── README.md
│   ├── config.py
│   ├── portfolio-flask.code-workspace
│   ├── requirements-dev.txt
│   ├── requirements.txt
│   ├── run.py
│   ├── seed.py
│   └── wsgi.py
├── public/
│   ├── downloads/
│   │   └── README.md
│   ├── django-logo-positive.png
│   ├── favicon.svg
│   ├── file.svg
│   ├── gerente-360-dashboard.webp
│   ├── gerente-360-demo-30s.mp4
│   ├── globe.svg
│   ├── igor-avatar-realistic-v2.webp
│   ├── igor-data-future.webp
│   ├── igor-portfolio-realistic-v2.webp
│   ├── og.png
│   ├── python-practice-lab-structure.webp
│   └── window.svg
├── scripts/
│   ├── build-verified.sh
│   ├── install-ci.sh
│   └── sites-env.sh
├── tests/
│   └── rendered-html.test.mjs
├── worker/
│   └── index.ts
├── .gitignore
├── .npmrc
├── README.md
├── drizzle.config.ts
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── requirements-dev.txt
├── requirements.txt
├── run.py
├── seed.py
├── tsconfig.json
├── vite.config.ts
└── wsgi.py
```

O ZIP da distribuição é gerado depois que essa estrutura é preparada. Por isso,
ele não é incluído dentro de si mesmo.

## Executar o site atual

### Requisitos

- Node.js 22.13 ou superior;
- npm;
- Git opcional.

### Instalação

```bash
npm install
npm run dev
```

Abra o endereço exibido no terminal.

### Validação

```bash
npm run build
npm test
npm run lint
```

Para recursos de banco, uploads e autenticação em produção, configure os
bindings do Cloudflare indicados em `.openai/hosting.json`.

## Executar a versão Python + Flask no Windows

Abra o PowerShell na raiz do pacote e execute:

```powershell
py -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
py -m pip install --upgrade pip
py -m pip install -r requirements.txt
Copy-Item .env.example .env
py seed.py
py run.py
```

Depois, acesse:

| Endereço | Função |
| --- | --- |
| `http://127.0.0.1:5000` | Portfólio público |
| `http://127.0.0.1:5000/auth/login` | Login administrativo |
| `http://127.0.0.1:5000/admin` | Painel de edição |

O comando `py seed.py` solicita os dados do primeiro administrador e cria os
registros iniciais, incluindo os cards do Gerente 360, Python Practice Lab,
Power BI, Django e outros projetos. Não publique a senha nem o arquivo `.env`.

## Executar testes da versão Flask

```powershell
cd flask-source
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements-dev.txt
pytest -v
```

## Como o conteúdo é administrado

- visitantes possuem apenas acesso de leitura;
- a área administrativa exige autenticação;
- o perfil, contatos, currículo, projetos, imagens e links podem ser alterados;
- cada projeto aceita status, tecnologias, GitHub, demonstração e vídeo;
- senhas são armazenadas com hash e os formulários Flask usam proteção CSRF;
- uploads são validados antes de serem salvos.

## Ordem de estudo recomendada

1. Leia este arquivo e `flask-source/00-START-HERE.md`.
2. Explore `app/page.tsx` e `app/globals.css` para entender a interface atual.
3. Analise `app/project-catalog.ts` e as páginas dentro de `app/projetos`.
4. Execute o laboratório de dados em `app/tecnologias/power-bi/DataLab.tsx`.
5. Na versão Flask, comece por `run.py` e `app/__init__.py`.
6. Continue por models, rotas, templates, formulários, serviços e testes.
7. Use os guias numerados em `flask-source` como roteiro prático.

## Segurança antes da publicação

- crie uma `SECRET_KEY` longa e exclusiva;
- nunca envie `.env`, senhas, tokens ou bancos locais ao GitHub;
- desative o modo debug em produção;
- use HTTPS, cookies seguros e cabeçalhos de segurança;
- execute os testes e a análise estática;
- use PostgreSQL e armazenamento persistente quando o volume crescer;
- mantenha dependências atualizadas e revise permissões do painel.

## Projetos relacionados

- [Gerente 360 — ERP em Flask](https://github.com/igormauriciomota/gerente360)
- [Python Practice Lab — evolução dos estudos](https://github.com/igormauriciomota/python-practice-lab)

---

Desenvolvido por **Igor Mauricio Mota** para demonstrar aplicações web,
automação, APIs, análise de dados e sistemas de gestão orientados a resultados.
