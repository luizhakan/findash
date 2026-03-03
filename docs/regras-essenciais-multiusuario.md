# Regras Essenciais Multiusuario

Este documento define regras minimas para garantir isolamento de dados em cenarios com muitos usuarios.

## Regras obrigatorias

- Toda entidade financeira deve possuir `usuario_id`.
- Toda consulta deve filtrar por `usuario_id`.
- Nenhuma operacao pode acessar carteira de outro usuario.
- Operacoes de edicao/remocao devem validar dono da carteira antes de executar.
- Transferencias so sao permitidas entre carteiras do mesmo `usuario_id`.
- Importacao de CSV deve registrar `usuario_id` e `carteira_id` em cada movimentacao.
- Deduplicacao deve considerar contexto do usuario e da carteira.

## Deduplicacao recomendada

Chave unica recomendada para importacao:

- `usuario_id`
- `carteira_id`
- `fonte_origem`
- `id_origem`

## Indices minimos recomendados

- Indice em `usuario_id` (tabelas de carteira e movimentacao).
- Indice composto em `usuario_id` + `carteira_id`.
- Indice composto em `usuario_id` + `data_movimentacao`.
- Unico composto em `usuario_id` + `carteira_id` + `fonte_origem` + `id_origem`.

## Regras de concorrencia

- Criacao de carteira deve prevenir duplicidade por usuario.
- Atualizacao de saldo deve ter protecao contra condicao de corrida.
- Operacoes em lote devem manter isolamento por usuario sem vazamento.

## Regras de observabilidade

- Logs devem incluir `usuario_id` e `carteira_id` para rastreabilidade.
- Nao registrar dados sensiveis em texto claro.
