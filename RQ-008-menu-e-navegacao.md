# RQ-008 — Menu lateral, cabeçalho e rodapé

- Fonte: https://www.saucedemo.com/inventory.html · conta `standard_user`
- Observado em: 2026-09-23
- Status: rascunho
- Relacionados: RQ-001, RQ-002, RQ-004, RQ-009, RQ-010

## História

Como pessoa compradora
Quero um menu e um cabeçalho presentes em toda a loja
Para que eu volte ao catálogo, saia da conta ou recomece a compra de qualquer página

## Critérios de aceite

AC1 — Cabeçalho e rodapé
1.1 Toda página com sessão exibe no cabeçalho o botão do menu, o nome "Swag Labs" e o ícone do carrinho (RQ-004).
1.2 A vitrine e as páginas do Dynamic Catalog exibem no rodapé os links "X" (`https://x.com/saucelabs`), "Facebook" (`https://www.facebook.com/saucelabs`) e "LinkedIn" (`https://www.linkedin.com/company/sauce-labs/`).
1.3 O rodapé exibe o texto "© 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy".

AC2 — Abrir e fechar o menu
2.1 O menu começa fechado. O botão do menu abre o painel lateral.
2.2 O menu tem 5 itens, nesta ordem: "All Items", "Dynamic Catalog", "About", "Logout" e "Reset App State".
2.3 O botão de fechar (X) e a tecla Esc fecham o menu.

AC3 — All Items
3.1 "All Items" leva à vitrine em `/inventory.html`. Vindo de outra página, o menu fecha.
3.2 Acionado na própria vitrine, "All Items" não recarrega a página: o menu continua aberto e a ordenação escolhida é mantida.

AC4 — Dynamic Catalog
4.1 "Dynamic Catalog" abre, dentro do menu, um submenu com "Lazy Load", "Spinner" e "Slider" (páginas descritas em RQ-009).

AC5 — About
5.1 "About" leva ao site `https://saucelabs.com/`, na mesma aba.

AC6 — Logout
6.1 "Logout" encerra a sessão e leva à tela de login em `/`, com os campos de usuário e senha vazios.
6.2 Depois do Logout, voltar pelo navegador não reabre a vitrine: a tela de login exibe "Epic sadface: You can only access '/inventory.html' when you are logged in.".
6.3 O Logout não esvazia o carrinho (RQ-004, 5.3).

AC7 — Reset App State
7.1 "Reset App State" esvazia o carrinho: o contador deixa de ser exibido.
7.2 O usuário permanece na mesma página e o menu continua aberto.
7.3 A ordenação da vitrine não é alterada pelo Reset App State.

## Oráculo

| O que | Regra que define o esperado | Conferido em |
| --- | --- | --- |
| Carrinho após Reset | Nenhum contador; depois de recarregar, todos os produtos em "Add to cart" | 2 itens, Reset na vitrine · 1 item, Reset no carrinho (sem recarregar) |
| Sessão após Logout | Página protegida recusa com a mensagem de RQ-001 AC5 | voltar pelo navegador depois do Logout |
| Destino dos links | O endereço declarado em cada link, comparado ao endereço de chegada | About e os 3 links do rodapé (destino só conferido para About) |

## Elementos observados

| Elemento | data-test | Tipo | Observação |
| --- | --- | --- | --- |
| Abrir menu | `open-menu` | imagem dentro do botão `#react-burger-menu-btn` | |
| Fechar menu | `close-menu` | imagem dentro do botão `#react-burger-cross-btn` | |
| All Items | `inventory-sidebar-link` | link | |
| Dynamic Catalog | `dynamic-catalog-sidebar-link` | link | abre `dynamic-catalog-submenu` |
| About | `about-sidebar-link` | link | `href="https://saucelabs.com/"` |
| Logout | `logout-sidebar-link` | link | |
| Reset App State | `reset-sidebar-link` | link | |
| Rodapé | `footer` | contêiner | |
| Redes sociais | `social-x`, `social-facebook`, `social-linkedin` | links | |
| Direitos | `footer-copy` | texto | |

## Casos de teste candidatos

CT-008-01 — O menu abre com os 5 itens na ordem de 2.2 e fecha pelo X e pela tecla Esc
CT-008-02 — "All Items" a partir do carrinho leva à vitrine e fecha o menu
CT-008-03 — "Logout" leva ao login com campos vazios, e voltar pelo navegador é recusado
CT-008-04 — "Reset App State" esvazia o carrinho: sem contador e, depois de recarregar, sem itens e com todos os botões em "Add to cart"
CT-008-05 — "About" leva a `https://saucelabs.com/`
CT-008-06 — O rodapé exibe os 3 links de redes sociais com os endereços de 1.2 e o texto de direitos

## Perguntas em aberto

P1 — **O Reset App State não atualiza a tela.** Com 2 produtos no carrinho, depois do Reset o contador some, mas os dois botões da vitrine continuam "Remove" até a página ser recarregada. No carrinho aberto, o item continua listado. Qual é o estado certo da tela logo depois do Reset?
P2 — O Reset App State deveria fechar o menu, como fazem "All Items" e "Logout" ao navegar?
P3 — O Reset App State deveria zerar a ordenação da vitrine? Hoje ela é mantida (7.3).
P4 — "Terms of Service" e "Privacy Policy" aparecem no rodapé como texto, sem link. Deveriam levar a alguma página?
P5 — O menu fica aberto quando "All Items" é acionado na própria vitrine (3.2). É pretendido?

## Histórico

- 2026-09-23 — criado a partir de exploração do site; consolida CAR-7 da BDD_SPECIFICATION §4 e acrescenta menu, cabeçalho e rodapé, que a especificação não cobria
