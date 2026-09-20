# Fluxos completos do sistema

## 1. Abrir o portfólio

```text
Navegador solicita GET /
        ↓
main.routes.index()
        ↓
SQLAlchemy consulta Profile, Project e Article
        ↓
github.py consulta atividade pública
        ↓
render_template("main/index.html", ...)
        ↓
Jinja cria o HTML com os dados reais
        ↓
Flask devolve a resposta ao navegador
```

O template não consulta o banco. A rota prepara os dados; o template apenas apresenta.

## 2. Fazer login

```text
GET /auth/login → mostra o formulário
POST /auth/login → valida campos e CSRF
                  → procura o User pelo e-mail
                  → compara senha e hash
                  → login_user(user)
                  → redireciona para /admin/
```

A senha original nunca volta do banco porque somente o hash foi armazenado.

## 3. Cadastrar projeto

```text
Administrador abre /admin/projetos/novo
        ↓
ProjectForm é renderizado
        ↓
POST envia título, stack, links e capa
        ↓
Flask-WTF valida os campos
        ↓
storage.py valida e grava a capa
        ↓
unique_slug() cria URL única
        ↓
db.session.add(project)
db.session.commit()
        ↓
redirect para o dashboard
```

Quando a home for aberta novamente, o novo registro aparecerá automaticamente se `featured=True`.

## 4. Editar e excluir

Na edição, `ProjectForm(obj=project)` preenche os campos com o objeto existente. `populate_obj()` transfere os novos valores para o model e `commit()` confirma a alteração.

A exclusão recebe o `project_id` pela URL, procura o registro com `get_or_404()`, chama `delete()` e confirma com `commit()`.

## 5. Upload

O formulário precisa de `enctype="multipart/form-data"`. Sem isso, o navegador não envia os bytes do arquivo.

`save_upload()`:

1. verifica se um arquivo foi selecionado;
2. higieniza o nome original;
3. confere a extensão;
4. gera um UUID;
5. cria a pasta;
6. salva o arquivo;
7. devolve o caminho relativo para o banco.

## 6. Exibição Jinja

Exemplo conceitual:

```jinja2
{% for project in projects %}
  <h3>{{ project.title }}</h3>
{% else %}
  <p>Nenhum projeto publicado.</p>
{% endfor %}
```

Um registro novo gera um novo card sem alterar o HTML.

## 7. Proteções aplicadas

- senha com hash;
- sessão com Flask-Login;
- rotas administrativas protegidas;
- CSRF em formulários;
- exclusão por POST;
- limites de upload;
- extensões permitidas;
- nomes de arquivos seguros e únicos;
- validação de URLs e e-mail;
- segredos fora do Git.
