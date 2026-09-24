# RQ-006 — Checkout, passo 2: revisão e totais

- Fonte: https://www.saucedemo.com/checkout-step-two.html · conta `standard_user`
- Observado em: 2026-09-23
- Status: rascunho
- Relacionados: RQ-004, RQ-005, RQ-007, RQ-010

## História

Como pessoa compradora
Quero revisar os itens, a forma de pagamento, o envio e os valores antes de concluir
Para que eu saiba exatamente quanto vou pagar

## Critérios de aceite

AC1 — Carregar a revisão
1.1 "Continue", no passo 1, leva a `/checkout-step-two.html`, com o título "Checkout: Overview".
1.2 O sistema lista os itens do carrinho, na mesma ordem do carrinho, cada um com quantidade `1`, nome, descrição e preço.
1.3 O sistema exibe "Payment Information:" com o valor "SauceCard #31337".
1.4 O sistema exibe "Shipping Information:" com o valor "Free Pony Express Delivery!".
1.5 O sistema exibe o bloco "Price Total" com três linhas, nesta ordem: "Item total: $<valor>", "Tax: $<valor>" e "Total: $<valor>".

AC2 — Calcular os totais
2.1 "Item total" é a soma dos preços dos itens listados.
2.2 "Tax" é o "Item total" multiplicado por 0,08 e arredondado a duas casas decimais.
2.3 "Total" é a soma de "Item total" e "Tax".
2.4 "Tax" e "Total" são exibidos com duas casas decimais.

AC3 — Cancelar
3.1 "Cancel" leva à vitrine em `/inventory.html`, sem concluir o pedido: o carrinho mantém os itens e o contador não muda.

AC4 — Concluir
4.1 "Finish" conclui o pedido e leva à tela de conclusão (RQ-007).

## Oráculo

| O que | Regra que define o esperado | Conferido em |
| --- | --- | --- |
| Item total | Soma dos preços lidos na vitrine, no momento de adicionar (com `standard_user` são iguais aos da revisão) | $7.99 · $9.99 · $29.99 · $37.98 · $39.97 · $79.98 · $129.94 |
| Imposto | arredondar(Item total × 0,08; 2 casas) | $7.99 → $0.64 · $9.99 → $0.80 · $29.99 → $2.40 · $37.98 → $3.04 · $39.97 → $3.20 · $79.98 → $6.40 · $129.94 → $10.40 |
| Total | Item total + Tax | $8.63 · $10.79 · $32.39 · $41.02 · $43.17 · $86.38 · $140.34 |
| Arredondamento na metade | Inalcançável: com preços em centavos inteiros, 8 × centavos nunca termina em 50 (BDD_SPECIFICATION §6) | — |

## Elementos observados

| Elemento | data-test | Tipo | Observação |
| --- | --- | --- | --- |
| Título | `title` | texto | "Checkout: Overview" |
| Item | `inventory-item` | contêiner | com `item-quantity`, `inventory-item-name`, `inventory-item-desc`, `inventory-item-price` |
| Rótulo pagamento | `payment-info-label` | texto | "Payment Information:" |
| Valor pagamento | `payment-info-value` | texto | "SauceCard #31337" |
| Rótulo envio | `shipping-info-label` | texto | "Shipping Information:" |
| Valor envio | `shipping-info-value` | texto | "Free Pony Express Delivery!" |
| Rótulo do bloco | `total-info-label` | texto | "Price Total" |
| Item total | `subtotal-label` | texto | valor dentro do texto: "Item total: $29.99" |
| Imposto | `tax-label` | texto | "Tax: $2.40" |
| Total | `total-label` | texto | "Total: $32.39" |
| Cancelar | `cancel` | botão | vai à vitrine, não ao carrinho |
| Concluir | `finish` | botão | |

## Casos de teste candidatos

CT-006-01 — Item total, Tax e Total batem com a regra, calculados a partir dos preços da vitrine, em carrinhos de valores diferentes (um item barato, um item caro, três itens)
CT-006-02 — Controle: a asserção de imposto reprova um valor diferente do calculado
CT-006-03 — A revisão lista os mesmos itens do carrinho, na mesma ordem
CT-006-04 — Pagamento "SauceCard #31337" e envio "Free Pony Express Delivery!" são exibidos
CT-006-05 — "Cancel" volta à vitrine sem concluir: o contador mantém o número de itens

## Perguntas em aberto

P1 — Com o carrinho vazio, a revisão exibe "Item total: $0", sem casas decimais, ao lado de "Tax: $0.00" e "Total: $0.00". O formato do Item total deveria ter sempre duas casas? E a revisão com carrinho vazio deveria existir (ver RQ-004 P3)?
P2 — A revisão abre direto pela URL, com sessão, sem passar pelo passo 1. O pedido pode então ser concluído sem dados de entrega?
P3 — "Cancel" na revisão vai à vitrine, e "Cancel" no passo 1 vai ao carrinho. A diferença é intencional?

## Histórico

- 2026-09-23 — criado a partir de exploração do site; consolida CK2-1 a CK2-7 da BDD_SPECIFICATION §6; o oráculo do imposto foi conferido de novo em 7 carrinhos
