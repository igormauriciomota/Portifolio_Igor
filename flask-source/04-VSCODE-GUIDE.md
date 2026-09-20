# Guia do VS Code no Windows

## 1. Abrir corretamente

No VS Code, escolha **Arquivo → Abrir Espaço de Trabalho do Arquivo** e selecione:

```text
portfolio-flask.code-workspace
```

Não abra a pasta `venv` como projeto. O ambiente virtual é apenas o interpretador e suas bibliotecas.

## 2. Criar e ativar o ambiente

No PowerShell integrado:

```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

Se o PowerShell bloquear a ativação somente nesta sessão:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
venv\Scripts\Activate.ps1
```

## 3. Selecionar o interpretador

Pressione `Ctrl+Shift+P`, procure **Python: Select Interpreter** e escolha:

```text
venv\Scripts\python.exe
```

## 4. Instalar bibliotecas

```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

## 5. Configurar ambiente

```powershell
Copy-Item .env.example .env
```

Altere `SECRET_KEY` no `.env`. Para gerar uma chave:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

## 6. Criar administrador

```powershell
python seed.py
```

A senha fica invisível enquanto é digitada. Isso é comportamento do `getpass()`.

## 7. Executar

Método simples:

```powershell
python run.py
```

Método pelo depurador:

1. abra `run.py`;
2. coloque um breakpoint clicando à esquerda do número da linha;
3. pressione `F5`;
4. escolha **Flask Portfolio: run.py**.

## 8. Executar testes

```powershell
pytest -v
```

Também é possível pressionar `Ctrl+Shift+P` e executar a tarefa **Tests: pytest**.

## 9. Formatar e verificar Python

```powershell
ruff check .
ruff format .
```

Execute primeiro `ruff check .` para entender os avisos. Só depois use o formatador.

## 10. Erros comuns

### `ModuleNotFoundError`

O ambiente não está ativo ou as dependências não foram instaladas.

### `TemplateNotFound`

Confirme se o HTML está dentro de `app/templates` e se o nome usado em `render_template()` está correto.

### `BuildError` no `url_for`

Use `blueprint.funcao`, como `url_for("admin.dashboard")`, e não apenas o nome da função.

### Banco não aparece

Ele será criado em `instance/portfolio.db` na primeira execução.

### CSS não atualiza

Use `Ctrl+F5` para ignorar o cache do navegador.
