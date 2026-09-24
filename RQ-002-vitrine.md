# RQ-002 — Vitrine e ordenação

- Fonte: https://www.saucedemo.com/inventory.html · conta `standard_user`
- Observado em: 2026-09-23
- Status: rascunho
- Relacionados: RQ-001, RQ-003, RQ-004, RQ-010

## História

Como pessoa compradora
Quero ver os produtos da loja e ordená-los por nome ou por preço
Para que eu encontre rápido o que quero comprar

## Critérios de aceite

AC1 — Carregar a vitrine
1.1 O sistema exibe o título "Products" no cabeçalho secundário.
1.2 O sistema exibe 6 produtos. Cada produto tem imagem, nome, descrição, preço e um botão de ação.
1.3 O preço é exibido com o símbolo `$` e duas casas decimais (ex.: `$29.99`).
1.4 A imagem de cada produto tem como texto alternativo o nome do produto, e as 6 imagens são distintas.
1.5 O botão de ação de um produto que não está no carrinho tem o rótulo "Add to cart" (a troca para "Remove" está em RQ-004).

AC2 — Ordenar a vitrine
2.1 O seletor de ordenação é uma lista de escolha única com 4 opções, nesta ordem: "Name (A to Z)", "Name (Z to A)", "Price (low to high)" e "Price (high to low)".
2.2 Em carga nova da vitrine, a opção selecionada é "Name (A to Z)".
2.3 "Name (A to Z)" ordena os produtos por nome, em ordem crescente; "Name (Z to A)", em ordem decrescente.
2.4 "Price (low to high)" ordena os produtos por preço crescente; "Price (high to low)", por preço decrescente.
2.5 Entre produtos de mesmo preço, a ordem relativa entre eles é a da ordenação por nome crescente, nas duas direções de preço.
2.6 Ao lado do seletor, o sistema exibe o rótulo da opção selecionada.
2.7 A ordenação escolhida não é mantida: ao sair da vitrine e voltar, ou ao recarregar a página, a vitrine volta a "Name (A to Z)".

AC3 — Abrir o detalhe de um produto
3.1 O nome e a imagem de cada produto são links que abrem o detalhe daquele produto (ver RQ-003).

## Oráculo

| O que | Regra que define o esperado | Conferido em |
| --- | --- | --- |
| Ordem por nome | Os nomes lidos da vitrine, ordenados alfabeticamente no próprio teste | `az` e `za` com os 6 produtos |
| Ordem por preço | Os preços lidos da vitrine, ordenados numericamente no próprio teste | `lohi` e `hilo`, incluindo o empate de `$15.99` entre Bolt T-Shirt e Test.allTheThings() T-Shirt |
| Quantidade de produtos | Contagem dos cartões de produto na vitrine | 6 com `standard_user`, `problem_user`, `performance_glitch_user`, `error_user` e `visual_user` |

## Elementos observados

| Elemento | data-test | Tipo | Observação |
| --- | --- | --- | --- |
| Título | `title` | texto | "Products" |
| Seletor de ordenação | `product-sort-container` | lista de seleção | valores `az`, `za`, `lohi`, `hilo` |
| Opção ativa | `active-option` | texto | espelha o rótulo selecionado |
| Lista de produtos | `inventory-list` | contêiner | |
| Cartão de produto | `inventory-item` | contêiner | um por produto |
| Nome | `inventory-item-name` | texto | dentro do link `item-<id>-title-link` |
| Descrição | `inventory-item-desc` | texto | |
| Preço | `inventory-item-price` | texto | |
| Link da imagem | `item-<id>-img-link` | link | `<id>` de 0 a 5 |
| Imagem | `inventory-item-<slug>-img` | imagem | `alt` = nome do produto |
| Botão de ação | `add-to-cart-<slug>` / `remove-<slug>` | botão | o `<slug>` de Test.allTheThings() contém pontos e parênteses |

## Casos de teste candidatos

CT-002-01 — A vitrine exibe o título "Products" e 6 produtos, cada um com imagem, nome, descrição, preço e botão
CT-002-02 — A ordenação padrão em carga nova é "Name (A to Z)"
CT-002-03 — Cada uma das 4 ordenações produz a ordem calculada a partir dos nomes ou preços lidos na tela
CT-002-04 — Produtos de mesmo preço mantêm a ordem por nome nas duas direções de preço
CT-002-05 — A ordenação volta a "Name (A to Z)" depois de recarregar a página
CT-002-06 — As 6 imagens são distintas e têm como texto alternativo o nome do produto

## Perguntas em aberto

P1 — A ordenação deveria ser mantida durante a sessão? Hoje ela se perde ao navegar (2.7). Sem essa resposta, 2.7 descreve o que existe, não o que se quer.
P2 — O critério de desempate entre preços iguais (2.5) é intencional ou efeito da ordem padrão? Foi visto em um único par de produtos.

## Histórico

- 2026-09-23 — criado a partir de exploração do site; consolida VIT-1 a VIT-5 da BDD_SPECIFICATION §3 e acrescenta 1.3, 1.4, 2.5, 2.6 e 2.7
