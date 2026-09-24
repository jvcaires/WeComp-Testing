# RQ-009 — Catálogo dinâmico (Lazy Load, Spinner, Slider)

- Fonte: https://www.saucedemo.com/dynamic-catalog-lazy-load.html, `-spinner.html`, `-slider.html` · conta `standard_user`
- Observado em: 2026-09-23
- Status: rascunho
- Relacionados: RQ-002, RQ-008

## História

Como pessoa compradora
Quero ver o catálogo em formatos alternativos, que carregam aos poucos ou passam sozinhos
Para que eu navegue pelos produtos de outro jeito além da vitrine

## Critérios de aceite

AC1 — Entrar no catálogo dinâmico
1.1 O submenu "Dynamic Catalog" (RQ-008, AC4) leva a três páginas: "Lazy Load" em `/dynamic-catalog-lazy-load.html`, "Spinner" em `/dynamic-catalog-spinner.html` e "Slider" em `/dynamic-catalog-slider.html`.
1.2 Ao chegar a qualquer uma delas, o menu fecha.
1.3 Cada página exibe no cabeçalho secundário o título "Dynamic Catalog - Lazy Load", "Dynamic Catalog - Spinner" ou "Dynamic Catalog - Slider".
1.4 Nas três páginas, cada produto exibe imagem, nome e preço. Não há botão de adicionar ao carrinho nem link nos produtos. No Lazy Load, clicar num produto não muda de página.

AC2 — Lazy Load
2.1 A página abre com 8 produtos.
2.2 Rolar até o fim da lista carrega mais produtos.
2.3 A lista é uma sequência de 22 produtos que se repete: produtos sem tamanho (Bike Light, Onesie, Backpack) e variações de tamanho, com o tamanho entre parênteses no nome (ex.: "Sauce Labs Fleece Jacket (XS)" até "(XXL)").
2.4 O preço de cada variação é o preço do produto na vitrine (ex.: todas as variações de Fleece Jacket custam $49.99).
2.5 Recarregar a página volta aos 8 primeiros produtos, na mesma ordem.

AC3 — Spinner
3.1 A página abre exibindo um indicador de carregamento, e nenhum produto.
3.2 Depois de cerca de 2,5 a 3 segundos, o indicador desaparece e o sistema exibe uma grade com os 6 produtos do catálogo, sem tamanhos.
3.3 A ordem da grade é Bike Light, Bolt T-Shirt, Onesie, Test.allTheThings() T-Shirt (Red), Backpack e Fleece Jacket.

AC4 — Slider
4.1 A página exibe um produto por vez e 6 marcadores de posição, um por produto do catálogo.
4.2 Sem interação, o produto exibido avança sozinho a cada cerca de 2 segundos, na ordem de 3.3.
4.3 Depois do último produto, o slider volta ao primeiro.
4.4 Acionar um marcador exibe o produto daquela posição, e a passagem automática continua a partir dele.

## Oráculo

| O que | Regra que define o esperado | Conferido em |
| --- | --- | --- |
| Preço no catálogo dinâmico | O preço do mesmo produto na vitrine de `standard_user` (RQ-002) | 84 produtos no Lazy Load · 6 no Spinner · 6 no Slider |
| Crescimento do Lazy Load | Cada rolagem até o fim aumenta a contagem de produtos | 12 rolagens: 8 → 16 → 24 → 28 → 36 → 40 → 48 → 52 → 60 → 64 → 72 → 76 → 84 |
| Fim do Spinner | O indicador some e a grade aparece. Esperar pela grade, nunca por um tempo fixo | 3,1 s · 2,9 s · 2,4 s |
| Passagem do Slider | A sequência de nomes, amostrada a cada 1 s, segue a ordem de 3.3 | 8 amostras sem interação · 5 amostras depois do marcador 6 |

## Elementos observados

| Elemento | data-test | Tipo | Observação |
| --- | --- | --- | --- |
| Submenu | `dynamic-catalog-submenu` | contêiner | dentro do menu lateral |
| Links do submenu | `dynamic-catalog-lazy-load-link`, `dynamic-catalog-spinner-link`, `dynamic-catalog-slider-link` | links | |
| Lista do Lazy Load | `dynamic-catalog-lazy-load-container` | contêiner | |
| Produto do Lazy Load | `lazy-load-item-<n>` | contêiner | com `-img`, `-name`, `-price`; `<n>` a partir de 0 |
| Gatilho de carga | `dynamic-catalog-lazy-load-sentinel` | elemento vazio | no fim da lista |
| Contêiner do Spinner | `dynamic-catalog-spinner-container` | contêiner | |
| Indicador | `dynamic-catalog-spinner` | indicador | some quando a grade aparece |
| Grade do Spinner | `dynamic-catalog-spinner-grid` | contêiner | não existe durante o carregamento |
| Produto do Spinner | `spinner-item-<n>` | contêiner | com `-img`, `-name`, `-price` |
| Slider | `dynamic-catalog-slider-container` | contêiner | |
| Produto do Slider | `dynamic-catalog-slider-item` | contêiner | com `-img`, `-name`, `-price` |
| Marcadores | `dynamic-catalog-slider-dot-0` a `-5` | botões | sem rótulo de texto |

## Casos de teste candidatos

CT-009-01 — O submenu leva às três páginas, cada uma com o próprio título
CT-009-02 — O Lazy Load abre com 8 produtos e carrega mais ao rolar até o fim
CT-009-03 — O Spinner exibe o indicador e depois a grade com os 6 produtos, esperando pela grade
CT-009-04 — O Slider avança sozinho na ordem do catálogo e volta ao primeiro depois do último
CT-009-05 — Acionar um marcador do Slider exibe o produto daquela posição
CT-009-06 — Os preços das três páginas batem com os preços da vitrine para o mesmo produto

## Perguntas em aberto

P1 — O Lazy Load tem fim? Com 12 rolagens chegou a 84 produtos e continuava carregando. O catálogo real tem 6 produtos.
P2 — Na sequência de 22 do Lazy Load, "Test.allTheThings() T-Shirt (Red) (L)" aparece duas vezes, e o Bolt T-Shirt aparece em "(XS)" no começo e em "(S)" só no fim, fora da ordem de tamanhos. É proposital?
P3 — O catálogo dinâmico não permite adicionar ao carrinho nem abrir o detalhe (1.4). É só uma vitrine de demonstração ou deveria ser comprável?
P4 — O Lazy Load carregou 8 ou 4 produtos por vez, alternando. Qual é a regra do tamanho de cada carga?
P5 — O comportamento destas páginas com as contas de RQ-010 não foi explorado.

## Histórico

- 2026-09-23 — criado a partir de exploração do site; responde à pergunta P2 da BDD_SPECIFICATION §10, que registrava só a existência do menu
