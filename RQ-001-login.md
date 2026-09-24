# RQ-001 — Login

- Fonte: https://www.saucedemo.com/ · conta `standard_user` (e as demais contas publicadas na tela, onde indicado)
- Observado em: 2026-09-23
- Status: rascunho
- Relacionados: RQ-002, RQ-008, RQ-010

## História

Como visitante da Swag Labs
Quero entrar na loja com uma das contas publicadas
Para que eu possa navegar pela vitrine e comprar

## Critérios de aceite

AC1 — Carregar a tela de login
1.1 O sistema exibe, na raiz `/`, o campo de usuário, o campo de senha e o botão "Login".
1.2 O campo de usuário é uma caixa de texto de uma linha, obrigatória, preenchida por digitação, sem valor padrão, com o texto de apoio "Username". Não tem máscara nem tamanho máximo declarado.
1.3 O campo de senha é obrigatório, preenchido por digitação, sem valor padrão, com o texto de apoio "Password", e oculta os caracteres digitados. Não tem tamanho máximo declarado.
1.4 O sistema publica na própria tela as contas aceitas, sob o título "Accepted usernames are:": `standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user` e `visual_user`.
1.5 O sistema publica a senha comum sob o título "Password for all users:": `secret_sauce`.

AC2 — Entrar com credenciais válidas
2.1 Com uma conta aceita, não bloqueada, e a senha `secret_sauce`, o acionamento de "Login" leva o usuário à vitrine em `/inventory.html`.
2.2 O envio também ocorre quando o usuário pressiona Enter no campo de senha.
2.3 Imediatamente após o login com o carrinho vazio, o contador do carrinho não é exibido (ver RQ-004).

AC3 — Recusar credenciais
3.1 O sistema valida o usuário antes da senha: com o usuário vazio, a mensagem é "Epic sadface: Username is required", esteja a senha preenchida ou não.
3.2 Com o usuário preenchido e a senha vazia, a mensagem é "Epic sadface: Password is required".
3.3 Com um par usuário/senha que não corresponde a uma conta aceita, a mensagem é "Epic sadface: Username and password do not match any user in this service".
3.4 A comparação de usuário e de senha diferencia maiúsculas de minúsculas e não descarta espaços: `STANDARD_USER`, `" standard_user"`, `"standard_user "`, `SECRET_SAUCE` e `"secret_sauce "` produzem a mensagem de 3.3.
3.5 Com a conta `locked_out_user` e a senha correta, a mensagem é "Epic sadface: Sorry, this user has been locked out.".
3.6 Em toda recusa, o usuário permanece na tela de login, os dois campos são destacados como erro e cada campo exibe um ícone de erro.
3.7 Em toda recusa, o valor digitado nos dois campos é mantido.

AC4 — Fechar a mensagem de erro
4.1 A mensagem de erro tem um botão de fechar.
4.2 Ao fechar, o sistema remove a mensagem, o destaque de erro dos campos e os ícones de erro.

AC5 — Acessar uma página protegida sem sessão
5.1 Sem sessão ativa, o acesso direto às páginas `/inventory.html`, `/inventory-item.html`, `/cart.html`, `/checkout-step-one.html`, `/checkout-step-two.html` e `/checkout-complete.html` leva o usuário à tela de login.
5.2 A tela de login exibe então "Epic sadface: You can only access '<página>' when you are logged in.", em que `<página>` é o caminho acessado, sem parâmetros (ex.: `'/inventory-item.html'` para `/inventory-item.html?id=4`).
5.3 O endereço final é a raiz `/`. O endereço protegido aparece por cerca de 390 ms antes do redirecionamento (ver Histórico da BDD_SPECIFICATION §2).

## Oráculo

| O que | Regra que define o esperado | Conferido em |
| --- | --- | --- |
| Mensagem de recusa | A primeira regra violada, na ordem usuário vazio → senha vazia → par inexistente → conta bloqueada; textos da AC3 | `""/""` · `""/secret_sauce` · `standard_user/""` · `foo/bar` · `locked_out_user` · 5 variações de caixa e espaço |
| Mensagem de página protegida | O texto fixo de 5.2 com o caminho acessado, sem parâmetros | 6 páginas, entre elas `/inventory-item.html?id=4` |
| Contas aceitas | A lista lida da própria tela de login, não uma lista fixa no teste | 6 contas publicadas; 5 entram, `locked_out_user` não |

## Elementos observados

| Elemento | data-test | Tipo | Observação |
| --- | --- | --- | --- |
| Campo usuário | `username` | caixa de texto | `placeholder="Username"`, sem `maxlength` |
| Campo senha | `password` | caixa de senha | `placeholder="Password"`, sem `maxlength` |
| Botão entrar | `login-button` | botão de envio | rótulo "Login" |
| Mensagem de erro | `error` | título (`h3`) | só existe depois de uma recusa |
| Fechar mensagem | `error-button` | botão | só existe junto com `error` |
| Contas aceitas | `login-credentials` | bloco de texto | `id="login_credentials"` |
| Senha comum | `login-password` | bloco de texto | |

## Casos de teste candidatos

CT-001-01 — A tela publica as seis contas aceitas e a senha comum
CT-001-02 — Login válido leva à vitrine, com 6 produtos e o carrinho sem contador
CT-001-03 — Usuário vazio é recusado com "Username is required", com a senha vazia e com ela preenchida
CT-001-04 — Usuário preenchido e senha vazia são recusados com "Password is required"
CT-001-05 — Par inexistente é recusado com a mensagem de par inválido
CT-001-06 — Conta bloqueada é recusada com a mensagem de bloqueio
CT-001-07 — Página protegida sem sessão exibe a mensagem e termina na raiz
CT-001-08 — Controle: credencial recusada não exibe vitrine nem cabeçalho de sessão
CT-001-09 — `performance_glitch_user` entra e vê os 6 produtos, com o tempo de login registrado
CT-001-10 — Caixa e espaços no usuário ou na senha são recusados como par inexistente
CT-001-11 — Fechar a mensagem de erro remove a mensagem e o destaque dos campos
CT-001-12 — Enter no campo de senha envia o login
CT-001-13 — Cada uma das seis páginas protegidas, acessada sem sessão, exibe a mensagem com o próprio caminho

## Perguntas em aberto

P1 — Quanto tempo dura a sessão? O navegador guarda a sessão num cookie com validade de 10 minutos a partir do login, mas a expiração não foi observada na tela.
P2 — Com sessão ativa, abrir a raiz `/` mostra a tela de login de novo, sem redirecionar para a vitrine. É o comportamento pretendido?
P3 — O login de `performance_glitch_user` levou 5,1 s, contra menos de 0,1 s das demais contas. Existe um tempo máximo aceitável? Sem ele, a lentidão não pode virar critério de aceite (ver RQ-010).

## Histórico

- 2026-09-23 — criado a partir de exploração do site; consolida as regras AUT-1 a AUT-7 da BDD_SPECIFICATION §2 e acrescenta 3.4, 3.6, 3.7, AC4, 2.2 e a cobertura de todas as páginas protegidas em 5.1
