# RQ-004 — Carrinho

- Fonte: https://www.saucedemo.com/cart.html · conta `standard_user`
- Observado em: 2026-09-23
- Status: rascunho
- Relacionados: RQ-002, RQ-003, RQ-005, RQ-008, RQ-010

## História

Como pessoa compradora
Quero juntar num carrinho os produtos que escolhi
Para que eu revise a seleção e siga para o pagamento

## Critérios de aceite

AC1 — Adicionar um produto
1.1 Ao acionar "Add to cart" na vitrine, o produto entra no carrinho, o rótulo do botão passa a "Remove" e o `data-test` do botão passa de `add-to-cart-<slug>` para `remove-<slug>`.
1.2 Cada produto entra no carrinho uma única vez, com quantidade `1`. Enquanto está no carrinho, não há botão para adicioná-lo de novo.
1.3 Cabem no carrinho os 6 produtos do catálogo. Com os 6, nenhum botão "Add to cart" resta na vitrine.

AC2 — Exibir o contador do carrinho
2.1 O contador sobre o ícone do carrinho exibe a quantidade de produtos distintos no carrinho, de `1` a `6`.
2.2 Com o carrinho vazio, o contador não é exibido. Ele não exibe `0`.

AC3 — Remover um produto
3.1 Ao acionar "Remove" na vitrine ou no carrinho, o produto sai do carrinho e o contador diminui em 1.
3.2 Ao remover o último produto, o contador deixa de ser exibido.
3.3 Um produto removido volta a exibir "Add to cart" na vitrine.

AC4 — Abrir o carrinho
4.1 O ícone do carrinho, em qualquer página com sessão, leva a `/cart.html`.
4.2 A página exibe o título "Your Cart", os rótulos de coluna "QTY" e "Description", e os botões "Continue Shopping" e "Checkout".
4.3 Cada item exibe a quantidade `1`, sem controle para alterá-la, o nome como link para o detalhe (RQ-003), a descrição, o preço e o botão "Remove".
4.4 Os itens aparecem na ordem em que foram adicionados.
4.5 "Continue Shopping" leva à vitrine; "Checkout" leva ao passo 1 do checkout (RQ-005).

AC5 — Manter o carrinho
5.1 O carrinho se mantém ao navegar entre as páginas da loja na mesma sessão.
5.2 O carrinho é compartilhado entre abas do mesmo navegador. Uma aba já aberta mostra o conteúdo novo depois de ser recarregada.
5.3 O carrinho se mantém depois de sair (Logout) e entrar de novo com a mesma conta, no mesmo navegador.

## Oráculo

| O que | Regra que define o esperado | Conferido em |
| --- | --- | --- |
| Valor do contador | Quantidade de produtos adicionados menos removidos, contada pelo teste; nenhum contador quando zero | 0 → 1 → 2 → 1 · 0 → 3 → 2 · 6 produtos |
| Conteúdo do carrinho | Os nomes e preços lidos na vitrine no momento de adicionar | Backpack, Onesie e Bike Light, nessa ordem de adição |
| Persistência | O mesmo conteúdo antes e depois de navegar, trocar de aba ou sair e entrar | 2 itens após logout e novo login · 2 → 3 itens entre abas |

## Elementos observados

| Elemento | data-test | Tipo | Observação |
| --- | --- | --- | --- |
| Ícone do carrinho | `shopping-cart-link` | link | no cabeçalho de toda página com sessão |
| Contador | `shopping-cart-badge` | texto | **não existe** com o carrinho vazio |
| Título | `title` | texto | "Your Cart" |
| Lista | `cart-list` | contêiner | |
| Rótulo QTY | `cart-quantity-label` | texto | |
| Rótulo Description | `cart-desc-label` | texto | |
| Quantidade | `item-quantity` | texto | não editável |
| Remover no carrinho | `remove-<slug>` | botão | |
| Continuar comprando | `continue-shopping` | botão | |
| Checkout | `checkout` | botão | habilitado mesmo com o carrinho vazio |

## Casos de teste candidatos

CT-004-01 — Adicionar troca o rótulo e o `data-test` do botão de "Add to cart" para "Remove"
CT-004-02 — O contador começa ausente, conta os produtos adicionados e desaparece ao remover o último
CT-004-03 — Remover pelo carrinho tira o item da lista, atualiza o contador e devolve "Add to cart" na vitrine
CT-004-04 — O carrinho exibe título, rótulos, itens na ordem de adição com quantidade 1, e os dois botões
CT-004-05 — Os 6 produtos cabem no carrinho e o contador chega a `6`
CT-004-06 — O carrinho sobrevive a Logout e novo login com a mesma conta
CT-004-07 — O carrinho aparece numa segunda aba do mesmo navegador

## Perguntas em aberto

P1 — **O carrinho passa de uma conta para outra.** Com `standard_user`: adicionar 2 produtos, sair pelo menu, entrar com `problem_user`. O contador de `problem_user` exibe `2`. Se duas pessoas usam o mesmo navegador, uma vê o carrinho da outra. É pretendido?
P2 — Adicionar o produto inexistente (RQ-003 P2) põe o contador em `1`, mas a página do carrinho não lista nenhum item. O contador e a lista deveriam sempre concordar?
P3 — "Checkout" funciona com o carrinho vazio e o pedido pode ser concluído sem itens (ver RQ-006 P1 e RQ-007 P2). Deveria ser bloqueado?
P4 — Por quanto tempo o carrinho persiste? Ele sobrevive a logout, a novo login e a abas; fechar o navegador não foi testado.

## Histórico

- 2026-09-23 — criado a partir de exploração do site; consolida CAR-1 a CAR-6 e CAR-8 a CAR-10 da BDD_SPECIFICATION §4 (CAR-7, Reset App State, está em RQ-008) e acrescenta 3.1 no carrinho, 4.4 e P1
