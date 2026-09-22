# Deploy e Docker

## Variáveis obrigatórias

- SECRET_KEY: chave longa e aleatória.
- FLASK_DEBUG=0.
- DATABASE_URL: banco configurado para a hospedagem.
- SOURCE_DOWNLOAD_URL: URL do repositório ou do ZIP público.
- ADMIN_EMAIL e ADMIN_PASSWORD: opcionais para seed automatizado.

## Gunicorn

~~~bash
gunicorn --bind 0.0.0.0:8000 --workers 2 --threads 4 wsgi:app
~~~

O Procfile já contém o comando básico.

## Docker

~~~bash
docker build -t portfolio-igor .
docker run --env-file .env -p 8000:8000 portfolio-igor
~~~

Acesse http://localhost:8000.

## Banco e uploads

SQLite é ideal para estudo e execução local. Em hospedagens com disco efêmero, use banco gerenciado e armazenamento persistente para uploads. Antes de migrar para PostgreSQL, instale o driver adequado e adote migrações Alembic.

## Checklist

1. pytest -q.
2. ruff check .
3. FLASK_DEBUG=0.
4. SECRET_KEY alterada.
5. HTTPS ativo.
6. domínio e metadados conferidos.
7. banco e uploads com backup.
8. sitemap.xml e robots.txt acessíveis.

