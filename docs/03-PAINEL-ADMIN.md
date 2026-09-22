# Painel administrativo

## Primeiro acesso

Execute:

~~~powershell
py seed.py
~~~

Informe um e-mail válido e uma senha forte. Entre em /auth/login.

## Perfil

O formulário atualiza apresentação, localização, biografia, e-mail, LinkedIn, GitHub e WhatsApp. Também aceita foto JPG, PNG ou WebP e currículo PDF.

## Projetos

Cada projeto recebe automaticamente um slug e uma página pública. Preencha:

- título e categoria;
- descrição curta;
- problema e solução;
- destaques e integrações, um item por linha;
- tecnologias separadas por vírgula;
- status, cor, ordem e destaque;
- GitHub, site e vídeo externo;
- capa e vídeo MP4/WebM local.

O Gerente 360 inicial já inclui repositório, tela e vídeo demonstrativo.

## Artigos

Artigos podem permanecer como rascunho. Ao marcar “Publicar agora”, a rota pública passa a aceitar o slug do texto.

## Boas práticas

- não reutilize a senha do e-mail;
- não publique o arquivo .env;
- revise a descrição em celular antes de salvar textos muito longos;
- envie imagens otimizadas em WebP;
- mantenha vídeos curtos e comprimidos;
- faça backup do banco e da pasta uploads antes de migrar o servidor.

