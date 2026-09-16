import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração mínima para a demo. Duas linhas importam de verdade:
 *
 *  - `testIdAttribute: 'data-test'` faz `getByTestId('checkout')` casar com
 *    `[data-test="checkout"]`, que é o atributo que esta loja usa. Sem isso o
 *    Playwright procura `data-testid` e não acha nada.
 *  - `trace: 'on-first-retry'` grava a linha do tempo quando algo falha — é o
 *    que se abre no palco quando um teste quebra ao vivo.
 */
export default defineConfig({
  testDir: '.',
  timeout: 60_000,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
