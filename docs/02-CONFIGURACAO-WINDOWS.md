# Configuração no Windows e VS Code

## Pasta recomendada

~~~text
C:\07-Portfolio\03-Projeto\Portifolio_Igor
~~~

Abra exatamente a pasta que contém run.py. Isso evita os erros “requirements.txt não encontrado” e “No module named app”.

## Comandos

~~~powershell
cd C:\07-Portfolio\03-Projeto\Portifolio_Igor
py -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
py -m pip install --upgrade pip
pip install -r requirements.txt
pip install -r requirements-dev.txt
copy .env.example .env
py seed.py
py run.py
~~~

## Interpretador no VS Code

1. Pressione Ctrl+Shift+P.
2. Execute Python: Select Interpreter.
3. Escolha .venv\Scripts\python.exe.
4. Pressione F5 ou use a tarefa “Executar portfólio Flask”.

## Soluções rápidas

- Flask não encontrado: confirme se (.venv) aparece no terminal e repita pip install -r requirements.txt.
- requirements.txt não encontrado: execute dir; você abriu a pasta errada.
- TemplateNotFound: não mova templates para fora de app/templates.
- Porta ocupada: encerre o processo anterior ou altere a porta no run.py apenas no ambiente local.
- Banco incompatível após mudar models: em desenvolvimento, mova instance/portfolio.db para backup e execute novamente. Em produção, use migrações.

