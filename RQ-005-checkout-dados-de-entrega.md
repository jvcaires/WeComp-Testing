# RQ-005 — Checkout, passo 1: dados de entrega

- Fonte: https://www.saucedemo.com/checkout-step-one.html · conta `standard_user`
- Observado em: 2026-09-23
- Status: rascunho
- Relacionados: RQ-004, RQ-006, RQ-010

## História

Como pessoa compradora
Quero informar para quem e para onde vai o pedido
Para que a loja saiba onde entregar

## Critérios de aceite

AC1 — Carregar o passo 1
1.1 "Checkout", no carrinho, leva a `/checkout-step-one.html`, com o título "Checkout: Your Information".
1.2 O sistema exibe três campos, os botões "Cancel" e "Continue", e o contador do carrinho com o número de itens.
1.3 O campo de primeiro nome é uma caixa de texto de uma linha, obrigatória, preenchida por digitação, sem valor padrão, com o texto de apoio "First Name".
1.4 O campo de sobrenome é uma caixa de texto de uma linha, obrigatória, preenchida por digitação, sem valor padrão, com o texto de apoio "Last Name".
1.5 O campo de CEP é uma caixa de texto de uma linha, obrigatória, preenchida por digitação, sem valor padrão, com o texto de apoio "Zip/Postal Code".
1.6 Nenhum dos três campos tem máscara, validação de formato ou tamanho máximo declarado. Foram aceitos 300 caracteres em cada um, letras no CEP (`abc`) e CEP com ou sem hífen (`01310-100`, `01310100`).
1.7 Os campos abrem vazios a cada entrada no passo 1. Dados informados antes não são lembrados.

AC2 — Validar e continuar
2.1 Ao acionar "Continue", o sistema valida os campos na ordem primeiro nome → sobrenome → CEP e exibe apenas a mensagem do primeiro campo vazio.
2.2 As mensagens são "Error: First Name is required", "Error: Last Name is required" e "Error: Postal Code is required".
2.3 Um campo preenchido só com espaços conta como preenchido: `"  "` nos três campos avança para o passo 2.
2.4 Na recusa com os três campos vazios, os três são destacados como erro. Em toda recusa, os valores já digitados são mantidos e a mensagem pode ser fechada pelo botão de fechar.
2.5 Com os três campos preenchidos, o usuário vai para a revisão do pedido em `/checkout-step-two.html` (RQ-006).

AC3 — Cancelar
3.1 "Cancel" leva de volta ao carrinho em `/cart.html`, sem alterar o conteúdo dele.

## Oráculo

| O que | Regra que define o esperado | Conferido em |
| --- | --- | --- |
| Mensagem de recusa | A do primeiro campo vazio, na ordem de 2.1 | vazio/vazio/vazio · vazio/vazio/CEP · vazio/sobrenome/vazio · nome/vazio/CEP · nome/sobrenome/vazio |
| "Preenchido" | Qualquer valor com ao menos um caractere, inclusive espaço | `"  "` · `1`/`2`/`3` · `abc` no CEP · 300 caracteres |
| Valor gravado no campo | O próprio texto digitado, lido do campo depois da digitação | `Ana` · `Souza` · `01310-100` |

## Elementos observados

| Elemento | data-test | Tipo | Observação |
| --- | --- | --- | --- |
| Título | `title` | texto | "Checkout: Your Information" |
| Primeiro nome | `firstName` | caixa de texto | `placeholder="First Name"`, sem `maxlength` |
| Sobrenome | `lastName` | caixa de texto | `placeholder="Last Name"`, sem `maxlength` |
| CEP | `postalCode` | caixa de texto | `placeholder="Zip/Postal Code"`, sem `maxlength` |
| Mensagem de erro | `error` | texto | |
| Fechar mensagem | `error-button` | botão | |
| Cancelar | `cancel` | botão | volta ao carrinho |
| Continuar | `continue` | botão de envio | rótulo "Continue" |

## Casos de teste candidatos

CT-005-01 — Cada campo vazio é recusado com a própria mensagem, na ordem primeiro nome → sobrenome → CEP
CT-005-02 — Os três campos preenchidos levam à revisão do pedido
CT-005-03 — Espaço em branco nos três campos é aceito como preenchimento
CT-005-04 — CEP sem hífen, com letras ou com 300 caracteres é aceito
CT-005-05 — Na recusa, os valores digitados são mantidos e a mensagem pode ser fechada
CT-005-06 — "Cancel" volta ao carrinho com os itens intactos
CT-005-07 — O valor digitado em cada campo é o valor gravado nele (base para detectar os defeitos de RQ-010)

## Perguntas em aberto

P1 — "Obrigatório" deve significar "não vazio" ou "com conteúdo além de espaços"? Hoje é o primeiro (2.3), e um requisito que diga só "obrigatório" não decide entre os dois.
P2 — Qual o tamanho máximo e o formato aceito de cada campo? 300 caracteres e CEP com letras foram aceitos. O limite real não foi encontrado.
P3 — O passo 2 abre direto pela URL, com sessão, sem passar pelo passo 1 (ver RQ-006 P2). O passo 1 deveria ser obrigatório?

## Histórico

- 2026-09-23 — criado a partir de exploração do site; consolida CK1-1 a CK1-6 da BDD_SPECIFICATION §5 e acrescenta 1.6 (letras e 300 caracteres), 1.7, 2.4 e AC3
