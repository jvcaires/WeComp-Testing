# RQ-003 — Detalhe do produto

- Fonte: https://www.saucedemo.com/inventory-item.html · conta `standard_user`
- Observado em: 2026-09-23
- Status: rascunho
- Relacionados: RQ-002, RQ-004, RQ-010

## História

Como pessoa compradora
Quero abrir a página de um produto
Para que eu veja os detalhes dele antes de decidir comprar

## Critérios de aceite

AC1 — Abrir o detalhe
1.1 Na vitrine, o nome e a imagem de um produto abrem `/inventory-item.html?id=<id>`, em que `<id>` identifica aquele produto.
1.2 No carrinho e na revisão do pedido, o nome de um item também abre o detalhe daquele produto.
1.3 A página exibe a imagem, o nome, a descrição e o preço do produto, iguais aos exibidos na vitrine.
1.4 A página exibe o botão "Back to products", que leva de volta à vitrine em `/inventory.html`.

AC2 — Adicionar e remover pelo detalhe
2.1 Um produto que não está no carrinho exibe o botão "Add to cart".
2.2 Ao adicionar pelo detalhe, o botão passa a "Remove" e o contador do carrinho passa a contar o produto.
2.3 O estado do botão é o mesmo nas duas telas: um produto adicionado pelo detalhe aparece com "Remove" na vitrine, e um produto adicionado pela vitrine abre o detalhe já com "Remove".

AC3 — Produto inexistente
3.1 Um `<id>` que não corresponde a um produto (ex.: `6`, `-1`, `99`, `abc` ou vazio) exibe o nome "ITEM NOT FOUND", uma imagem de item não encontrado com o texto alternativo "ITEM NOT FOUND" e uma descrição que começa com "We're sorry, but your call could not be".
3.2 A página de produto inexistente não exibe erro de aplicação e mantém o botão "Back to products".

## Oráculo

| O que | Regra que define o esperado | Conferido em |
| --- | --- | --- |
| Produto exibido no detalhe | O nome e o preço lidos no cartão da vitrine que foi clicado | 6 produtos, por nome e por imagem |
| Correspondência `id` → produto | `item-<id>-title-link` na vitrine abre `?id=<id>` | ids 0 a 5 |
| Produto inexistente | Qualquer `id` fora de 0 a 5 | `6`, `-1`, `99`, `abc`, vazio |

## Elementos observados

| Elemento | data-test | Tipo | Observação |
| --- | --- | --- | --- |
| Voltar | `back-to-products` | botão | rótulo "Back to products" |
| Nome | `inventory-item-name` | texto | |
| Descrição | `inventory-item-desc` | texto | |
| Preço | `inventory-item-price` | texto | |
| Imagem | `item-<slug>-img` | imagem | na vitrine o prefixo é `inventory-item-` |
| Adicionar | `add-to-cart` | botão | **sem** o slug do produto, ao contrário da vitrine |
| Remover | `remove` | botão | **sem** o slug do produto |

## Casos de teste candidatos

CT-003-01 — Clicar no nome de cada produto abre o detalhe com o mesmo nome e preço da vitrine
CT-003-02 — Clicar na imagem abre o mesmo detalhe que clicar no nome
CT-003-03 — "Back to products" volta à vitrine
CT-003-04 — Adicionar pelo detalhe atualiza o contador e aparece como "Remove" na vitrine
CT-003-05 — `id` inexistente exibe "ITEM NOT FOUND" sem erro de aplicação

## Perguntas em aberto

P1 — Logo depois do clique, com o endereço já novo, a página exibiu por um instante o nome "Sauce Labs Backpack" antes do produto certo. Isso aconteceu em 4 de 4 tentativas (Bike Light, Fleece Jacket, Onesie e Bolt T-Shirt), e em menos de 1 s aparecia o produto correto. É pretendido? Para automação, é a armadilha 1 da BDD_SPECIFICATION §9: afirmar sobre o nome só depois de o conteúdo estabilizar.
P2 — A página "ITEM NOT FOUND" exibe o preço `$√-1` e um botão "Add to cart" que funciona: o contador passa a `1`, mas o carrinho aparece vazio (ver RQ-004 P2). Adicionar um produto inexistente deveria ser possível?
P3 — O botão de ação no detalhe usa `data-test` sem o slug (`add-to-cart`), e na vitrine com o slug (`add-to-cart-<slug>`). É intencional? Um teste que reutilize o seletor da vitrine não encontra o botão no detalhe.

## Histórico

- 2026-09-23 — criado a partir de exploração do site; consolida VIT-6 e VIT-7 da BDD_SPECIFICATION §3
