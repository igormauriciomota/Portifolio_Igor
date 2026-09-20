import os

from app import create_app

# A fábrica cria e configura a aplicação. Separar a criação do Flask permite
# reutilizar a mesma estrutura nos testes e em servidores de produção.
app = create_app()


if __name__ == "__main__":
    # Este bloco só executa com `python run.py`. O arquivo .env controla o
    # recarregamento local; wsgi.py nunca liga o debug do Gunicorn.
    debug_enabled = os.getenv("FLASK_DEBUG", "0") == "1"
    app.run(debug=debug_enabled)
