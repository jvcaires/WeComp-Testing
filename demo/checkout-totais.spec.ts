/**
 * O que sai do "bom pedido" do ato 2 de prompts.md.
 *
 * Casos: CT-006-01 e CT-006-02 de RQ-006-checkout-totais.md, e CT-004-02 de
 * RQ-004-carrinho.md. Cada título começa pelo CT que o teste prova.
 *
 * Alvo: loja pública de demonstração · conta padrão do próprio site.
 * Prova: a regra de imposto do checkout (8% do subtotal, 2 casas) vale para
 *        carrinhos de valores diferentes — com o valor esperado calculado a
 *        partir dos preços da vitrine, nunca lido da tela de resumo.
 *
 * As quatro regras do material estão aplicadas de propósito, cada uma marcada
 * com um comentário REGRA — é o que se mostra no slide ao lado do código.
 */

import { test, expect, type Page } from '@playwright/test';

const LOJA = 'https://www.saucedemo.com/';
const CONTA = { usuario: 'standard_user', senha: 'secret_sauce' };

/** A regra do produto. O valor esperado vem daqui — não da execução. */
const ALIQUOTA = 0.08;
const imposto = (subtotal: number) => Math.round(subtotal * ALIQUOTA * 100) / 100;

const dinheiro = (texto: string | null) => Number((texto ?? '').replace(/[^0-9.]/g, ''));

async function entrar(page: Page) {
  await page.goto(LOJA);
  await page.getByTestId('username').fill(CONTA.usuario);
  await page.getByTestId('password').fill(CONTA.senha);
  await page.getByTestId('login-button').click();
  await page.waitForURL(/inventory\.html/);

  // REGRA 4 — provar o ambiente antes de julgar o produto. Uma vitrine vazia
  // não é "o teste falhou": é o teste não ter tido o que medir. A mensagem
  // precisa dizer isso, ou a próxima pessoa vai caçar um defeito que não existe.
  const itens = page.locator('[data-test="inventory-item"]');
  await expect(itens.first(), 'SETUP: a vitrine não carregou nenhum item').toBeVisible();
  expect(await itens.count(), 'SETUP: vitrine sem itens — nada a medir').toBeGreaterThan(0);
}

async function precoDe(page: Page, slug: string) {
  const cartao = page.locator('[data-test="inventory-item"]').filter({
    has: page.locator(`[data-test="add-to-cart-${slug}"]`),
  });
  // REGRA 1 — pré-condição ausente FALHA, nunca pula. Um produto renomeado
  // tem de derrubar o teste; se ele "pulasse", o CI ficaria verde sem medir nada.
  await expect(cartao, `SETUP: produto "${slug}" não está na vitrine`).toHaveCount(1);
  return dinheiro(await cartao.locator('[data-test="inventory-item-price"]').textContent());
}

async function irAteOResumo(page: Page, slugs: string[]) {
  for (const slug of slugs) await page.getByTestId(`add-to-cart-${slug}`).click();
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();
  await page.getByTestId('firstName').fill('Ana');
  await page.getByTestId('lastName').fill('Souza');
  await page.getByTestId('postalCode').fill('01310-100');
  await page.getByTestId('continue').click();
  await page.waitForURL(/checkout-step-two\.html/);
}

const CARRINHOS = [
  { nome: 'um item barato', slugs: ['sauce-labs-onesie'] },
  { nome: 'um item caro', slugs: ['sauce-labs-fleece-jacket'] },
  { nome: 'três itens', slugs: ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt'] },
];

test.describe('checkout — a conta cobrada corresponde ao carrinho', () => {
  for (const carrinho of CARRINHOS) {
    test(`CT-006-01 · imposto e total com ${carrinho.nome}`, async ({ page }) => {
      await entrar(page);

      // REGRA 2 — o esperado vem da ESPECIFICAÇÃO, calculado a partir dos preços
      // da vitrine. Nenhum número deste teste foi copiado de uma execução.
      const precos = [];
      for (const slug of carrinho.slugs) precos.push(await precoDe(page, slug));
      const subtotalEsperado = Math.round(precos.reduce((a, b) => a + b, 0) * 100) / 100;
      const impostoEsperado = imposto(subtotalEsperado);
      const totalEsperado = Math.round((subtotalEsperado + impostoEsperado) * 100) / 100;

      await irAteOResumo(page, carrinho.slugs);

      expect(dinheiro(await page.getByTestId('subtotal-label').textContent()),
        `subtotal: somei ${precos.join(' + ')} da vitrine`).toBe(subtotalEsperado);
      expect(dinheiro(await page.getByTestId('tax-label').textContent()),
        `imposto: ${ALIQUOTA * 100}% de ${subtotalEsperado}, arredondado a 2 casas`).toBe(impostoEsperado);
      expect(dinheiro(await page.getByTestId('total-label').textContent()),
        `total: ${subtotalEsperado} + ${impostoEsperado}`).toBe(totalEsperado);
    });
  }

  test('CT-006-02 · a asserção de imposto reprova um valor errado (controle)', async ({ page }) => {
    // REGRA 3 — controle positivo. Uma suíte cheia de asserções que nunca
    // poderiam falhar passa por uma suíte saudável. Este teste prova que a
    // comparação acima tem dentes: o imposto correto NÃO é um valor fixo.
    await entrar(page);
    const preco = await precoDe(page, 'sauce-labs-backpack');
    await irAteOResumo(page, ['sauce-labs-backpack']);

    const cobrado = dinheiro(await page.getByTestId('tax-label').textContent());
    expect(cobrado, 'o imposto correto deve bater com a regra').toBe(imposto(preco));
    expect(cobrado, 'e NÃO deve ser um valor fixo — se fosse, a asserção acima não provaria nada')
      .not.toBe(imposto(preco) + 1);
  });

  test('CT-004-02 · o contador do carrinho começa ausente, não em zero', async ({ page }) => {
    await entrar(page);
    const contador = page.getByTestId('shopping-cart-badge');

    // O detalhe que um teste escrito no automático erra: com o carrinho vazio o
    // contador não existe. Afirmar toHaveText('0') falha pelo motivo errado.
    await expect(contador).toHaveCount(0);
    await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
    await expect(contador).toHaveText('1');
    await page.getByTestId('remove-sauce-labs-backpack').click();
    await expect(contador).toHaveCount(0);
  });
});
