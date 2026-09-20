from app import create_app


# Gunicorn procura esta variável: gunicorn wsgi:app
app = create_app()
