# Prompts da demo — prontos para colar

Quatro atos, na ordem. Cada um tem o pedido **para colar tal como está** e a nota
do que dizer enquanto a IA trabalha. Alvo: `https://www.saucedemo.com/`, conta
`standard_user` / `secret_sauce` (o próprio site publica as contas na tela de
login).

> **Combine o tempo antes.** Os quatro atos cabem em ~25 min se você falar por
> cima da geração em vez de esperar em silêncio. Se o tempo apertar, o **ato 2
> sozinho** entrega a mensagem inteira.

---

## Ato 1 · O pedido preguiçoso (≈5 min)

Cole exatamente isto. A preguiça é o ponto.

```text
Crie um teste e2e para o site https://www.saucedemo.com/
```

**O que vai sair:** login, uma verificação de URL, talvez um clique em "Add to
cart". Vai rodar. Vai passar.

**O que dizer:** peça à plateia para apontar o que esse teste prova. A resposta
honesta é "que a página de inventário é a página de inventário". Não critique a
IA — ela respondeu exatamente o que foi perguntado. **O pedido é que não tinha
como estar certo.**

Se o teste que saiu usar seletor de CSS estrutural ou um `waitForTimeout`, marque
na tela: são os dois sintomas que o próximo ato elimina.

---

## Ato 2 · O mesmo fluxo, com oráculo (≈8 min) — o ato principal

```text
Escreva um teste Playwright + TypeScript que prove a regra de imposto do
checkout desta loja: imposto = 8% do subtotal, arredondado a 2 casas.

Regras que o teste tem de obedecer:
- O valor esperado é CALCULADO no teste a partir dos preços lidos na
  vitrine. Nenhum número pode ser copiado de uma execução.
- Rode o mesmo cenário com três carrinhos de valores diferentes.
- Seletores: só [data-test]. Nada de caminho de CSS, nada de índice.
- Espera: só por condição (URL, elemento). Nenhum sleep fixo.
- Se a vitrine vier vazia ou um produto não existir, o teste FALHA com
  uma mensagem que começa com "SETUP:" — nunca pula.
- A mensagem de cada asserção diz o que foi lido e o que era esperado.

Entregue um arquivo só, pronto para rodar.
```

**O que dizer enquanto gera:** que a diferença entre este pedido e o anterior não
é tamanho, é **o item do oráculo**. Foi a única linha que transformou um roteiro de
cliques num teste.

**Depois de rodar:** mostre os três casos passando. Eles levam ~1 segundo cada.

> Números medidos, caso queira antecipar: `$29.99 → $2.40`, `$49.99 → $4.00`,
> `$7.99 → $0.64`. Todos batem com `round(subtotal × 0,08; 2)`.

---

## Ato 3 · Provar que o teste tem dentes (≈6 min)

Este é o ato que quase ninguém faz numa demo — e é o que fica na memória.

```text
Agora prove que esse teste falharia se o produto quebrasse. Sem mudar o
site, mostre-me:
  1. qual alteração de uma linha no teste simula o defeito;
  2. quantos e quais testes ficam vermelhos com ela;
  3. quais continuam verdes, e por que isso está correto.
Depois desfaça a alteração e confirme que tudo voltou a passar.
```

**O que acontece:** a IA troca a alíquota de 0,08 para 0,09 e roda.

> Medido: **4 dos 5 testes ficam vermelhos.** O que continua verde é o do contador
> do carrinho — e está certo, porque ele não depende da alíquota. É esse "e está
> certo" que mostra que a suíte é precisa, não só sensível.

Repita depois com uma segunda mutação, trocando o nome de um produto por um
inexistente. A falha sai como `SETUP: produto "..." não está na vitrine` — não como
"esperado 3, recebido 0". **Essa é a diferença entre um teste que acusa o produto e
um que acusa a si mesmo.**

**O que dizer:** "um teste que nunca foi visto falhando é uma hipótese, não um
teste".

---

## Ato 4 · Diagnóstico, não conserto (≈6 min)

```text
Esta loja tem uma conta chamada problem_user (mesma senha). Com ela, o
checkout não completa.

Antes de mudar uma linha de teste, investigue e me responda:
  1. em qual passo exatamente o fluxo diverge do esperado;
  2. qual é a evidência concreta — valor lido, estado do DOM, requisição;
  3. se isso é defeito do site ou do teste, e como você distingue os dois.

Só depois disso proponha uma mudança, dizendo o que ela mudaria.
```

**O que a IA vai achar** (os dois estão lá, e são reproduzíveis):

- O campo **sobrenome não aceita digitação** — você preenche, o valor volta vazio.
  É isso que trava o checkout.
- As **seis imagens de produto são a mesma**. Nenhum teste que só verifique texto
  jamais veria isso.

**O que dizer — o fechamento da demo:** o pedido preguiçoso teria sido "conserta o
teste", e a IA teria consertado: trocaria o seletor, aumentaria o timeout,
adicionaria um retry. O teste ficaria verde e o defeito continuaria lá.

> "A IA é ótima em fazer o vermelho virar verde. Quem decide se isso é o certo
> continua sendo você."

---

## Se sobrar tempo: o pedido que rende mais

```text
Antes de escrever qualquer teste: navegue por esta loja e me diga quais
três comportamentos, se quebrassem, ninguém perceberia até um cliente
reclamar. Depois escrevemos teste para esses.
```

Usa a IA na parte cara — **decidir o que merece teste** — em vez da parte barata,
que é digitar. É o slide que fala do trabalho da plateia, não da ferramenta.

---

## Plano B

Se a internet cair ou a geração travar:

1. O arquivo [`checkout-totais.spec.ts`](checkout-totais.spec.ts) já está pronto
   nesta pasta — é exatamente o resultado do ato 2, e roda offline contra o site
   (só precisa de rede para o site, não para a IA).
2. Tenha um vídeo de 90 s do ato 3 gravado. É o ato mais visual e o mais caro de
   perder.
3. Em último caso, o ato 2 se explica só com o código na tela: mostre a linha que
   calcula o esperado e a linha que lê a tela, e pergunte qual das duas um teste
   ruim usaria para as duas coisas.
