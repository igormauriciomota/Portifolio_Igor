"""Conteúdo editorial inicial do portfólio.

O banco continua sendo a fonte editável. Este módulo fornece uma primeira
experiência completa logo depois de `python run.py`, sem exigir que o usuário
cadastre manualmente cada projeto antes de visualizar o site.
"""

PROFILE_DEFAULTS = {
    "id": 1,
    "name": "Igor Mota",
    "headline": "Desenvolvedor Python & Analista de Dados",
    "location": "Belo Horizonte, MG",
    "bio": (
        "Uno experiência em controladoria e contabilidade à programação para "
        "criar ERPs, APIs, automações e análises orientadas a negócio."
    ),
    "email": "mota.full.stack@gmail.com",
    "linkedin_url": "https://www.linkedin.com/in/igor-mota-320872274",
    "github_url": "https://github.com/igormauriciomota",
    "whatsapp_url": "https://wa.me/5531975340765",
    "photo_filename": "asset:igor-avatar-realistic-v2.webp",
}


PROJECTS = [
    {
        "title": "Gerente 360",
        "slug": "gerente-360",
        "eyebrow": "ERP em Flask · Gestão integrada",
        "description": (
            "ERP funcional desenvolvido em Flask para integrar vendas, estoque, "
            "financeiro, importações, indicadores e rotinas administrativas."
        ),
        "problem": (
            "Informações comerciais, financeiras e de estoque em controles "
            "separados aumentam o retrabalho e reduzem a velocidade das decisões."
        ),
        "solution": (
            "Aplicação Flask modular que centraliza cadastros, movimentações, "
            "indicadores e auditoria em um fluxo organizado e mensurável."
        ),
        "highlights": "Vendas, estoque e financeiro integrados\nImportação de Excel e notas fiscais XML\nDashboards, conciliação e auditoria\nClientes, fornecedores e perfis de acesso",
        "integrations": "SQLAlchemy para persistência e regras de dados\nExcel e XML para importações\nChart.js para dashboards\nFlask-Login para controle de acesso",
        "stack": "Python, Flask, SQLAlchemy, Bootstrap, Chart.js",
        "status": "Em evolução",
        "accent": "#4f9cff",
        "github_url": "https://github.com/igormauriciomota/gerente360",
        "video_url": "asset:gerente-360-demo-30s.mp4",
        "image_filename": "asset:gerente-360-dashboard.webp",
        "sort_order": 1,
    },
    {
        "title": "Python Practice Lab",
        "slug": "python-practice-lab",
        "eyebrow": "Treinamento Python · evolução no GitHub",
        "description": (
            "Laboratório público em 20 etapas: fundamentos, lógica, funções, "
            "arquivos, POO, testes, SQL, SQLite, CRUD e segurança."
        ),
        "problem": (
            "Aprendizados soltos dificultam revisar conceitos, construir "
            "autonomia e demonstrar evolução técnica de forma verificável."
        ),
        "solution": (
            "Repositório progressivo com teoria aplicada, exercícios, testes, "
            "mini projetos e histórico de commits por competência."
        ),
        "highlights": "20 etapas de aprendizagem\nPrática registrada por commits\nDo fundamento à arquitetura\nTestes e qualidade desde o início",
        "integrations": "GitHub para histórico verificável\nPytest para qualidade\nSQL e SQLite para persistência\nCRUD e autenticação",
        "stack": "Python 3.13+, Pytest, SQL, SQLite, Git",
        "status": "Em evolução",
        "accent": "#b47cff",
        "github_url": "https://github.com/igormauriciomota/python-practice-lab",
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
        "problem": "Planilhas operacionais chegam com formatos, lacunas e métricas pouco padronizados.",
        "solution": "Fluxo local que prepara os dados, calcula KPIs e explica os resultados sem enviar o arquivo ao servidor.",
        "highlights": "Importação de CSV, XLS e XLSX\nKPIs automáticos\nGráficos interativos\nQuatro níveis de análise",
        "integrations": "Excel e CSV\nSheetJS no navegador\nSQL e Power BI como evolução\nPrivacidade por processamento local",
        "stack": "Power BI, SQL, Pandas, Excel, Power Query",
        "status": "Em evolução",
        "accent": "#7c8cff",
        "live_url": "/tecnologias/power-bi#laboratorio",
        "image_filename": "asset:igor-data-future.webp",
        "sort_order": 3,
    },
    {
        "title": "Django ERP Control Center",
        "slug": "django-erp-control-center",
        "eyebrow": "Django · ERP e gestão",
        "description": "Arquitetura multiusuário para financeiro, estoque, compras, permissões, administração e APIs empresariais.",
        "problem": "Processos administrativos desconectados geram duplicidade e pouca rastreabilidade.",
        "solution": "Projeto modular em Django com autenticação, ORM, administração e APIs.",
        "highlights": "Multiusuário e permissões\nMódulos desacoplados\nAuditoria e indicadores",
        "integrations": "Django ORM e PostgreSQL\nDjango Admin\nDjango REST Framework\nCelery, Redis e Power BI",
        "stack": "Django, PostgreSQL, Django REST Framework, Bootstrap, Docker",
        "status": "Planejado",
        "accent": "#44b78b",
        "live_url": "/tecnologias/django",
        "image_filename": "asset:django-logo-positive.png",
        "sort_order": 4,
    },
    {
        "title": "Fiscal Audit Engine",
        "slug": "fiscal-audit-engine",
        "eyebrow": "Auditoria de NF-e",
        "description": "Leitura de XML e validações de CFOP, CST, NCM, ICMS, PIS e COFINS com trilha de auditoria.",
        "problem": "A conferência manual de documentos fiscais consome tempo e dificulta localizar divergências recorrentes.",
        "solution": "Pipeline de importação, normalização e validação com histórico de cada regra aplicada.",
        "highlights": "Regras configuráveis\nHistórico de auditoria\nRelatório de divergências",
        "integrations": "XML NF-e 4.00\nPandas\nExcel",
        "stack": "Python, Pandas, Flask, XML",
        "status": "Planejado",
        "accent": "#4ae0c1",
        "sort_order": 5,
    },
    {
        "title": "Inventory Intelligence",
        "slug": "inventory-intelligence",
        "eyebrow": "Estoque e custos",
        "description": "CRUD de produtos e movimentações com custo médio, margem, giro e alertas de reposição.",
        "problem": "Entradas, saídas e custos dispersos impedem uma visão confiável do estoque.",
        "solution": "Sistema com saldo, custo médio, ponto de reposição e indicadores de giro por produto.",
        "highlights": "Custo médio\nAlertas de reposição\nGiro e margem",
        "integrations": "SQLAlchemy ORM\nImportação por Excel\nRelatórios PDF",
        "stack": "Flask, SQLAlchemy, Bootstrap, Excel",
        "status": "Planejado",
        "accent": "#ff8c68",
        "sort_order": 6,
    },
    {
        "title": "Business API",
        "slug": "business-api",
        "eyebrow": "API REST",
        "description": "API para clientes, produtos e lançamentos com autenticação, validação e testes automatizados.",
        "problem": "Sistemas isolados precisam compartilhar cadastros sem duplicar regras de negócio.",
        "solution": "API REST com contratos claros, autenticação, validação e cobertura dos fluxos críticos.",
        "highlights": "Documentação automática\nAutenticação\nTestes de contrato",
        "integrations": "PostgreSQL\nOpenAPI\nAplicações web e BI",
        "stack": "FastAPI, PostgreSQL, Pytest, OpenAPI",
        "status": "Planejado",
        "accent": "#57b8ff",
        "sort_order": 7,
    },
    {
        "title": "Django Data Portal",
        "slug": "django-data-portal",
        "eyebrow": "Django · dados e automação",
        "description": "Portal seguro para importar planilhas, validar dados, executar análises e disponibilizar resultados por painel e API.",
        "problem": "Análises recorrentes dependem de etapas manuais e arquivos sem validação ou histórico.",
        "solution": "Upload controlado, processamento assíncrono, histórico de execuções e métricas por usuário.",
        "highlights": "Importação validada\nFila de processamento\nHistórico por usuário",
        "integrations": "Pandas\nCelery\nPostgreSQL\nPower BI e API",
        "stack": "Django, Pandas, PostgreSQL, Celery, Power BI",
        "status": "Planejado",
        "accent": "#0c4b33",
        "live_url": "/tecnologias/django",
        "image_filename": "asset:django-logo-positive.png",
        "sort_order": 8,
    },
]


TECHNOLOGIES = {
    "python": {
        "icon": "python",
        "title": "Python",
        "eyebrow": "DESENVOLVIMENTO · AUTOMAÇÃO · APIs",
        "summary": "Uso Python para transformar regras de negócio em sistemas claros, integrações reutilizáveis e rotinas que reduzem trabalho manual.",
        "impact": "Minha base contábil ajuda a programar com atenção a validação, rastreabilidade e significado dos números — não apenas à sintaxe.",
        "applications": [
            ("Desenvolvimento web", "Aplicações Flask com rotas, templates, formulários, autenticação e arquitetura modular.", "FLASK · HTML · CSS"),
            ("APIs", "Endpoints REST para conectar clientes, produtos e lançamentos com validação e documentação.", "FASTAPI · JSON · TESTES"),
            ("Automação", "Leitura de planilhas e XML, conferências, padronização e relatórios repetíveis.", "PANDAS · EXCEL · XML"),
        ],
        "process": [("01", "Entender", "Mapeio a regra, os usuários e o resultado esperado."), ("02", "Modelar", "Organizo módulos, dados, validações e casos de erro."), ("03", "Construir", "Implemento em partes pequenas e testáveis."), ("04", "Evoluir", "Meço uso, documento decisões e planejo melhorias.")],
        "stack": ["Python", "Flask", "FastAPI", "Pandas", "Pytest", "SQLite", "PostgreSQL"],
    },
    "django": {
        "icon": "django",
        "title": "Django",
        "eyebrow": "PYTHON · FRAMEWORK WEB DE ALTO NÍVEL",
        "summary": "Django é um framework web de alto nível escrito em Python para desenvolver aplicações completas com rapidez, segurança e organização.",
        "impact": "Uso Django como caminho para sistemas empresariais maiores, mantendo regras, usuários, dados e administração em uma arquitetura consistente.",
        "applications": [
            ("Sistemas empresariais", "ERP, portais internos e aplicações multiusuário com módulos e regras de acesso.", "ERP · ADMIN · PERMISSÕES"),
            ("Dados e segurança", "Models descrevem o domínio, o ORM conversa com o banco e recursos nativos apoiam autenticação e proteção.", "ORM · AUTH · MIGRATIONS"),
            ("APIs e integrações", "Django REST Framework conecta front-ends, Power BI e serviços externos.", "DRF · JSON · WEBHOOKS"),
        ],
        "process": [("01", "Modelar o domínio", "Transformo clientes, produtos e lançamentos em models."), ("02", "Organizar aplicações", "Divido o sistema em apps com responsabilidades claras."), ("03", "Entregar interfaces e APIs", "Views, templates e serializers apresentam os dados."), ("04", "Operar com segurança", "Permissões, testes e tarefas assíncronas sustentam a evolução.")],
        "stack": ["Django", "Django REST Framework", "PostgreSQL", "Celery", "Redis", "Docker", "Bootstrap", "Power BI"],
        "official_url": "https://www.djangoproject.com/start/overview/",
    },
    "sql": {
        "icon": "sql", "title": "SQL", "eyebrow": "MODELAGEM · CONSULTAS · QUALIDADE",
        "summary": "Estruturo e consulto dados relacionais para que sistemas e análises trabalhem sobre informações consistentes e explicáveis.",
        "impact": "Em projetos de ERP e BI, SQL é a ponte entre a operação diária e a visão gerencial.",
        "applications": [("Modelagem de dados", "Entidades, relacionamentos, chaves e regras de integridade.", "SCHEMA · INTEGRIDADE"), ("Consultas analíticas", "Filtros, junções, agregações e indicadores por período, produto ou região.", "JOIN · CTE · GROUP BY"), ("Integração", "Camada de dados para aplicações Python, APIs e painéis.", "PYTHON · API · BI")],
        "process": [("01", "Definir", "Traduzo processos em entidades e regras."), ("02", "Organizar", "Reduzo duplicidade e estabeleço relacionamentos."), ("03", "Consultar", "Crio consultas legíveis e verificáveis."), ("04", "Otimizar", "Reviso índices, volume e uso antes de escalar.")],
        "stack": ["SQL", "PostgreSQL", "SQLite", "Modelagem relacional", "ETL", "Power Query"],
    },
    "power-bi": {
        "icon": "power-bi", "title": "Power BI & Dashboards", "eyebrow": "POWER QUERY · KPIs · STORYTELLING",
        "summary": "Converto dados operacionais em indicadores visuais que ajudam lideranças a localizar variações, comparar resultados e agir com contexto.",
        "impact": "O painel é o fim de uma cadeia: primeiro vêm qualidade, modelagem e definição do indicador. Só então o gráfico se torna confiável.",
        "applications": [("Preparação", "Limpeza, tipos corretos, ausências e padronização com Power Query.", "POWER QUERY · ETL"), ("Modelo e métricas", "Relacionamentos, calendário, medidas e KPIs alinhados ao negócio.", "DAX · MODELO ESTRELA"), ("Dashboard", "Hierarquia visual, filtros e narrativa para leitura rápida.", "UX · KPIs · INSIGHTS")],
        "process": [("01", "Pergunta", "Defino qual decisão o painel precisa apoiar."), ("02", "Qualidade", "Perfilo e preparo os dados antes dos cálculos."), ("03", "Modelo", "Crio medidas e dimensões com regras explícitas."), ("04", "Comunicação", "Apresento o indicador, o contexto e a próxima ação.")],
        "stack": ["Power BI", "Power Query", "DAX", "Excel", "SQL", "Python", "Storytelling"],
    },
    "analise-de-dados": {
        "icon": "analytics", "title": "Análise de Dados", "eyebrow": "DESCREVER · EXPLICAR · PREVER · RECOMENDAR",
        "summary": "Estruturo a análise da pergunta à recomendação, escolhendo o nível de profundidade adequado à decisão.",
        "impact": "Combino conhecimento de negócio, qualidade de dados e comunicação para evitar números sem contexto.",
        "applications": [("Descritiva", "Resume o que aconteceu com totais, médias, tabelas e gráficos.", "O QUE ACONTECEU"), ("Diagnóstica", "Investiga causas, segmentos e padrões relacionados ao resultado.", "POR QUE ACONTECEU"), ("Preditiva e prescritiva", "Estima cenários e transforma evidências em opções de ação.", "O QUE PODE ACONTECER")],
        "process": [("01", "Perguntar", "Delimito decisão, período e população."), ("02", "Preparar", "Valido origem, tipos, ausências e consistência."), ("03", "Analisar", "Aplico estatística e comparação adequadas."), ("04", "Comunicar", "Explico limites, evidências e ações possíveis.")],
        "stack": ["Python", "Pandas", "SQL", "Excel", "Power BI", "Estatística", "Machine Learning"],
    },
}


ARTICLE_DEFAULTS = [
    {
        "title": "Do erro ‘view retornou None’ ao fluxo completo de uma rota Flask",
        "slug": "fluxo-completo-rota-flask",
        "summary": "Um bug simples como ponto de partida para entender requisição, retorno e renderização de templates.",
        "body": "Uma rota Flask precisa sempre devolver uma resposta válida. A partir desse erro, é possível compreender como a requisição chega à view, como as regras são executadas e como o template recebe os dados.",
        "published": True,
    },
    {
        "title": "Como um CRUD com listas prepara o caminho para SQLite",
        "slug": "crud-listas-para-sqlite",
        "summary": "O que permanece igual — e o que muda — quando os dados deixam a memória e chegam ao banco.",
        "body": "O fluxo de criar, consultar, atualizar e excluir permanece o mesmo. O SQLite acrescenta persistência, consultas e integridade, permitindo evoluir o exercício para uma aplicação real.",
        "published": True,
    },
]
