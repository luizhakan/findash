# Modelagem Financeira Refinada

Modelagem recomendada para o sistema de gestao financeira com foco em multiusuario e importacao de CSV.

## Entidades principais

- `UsuarioSistema`: dono dos dados financeiros.
- `CarteiraSistema`: agrupador de saldo por contexto (conta, cartao, dinheiro etc.).
- `MovimentacaoSistema`: registro de entrada/saida por carteira.
- `ImportacaoCsvSistema`: controle do processamento de um arquivo CSV.
- `ItemImportacaoCsvSistema`: rastreio por linha importada.

## Enums recomendados

- `TipoCarteiraSistema`
- `ModoMovimentacaoSistema`
- `TipoMovimentacaoSistema`
- `FonteOrigemMovimentacaoSistema`
- `StatusImportacaoCsvSistema`

Implementacao em:

- `apps/api/tipos/sistema/financeiro.tipos.ts`

## Mapeamento de CSV para tipo do sistema

Saida canonica da importacao:

- `usuario_id`
- `carteira_id`
- `modo`
- `tipo`
- `valor`
- `descricao`
- `data_movimentacao`
- `saldo_pos_movimento_origem` (opcional)
- `id_origem` (opcional)
- `fonte_origem`

Implementacao em:

- `apps/api/tipos/csv/csv-bancario.tipos.ts`
