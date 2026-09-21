import { defineConfig, devices } from '@playwright/test';

/**
 * Configuração mínima para a demo. Três linhas importam de verdade:
 *
 *  - `testIdAttribute: 'data-test'` faz `getByTestId('checkout')` casar com
 *    `[data-test="checkout"]`, que é o atributo que esta loja usa. Sem isso o
 *    Playwright procura `data-testid` e não acha nada.
 *  - `screenshot: 'on'` guarda uma imagem de **todo** teste, passando ou
 *    falhando. Evidência de aprovação vale tanto quanto evidência de falha:
 *    "passou" sem imagem é uma afirmação sobre um estado que ninguém viu.
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

    /**
     * 'on' captura ao fim de cada teste, qualquer que seja o resultado, e
     * também no ponto da falha quando existe uma. As imagens ficam em
     * `test-results/` e embutidas no relatório HTML (`npm run relatorio`).
     *
     * O custo é real: ~40 KB por teste e alguns milissegundos cada. Para 15
     * testes isso é irrelevante; numa suíte de mil, pense duas vezes.
     */
    screenshot: 'on',
  },
});
