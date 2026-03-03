# Estrutura dos CSV Bancarios

Este documento consolida a estrutura dos CSVs de extrato para:

- Nubank (`janeiro-2026-nubank.csv`)
- Banco Inter (`setembro-fevereiro-inter.csv`)
- Mercado Pago (`janeiro-2026-mp.csv`)

## Objetivo

Padronizar o entendimento dos formatos para facilitar leitura, validacao e mapeamento dos dados na API.

## Nubank

- Delimitador: `,`
- Cabecalho extra: nao possui
- Exibe saldo por linha: nao
- Estrutura de data: `DD/MM/AAAA`

Colunas:

- `Data`: data da transacao
- `Valor`: valor da transacao (negativo para saida, positivo para entrada)
- `Identificador`: UUID da transacao
- `Descricao`: descricao da movimentacao

## Banco Inter

- Delimitador: `;`
- Cabecalho extra: possui linhas informativas antes da tabela
- Exibe saldo por linha: sim
- Estrutura de data: `DD/MM/AAAA`

Colunas:

- `Data Lancamento`: data da movimentacao
- `Historico`: categoria geral da transacao
- `Descricao`: favorecido ou estabelecimento
- `Valor`: valor da transacao (negativo para debito)
- `Saldo`: saldo resultante apos a transacao

## Mercado Pago

- Delimitador: `;`
- Resumo inicial: possui linhas de consolidado (`INITIAL_BALANCE`, `CREDITS`, `DEBITS`, `FINAL_BALANCE`)
- Exibe saldo por linha: sim
- Estrutura de data: `DD-MM-AAAA`

Colunas:

- `RELEASE_DATE`: data de liberacao do valor
- `TRANSACTION_TYPE`: tipo de movimentacao
- `REFERENCE_ID`: identificador numerico da transacao
- `TRANSACTION_NET_AMOUNT`: valor liquido da transacao
- `PARTIAL_BALANCE`: saldo acumulado apos a movimentacao

## Resumo comparativo

| Caracteristica | Nubank | Inter | Mercado Pago |
| --- | --- | --- | --- |
| Separador | `,` | `;` | `;` |
| Exibe saldo? | Nao | Sim | Sim |
| Identificador | UUID | Nao exposto | Numerico |
| Data | `DD/MM/AAAA` | `DD/MM/AAAA` | `DD-MM-AAAA` |

## Recomendacoes de padronizacao

- Detectar delimitador automaticamente (`;` ou `,`).
- Ignorar linhas de cabecalho/resumo antes da tabela de transacoes.
- Normalizar datas para formato unico interno (`AAAA-MM-DD`).
- Normalizar valor para numero decimal com sinal.
- Gerar um identificador interno para linhas sem ID de origem.
- Definir mapeamento canonico para importacao:
  - `data_movimentacao`
  - `descricao`
  - `tipo_movimentacao`
  - `valor`
  - `saldo_pos_movimento` (quando houver)
  - `id_referencia_origem` (quando houver)
