# Especificação — Painel de qualidade do Swag Labs

Especificação do painel que mede a **qualidade da suíte de testes escrita contra
`https://www.saucedemo.com/`** durante o mini-curso. Mesmo formato do painel que já
existe em `painel/painel.html`: arquivo único, sem dependência,
sem rede — trocando os dados de um produto real pelos da nossa própria suíte.

> O painel de referência não está neste repositório: ele carrega métricas de um
> produto real e ficou só na máquina de quem apresenta. O que está aqui é a
> especificação — suficiente para construir o painel novo do zero.

Os números da seção [6](#6-apuração-de-hoje) foram **apurados**, não estimados: saem do
confronto entre [`BDD_SPECIFICATION.md`](BDD_SPECIFICATION.md) (42 regras verificadas) e
[`demo/checkout-totais.spec.ts`](demo/checkout-totais.spec.ts) (5 testes). O mapeamento
está aberto para auditoria na seção 4.1 — se você discordar de uma linha, discuta a
linha, não o índice.

---

## 1. Objetivo e recorte

**O painel responde a uma pergunta:** *do que a especificação diz que este produto faz,
quanto a nossa suíte de fato prova?*

Ele mede **a suíte**, não o produto. O produto é de terceiros, está no ar e não é nosso
para consertar — o que está em julgamento é o teste.

**O que ele não é:**

- Não é relatório de execução. Passou/falhou é insumo, não é a tela.
- Não é cobertura de linha. Não temos o código da loja, e isso **não é um dado faltando:
  é um dado impossível**. O painel diz isso com todas as letras (regra HON-3).
- Não é comparação entre pessoas ou entre ferramentas.

**Por que ele existe no mini-curso:** é o contraponto do slide anterior. A demo mostra
uma suíte bem escrita; o painel mostra que uma suíte bem escrita ainda cobre **14% das
regras conhecidas**. As duas coisas são verdadeiras ao mesmo tempo, e é esse desconforto
que a plateia leva para casa.

---

## 2. Linguagem ubíqua

- `Regra` — uma linha verificada do `BDD_SPECIFICATION.md`, com identificador estável
  (`AUT-3`, `CK2-5`…). São **42** hoje.
- `Área` — um agrupamento de regras por tela ou fluxo. São **6**: Autenticação, Vitrine,
  Carrinho, Checkout passo 1, Checkout passo 2, Conclusão.
- `CT` — caso de teste candidato declarado num `RQ-*.md`. É a ponte entre requisito e código.
- `Teste` — uma função de teste executável na suíte.
- `Regra coberta` — existe pelo menos uma asserção que **reprovaria se aquela regra
  quebrasse**. Nada mais fraco conta.
- `Regra parcial` — o teste passa por ali, mas não afirma a regra. **Conta como zero** no
  numerador e aparece nomeada na tela.
- `Defeito plantado` — comportamento alterado de conta descrito na seção 8 do
  `BDD_SPECIFICATION.md`. São **11**.
- `Mutação` — alteração deliberada que deveria derrubar a suíte. `Morta` = derrubou.
  `Sobrevivente` = a suíte continuou verde, e isso é um buraco.
- `Insumo` — fonte de dado que alimenta uma métrica. Pode estar **presente**, **ausente**
  (existiria, não foi coletado) ou **impossível** (não existe para este alvo).
- `Retrato` — uma apuração datada. O painel mostra um retrato por vez.
- `Índice de prontidão` — média ponderada das métricas disponíveis. Ver seção 5.

---

## 3. Insumos

| Insumo | O que entrega | Como se apura | Estado hoje |
| --- | --- | --- | --- |
| `BDD_SPECIFICATION.md` | As 42 regras e as 6 áreas, os 11 defeitos plantados, as 5 perguntas em aberto | Contagem das linhas de regra por prefixo | **presente** |
| `RQ-*.md` da raiz | Requisitos e seus `CT` | Contagem de arquivos e de `CT-` | **ausente** — nenhum requisito escrito ainda |
| `demo/checkout-totais.spec.ts` | Os testes executáveis | Leitura das asserções, mapeadas para regras | **presente** — 5 testes |
| Execução do Playwright | Tempo, resultado, instabilidade | `npx playwright test --reporter=json` | **presente** |
| Mutações do ato 3 | Poder de detecção | Registro manual: aplicada, morta ou sobrevivente | **presente** — 2 mutações |
| Cobertura de linha do produto | — | — | **impossível** — o código da loja não é nosso |

> **A coluna "Estado" não é decoração.** Ela decide se a métrica vira número, vira barra
> vazia nomeada ou some da conta. É o que separa um painel honesto de um bonito.

---

## 4. Métricas

Cada métrica declara numerador e denominador **na tela**, não só aqui. Denominadores
diferentes nunca se somam.

### 4.1 Cobertura de regras

**Fórmula:** `regras cobertas ÷ 42`.
**Denominador:** as regras verificadas da especificação — **não** a quantidade de testes.
É isso que faz uma suíte nova marcar 14% em vez de 100%.

Mapeamento apurado em 2026-09-18, auditável linha a linha:

| Regra | Como é coberta | Estado |
| --- | --- | --- |
| `AUT-2` | `entrar()` espera `/inventory.html`; se o login não levasse lá, o teste cairia | coberta |
| `CAR-1` | O teste clica em `remove-sauce-labs-backpack`, que só existe se o botão alternar | coberta |
| `CAR-3` | `toHaveCount(0)` antes, `toHaveText('1')` depois, `toHaveCount(0)` ao remover | coberta |
| `CK2-4` | `subtotal-label` comparado à soma dos preços lidos na vitrine | coberta |
| `CK2-5` | `tax-label` comparado a `round(subtotal × 0,08; 2)` | coberta |
| `CK2-6` | `total-label` comparado a subtotal + imposto | coberta |
| `VIT-1` | O teste exige ≥ 1 item na vitrine, não os 6, nem os campos do cartão | **parcial** |
| `CK1-1` | Preenche os três campos no caminho feliz, sem provar obrigatoriedade | **parcial** |
| `CK2-1` | Chega ao resumo, mas não afirma a lista de itens | **parcial** |
| `CAR-4` | Navega entre páginas com carrinho cheio, sem afirmar a persistência | **parcial** |
| demais 32 | — | descoberta |

**Apuração:** 6 cobertas · 4 parciais · 32 descobertas → **14,3%**.

> As parciais valem zero de propósito. "O teste passa por ali" é exatamente a ilusão que
> o painel existe para desfazer — e por isso elas aparecem **nomeadas** na tela, em vez de
> serem escondidas no denominador.

### 4.2 Alcance por área

**Fórmula:** `áreas com ao menos uma regra coberta ÷ 6`.

| Área | Regras | Cobertas | Estado |
| --- | --- | --- | --- |
| Autenticação | 7 | 1 | alcançada |
| Vitrine | 7 | 0 | **fora** (só parcial) |
| Carrinho | 10 | 2 | alcançada |
| Checkout passo 1 | 6 | 0 | **fora** |
| Checkout passo 2 | 7 | 3 | alcançada |
| Conclusão | 5 | 0 | **fora** |

**Apuração:** 3 de 6 → **50,0%**.

> Alcance e cobertura medem coisas diferentes e por isso **não se misturam numa fração
> só**: 50% das áreas encostadas, 14,3% das regras provadas. A distância entre os dois
> números é a própria mensagem — encostar é barato, provar não é.

### 4.3 Detecção de defeitos plantados

**Fórmula:** `defeitos detectados ÷ 11`.
Esta métrica só existe porque o alvo é o Swag Labs: os defeitos estão **plantados,
documentados e reproduzíveis**. É um gabarito — raríssimo em produto real.

| Conta | Defeitos | Detectados hoje |
| --- | --- | --- |
| `problem_user` | 3 | 0 |
| `error_user` | 3 | 0 |
| `visual_user` | 3 | 0 |
| `performance_glitch_user` | 1 | 0 |
| `locked_out_user` | 1 | 0 |

**Apuração:** 0 de 11 → **0,0%**. A suíte só executa com `standard_user`.

> **O cartão que salva a métrica de virar vergonha:** 0 de 11 não diz que a suíte é ruim,
> diz que ela é **estreita**. Ela prova uma regra muito bem e não olha para lugar nenhum
> além dela. Duas frases diferentes, e o painel precisa mostrar a segunda.
>
> Detalhe fino para quem perguntar: os preços sorteados do `visual_user` **não** derrubariam
> a suíte — e está certo, porque o esperado é calculado a partir do preço lido. O que
> passaria batido é o `$72.8` de uma casa decimal. Um defeito de formato exige uma asserção
> de formato; nenhuma regra de cálculo pega isso.

### 4.4 Poder de detecção (mutação)

**Fórmula:** `mutações mortas ÷ mutações aplicadas`.

| Mutação | Efeito observado | Resultado |
| --- | --- | --- |
| Alíquota 0,08 → 0,09 | 4 dos 5 testes ficam vermelhos; o do contador segue verde, e corretamente | morta |
| Produto renomeado para inexistente | Falha com `SETUP: produto "..." não está na vitrine` | morta |

**Apuração:** 2 de 2 → 100% — **e o painel não exibe esse 100% como nota**. Com
denominador menor que 5, a métrica entra como `insuficiente` (regra HON-4). Cem por cento
de duas tentativas não é evidência, é anedota.

### 4.5 Maturidade do requisito

Três contagens simples, sem nota:

- `RQ-*.md` escritos: **0**
- `CT` declarados: **0**
- Perguntas em aberto pendentes na especificação: **5**

> Serve de termômetro do ciclo inteiro: enquanto houver pergunta em aberto, existe regra
> que ninguém pode cobrir — nem com o melhor teste do mundo.

### 4.6 Execução

Tempo total, contagem passou/falhou e instabilidade conhecida. Hoje: **5 testes, ~5 s,
5 passando**. A armadilha 1 da especificação (cabeçalho atrasado, 1 ocorrência em ~6) entra
como **instabilidade conhecida**, com a contagem à vista — não como "flaky" sem número.

---

## 5. Índice de prontidão

**Fórmula:** média ponderada das métricas **disponíveis**, renormalizada pelo peso
disponível — igual à do painel existente.

| Componente | Peso | Valor hoje |
| --- | --- | --- |
| Cobertura de regras | 35 | 14,3 |
| Detecção de defeitos plantados | 30 | 0,0 |
| Alcance por área | 20 | 50,0 |
| Poder de detecção (mutação) | 15 | `insuficiente` (n = 2) |
| Cobertura de linha | — | `impossível` |

```
(14,3 × 35) + (0,0 × 30) + (50,0 × 20)   1.500,5
────────────────────────────────────── = ─────── = 17,7  →  índice 18
            35 + 30 + 20                     85
```

O painel exibe **18** e, ao lado, **"3 de 5 insumos"**. Um índice que não diz de quantos
insumos ele saiu é um número que finge saber mais do que sabe.

---

## 6. Apuração de hoje

Retrato de 2026-09-18, para conferência rápida no palco:

| Métrica | Valor | Fração |
| --- | --- | --- |
| Cobertura de regras | 14,3% | 6 / 42 |
| Alcance por área | 50,0% | 3 / 6 |
| Detecção de defeitos plantados | 0,0% | 0 / 11 |
| Poder de detecção | insuficiente | 2 / 2 mutações |
| Cobertura de linha | impossível | — |
| Índice de prontidão | **18** | 3 de 5 insumos |

---

## 7. Contrato de dados

Um bloco JSON único dentro do HTML, como no painel atual. Editar o valor, salvar,
recarregar — nada mais é regenerado.

```html
<script type="application/json" id="dados">{ … }</script>
```

```jsonc
{
  "geradoEm": "2026-09-18T00:00:00Z",
  "alvo": { "loja": "https://www.saucedemo.com/", "conta": "standard_user" },

  "regras": {
    "total": 42,
    "cobertas": 6,
    "parciais": 4,
    "listaCobertas":  ["AUT-2", "CAR-1", "CAR-3", "CK2-4", "CK2-5", "CK2-6"],
    "listaParciais":  ["VIT-1", "CK1-1", "CK2-1", "CAR-4"],
    "porArea": {
      "autenticacao":  { "total": 7,  "cobertas": 1 },
      "vitrine":       { "total": 7,  "cobertas": 0 },
      "carrinho":      { "total": 10, "cobertas": 2 },
      "checkoutPasso1":{ "total": 6,  "cobertas": 0 },
      "checkoutPasso2":{ "total": 7,  "cobertas": 3 },
      "conclusao":     { "total": 5,  "cobertas": 0 }
    }
  },

  "defeitosPlantados": {
    "total": 11, "detectados": 0,
    "porConta": {
      "problem_user":            { "total": 3, "detectados": 0 },
      "error_user":              { "total": 3, "detectados": 0 },
      "visual_user":             { "total": 3, "detectados": 0 },
      "performance_glitch_user": { "total": 1, "detectados": 0 },
      "locked_out_user":         { "total": 1, "detectados": 0 }
    }
  },

  "mutacao": { "aplicadas": 2, "mortas": 2, "sobreviventes": 0, "minimoParaNota": 5 },

  "requisitos": { "arquivos": 0, "ct": 0, "ctAutomatizados": 0, "perguntasEmAberto": 5 },

  "execucao": {
    "arquivos": 1, "testes": 5, "passou": 5, "falhou": 0,
    "duracaoSegundos": 5.0,
    "instabilidadesConhecidas": [
      { "descricao": "cabeçalho atrasado após navegação por clique", "ocorrencias": 1, "execucoes": 6 }
    ]
  },

  "coberturaLinha": { "valor": null, "estado": "impossivel",
                      "motivo": "o código da loja é de terceiros" },

  "indice": {
    "valor": 18,
    "insumosDisponiveis": 3, "insumosTotais": 5,
    "componentes": [
      { "chave": "coberturaRegras",   "rotulo": "Cobertura de regras",   "peso": 35, "valor": 14.3 },
      { "chave": "deteccaoDefeitos",  "rotulo": "Defeitos plantados",    "peso": 30, "valor": 0.0 },
      { "chave": "alcanceAreas",      "rotulo": "Alcance por área",      "peso": 20, "valor": 50.0 },
      { "chave": "poderDeteccao",     "rotulo": "Poder de detecção",     "peso": 15, "valor": null,
        "estado": "insuficiente", "motivo": "2 mutações; mínimo 5" },
      { "chave": "coberturaLinha",    "rotulo": "Cobertura de linha",    "peso": 0,  "valor": null,
        "estado": "impossivel", "motivo": "código de terceiros" }
    ]
  }
}
```

Regras do contrato:

- `valor: null` **nunca** é renderizado como `0`. Ver HON-1.
- Todo componente com `valor: null` traz `estado` e `motivo` — o painel imprime o motivo.
- Toda fração exibida na tela existe no JSON como numerador e denominador separados. O
  painel não guarda porcentagem calculada fora dele.

---

## 8. Abas

| Tecla | Aba | O que mostra | O que dizer no palco |
| --- | --- | --- | --- |
| `1` | Visão geral | Índice 18, "3 de 5 insumos", os cinco componentes com peso e estado | Comece pelo cartão de cobertura de linha: o painel mostra o que **não** pode medir |
| `2` | Regras | 42 regras por área, cobertas / parciais / descobertas, com os identificadores | As parciais valem zero — e é aqui que se mostra por quê |
| `3` | Defeitos plantados | 11 defeitos por conta, todos em vermelho | A aba mais forte: a suíte é boa **e** cega ao mesmo tempo |
| `4` | Suíte | 5 testes, tempo, mutações, instabilidade conhecida | 100% de mutação com n = 2 aparece como *insuficiente*, não como nota |

`←` `→` andam entre abas, `T` alterna tema — idênticos ao painel atual, para não haver
duas convenções de teclado no mesmo material.

---

## 9. Regras de honestidade

São as regras que o painel **não pode** violar. Se uma delas cair, o painel virou peça de
marketing.

| # | Regra |
| --- | --- |
| HON-1 | Insumo ausente ou impossível nunca vira `0`. Vira cartão nomeado, com o motivo escrito |
| HON-2 | Toda porcentagem exibe a fração ao lado. Nenhum número aparece sem denominador |
| HON-3 | `ausente` e `impossível` são estados distintos e escritos com palavras diferentes na tela |
| HON-4 | Métrica com denominador abaixo do mínimo declarado entra como `insuficiente`, não como nota |
| HON-5 | Denominadores diferentes não se somam nem viram uma fração única |
| HON-6 | Regra parcial conta zero no numerador e aparece nomeada |
| HON-7 | O retrato traz data e alvo. Painel sem data é painel sem validade |
| HON-8 | A cor nunca carrega significado sozinha: verde e vermelho sempre acompanhados do número |

---

## 10. Regras de execução e desenho

| # | Regra | Verificado no painel atual |
| --- | --- | --- |
| EXE-1 | Arquivo único `.html`, sem build, sem `npm install`, sem servidor, sem rede | sim |
| EXE-2 | Abre por duplo clique em `file://`; nenhuma fonte ou script externo | sim |
| EXE-3 | Abre no tema escuro; `T` alterna | sim |
| EXE-4 | `1`–`4` vão direto à aba; `←` `→` andam | sim |
| EXE-5 | Números em pt-BR: vírgula decimal, ponto de milhar | sim |
| DES-1 | Mesma paleta do material: `--accent` azul e `--serie2` laranja, validadas nos dois temas | sim |
| DES-2 | Verde, amarelo e vermelho **só para estado**, nunca como identidade de série | sim |
| DES-3 | Barra de meta com marca do alvo, como no painel atual | sim |

> Reaproveite a folha de estilo do painel de referência. O material inteiro precisa parecer
> um sistema só — dois painéis com linguagens gráficas diferentes na mesma palestra fazem a
> plateia achar que um deles é print de ferramenta de terceiro.

---

## 11. Critérios de aceite

```gherkin
Cenário: Insumo impossível não vira zero
  Dado que a cobertura de linha tem valor nulo e estado "impossivel"
  Quando abro a Visão geral
  Então o cartão de cobertura de linha exibe o motivo "o código da loja é de terceiros"
  E não exibe "0%"
  E o índice de prontidão informa "3 de 5 insumos"

Cenário: Toda porcentagem mostra o denominador
  Quando abro qualquer aba
  Então cada porcentagem exibida tem a fração correspondente ao lado
  E nenhuma fração mistura regras com áreas

Cenário: Métrica com amostra pequena não vira nota
  Dado que foram aplicadas 2 mutações e o mínimo para nota é 5
  Quando abro a aba Suíte
  Então o poder de detecção aparece como "insuficiente"
  E o painel informa "2 mutações; mínimo 5"
  E esse componente não entra no cálculo do índice

Cenário: Regra parcial não conta como coberta
  Dado que "VIT-1" está marcada como parcial
  Quando abro a aba Regras
  Então "VIT-1" aparece na lista de parciais
  E a cobertura de regras exibe "6 / 42"

Cenário: Abrir sem rede
  Dado que a máquina está sem internet
  Quando abro o arquivo por duplo clique
  Então o painel renderiza completo, com todos os números

Cenário: Trocar um número
  Dado que edito "cobertas" de 6 para 9 no bloco JSON
  Quando recarrego a página
  Então a cobertura de regras exibe "21,4%" e a fração "9 / 42"
  E o índice de prontidão é recalculado
```

---

## 12. Como reapurar

Antes da apresentação, com a suíte na mão:

1. **Regras:** `grep -cE '^\| (AUT|VIT|CAR|CK1|CK2|FIM)-[0-9]+ \|' BDD_SPECIFICATION.md`
   devolve o denominador. Se mudou, o mapeamento da seção 4.1 mudou junto.
2. **Cobertas:** releia as asserções e pergunte, uma a uma: *se esta regra quebrasse, este
   teste ficaria vermelho?* Só "sim" conta.
3. **Execução:** `cd demo && npx playwright test --reporter=json` para tempo e resultado.
4. **Defeitos plantados:** rode a suíte trocando a conta; conte quantos dos 11 ela pega.
5. **Mutação:** aplique a alteração, rode, registre morta ou sobrevivente, desfaça.

> O passo 2 é manual de propósito. Automatizar o mapeamento regra → asserção produziria
> exatamente o tipo de número convincente e errado que esta palestra existe para denunciar.

---

## 13. Perguntas em aberto

- `PP1` — A cobertura de regras deve ponderar regra por risco? Hoje `AUT-3` e `CK2-5` pesam
  igual, e elas claramente não valem o mesmo.
- `PP2` — Regra parcial merece um estado próprio na barra, ou basta a lista nomeada?
- `PP3` — Qual o mínimo de mutações para o poder de detecção virar nota? O `5` da seção 4.4
  foi escolhido, não medido.
- `PP4` — O painel deve guardar retratos anteriores para mostrar tendência, como o gráfico de
  área do painel atual? Com um retrato só, a aba de tendência mentiria por falta de dados.
- `PP5` — Instabilidade conhecida entra no índice ou fica só descritiva? Hoje fica de fora.

---

## 14. Plano de corte para o palco

Se o tempo apertar, **fique com as abas 1 e 3**. O índice 18 abre a conversa e os 11
defeitos plantados a fecham:

> "Esta suíte está certa. Cada linha dela está certa. E ela prova 14% do que a gente já
> sabe que este produto faz — porque provar é caro, e escrever teste ficou barato. A IA
> mexeu no segundo número, não no primeiro."

---

- Especificação do produto: [`BDD_SPECIFICATION.md`](BDD_SPECIFICATION.md)
- Papel de PO: [`product-owner.prompt.md`](product-owner.prompt.md)
- Papel de SDET: [`sdet-automator.prompt.md`](sdet-automator.prompt.md)
- Painel de referência: `painel/painel.html` (local, fora do repositório)
