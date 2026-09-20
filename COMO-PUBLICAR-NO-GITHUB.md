# Como publicar este projeto no GitHub

Este pacote foi preparado para ser a raiz de um único repositório. Não envie o
arquivo ZIP para dentro do repositório: primeiro descompacte e publique os
arquivos e pastas que estão dentro dele.

## Opção 1 — GitHub pelo navegador

1. Entre em [github.com/new](https://github.com/new).
2. Crie um repositório chamado `portfolio-igor-mota`.
3. Desmarque a criação automática de README, `.gitignore` e licença, pois o
   pacote já contém esses arquivos.
4. Descompacte `portfolio-igor-mota-github.zip`.
5. No repositório vazio, escolha **uploading an existing file**.
6. Arraste todo o conteúdo da pasta `portfolio-igor-mota-github`.
7. Escreva a mensagem `Publica portfólio completo` e confirme o commit.

## Opção 2 — Git pelo terminal

Abra o terminal dentro da pasta descompactada:

```powershell
git init
git add .
git commit -m "Publica portfólio completo"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/portfolio-igor-mota.git
git push -u origin main
```

Substitua `SEU-USUARIO` pelo seu nome de usuário no GitHub.

## Conferência antes do envio

- `run.py`, `seed.py`, `requirements.txt` e `README.md` estão na raiz;
- as fotos e o vídeo estão dentro de `public/`;
- a versão Flask completa está em `flask-source/`;
- as páginas e funcionalidades do site publicado estão em `app/`;
- `.env`, bancos locais, senhas, caches e ambientes virtuais não devem entrar;
- `node_modules` e `.venv` são recriados pelas instruções do README.

## Executar a versão Flask pela raiz

```powershell
py -m venv .venv
Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned
.\.venv\Scripts\Activate.ps1
py -m pip install --upgrade pip
py -m pip install -r requirements.txt
Copy-Item .env.example .env
py seed.py
py run.py
```

Abra `http://127.0.0.1:5000`.

## Executar a versão atual do site

```powershell
npm install
npm run dev
```

O endereço local será informado no terminal.
