/**
 * Login — casos CT-001-01 a CT-001-09 de RQ-001-login.md, que consolida as
 * regras AUT-1 a AUT-7 da BDD_SPECIFICATION.md §2. Cada título começa pelo CT
 * que o teste prova; CT-001-10 a CT-001-13 ainda não estão automatizados.
 *
 * Nenhuma mensagem aqui foi copiada de uma execução: todas saem dos critérios
 * de aceite do requisito. Se o site mudar um texto, este arquivo reprova — que
 * é o comportamento desejado. Um teste que lê a mensagem da tela e a compara
 * consigo mesma nunca reprova nada.
 *
 * As quatro regras do material estão marcadas com comentários REGRA, como em
 * checkout-totais.spec.ts. Três armadilhas da §9 também estão tratadas, cada
 * uma marcada com ARMADILHA.
 */

import { test, expect, type Page } from '@playwright/test';

const LOJA = 'https://www.saucedemo.com/';
const SENHA_COMUM = 'secret_sauce';
const CONTAS_PUBLICADAS = [
  'standard_user', 'locked_out_user', 'problem_user',
  'performance_glitch_user', 'error_user', 'visual_user',
] as const;

/**
 * REGRA 2 — o esperado vem da ESPECIFICAÇÃO (§2, tabela de regras), não da
 * execução. Estas constantes são o oráculo; trocá-las por "o que a tela
 * mostrou" destrói o valor do arquivo inteiro.
 */
const MENSAGEM = {
  usuarioObrigatorio: 'Epic sadface: Username is required',
  senhaObrigatoria: 'Epic sadface: Password is required',
  parInvalido: 'Epic sadface: Username and password do not match any user in this service',
  contaBloqueada: 'Epic sadface: Sorry, this user has been locked out.',
  semSessao: "Epic sadface: You can only access '/inventory.html' when you are logged in.",
} as const;

/**
 * REGRA 4 — provar o ambiente antes de julgar o produto. Se a tela de login
 * não carregou, nenhuma afirmação sobre mensagem de erro significa coisa
 * alguma. O prefixo SETUP separa "o teste não teve o que medir" de "o produto
 * está errado" — a distinção que economiza a próxima meia hora de investigação.
 */
async function irParaOLogin(page: Page) {
  await page.goto(LOJA);
  await expect(page.getByTestId('username'),
    'SETUP: a tela de login não apresentou o campo de usuário').toBeVisible();
  await expect(page.getByTestId('login-button'),
    'SETUP: a tela de login não apresentou o botão de entrar').toBeVisible();
}

async function tentarEntrar(page: Page, usuario: string, senha: string) {
  // Campo vazio é caso de teste, não descuido: preencher com '' mantém o
  // comando explícito e o cenário legível ao lado do Gherkin da §2.
  await page.getByTestId('username').fill(usuario);
  await page.getByTestId('password').fill(senha);
  await page.getByTestId('login-button').click();
}

test.describe('login — AUT-1 a AUT-7', () => {
  test('CT-001-01 · AUT-1 · a tela publica as contas aceitas e a senha comum', async ({ page }) => {
    await irParaOLogin(page);

    const contas = page.getByTestId('login-credentials');
    const senha = page.getByTestId('login-password');

    // REGRA 1 — pré-condição ausente FALHA, nunca pula. Se o site parar de
    // publicar as credenciais, os outros testes deste arquivo passam a depender
    // de conhecimento que deixou de estar na tela. Isso precisa aparecer como
    // falha, não como teste ignorado.
    await expect(contas, 'SETUP: o painel de contas aceitas não está na tela').toBeVisible();
    await expect(senha, 'SETUP: o painel da senha comum não está na tela').toBeVisible();

    // RQ-001 1.4: as seis contas, não só as duas que os outros testes usam.
    for (const conta of CONTAS_PUBLICADAS) await expect(contas).toContainText(conta);
    await expect(senha).toContainText(SENHA_COMUM);
  });

  test('CT-001-02 · AUT-2 · login válido leva à vitrine, com o carrinho vazio', async ({ page }) => {
    await irParaOLogin(page);
    await tentarEntrar(page, 'standard_user', SENHA_COMUM);

    // ARMADILHA 1 (§9) — a URL muda antes da tela. Esperar pela URL não é
    // esperar pela vitrine: foi observado o cabeçalho ainda exibir o título
    // anterior com a URL já nova. Por isso afirmamos sobre CONTEÚDO também.
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="inventory-item"]').first(),
      'a URL virou vitrine mas o conteúdo não chegou').toBeVisible();

    // §1 da especificação: o catálogo tem 6 produtos.
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);

    // §1: o contador do carrinho NÃO EXISTE quando vazio — não é '0'.
    await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
  });

  /**
   * AUT-3 a AUT-6 — o "Esquema do Cenário: Credenciais recusadas" da §2,
   * transcrito linha por linha. A ordem dos exemplos importa: os dois
   * primeiros provam que a validação de usuário vem ANTES da de senha, que é
   * a regra que a especificação marca como a mais enganosa.
   */
  const RECUSADAS = [
    { caso: 'CT-001-03 · AUT-3 · usuário vazio e senha vazia', usuario: '', senha: '', esperada: MENSAGEM.usuarioObrigatorio },
    { caso: 'CT-001-03 · AUT-3 · usuário vazio COM senha preenchida', usuario: '', senha: SENHA_COMUM, esperada: MENSAGEM.usuarioObrigatorio },
    { caso: 'CT-001-04 · AUT-4 · usuário preenchido e senha vazia', usuario: 'standard_user', senha: '', esperada: MENSAGEM.senhaObrigatoria },
    { caso: 'CT-001-05 · AUT-5 · par inexistente', usuario: 'foo', senha: 'bar', esperada: MENSAGEM.parInvalido },
    { caso: 'CT-001-06 · AUT-6 · conta bloqueada', usuario: 'locked_out_user', senha: SENHA_COMUM, esperada: MENSAGEM.contaBloqueada },
  ];

  for (const { caso, usuario, senha, esperada } of RECUSADAS) {
    test(`${caso} → recusa com a mensagem da especificação`, async ({ page }) => {
      await irParaOLogin(page);
      await tentarEntrar(page, usuario, senha);

      await expect(page.getByTestId('error'),
        `§2 prevê exatamente: "${esperada}"`).toHaveText(esperada);

      // "Então a Loja permanece na tela de login" — não basta ver o erro: uma
      // tela que mostra erro E navega mesmo assim está igualmente errada.
      await expect(page).not.toHaveURL(/\/inventory\.html/);
      await expect(page.getByTestId('login-button')).toBeVisible();
    });
  }

  test('CT-001-07 · AUT-7 · página protegida sem sessão recusa e redireciona para a raiz', async ({ page }) => {
    // ARMADILHA 7 (§9) — o estado sobrevive entre cenários. Cada teste do
    // Playwright recebe um contexto novo, sem cookie herdado; é isso que faz
    // "sem sessão" significar realmente sem sessão. Se algum dia estes testes
    // passarem a compartilhar contexto, este caso vira falso-positivo.
    await page.goto(`${LOJA}inventory.html`);

    // O que vale é a mensagem: ela sobrevive ao redirecionamento.
    await expect(page.getByTestId('error')).toHaveText(MENSAGEM.semSessao);

    /**
     * ARMADILHA 1 (§9), e foi este teste que a pegou na própria especificação.
     *
     * A tabela da §2 afirmava que a URL "se mantinha" em /inventory.html.
     * Medindo com amostras a cada 400 ms, a sequência real é:
     *
     *    73ms  /inventory.html      requisição, HTTP 404
     *   109ms  /?/inventory.html
     *   113ms  /inventory.html
     *   385ms  /inventory.html
     *   388ms  /                    estabiliza aqui
     *
     * Quem escreveu a regra observou dentro da janela de ~390 ms. Afirmar
     * /inventory.html aqui produziria um teste verde por corrida — verde na
     * máquina rápida, vermelho no CI, e sem explicação em nenhum dos dois.
     * A especificação foi corrigida em 2026-09-21 com essa medição.
     */
    await expect(page).toHaveURL(`${LOJA}`);
    await expect(page.locator('[data-test="inventory-item"]'),
      'a vitrine não pode ter renderizado em nenhum momento').toHaveCount(0);
  });

  test('CT-001-08 · a asserção de login bem-sucedido reprova credencial errada (controle)', async ({ page }) => {
    /**
     * REGRA 3 — controle positivo. Os testes acima afirmam "entrou" e "não
     * entrou". Se o oráculo de sucesso fosse vazio — se qualquer estado
     * passasse por vitrine — AUT-2 aprovaria sozinho e nunca reprovaria nada.
     * Este teste prova que o oráculo tem dentes.
     */
    await irParaOLogin(page);
    await tentarEntrar(page, 'foo', 'bar');

    await expect(page).not.toHaveURL(/\/inventory\.html/);
    await expect(page.locator('[data-test="inventory-item"]'),
      'credencial recusada não pode render vitrine — se render, o oráculo de AUT-2 não vale')
      .toHaveCount(0);
    await expect(page.getByTestId('shopping-cart-link'),
      'nem o cabeçalho de sessão ativa').toHaveCount(0);
  });

  test('CT-001-09 · performance_glitch_user entra, só devagar', async ({ page }, testInfo) => {
    // ARMADILHA 5 (§9) — esta conta estoura timeout curto, e só ela. §8 mediu
    // ~5 s contra ~0,4 s das demais. O timeout maior é da conta, não do arquivo:
    // afrouxar o padrão esconderia lentidão nas outras.
    test.setTimeout(60_000);

    await irParaOLogin(page);
    const partiu = Date.now();
    await tentarEntrar(page, 'performance_glitch_user', SENHA_COMUM);

    await expect(page.locator('[data-test="inventory-item"]').first()).toBeVisible({ timeout: 30_000 });
    const decorrido = Date.now() - partiu;

    // Deliberadamente NÃO afirmamos "demorou mais de 5 s". Tempo de parede
    // depende de rede e de máquina; uma asserção assim ficaria vermelha por
    // motivo errado no CI. O defeito fica REGISTRADO como anotação, e o que se
    // afirma é o que não depende do ambiente: a conta entra.
    testInfo.annotations.push({ type: 'tempo de login (ms)', description: String(decorrido) });
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });
});
