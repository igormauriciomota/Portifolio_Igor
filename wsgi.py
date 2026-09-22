from dotenv import load_dotenv

from app import create_app

# Gunicorn procura esta variável: gunicorn wsgi:app
load_dotenv()
app = create_app()
