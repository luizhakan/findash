# Backlog do Projeto - FinDash

## Critérios de priorização

- **P0:** necessário para o MVP funcionar ponta a ponta.
- **P1:** agrega valor alto após MVP.
- **P2:** melhoria evolutiva.

---

## Épico 1 - Fundação Técnica (P0)

### US-001 - Estruturar monorepo

- **Descrição:** criar estrutura base com `apps/api` e `apps/mobile`.
- **Critérios de aceite:**
  - Estrutura de pastas criada.
  - Workspace com scripts de desenvolvimento.
  - `README` com instruções de setup local.

### US-002 - Subir banco local com Docker

- **Descrição:** provisionar PostgreSQL para desenvolvimento.
- **Critérios de aceite:**
  - `docker-compose.yml` com serviço do Postgres.
  - Variáveis de ambiente documentadas em `.env.example`.
  - Banco acessível localmente.

### US-003 - Configurar Prisma

- **Descrição:** preparar ORM e migrações iniciais.
- **Critérios de aceite:**
  - `schema.prisma` ativo na API.
  - Primeira migration criada e aplicável.
  - Prisma Client gerado.

---

## Épico 2 - Núcleo Financeiro (P0)

### US-004 - Cadastro de contas

- **Descrição:** CRUD de contas (`Conta`) por usuário.
- **Critérios de aceite:**
  - Criar, listar, editar e inativar conta.
  - Campo `incluir_soma_total` respeitado no saldo consolidado.

### US-005 - Cadastro de categorias e tags

- **Descrição:** CRUD de `Categoria` e `Tag`.
- **Critérios de aceite:**
  - Categorias por tipo (`RECEITA`/`DESPESA`).
  - Associação opcional de tags nas transações.

### US-006 - Lançamentos manuais

- **Descrição:** CRUD de transações de receita/despesa/transferência.
- **Critérios de aceite:**
  - `tipo`, `status`, `valor`, `data_ocorrencia` e `descricao` obrigatórios.
  - Regras de transferência validadas (`conta_id` e `conta_destino_id`).

### US-007 - Dashboard mensal inicial

- **Descrição:** endpoint de resumo mensal.
- **Critérios de aceite:**
  - Total de receitas, despesas e saldo no mês atual.
  - Saldo total respeitando visibilidade de conta.

---

## Épico 3 - Cartão de Crédito e Faturas (P0)

### US-008 - Cadastro de cartões

- **Descrição:** CRUD de `CartaoCredito`.
- **Critérios de aceite:**
  - Campos `dia_fechamento` e `dia_vencimento` validados (1..31).
  - Vínculo opcional com `conta_pagamento_id`.

### US-009 - Faturas automáticas

- **Descrição:** vincular despesas no crédito à fatura correta.
- **Critérios de aceite:**
  - Regra de fechamento aplicada pela data da compra.
  - Uma fatura por cartão/mês/ano.

### US-010 - Pagamento de fatura

- **Descrição:** pagar fatura total ou parcial.
- **Critérios de aceite:**
  - Lançar transação de saída na conta de pagamento.
  - Atualizar status da fatura conforme regra de negócio.

---

## Épico 4 - Importação Inteligente (P1)

### US-011 - Upload e parser de CSV

- **Descrição:** receber CSV e mapear layouts de Nubank, Inter e Mercado Pago.
- **Critérios de aceite:**
  - Parsing por instituição com estratégia própria.
  - Retorno de resumo da importação (lidas, inseridas, ignoradas).

### US-012 - Anti-duplicidade por hash

- **Descrição:** impedir transações duplicadas por `hash_importacao`.
- **Critérios de aceite:**
  - Hash determinístico por transação importada.
  - Registros já existentes são ignorados.

---

## Épico 5 - Mobile MVP (P1)

### US-013 - Autenticação e sessão

- **Descrição:** login no app e persistência de sessão.
- **Critérios de aceite:**
  - Login funcional com API.
  - Token persistido em storage seguro.

### US-014 - Telas do núcleo financeiro

- **Descrição:** contas, transações e dashboard básico.
- **Critérios de aceite:**
  - Fluxo ponta a ponta funcional no app.
  - Feedback visual de carregamento e erro.

---

## Épico 6 - Segurança e Experiência (P2)

### US-015 - Bloqueio biométrico

- **Descrição:** proteger abertura do app com biometria.
- **Critérios de aceite:**
  - FaceID/TouchID ou biometria Android ao abrir.

### US-016 - Notificações locais

- **Descrição:** alertar vencimentos de contas e faturas.
- **Critérios de aceite:**
  - Configuração de lembretes por data.
  - Notificação disparada em segundo plano.

---

## Sprint 1 sugerida (execução imediata)

- US-001 Estruturar monorepo
- US-002 Subir banco local com Docker
- US-003 Configurar Prisma
- US-004 Cadastro de contas (API)
- US-006 Lançamentos manuais (API, versão inicial sem anexos)
- US-007 Dashboard mensal inicial
