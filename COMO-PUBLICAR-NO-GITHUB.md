# Como publicar a versão Flask no GitHub

## 1. Teste antes do envio

No PowerShell, dentro da pasta que contém `run.py`:

```powershell
py -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
py -m pip install --upgrade pip
pip install -r requirements.txt
pip install -r requirements-dev.txt
pytest -q
py run.py
```

Abra http://127.0.0.1:5000 no Google Chrome.

## 2. Crie o repositório

Crie um repositório vazio em https://github.com/new. Não marque a criação de
outro README ou `.gitignore`, porque o projeto já contém esses arquivos.

## 3. Envie pelo terminal

```powershell
git init
git add .
git commit -m "Publica portfólio Flask profissional"
git branch -M main
git remote add origin https://github.com/igormauriciomota/portfolio-flask.git
git push -u origin main
```

Você pode substituir `portfolio-flask` pelo nome escolhido no GitHub.

## 4. Arquivos que não devem ser enviados

- `.venv/` ou `venv/`;
- `.env`;
- `instance/portfolio.db`;
- caches do Python e do Pytest;
- arquivos pessoais enviados pelo painel.

O `.gitignore` já protege esses itens.
