# Portfólio Igor Mota — Flask Profissional

![Prévia do portfólio](app/static/assets/og.png)

Portfólio completo, modular e responsivo para apresentar experiência profissional, habilidades técnicas, projetos e evolução de estudos. O visual combina um centro de comando futurista com uma arquitetura Flask simples de executar, estudar e publicar.

> O arquivo **run.py** está na raiz. Depois de instalar as dependências, o site inicia com **py run.py** no Windows.

## O que está incluído

- página inicial igual à composição visual apresentada: sidebar, retrato, hero em tela cheia e cards tecnológicos;
- páginas individuais para Python, Flask/APIs, Django, SQL, Power BI e Análise de Dados;
- catálogo pesquisável e filtrável de projetos;
- estudo de caso completo do **Gerente 360**, com GitHub, imagem da tela e vídeo de 30 segundos;
- evolução do **Python Practice Lab** com dados de commits públicos do GitHub;
- laboratório de dados que lê CSV, XLS e XLSX localmente no navegador;
- métricas descritivas, diagnósticas, preditivas e prescritivas;
- modo holograma interativo com teclado, mouse e toque;
- painel administrativo protegido para perfil, projetos, artigos, imagens, currículo e vídeo;
- banco SQLite criado automaticamente;
- Application Factory, Blueprints, SQLAlchemy, Flask-Login, Flask-WTF e CSRF;
- SEO com Open Graph, sitemap, robots.txt, manifest e HTML semântico;
- headers de segurança, validação de uploads e senhas com hash;
- CSS mobile-first, Bootstrap 5, estados de foco e suporte a movimento reduzido;
- testes automatizados com Pytest;
- Dockerfile, configuração do VS Code e documentação de arquitetura/deploy;
- fotos, ícones, capas e vídeo armazenados dentro do projeto.

## Início rápido no Windows

### 1. Descompacte no endereço desejado

Exemplo:

~~~text
C:\07-Portfolio\03-Projeto\Portifolio_Igor
~~~

Abra essa pasta no VS Code. No terminal, confirme que está na pasta que contém **run.py**:

~~~powershell
cd C:\07-Portfolio\03-Projeto\Portifolio_Igor
dir
~~~

### 2. Crie o ambiente virtual

~~~powershell
py -m venv .venv
~~~

Se o PowerShell bloquear a ativação, libere apenas a sessão atual:

~~~powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
~~~

Ative:

~~~powershell
.\.venv\Scripts\Activate.ps1
~~~

### 3. Instale as dependências

~~~powershell
py -m pip install --upgrade pip
pip install -r requirements.txt
pip install -r requirements-dev.txt
~~~

### 4. Configure o ambiente

~~~powershell
copy .env.example .env
~~~

O projeto já cria perfil, projetos e artigos na primeira execução. Para habilitar o painel, crie o administrador:

~~~powershell
py seed.py
~~~

O e-mail e a senha informados ficam somente no banco local; a senha é armazenada como hash.

### 5. Execute

~~~powershell
py run.py
~~~

Acesse:

- site: http://127.0.0.1:5000
- projetos: http://127.0.0.1:5000/projetos
- painel: http://127.0.0.1:5000/auth/login
- laboratório: http://127.0.0.1:5000/tecnologias/power-bi#laboratorio

## Estrutura

~~~text
portfolio-igor-mota-flask/
├── app/
│   ├── admin/
│   │   ├── forms.py                 # formulários e validação
│   │   └── routes.py                # CRUD protegido
│   ├── auth/
│   │   ├── forms.py                 # formulário de login
│   │   └── routes.py                # autenticação e logout
│   ├── main/
│   │   └── routes.py                # páginas, API, sitemap e manifest
│   ├── services/
│   │   ├── bootstrap.py             # conteúdo inicial idempotente
│   │   ├── github.py                # atividade e commits públicos
│   │   └── storage.py               # uploads seguros
│   ├── static/
│   │   ├── assets/                  # imagens, ícones e vídeo
│   │   ├── css/app.css              # identidade visual responsiva
│   │   ├── js/app.js                # navegação, filtros e holograma
│   │   ├── js/data-lab.js           # análise local da planilha
│   │   ├── uploads/                 # arquivos enviados pelo painel
│   │   └── vendor/xlsx.full.min.js  # leitura de Excel no navegador
│   ├── templates/
│   │   ├── admin/                   # painel e editores
│   │   ├── articles/                # artigos públicos
│   │   ├── auth/                    # login
│   │   ├── errors/                  # páginas 404 e 500
│   │   ├── macros/                  # ícones e componentes Jinja
│   │   ├── main/                    # home, projetos e tecnologias
│   │   └── base.html                # metadados e recursos comuns
│   ├── content.py                   # conteúdo editorial inicial
│   ├── extensions.py                # extensões Flask
│   ├── models.py                    # User, Profile, Project e Article
│   └── __init__.py                  # Application Factory
├── docs/                             # arquitetura, painel, testes e deploy
├── tests/                            # suíte Pytest
├── .env.example                     # variáveis documentadas
├── .gitignore
├── Dockerfile
├── Procfile
├── pyproject.toml
├── requirements.txt
├── requirements-dev.txt
├── run.py                           # entrada local
├── seed.py                          # cria administrador
└── wsgi.py                          # entrada de produção
~~~

## Laboratório de Power BI e análise de dados

O Data Lab aceita arquivos .csv, .xls e .xlsx de até 8 MB e 10.000 linhas. A primeira aba é analisada no navegador usando SheetJS. O arquivo não é enviado ao Flask.

A demonstração:

1. identifica colunas numéricas e dimensões;
2. calcula total, média, mediana, preenchimento e tendência;
3. compara grupos e destaca possíveis valores atípicos;
4. cria uma estimativa linear educacional;
5. explica os quatro níveis de análise;
6. mostra uma amostra das primeiras linhas.

A previsão não substitui um modelo estatístico validado. O objetivo é demonstrar fluxo analítico, comunicação e UX.

## Painel administrativo

Crie a conta com **py seed.py** e entre em **/auth/login**.

O painel permite:

- alterar nome, título, biografia e contatos;
- enviar foto WebP/JPG/PNG e currículo PDF;
- criar, editar e remover projetos;
- incluir problema, solução, destaques e integrações;
- enviar capa e vídeo MP4/WebM;
- definir status, cor, ordem e destaque;
- criar artigos em rascunho ou publicados.

Veja [docs/03-PAINEL-ADMIN.md](docs/03-PAINEL-ADMIN.md).

## Testes e qualidade

~~~powershell
pytest -q
ruff check .
~~~

Os testes verificam home, recursos internos, páginas tecnológicas, Data Lab, Gerente 360, artigos, sitemap, manifest, erros e proteção do painel.

## Publicar no GitHub

Na raiz do projeto:

~~~powershell
git init
git add .
git commit -m "feat: publica portfolio Flask profissional"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
~~~

A pasta .venv, o arquivo .env, o banco instance/portfolio.db e uploads privados não são enviados.

## Produção

Use uma chave secreta real, desative debug e execute por WSGI:

~~~bash
gunicorn --bind 0.0.0.0:8000 wsgi:app
~~~

Consulte [docs/04-DEPLOY.md](docs/04-DEPLOY.md) e [docs/05-SEGURANCA.md](docs/05-SEGURANCA.md).

## Documentação

- [Arquitetura modular](docs/01-ARQUITETURA.md)
- [Configuração no Windows e VS Code](docs/02-CONFIGURACAO-WINDOWS.md)
- [Painel administrativo](docs/03-PAINEL-ADMIN.md)
- [Deploy e Docker](docs/04-DEPLOY.md)
- [Segurança e privacidade](docs/05-SEGURANCA.md)
- [Testes e manutenção](docs/06-TESTES-E-MANUTENCAO.md)

## Links dos projetos

- [Gerente 360](https://github.com/igormauriciomota/gerente360)
- [Python Practice Lab](https://github.com/igormauriciomota/python-practice-lab)
- [Perfil GitHub](https://github.com/igormauriciomota)

---

Desenvolvido em Python, Flask, HTML, CSS, Bootstrap e JavaScript, com foco em dados, automação e sistemas de negócio.
