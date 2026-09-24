# RQ-010 — Contas de demonstração

- Fonte: https://www.saucedemo.com/ · contas `standard_user` (referência), `problem_user`, `performance_glitch_user`, `error_user`, `visual_user` e `locked_out_user`
- Observado em: 2026-09-23
- Status: rascunho
- Relacionados: RQ-001 a RQ-009

## História

Como responsável pela loja
Quero que toda conta aceita encontre a mesma loja que `standard_user` encontra
Para que nenhuma pessoa compradora tenha preço, carrinho ou pedido diferentes por causa da conta com que entrou

## Critérios de aceite

AC1 — Entrar
1.1 As contas `standard_user`, `problem_user`, `performance_glitch_user`, `error_user` e `visual_user` entram com a senha `secret_sauce` e chegam à vitrine com 6 produtos (RQ-001, RQ-002).
1.2 A conta `locked_out_user` não entra e recebe a mensagem de conta bloqueada (RQ-001, 3.5).

AC2 — O que foi observado igual em todas as contas que entram
2.1 Backpack e Onesie entram no carrinho pela vitrine, e o contador conta cada um.
2.2 Na página do carrinho, "Remove" tira o item e atualiza o contador (conferido com todas, menos `performance_glitch_user`).
2.3 Na revisão do pedido, "Tax" é o "Item total" exibido × 0,08, arredondado a duas casas, e "Total" é "Item total" + "Tax".

AC3 — Comparar com a conta de referência
3.1 O comportamento de `standard_user`, descrito em RQ-001 a RQ-009, é a referência. Toda diferença de outra conta em relação a ele está registrada abaixo como pergunta em aberto, com a conta e a evidência. Nenhuma virou critério de aceite, porque não se sabe se é defeito ou comportamento pretendido.

## Oráculo

| O que | Regra que define o esperado | Conferido em |
| --- | --- | --- |
| Comportamento de cada conta | O mesmo passo executado com `standard_user` na mesma rodada | 5 contas: vitrine, ordenação, adicionar e remover, checkout e conclusão · detalhe e cada botão por produto com `problem_user`, `error_user` e `visual_user` |
| Item total | Soma dos preços listados na própria revisão | `standard_user`: sempre igual · `problem_user`: sempre o dobro (P4) |
| Preço cobrado | Preço exibido na vitrine para o produto adicionado | `visual_user`: diferente em 3 de 3 rodadas (P12) |
| Pedido concluído | A tela de conclusão exibe "Thank you for your order!" **e** o contador some | `error_user` não conclui (P10) · `problem_user` conclui sem esvaziar o carrinho (P5) |

## Elementos observados

| Elemento | data-test | Tipo | Observação |
| --- | --- | --- | --- |
| Imagem do produto | `inventory-item-<slug>-img` | imagem | com `problem_user`, as 6 têm o mesmo endereço |
| Botões da vitrine | `add-to-cart-<slug>` / `remove-<slug>` | botões | com `problem_user` e `error_user`, 3 não adicionam e nenhum remove |
| Sobrenome | `lastName` | caixa de texto | com `problem_user` e `error_user`, o valor digitado não fica no campo |
| Item total | `subtotal-label` | texto | com `problem_user`, o dobro da soma |
| Concluir | `finish` | botão | com `error_user`, não faz nada |

## Casos de teste candidatos

CT-010-01 — As 5 contas que entram chegam à vitrine com 6 produtos, e `locked_out_user` é recusada
CT-010-02 — Compra de ponta a ponta com cada conta: o pedido chega a "Thank you for your order!" e o contador some
CT-010-03 — Com cada conta, o Item total da revisão é a soma dos preços dos itens listados
CT-010-04 — Com cada conta, o preço cobrado é o preço exibido na vitrine
CT-010-05 — Com cada conta, cada um dos 6 produtos entra no carrinho e sai dele pela vitrine
CT-010-06 — Com cada conta, o valor digitado em cada campo do passo 1 é o valor gravado nele
CT-010-07 — Com cada conta, as 4 ordenações produzem a ordem calculada a partir da tela
CT-010-08 — Com cada conta, cada produto abre o próprio detalhe
CT-010-09 — Com cada conta, as 6 imagens da vitrine são distintas

## Perguntas em aberto

`problem_user`:

P1 — As 6 imagens da vitrine são a mesma: há 1 endereço de imagem distinto entre 6.
P2 — As ordenações "Name (Z to A)" e "Price (high to low)" não mudam a ordem: a vitrine continua em "Name (A to Z)".
P3 — Cada produto abre o detalhe do produto seguinte: Backpack abre Fleece Jacket, Bike Light abre Bolt T-Shirt, Onesie abre Test.allTheThings() T-Shirt, e Fleece Jacket abre "ITEM NOT FOUND".
P4 — **O Item total da revisão é o dobro da soma dos itens.** $17.98 viraram $35.96, $37.98 viraram $75.96 e $29.99 viraram $59.98. O imposto é calculado sobre o valor dobrado, então o Total também sai errado.
P5 — Depois de "Finish", a tela de conclusão aparece, mas o carrinho não esvazia: o contador continua exibindo os itens.
P6 — "Add to cart" não funciona para Bolt T-Shirt, Fleece Jacket e Test.allTheThings() T-Shirt: o botão não muda e o contador não aparece. "Remove" na vitrine e no detalhe não tira o produto. No carrinho, tira.
P7 — O que se digita no sobrenome vai para o primeiro nome. Digitando tecla a tecla, o primeiro nome fica só com a última letra digitada (`a` de "Souza") e o sobrenome fica vazio. O passo 1 recusa com "Error: Last Name is required".
P8 — "About" leva a `https://saucelabs.com/error/404`, e não a `https://saucelabs.com/`.

`error_user`:

P9 — O sobrenome digitado não fica no campo, que continua vazio, **mas o passo 1 aceita e avança** para a revisão sem mensagem. O pedido segue sem sobrenome.
P10 — **"Finish" não faz nada.** A tela permanece na revisão, sem mensagem de erro, e o pedido não é concluído.
P11 — Trocar a ordenação abre um alerta do navegador com "Sorting is broken! This error has been reported to Backtrace.", e a ordem não muda. "Add to cart" e "Remove" falham nos mesmos produtos e telas de P6.

`visual_user`:

P12 — **O preço da vitrine muda a cada carga e não é o preço cobrado.** Em 3 rodadas, o Backpack apareceu na vitrine por $33.89, $52.96 e $78.41, e no carrinho por $29.99 nas três. Onesie e Bike Light chegaram à revisão por $7.99 e $9.99, com Item total $17.98, enquanto a vitrine os exibia, na primeira rodada, por $47.54 e $60.16. Um teste que calcule o esperado a partir da vitrine (CT-006-01) reprova com esta conta.
P13 — Aparecem preços com uma casa decimal na vitrine (ex.: `$40.9`, `$2.9`).
P14 — "Price (high to low)" não ordena pelos preços exibidos. "Name (Z to A)" ordena corretamente.

`performance_glitch_user`:

P15 — O login levou 5,1 s, contra menos de 0,1 s das demais contas, medido na mesma rodada. O resto do fluxo foi normal e o pedido concluiu. Qual é o tempo máximo aceitável (RQ-001 P3)?

Todas as contas:

P16 — As contas publicadas na tela de login são de demonstração. Toda divergência acima é defeito a corrigir, ou é o comportamento pretendido da conta? A resposta decide se CT-010-02 a CT-010-09 devem reprovar para essas contas, e é essa reprovação que um teste com oráculo deveria mostrar.

## Histórico

- 2026-09-23 — criado a partir de exploração do site; substitui a tabela da BDD_SPECIFICATION §8, que ficou desatualizada: P3, P4, P5, P6, P8, P9 (o avanço sem sobrenome), P11 (o alerta) e P12 (preço cobrado diferente do exibido) não constavam dela
