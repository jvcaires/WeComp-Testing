# WeComp — IA & Testes

Material do mini-curso sobre uso de assistentes de IA em QA e automação de
testes. O percurso é um só: **especificar um produto real observando-o rodar,
transformar a especificação em testes, e medir o que os testes de fato cobrem.**

O alvo é sempre a mesma loja pública: **[`saucedemo.com`](https://www.saucedemo.com/)**
(Swag Labs, da Sauce Labs). Ela é de demonstração, não pertence a ninguém da
plateia, não tem dado real e não sai do ar no meio da aula.

## Por onde começar

| Arquivo | O que é |
| --- | --- |
| [`BDD_SPECIFICATION.md`](BDD_SPECIFICATION.md) | A especificação da loja em 11 seções — 42 regras observadas no site rodando, não presumidas |
| [`demo/`](demo/) | A demonstração ao vivo: os prompts, o teste pronto e o mínimo para rodar |
| [`product-owner.prompt.md`](product-owner.prompt.md) | Papel de PO — como extrair requisitos de um produto que já existe |
| [`sdet-automator.prompt.md`](sdet-automator.prompt.md) | Papel de SDET — como automatizar depois de ter executado à mão |
| [`PAINEL_SPECIFICATION.md`](PAINEL_SPECIFICATION.md) | A especificação do painel que mede a qualidade da suíte que escrevermos |
| `WeComp - Testado Por Quem.pptx` | Os slides da apresentação |

Se for ler um só: `BDD_SPECIFICATION.md`. Tudo o mais deriva dele.

## A tese, em três linhas

1. O gargalo de QA nunca foi digitar — é entender o pedido, alcançar o estado de
   teste e separar defeito de ruído de ambiente.
2. A IA ataca exatamente essas etapas, e torna barato um nível de rigor que antes
   era caro demais para praticar.
3. O preço é um risco novo: teste que **parece** cobrir e não cobre, produzido em
   escala e com uma explicação convincente anexada.

## O percurso

```
produto rodando
      │
      ├─ product-owner.prompt.md ──► BDD_SPECIFICATION.md      (o que o produto faz)
      │                                      │
      ├─ sdet-automator.prompt.md ──► demo/checkout-totais.spec.ts   (o que verificamos)
      │                                      │
      └─ PAINEL_SPECIFICATION.md ──► painel da suíte           (quanto disso é coberto)
```

Cada etapa produz um artefato que a próxima consome. Nenhuma delas aceita um
número que não tenha origem declarada.

## Rodar a demo

```bash
cd demo
npm install
npx playwright install chromium
npm test          # deve sair "5 passed" em ~5 segundos
```

Detalhes, prompts e o que dizer em cada momento: [`demo/README.md`](demo/README.md).

## Como se contribui aqui

A `main` é protegida: **push direto é rejeitado, mesmo para o dono do
repositório.** Toda alteração entra por pull request.

```bash
git switch -c minha-alteracao
# ... edita, commita ...
git push -u origin minha-alteracao
gh pr create --fill          # ou abra pelo site
```

Ao abrir o PR, o workflow [`testes`](.github/workflows/testes.yml) roda a suíte
do `demo/` contra a loja e publica o resultado no próprio PR. Ele **não** é um
check obrigatório: a suíte depende de alcançar o `saucedemo.com` pela rede, e
uma instabilidade da loja não deve impedir um merge.

Nenhuma aprovação é exigida — o repositório tem um autor só, e o GitHub não
permite aprovar o próprio PR. O portão que existe é o do processo: a alteração
fica visível, revisável e comentável antes de entrar. A branch é apagada
sozinha depois do merge.

## Compliance

O repositório é **autocontido e anônimo**. Não cita empresa, produto interno,
cliente, colaborador, ambiente, URL privada, chave de ticket nem regra de
negócio proprietária. O único sistema exercitado é uma loja pública de
demonstração.

O material de origem da palestra — as métricas de produtividade de um mês real,
os gráficos gerados a partir delas e o painel de qualidade de um produto real —
**não está aqui**. Ele serviu para montar os slides e permanece apenas na máquina
de quem apresenta, ignorado via [`.gitignore`](.gitignore). É proposital: o que
os alunos precisam é do método e do alvo público, não dos números de um produto
que eles não podem ver.

Se um slide novo precisar de captura de tela, **gere uma com dados sintéticos** —
não reaproveite nada de uma execução real.
