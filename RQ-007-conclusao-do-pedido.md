# RQ-007 — Conclusão do pedido e recibo em PDF

- Fonte: https://www.saucedemo.com/checkout-complete.html · conta `standard_user`
- Observado em: 2026-09-23
- Status: rascunho
- Relacionados: RQ-004, RQ-005, RQ-006, RQ-010

## História

Como pessoa compradora
Quero a confirmação de que meu pedido foi feito, e um recibo dele
Para que eu tenha certeza da compra e guarde o comprovante

## Critérios de aceite

AC1 — Confirmar o pedido
1.1 "Finish", na revisão, leva a `/checkout-complete.html`, com o título "Checkout: Complete!".
1.2 A tela exibe a imagem de confirmação, com o texto alternativo "Pony Express".
1.3 A tela exibe o título "Thank you for your order!".
1.4 A tela exibe o texto "Your order has been dispatched, and will arrive just as fast as the pony can get there!".
1.5 A tela exibe os botões "Back Home" e "Generate PDF order".

AC2 — Esvaziar o carrinho
2.1 Ao concluir, o carrinho fica vazio e o contador do carrinho deixa de ser exibido.
2.2 De volta à vitrine, todos os produtos exibem "Add to cart".

AC3 — Voltar à loja
3.1 "Back Home" leva à vitrine em `/inventory.html`.

AC4 — Gerar o recibo em PDF
4.1 "Generate PDF order" baixa um arquivo PDF, sem sair da tela de conclusão. O botão continua disponível depois do download.
4.2 O arquivo se chama `swag-labs-order-<AAAA-MM-DD>_<HH-MM-SS>.pdf`.
4.3 O recibo exibe o título "Swag Labs" e o subtítulo "Order Receipt".
4.4 O recibo exibe, em "ORDER DETAILS", a linha "Order Date" com data e hora no formato "September 23, 2026 at 11:42 PM".
4.5 O recibo exibe, em "SHIP TO", o nome e o sobrenome informados no passo 1, separados por espaço, e o CEP na linha seguinte.
4.6 O recibo exibe, em "ITEMS", cada item comprado com nome e preço, e depois "Item total", "Tax" e "Total".
4.7 Os valores do recibo são os mesmos da revisão do pedido (RQ-006).
4.8 O recibo termina com o texto "Thank you for your order! It has been dispatched, and will arrive just as fast as the pony can get there.".

## Oráculo

| O que | Regra que define o esperado | Conferido em |
| --- | --- | --- |
| Carrinho após concluir | Nenhum contador, e o armazenamento do carrinho vazio | pedidos de 1 e de 6 itens |
| Destinatário no recibo | Os valores digitados no passo 1, lidos pelo teste antes de continuar | `Ana` · `Souza` · `01310-100` |
| Valores do recibo | Os três valores lidos na revisão da mesma execução | Backpack + Onesie: $37.98 · $3.04 · $41.02 |
| Data do pedido | O relógio da máquina no momento do clique, no fuso local | 1 recibo: 11:42 PM local |

## Elementos observados

| Elemento | data-test | Tipo | Observação |
| --- | --- | --- | --- |
| Título | `title` | texto | "Checkout: Complete!" |
| Imagem | `pony-express` | imagem | `alt="Pony Express"` |
| Título da confirmação | `complete-header` | título (`h2`) | "Thank you for your order!" |
| Texto | `complete-text` | texto | |
| Voltar | `back-to-products` | botão | rótulo "Back Home", apesar do `data-test` |
| Gerar recibo | `generate-pdf-order` | botão | baixa um PDF |

## Casos de teste candidatos

CT-007-01 — "Finish" leva à conclusão com o título, a imagem, o texto e os dois botões
CT-007-02 — Depois de concluir, o contador desaparece e todos os produtos voltam a "Add to cart"
CT-007-03 — "Back Home" (`back-to-products`) leva à vitrine
CT-007-04 — "Generate PDF order" baixa um PDF com o nome no padrão de 4.2
CT-007-05 — O recibo traz o destinatário do passo 1 e os mesmos itens e valores da revisão

## Perguntas em aberto

P1 — O nome do arquivo e o recibo usam horas diferentes. O recibo marcou "September 23, 2026 at 11:42 PM" (hora local), e o arquivo se chamou `swag-labs-order-2026-09-24_02-42-05.pdf` (a mesma hora em UTC, que já era o dia seguinte). Qual das duas é a data do pedido?
P2 — O pedido é concluído mesmo com o carrinho vazio (RQ-004 P3). Nesse caso, que recibo deveria sair? O recibo de carrinho vazio não foi gerado nesta exploração.
P3 — O texto do recibo (4.8) é diferente do texto da tela (1.4): "It has been dispatched… there." contra "Your order has been dispatched… there!". Qual é o texto oficial?
P4 — O recibo pode ser gerado de novo depois de recarregar a tela, ou numa visita posterior a `/checkout-complete.html`? Com sessão, essa página abre direto pela URL. O conteúdo do recibo nessa situação não foi verificado.
P5 — Voltar pelo navegador depois de concluir mostra a revisão com "Item total: $0" e o botão "Finish" disponível. Deveria ser possível voltar a essa tela?

## Histórico

- 2026-09-23 — criado a partir de exploração do site; consolida FIM-1 a FIM-5 da BDD_SPECIFICATION §7 e acrescenta o recibo em PDF (AC4), que não existia na especificação de 2026-09-18
