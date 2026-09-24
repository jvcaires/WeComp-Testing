# Painel de qualidade da suíte

`painel.html` é um **arquivo único, sem dependência nenhuma**. Duplo clique e ele abre.
Sem `npm install`, sem build, sem servidor, sem internet, sem fonte externa.

Ele responde a uma pergunta só: *do que a especificação diz que este produto faz, quanto a
nossa suíte de fato prova?* Mede **a suíte**, não o produto — a loja é de terceiros e não é
nossa para consertar.

Construído a partir de [`PAINEL_SPECIFICATION.md`](../PAINEL_SPECIFICATION.md), que define as
métricas, o contrato de dados e as oito regras de honestidade.

## No palco

| Tecla | Faz |
| --- | --- |
| `1` `2` `3` `4` | vai direto para Visão geral · Regras · Defeitos plantados · Suíte |
| `←` `→` | anda entre abas |
| `T` | alterna tema claro e escuro |

Abre no tema escuro. Se o tempo apertar, **fique com as abas 1 e 3**: o índice abre a
conversa e os defeitos plantados a fecham.

## O retrato atual

| Métrica | Valor | Fração |
| --- | --- | --- |
| Cobertura de regras | 28,6% | 12 / 42 |
| Alcance por área | 50,0% | 3 / 6 |
| Defeitos plantados detectados | 9,1% | 1 / 11 |
| Poder de detecção | não entra no índice | 5 / 5 mutações |
| Cobertura de linha | impossível | — |
| **Índice de prontidão** | **27** | 3 de 5 insumos |

O par que carrega a mensagem é **28,6% contra 50,0%**: metade das áreas encostadas, pouco
mais de um quarto das regras provadas. Encostar é barato, provar não é.

## Como reapurar

Os números vivem num bloco JSON único dentro do HTML. **Editar o valor, salvar, recarregar
— nada mais é regenerado.** Nenhuma porcentagem está gravada: todas saem de numerador e
denominador declarados, e o índice é recalculado na carga.

```bash
# denominador das regras
grep -cE '^\| (AUT|VIT|CAR|CK1|CK2|FIM)-[0-9]+ \|' ../BDD_SPECIFICATION.md

# execução: tempo, resultado, instabilidade
cd ../demo && npx playwright test --reporter=json
```

O passo que não tem comando é o que mais importa: para cada regra, perguntar *se esta regra
quebrasse, algum teste ficaria vermelho?* Só "sim" conta como coberta. Automatizar esse
mapeamento produziria exatamente o tipo de número convincente e errado que a palestra existe
para denunciar.

## O que o painel se recusa a fazer

- **Insumo impossível nunca vira zero.** Cobertura de linha aparece como cartão nomeado, com
  o motivo escrito. `Ausente` e `impossível` são palavras diferentes na tela.
- **Nenhuma porcentagem aparece sem denominador.** Toda fração está ao lado do número.
- **Denominadores diferentes não se somam.** Regras e áreas nunca viram uma fração só.
- **Regra parcial conta zero** e aparece nomeada, com o motivo. "O teste passa por ali" é
  justamente a ilusão que o painel existe para desfazer.
- **Métrica que não pode reprovar não vira nota.** O poder de detecção deu 5 de 5 e mesmo
  assim ficou fora do índice: como mutamos o valor esperado no teste, e não o produto,
  sobrevivente é impossível por construção.
