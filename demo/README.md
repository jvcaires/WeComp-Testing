# Demo ao vivo

Tudo que a demonstração precisa. Alvo: `https://www.saucedemo.com/`, uma loja
pública de demonstração — **não pertence a ninguém da plateia, não tem dado real e
não some no meio da palestra**.

| Arquivo | O que é |
| --- | --- |
| [`prompts.md`](prompts.md) | Os quatro pedidos, prontos para colar, com o que dizer em cada um |
| [`checkout-totais.spec.ts`](checkout-totais.spec.ts) | O resultado do ato 2 — já validado, serve de plano B |
| `playwright.config.ts` · `package.json` | O mínimo para rodar |

As quatro regras que sustentam este exemplo estão listadas em
[**O que este exemplo demonstra**](#o-que-este-exemplo-demonstra), logo abaixo.

## Preparar (faça antes, não no palco)

```bash
cd demo
npm install
npx playwright install chromium
npm test
```

Deve sair **5 passed** em cerca de 5 segundos. Se sair, a demo está pronta.

Úteis no palco: `npm run test:headed` (mostra o navegador, bom para plateia),
`npm run test:ui` (modo interativo) e `npm run relatorio` (abre o relatório HTML).

## Evidência de cada execução

`screenshot: 'on'` na configuração guarda **uma imagem por teste, passe ou
falhe** — em `test-results/`, e embutidas no relatório HTML:

| Arquivo | Quando |
| --- | --- |
| `test-finished-1.png` | Teste aprovado, estado final |
| `test-failed-1.png` | Teste reprovado, no ponto exato da falha |

É deliberado guardar as duas. "Passou" sem imagem é uma afirmação sobre um
estado que ninguém olhou — e a plateia costuma perguntar justamente isso.

No CI as duas coisas sobem como artefato em **toda** execução, não só nas que
falham, e ficam disponíveis por 7 dias na página do run.

## O que este exemplo demonstra

As quatro regras do material estão aplicadas no código, cada uma marcada com um
comentário `REGRA` — dá para projetar o arquivo e apontar:

1. **Pré-condição falha, nunca pula.** Produto ausente derruba o teste com
   `SETUP: produto "..." não está na vitrine`.
2. **O esperado vem da especificação.** O imposto é calculado no teste a partir dos
   preços lidos na vitrine; nenhum número foi copiado de uma execução.
3. **Controle positivo.** Um teste existe só para provar que a asserção de imposto
   pode reprovar — sem ele, uma comparação que nunca falha passaria por saudável.
4. **Prove o ambiente antes de julgar o produto.** Vitrine vazia é falha de setup
   com mensagem própria, não "esperado 3, recebido 0".

## Verificado, não presumido

Tudo abaixo foi medido no site, não estimado:

- **A regra de imposto é 8% do subtotal, arredondado a 2 casas.** Conferido em três
  carrinhos: `$29.99 → $2.40`, `$49.99 → $4.00`, `$7.99 → $0.64`.
- **Trocar a alíquota de 0,08 para 0,09 derruba 4 dos 5 testes.** O que sobrevive é
  o do contador do carrinho — e está correto, porque ele não depende da alíquota.
- **Trocar um nome de produto** produz `SETUP: produto "..." não está na vitrine`,
  e não uma falha que parece defeito do site.
- **O contador do carrinho não existe quando o carrinho está vazio** — ele não é
  "0". Um teste que afirme `toHaveText('0')` falha pelo motivo errado.
- **`problem_user` tem dois defeitos reais:** o campo de sobrenome não aceita
  digitação (fica vazio depois de preenchido) e as seis imagens de produto são a
  mesma.
- **`performance_glitch_user` leva ~5,5 s para entrar** — bom para falar de espera
  por condição contra espera fixa, se a conversa for para esse lado.

## Duas coisas para não esquecer

**Rode uma vez na máquina e no projetor antes de começar.** O teste depende de rede
para alcançar a loja. Se a sala tiver internet ruim, prefira o modo `--headed` com
um carrinho só, que é mais rápido, ou caia para o vídeo gravado.

**Não use um site de trabalho na demo.** Além do óbvio de compliance, um ambiente
interno escolhe o pior momento para cair — e aí a plateia aprende sobre o seu
ambiente, não sobre o método.
