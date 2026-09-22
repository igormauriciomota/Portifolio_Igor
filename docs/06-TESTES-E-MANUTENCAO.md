# Testes e manutenção

## Executar

~~~powershell
pytest -q
ruff check .
~~~

## Cobertura funcional atual

- home e proposta de valor;
- imagens, vídeo, Django e biblioteca de planilhas;
- páginas Python, Django, SQL, Power BI e Análise de Dados;
- laboratório de dados;
- catálogo e estudo de caso Gerente 360;
- artigos;
- sitemap, manifest e robots;
- página 404;
- redirecionamento de visitante anônimo no painel;
- headers de segurança.

## Ao acrescentar uma rota

1. crie a função no Blueprint responsável;
2. crie ou reutilize um template;
3. adicione um teste de status e de conteúdo;
4. inclua a rota no sitemap se for pública;
5. valide navegação por teclado e layout mobile;
6. execute testes antes do commit.

## Conteúdo inicial

Alterar content.py afeta bancos novos. Bancos existentes preservam o conteúdo já criado. Para alterar dados existentes, use o painel ou crie uma migração explícita.

