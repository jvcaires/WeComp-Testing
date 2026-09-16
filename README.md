# WeComp — IA & Testes

Material para palestra / mini-curso sobre uso de assistentes de IA em QA e
automação de testes: os números de produtividade de um mês real, dez casos
reais, o roteiro e os gráficos prontos para slide.

**Repositório autocontido e anônimo.** Não cita empresa, produto, cliente,
pessoas, ambientes, URLs, chaves de ticket nem regra de negócio. Os números são
agregados; os exemplos foram reescritos em termos genéricos. Ele não tem vínculo
com nenhum repositório de trabalho e não deve ganhar um.

## Por onde começar

| Arquivo | O que é |
| --- | --- |
| [`01-numeros.md`](01-numeros.md) | Os números de produtividade, com metodologia e ressalvas |
| [`02-casos-reais.md`](02-casos-reais.md) | 10 casos anonimizados — 5 onde a IA ganha, 5 onde ela erra |
| [`03-roteiro.md`](03-roteiro.md) | Roteiro de 75 min, com tempos, demo ao vivo e as perguntas difíceis |
| [`04-frases-de-efeito.md`](04-frases-de-efeito.md) | O que sustenta pergunta de plateia, e o que não sustenta |
| [`graficos/`](graficos/) | Cinco figuras em SVG e PNG, tema claro e escuro — abra o `index.html` |
| [`dados/metricas.json`](dados/metricas.json) | Os mesmos números em forma estruturada |
| [`dados/metodologia.md`](dados/metodologia.md) | Como cada número foi medido, para quem perguntar |

Se for ler um só: `02-casos-reais.md`. É o que a plateia lembra.

## A tese, em três linhas

1. O gargalo de QA nunca foi digitar — é entender o pedido, alcançar o estado de
   teste e separar defeito de ruído de ambiente.
2. A IA ataca exatamente essas etapas, e torna barato um nível de rigor que antes
   era caro demais para praticar.
3. O preço é um risco novo: teste que **parece** cobrir e não cobre, produzido em
   escala e com uma explicação convincente anexada.

## Regenerar os gráficos

```bash
npm run graficos        # os 10 SVGs, a partir de dados/metricas.json — sem dependências
npm i && npm run png    # os 10 PNGs a 2×, plano B para editor que importa SVG mal
```

Os SVGs são gerados, nunca editados à mão: número e figura saem da mesma fonte e
não podem divergir. Detalhes e decisões de desenho em
[`graficos/README.md`](graficos/README.md).

## Compliance

Todo o conteúdo passou por três filtros, nesta ordem:

1. **Nenhum identificador.** Sem nome de empresa, produto, domínio, usuário final,
   colaborador ou chave de ticket. Onde um exemplo precisa de identificador, ele é
   fictício.
2. **Nenhum dado de negócio.** Sem valores reais, sem regras proprietárias, sem
   nomes de endpoint internos. As regras foram generalizadas até deixarem de
   descrever o sistema de origem.
3. **Só agregados.** Números que descrevem volume e ritmo de trabalho, nunca
   conteúdo. "187 relatórios de verificação" é agregado; o texto de qualquer um
   deles não está aqui.

Se um slide precisar de captura de tela, **gere uma nova com dados sintéticos** —
não reaproveite nada de uma execução real.
