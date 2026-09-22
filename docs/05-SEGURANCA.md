# Segurança e privacidade

## Implementado

- senha armazenada por hash do Werkzeug;
- sessão com cookies HttpOnly e SameSite=Lax;
- formulários protegidos por CSRF;
- rotas administrativas protegidas por Flask-Login;
- exclusões somente por POST;
- redirecionamento de login limitado a caminhos internos;
- uploads com extensões permitidas, nomes aleatórios e limite de tamanho;
- Content Security Policy;
- X-Content-Type-Options, X-Frame-Options e Referrer-Policy;
- HSTS quando a requisição já usa HTTPS;
- escaping automático do Jinja;
- laboratório de planilhas processado localmente no navegador.

## Antes da produção

- use SECRET_KEY exclusiva;
- nunca versione .env, instance ou uploads privados;
- valide tamanho, conteúdo real e antivírus para uploads em ambientes públicos;
- restrinja o painel por MFA ou provedor de identidade se houver vários usuários;
- aplique rate limit no login;
- mantenha dependências atualizadas;
- registre erros sem gravar dados pessoais;
- publique política de privacidade se coletar analytics ou formulários.

O portfólio atual não envia a planilha do Data Lab ao servidor. Essa informação é apresentada claramente junto ao seletor de arquivo.

