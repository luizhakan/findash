# Prisma no projeto API

## Arquivos

- `schema.prisma`: schema inicial alinhado aos casos de uso e testes.

## Pre-requisitos

- PostgreSQL em execucao (via `docker-compose`).
- Variavel `DATABASE_URL` configurada (`apps/api/.env.exemplo`).

## Comandos planejados

- `npm run prisma:gerar`
- `npm run prisma:migrar:dev -- --name init`
- `npm run prisma:migrar:deploy`
- `npm run prisma:studio`

## Observacao

Neste ambiente, a instalacao de dependencias externas pode falhar por bloqueio de rede. Se isso ocorrer, execute os comandos acima quando houver acesso ao registro do npm.
