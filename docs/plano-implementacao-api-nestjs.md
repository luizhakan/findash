# Plano de Implementacao da API NestJS

Este plano organiza a implementacao da API com base nas suites de testes ja existentes, mantendo foco em simplicidade e evitando overengineering.

## Objetivo

- Estruturar a API HTTP em NestJS para refletir os casos de uso ja validados por testes.
- Manter arquitetura orientada a camadas (dominio, aplicacao, infraestrutura, interface).
- Preparar base para evolucao incremental por modulo.

## Fases

### Fase 1 - Fundacao tecnica

- Adicionar dependencias do NestJS no `apps/api`.
- Criar bootstrap (`main.ts`) e `AppModule`.
- Configurar scripts de execucao (`start:dev`, `build`, `start:prod`).
- Ajustar `tsconfig` para compilar `src` e manter testes.

### Fase 2 - Estrutura por modulos de negocio

Criar modulos em `apps/api/src/modulos`:

- `contas`
- `carteiras`
- `cartoes`
- `csv`
- `saldos`
- `transferencias`
- `recorrencias`
- `orcamentos`

Cada modulo deve iniciar com:

- `interface/http` (controller, dto, mapeadores)
- `aplicacao` (casos de uso e portas)
- `dominio` (regras e erros)
- `infraestrutura` (repositorios/provedores)

### Fase 3 - Contratos HTTP baseados nas suites

Mapear endpoints por contexto conforme casos cobertos:

- `contas`: criar, deletar, editar senha, editar nome, recuperar senha.
- `csv`: importar e padronizar dados de Nubank, Inter e Mercado Pago.
- `carteiras`: CRUD, arquivamento, movimentacao, importacao CSV.
- `transferencias`: transferencia interna entre carteiras.
- `saldos`: saldo consolidado e visibilidade por carteira.
- `cartoes`: cartao, compra, fatura, juros manual.
- `recorrencias`: recorrencias (criar, pausar, reativar, encerrar, editar proximas).
- `orcamentos`: orcamento por categoria com alertas e estornos.

### Fase 4 - Persistencia e integracao

- Definir PostgreSQL como banco relacional principal.
- Implementar Prisma como ORM oficial do projeto.
- Criar modelo de dados inicial e migracoes.
- Implementar repositorios concretos.
- Avaliar Redis apenas quando houver necessidade real de cache/fila/locks.

### Fase 5 - Endurecimento

- Validacao de entrada com DTOs e pipes.
- Padronizacao de erros de negocio para HTTP.
- Testes de integracao dos modulos criticos.
- Observabilidade minima (logs estruturados e health check).

## Criterios de pronto por modulo

- Endpoints mapeados para todos os casos de uso existentes no contexto.
- Regras de isolamento multiusuario garantidas.
- Erros de negocio com respostas HTTP previsiveis.
- Sem dependencia de detalhes de infraestrutura dentro da regra de negocio.

## Ordem recomendada de entrega

1. `contas`
2. `carteiras` + `transferencias` + `saldos`
3. `csv`
4. `cartoes`
5. `recorrencias`
6. `orcamentos`

## Regra de escopo

- Implementar apenas o necessario para refletir os testes atuais.
- Evitar funcionalidades extras nao cobertas por requisito de negocio.
