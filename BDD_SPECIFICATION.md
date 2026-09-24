# Especificação BDD — Swag Labs (saucedemo.com)

Especificação determinística e testável da loja pública
**`https://www.saucedemo.com/`**, usada como alvo único do mini-curso.

Tudo aqui foi **observado no site rodando**, com navegação automatizada, em
2026-09-18. Onde um comportamento não pôde ser determinado pela tela, ele está na
seção [Perguntas em aberto](#10-perguntas-em-aberto) — não foi preenchido por
suposição. Esse é o contrato do documento: **nada de presumido**.

Este arquivo é o pano de fundo dos requisitos `RQ-*.md` da raiz e dos testes que o
[`sdet-automator.prompt.md`](sdet-automator.prompt.md) gera a partir deles.

---

## 1. Linguagem ubíqua

### Atores

- `Visitante` — pessoa sem sessão ativa. Só enxerga a tela de login.
- `Pessoa compradora` — quem tem sessão ativa e pode navegar, montar carrinho e concluir pedido.
- `Loja` — a aplicação: catálogo, carrinho, checkout e conclusão.
- `Conta de demonstração` — identidade que **altera o comportamento da Loja**, não só os dados.
  É o mecanismo de defeito plantado do site.

### Entidades e objetos de valor

- `Produto` — nome, descrição, preço e imagem. O catálogo tem **6 produtos**.
- `Item de carrinho` — produto adicionado, sempre com quantidade `1`.
- `Contador do carrinho` — distintivo numérico no ícone. **Não existe quando o carrinho está vazio** (não é `0`).
- `Dados de entrega` — primeiro nome, sobrenome e CEP, informados no passo 1 do checkout.
- `Resumo do pedido` — itens, forma de pagamento, forma de envio e totais, no passo 2.
- `Totais` — `Item total` (subtotal), `Tax` (imposto) e `Total`.
- `Estado da aplicação` — carrinho e escolhas da sessão; zerável por **Reset App State**.

### Ações

`entrar`, `sair`, `ordenar vitrine`, `abrir detalhe`, `adicionar ao carrinho`,
`remover do carrinho`, `ir ao carrinho`, `iniciar checkout`, `informar dados`,
`revisar pedido`, `concluir pedido`, `cancelar`, `zerar estado`.

---

## 2. Autenticação

### Regras

| # | Regra | Verificado |
| --- | --- | --- |
| AUT-1 | A tela de login publica as contas aceitas e a senha comum (`secret_sauce`) | sim |
| AUT-2 | Login válido leva a `/inventory.html` | sim |
| AUT-3 | Usuário vazio produz `Epic sadface: Username is required` — **mesmo com senha preenchida** | sim |
| AUT-4 | Usuário preenchido e senha vazia produz `Epic sadface: Password is required` | sim |
| AUT-5 | Par inexistente produz `Epic sadface: Username and password do not match any user in this service` | sim |
| AUT-6 | `locked_out_user` produz `Epic sadface: Sorry, this user has been locked out.` | sim |
| AUT-7 | Acesso direto a `/inventory.html` sem sessão exibe `Epic sadface: You can only access '/inventory.html' when you are logged in.` e **redireciona para `/`** | sim, medido |

> **AUT-7 foi corrigida por medição, em 2026-09-21.** A versão anterior desta
> tabela afirmava que a URL **se mantinha** em `/inventory.html`. Ela não se
> mantém. A sequência real, amostrada a cada 400 ms:
>
> ```
>  73ms  /inventory.html          ← requisição, HTTP 404
> 109ms  /?/inventory.html
> 113ms  /inventory.html
> 385ms  /inventory.html
> 388ms  /                        ← estabiliza aqui
> ```
>
> A observação original foi feita dentro da janela de ~390 ms, quando a URL
> ainda era `/inventory.html`. É a **armadilha 1 da §9** aplicada a quem
> escreveu a especificação: esperar pela URL não é esperar pela tela. A
> mensagem permanece visível depois do redirecionamento, e é sobre ela que se
> deve afirmar.

> **AUT-3 é a regra que mais engana.** A validação de usuário vem antes da de senha,
> então "senha obrigatória" só aparece quando o usuário já está preenchido. Um critério
> de aceite que ignore a ordem gera um teste que passa pelo motivo errado.

### Cenários

```gherkin
Cenário: Entrar com conta padrão
  Dado que estou na tela de login
  Quando informo "standard_user" e "secret_sauce"
  E aciono Login
  Então a Loja exibe a vitrine em "/inventory.html"
  E o contador do carrinho não está presente

Esquema do Cenário: Credenciais recusadas
  Dado que estou na tela de login
  Quando informo "<usuario>" e "<senha>"
  E aciono Login
  Então a Loja permanece na tela de login
  E exibe a mensagem "<mensagem>"

  Exemplos:
    | usuario         | senha        | mensagem                                                                  |
    |                 |              | Epic sadface: Username is required                                        |
    |                 | secret_sauce | Epic sadface: Username is required                                        |
    | standard_user   |              | Epic sadface: Password is required                                        |
    | foo             | bar          | Epic sadface: Username and password do not match any user in this service |
    | locked_out_user | secret_sauce | Epic sadface: Sorry, this user has been locked out.                       |

Cenário: Página protegida sem sessão
  Dado que não tenho sessão ativa
  Quando abro "/inventory.html" diretamente
  Então a Loja exibe "Epic sadface: You can only access '/inventory.html' when you are logged in."
```

---

## 3. Vitrine

### Regras

| # | Regra | Verificado |
| --- | --- | --- |
| VIT-1 | A vitrine exibe 6 produtos, cada um com nome, descrição, preço e botão de ação | sim |
| VIT-2 | O cabeçalho secundário exibe `Products` | sim |
| VIT-3 | A ordenação oferece 4 opções: `az`, `za`, `lohi`, `hilo` | sim |
| VIT-4 | A ordenação padrão em carga nova é `az` (`Name (A to Z)`) | sim |
| VIT-5 | `lohi` ordena por preço crescente; `hilo`, decrescente | sim |
| VIT-6 | Clicar no nome abre `/inventory-item.html?id=<n>` com nome, preço e botão `Back to products` | sim |
| VIT-7 | `id` inexistente exibe `ITEM NOT FOUND` em vez de erro de aplicação | sim |

### Catálogo observado com `standard_user`

| Produto | Preço | `data-test` do botão |
| --- | --- | --- |
| Sauce Labs Backpack | $29.99 | `add-to-cart-sauce-labs-backpack` |
| Sauce Labs Bike Light | $9.99 | `add-to-cart-sauce-labs-bike-light` |
| Sauce Labs Bolt T-Shirt | $15.99 | `add-to-cart-sauce-labs-bolt-t-shirt` |
| Sauce Labs Fleece Jacket | $49.99 | `add-to-cart-sauce-labs-fleece-jacket` |
| Sauce Labs Onesie | $7.99 | `add-to-cart-sauce-labs-onesie` |
| Test.allTheThings() T-Shirt (Red) | $15.99 | `add-to-cart-test.allthethings()-t-shirt-(red)` |

> Os preços acima descrevem **esta conta**, não a Loja: com `visual_user` eles mudam a
> cada carga (ver seção 8). Por isso **nenhum teste pode tratar `$29.99` como constante** —
> o preço é lido da vitrine e usado como entrada do cálculo.

### Cenário

```gherkin
Esquema do Cenário: Ordenar a vitrine
  Dado que estou na vitrine com a conta "standard_user"
  Quando escolho a ordenação "<opcao>"
  Então os 6 produtos aparecem na ordem "<criterio>"

  Exemplos:
    | opcao | criterio          |
    | az    | nome crescente    |
    | za    | nome decrescente  |
    | lohi  | preço crescente   |
    | hilo  | preço decrescente |
```

---

## 4. Carrinho

### Regras

| # | Regra | Verificado |
| --- | --- | --- |
| CAR-1 | Adicionar um produto troca o botão de `Add to cart` para `Remove` e o `data-test` de `add-to-cart-<slug>` para `remove-<slug>` | sim |
| CAR-2 | O contador do carrinho exibe a quantidade de itens distintos; com 2 adições exibe `2` | sim |
| CAR-3 | Remover o último item **faz o contador desaparecer**; ele não passa a exibir `0` | sim |
| CAR-4 | O carrinho sobrevive à navegação entre páginas na mesma sessão | sim |
| CAR-5 | Cada item do carrinho tem quantidade `1`; não há controle para alterá-la | sim |
| CAR-6 | O carrinho exibe as colunas `QTY` e `Description` e os botões `Continue Shopping` e `Checkout` | sim |
| CAR-7 | **Reset App State** esvazia o carrinho | sim |
| CAR-8 | O carrinho **sobrevive a logout e novo login** no mesmo navegador: 6 itens antes, 6 itens depois | sim |
| CAR-9 | O carrinho é compartilhado entre abas do mesmo navegador | sim |
| CAR-10 | Cabem os 6 produtos do catálogo; não há como adicionar o mesmo produto duas vezes, logo o contador máximo é `6` | sim |

> **CAR-8 é a regra que estraga suíte.** Sair da conta não limpa o estado. Um cenário que
> comece assumindo carrinho vazio porque "acabei de fazer login" está assumindo errado —
> o estado anterior atravessa a sessão. Zere com **Reset App State** ou use um contexto novo.

> **CAR-3 é a armadilha clássica.** Um critério que diga "o contador exibe 0 quando o
> carrinho está vazio" descreve um produto que não existe, e o teste correspondente falha
> pelo motivo errado — parecendo defeito do site.

```gherkin
Cenário: Contador reflete o conteúdo do carrinho
  Dado que estou na vitrine com o carrinho vazio
  Então o contador do carrinho não está presente
  Quando adiciono "Sauce Labs Backpack"
  Então o contador exibe "1"
  E o botão daquele produto exibe "Remove"
  Quando adiciono "Sauce Labs Bike Light"
  Então o contador exibe "2"
  Quando removo "Sauce Labs Bike Light"
  Então o contador exibe "1"

Cenário: Remover o último item faz o contador desaparecer
  Dado que estou na vitrine com o carrinho vazio
  E que adicionei "Sauce Labs Backpack"
  Quando removo "Sauce Labs Backpack"
  Então o contador do carrinho não está presente
  E o botão daquele produto exibe "Add to cart"

Cenário: O carrinho atravessa logout e novo login
  Dado que entrei com a conta "standard_user"
  E que adicionei "Sauce Labs Backpack" e "Sauce Labs Onesie"
  Quando saio pelo menu lateral
  E entro de novo com a conta "standard_user"
  Então o contador exibe "2"

Cenário: Reset App State esvazia o carrinho
  Dado que estou na vitrine com 2 itens no carrinho
  Quando aciono "Reset App State" no menu lateral
  Então o contador do carrinho não está presente
```

---

## 5. Checkout — passo 1 (dados de entrega)

### Regras

| # | Regra | Verificado |
| --- | --- | --- |
| CK1-1 | O passo 1 pede três campos de texto: `firstName`, `lastName`, `postalCode` | sim |
| CK1-2 | Campo vazio bloqueia o avanço, na ordem primeiro nome → sobrenome → CEP | sim |
| CK1-3 | As mensagens são `Error: First Name is required`, `Error: Last Name is required`, `Error: Postal Code is required` | sim |
| CK1-4 | **Espaço em branco é aceito como preenchimento**: `"  "` nos três campos avança para o passo 2 | sim |
| CK1-5 | Não há máscara nem validação de formato de CEP: `01310-100` e `01310100` são aceitos igualmente | sim |
| CK1-6 | Os campos não declaram tamanho máximo (`maxlength` ausente) | sim |

> **CK1-4 é o achado mais útil da tela.** "Campo obrigatório" e "campo não vazio" não são
> a mesma regra, e o site implementa a segunda. Um requisito que diga só "obrigatório"
> produz um teste que aprova um comportamento que ninguém especificou.

```gherkin
Esquema do Cenário: Validação dos dados de entrega
  Dado que tenho ao menos um item no carrinho
  E que estou no passo 1 do checkout
  Quando informo nome "<nome>", sobrenome "<sobrenome>" e CEP "<cep>"
  E aciono Continue
  Então a Loja exibe "<resultado>"

  Exemplos:
    | nome | sobrenome | cep       | resultado                      |
    |      |           |           | Error: First Name is required  |
    | Ana  |           |           | Error: Last Name is required   |
    | Ana  | Souza     |           | Error: Postal Code is required |
    | Ana  | Souza     | 01310-100 | o passo 2 do checkout          |
    | Ana  | Souza     | 01310100  | o passo 2 do checkout          |

Cenário: Espaço em branco conta como preenchido
  Dado que tenho ao menos um item no carrinho
  E que estou no passo 1 do checkout
  Quando informo nome "  ", sobrenome "  " e CEP "  "
  E aciono Continue
  Então a Loja exibe o passo 2 do checkout
```

> **Por que CK1-4 não está na tabela de exemplos.** O Gherkin apara as células de
> `Exemplos`: uma célula com dois espaços chega ao passo como texto vazio, e o
> cenário testaria CK1-3 em vez de CK1-4. O valor entre aspas, no próprio passo,
> preserva os espaços.

---

## 6. Checkout — passo 2 (revisão e totais)

### Regras

| # | Regra | Verificado |
| --- | --- | --- |
| CK2-1 | O passo 2 lista os itens do carrinho com nome e preço | sim |
| CK2-2 | A forma de pagamento exibida é `SauceCard #31337` | sim |
| CK2-3 | A forma de envio exibida é `Free Pony Express Delivery!` | sim |
| CK2-4 | `Item total` é a soma dos preços dos itens do carrinho | sim |
| CK2-5 | **`Tax` = arredondar(`Item total` × 0,08; 2 casas)** | sim, em 5 carrinhos |
| CK2-6 | `Total` = `Item total` + `Tax` | sim |
| CK2-7 | `Cancel` volta à vitrine sem concluir o pedido | sim |

### O oráculo do imposto

A regra foi confirmada em cinco carrinhos de valores diferentes — é ela, e não os
números, que deve entrar no teste:

| Itens | Item total | Tax exibido | `round(subtotal × 0,08; 2)` |
| --- | --- | --- | --- |
| 1 | $7.99 | $0.64 | 0,6392 → **0,64** |
| 2 | $25.98 | $2.08 | 2,0784 → **2,08** |
| 2 | $37.98 | $3.04 | 3,0384 → **3,04** |
| 3 | $87.97 | $7.04 | 7,0376 → **7,04** |
| 4 | $97.96 | $7.84 | 7,8368 → **7,84** |

> Nenhuma amostra caiu em `x,xx5` — e **nenhuma pode cair**. Com o subtotal em centavos
> inteiros (`k`), o imposto vale `8k/10000`, e o empate exigiria `8k ≡ 50 (mod 100)`: `8k`
> é múltiplo de 4, `50` não é. **O caso de meia unidade é inalcançável**, então o modo de
> arredondamento na metade não precisa ser especificado nem testado. Isso é diferente de
> "não sabemos" — é uma pergunta respondida, e por isso saiu da seção 10.

```gherkin
Cenário: Totais do pedido
  Dado que meu carrinho tem "Sauce Labs Backpack", "Sauce Labs Fleece Jacket" e "Sauce Labs Onesie"
  E que informei dados de entrega válidos
  Quando abro a revisão do pedido
  Então "Item total" é a soma dos preços lidos na vitrine
  E "Tax" é 8% desse subtotal, arredondado a duas casas
  E "Total" é a soma de "Item total" e "Tax"

Cenário: Pagamento e envio fixos na revisão
  Dado que tenho ao menos um item no carrinho
  E que informei dados de entrega válidos
  Quando abro a revisão do pedido
  Então a forma de pagamento é "SauceCard #31337"
  E a forma de envio é "Free Pony Express Delivery!"

Cenário: Cancelar a revisão não conclui o pedido
  Dado que estou na revisão do pedido com "Sauce Labs Backpack" no carrinho
  Quando aciono Cancel
  Então a Loja exibe a vitrine
  E o contador exibe "1"
```

> O último passo de *Cancelar* não vem de CK2-7, que só diz "sem concluir o
> pedido". Ele é a forma observável dessa frase: se o pedido tivesse sido
> concluído, FIM-4 teria esvaziado o carrinho.

---

## 7. Conclusão do pedido

| # | Regra | Verificado |
| --- | --- | --- |
| FIM-1 | `Finish` leva a `/checkout-complete.html` | sim |
| FIM-2 | A tela exibe `Thank you for your order!` | sim |
| FIM-3 | E o texto `Your order has been dispatched, and will arrive just as fast as the pony can get there!` | sim |
| FIM-4 | O carrinho fica vazio: o contador desaparece | sim |
| FIM-5 | O botão de saída tem `data-test` `back-to-products` e rótulo `Back Home` | sim |

> **FIM-5 é um detalhe caro.** O `data-test` diz `back-to-products`, o texto na tela diz
> `Back Home`. Requisito e teste precisam concordar sobre qual dos dois é a regra.

```gherkin
Cenário: Concluir o pedido
  Dado que estou na revisão do pedido com "Sauce Labs Backpack" no carrinho
  Quando aciono Finish
  Então a Loja exibe "/checkout-complete.html"
  E exibe "Thank you for your order!"
  E exibe "Your order has been dispatched, and will arrive just as fast as the pony can get there!"
  E o contador do carrinho não está presente
  E o botão "back-to-products" tem o rótulo "Back Home"
```

---

## 8. Contas de comportamento alterado

O site planta defeitos por conta. **Esta seção é o coração do mini-curso**: cada linha é um
defeito real, reproduzível, que só um teste com oráculo pega.

| Conta | Comportamento observado |
| --- | --- |
| `standard_user` | Comportamento de referência. Tudo acima foi medido com ela. |
| `locked_out_user` | Não entra. Mensagem de conta bloqueada. |
| `problem_user` | **(a)** As 6 imagens de produto são a mesma (1 URL distinta em 6). **(b)** O que se digita no campo **sobrenome vai para o campo nome**: digitar "Ana" e depois "Souza" deixa nome = `Souza` e sobrenome vazio, e o checkout trava em `Error: Last Name is required`. **(c)** A ordenação não tem efeito: `hilo` devolve a ordem original. |
| `error_user` | **(a)** Mesmo defeito do sobrenome. **(b)** `Remove` não remove: o contador continua em `1`. **(c)** `Finish` não conclui — a Loja permanece no passo 2, **sem mensagem de erro**. |
| `visual_user` | **(a)** Os preços **mudam a cada carga da página** (ex.: Backpack `$72.8`, depois `$79.92`). **(b)** Aparecem preços com **uma casa decimal** (`$72.8`), quebrando o formato monetário. **(c)** A ordenação não corresponde ao critério escolhido. |
| `performance_glitch_user` | O login leva **~5 s** (medido: 5,1 s e 5,5 s), contra ~0,4 s das demais. O restante do fluxo é normal e o pedido conclui. |

> **O contraste que vale o slide:** `error_user` falha o checkout em silêncio — não há
> mensagem, não há erro, a tela simplesmente não avança. Um teste que só verifique "não
> apareceu erro" aprova esse comportamento. Um teste com oráculo — *o pedido chegou à tela
> de confirmação?* — reprova.

```gherkin
Esquema do Cenário: Compra de ponta a ponta com cada conta
  Dado que entrei com a conta "<conta>"
  E que adicionei "Sauce Labs Backpack"
  Quando informo nome "Ana", sobrenome "Souza" e CEP "01310-100"
  E aciono Continue
  E aciono Finish
  Então a Loja exibe "Thank you for your order!"

  Exemplos:
    | conta                   |
    | standard_user           |
    | performance_glitch_user |
    | problem_user            |
    | error_user              |
```

> **Este cenário descreve o que a Loja deveria fazer, não o que ela faz.** Pelo
> que foi observado em 2026-09-23, as duas primeiras linhas passam e as duas
> últimas reprovam, cada uma num ponto diferente. `problem_user` trava no passo 1
> com `Error: Last Name is required`. `error_user` perde o sobrenome também, mas
> o passo 1 aceita e avança; a conta trava no `Finish`, que não faz nada e não
> exibe mensagem. Esse é o resultado certo. O cenário não ganha uma coluna
> "resultado esperado" que aceite a falha, porque aí ele passaria a especificar
> o defeito. O levantamento completo por conta está em
> [`RQ-010-contas-de-demonstracao.md`](RQ-010-contas-de-demonstracao.md).

---

## 9. Armadilhas conhecidas para automação

Levantadas durante a exploração; cada uma já custou um teste falso a alguém:

1. **A URL muda antes da tela.** Em uma das execuções, logo após navegação por clique, o
   cabeçalho ainda exibia o título da página anterior mesmo com a URL nova. Foi intermitente
   (visto 1 vez em ~6 execuções). Esperar pela URL **não** é esperar pela tela: afirme sobre
   conteúdo.
2. **O contador do carrinho não existe quando vazio** (CAR-3).
3. **`data-test` com caracteres especiais**: `add-to-cart-test.allthethings()-t-shirt-(red)`
   contém pontos e parênteses. Em seletor CSS eles precisam de escape — por `getByTestId`, não.
4. **O botão do produto alterna rótulo e `data-test`** entre `Add to cart` / `Remove`.
   Esperar pelo botão errado é esperar por algo que não vai aparecer.
5. **`performance_glitch_user` estoura timeout curto** no login, e só nele.
6. **Preços não são constantes** (`visual_user`). Valor esperado se calcula, não se copia.
7. **O estado sobrevive entre cenários**, entre abas e até ao logout (CAR-8, CAR-9). Use
   **Reset App State** ou um contexto novo — todo cenário monta o próprio estado inicial.

---

## 10. Perguntas em aberto

Não determinados pela tela. **Não preencha por dedução** — meça ou pergunte.

- `P1` — Tamanho máximo aceito nos campos de dados de entrega. Não há `maxlength`, mas o
  limite real não foi testado.
- `P2` — Comportamento esperado da opção `Dynamic Catalog` do menu lateral (submenu
  `Lazy Load`, `Spinner`, `Slider`). Foi observada a existência, não a regra.
- `P3` — O preço de `visual_user` varia por carga ou por sessão? Duas cargas bastaram para
  mostrar que varia, não para descrever a regra.
- `P4` — Por quanto tempo o carrinho persiste. Sabe-se que atravessa logout e abas (CAR-8,
  CAR-9); não foi medido se sobrevive a fechar o navegador.
- `P5` — Quantas execuções em que o cabeçalho fica atrasado (armadilha 1)? Uma ocorrência em
  ~6 não basta para chamar de regra nem para descartar.

> Três perguntas saíram desta lista depois de medidas — arredondamento, persistência do
> carrinho e limite de itens. **É assim que a lista deve encolher: por medição, não por
> cansaço.**

---

## 11. Como esta especificação é usada

```
saucedemo.com  →  esta especificação  →  RQ-00X-<slug>.md  →  CT-00X-NN  →  e2e/
   (observar)       (o que a Loja faz)     (o que vamos        (o que vamos
                                            entregar)           provar)
```

- O papel de PO está em [`product-owner.prompt.md`](product-owner.prompt.md).
- O papel de SDET está em [`sdet-automator.prompt.md`](sdet-automator.prompt.md).
- Cada regra aqui tem coluna "Verificado" por um motivo: o que não foi verificado não vira
  critério de aceite, vira pergunta.

**Revalide antes da apresentação.** O site é de terceiros e muda sem aviso — as seções 6 e 8
são as que mais importam conferir na véspera.
