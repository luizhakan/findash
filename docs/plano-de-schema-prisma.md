# Plano de Schema Prisma (PostgreSQL)

Objetivo: evoluir o banco com seguranca e baixo risco, seguindo os casos de uso ja testados.

## Estado atual

- `docker-compose` com PostgreSQL (`findash_postgres`).
- Schema inicial em `apps/api/prisma/schema.prisma` cobrindo:
  - usuarios e recuperacao de senha
  - carteiras, movimentacoes e transferencias internas
  - importacoes CSV e deduplicacao
  - cartoes, faturas, compras e parcelas
  - recorrencias e ocorrencias
  - orcamentos por categoria e registros de consumo/estorno
  - visibilidade de carteiras no saldo consolidado

## Ordem sugerida de migracoes

1. Base de autenticacao e usuario

- `usuarios`
- `tokens_recuperacao_senha`

1. Nucleo financeiro

- `carteiras`
- `movimentacoes`
- `visibilidades_carteira_consolidado`
- `transferencias_internas`

1. Importacao CSV

- `importacoes_csv`
- `itens_importacao_csv`

1. Cartoes

- `cartoes`
- `faturas_cartao`
- `compras_cartao`
- `parcelas_compra_cartao`

1. Recorrencias

- `lancamentos_recorrentes`
- `ocorrencias_lancamento_recorrente`

1. Orcamentos

- `orcamentos_categoria`
- `registros_orcamento`

## Regras criticas no banco

- Isolamento por usuario em todas as tabelas de dominio (`usuario_id`).
- Unicos compostos para evitar duplicidade de regra de negocio.
- Indices por `usuario_id` e por periodo para leitura de dashboard.
- Dado financeiro em `Decimal` para evitar erro de ponto flutuante.

## Ajustes futuros recomendados

- Adicionar RLS no PostgreSQL em ambiente de producao.
- Criar rotinas de auditoria para alteracoes sensiveis (senha, juros manual, estornos).
- Revisar particionamento de `movimentacoes` quando volume crescer.
- Considerar eventos/outbox apenas quando houver necessidade real de integracao assincrona.

## Comandos Prisma planejados

- Gerar cliente: `npm run prisma:gerar`
- Criar migracao local: `npm run prisma:migrar:dev -- --name init`
- Aplicar em deploy: `npm run prisma:migrar:deploy`
- Abrir studio: `npm run prisma:studio`
