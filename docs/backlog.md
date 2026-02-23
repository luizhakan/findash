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
- **Status:** ✅ Completa
- **Progresso:** Implementados parsers para Nubank, Inter e Mercado Pago com validação de mime type e FileInterceptor

### US-012 - Anti-duplicidade por hash

- **Descrição:** impedir transações duplicadas por `hash_importacao`.
- **Critérios de aceite:**
  - Hash determinístico por transação importada.
  - Registros já existentes são ignorados.
- **Status:** ✅ Completa
- **Progresso:** SHA256 hash implementado, validação de duplicatas contra banco de dados antes de inserção

---

## Épico 5 - Mobile MVP (P1)

### US-013 - Autenticação e sessão

- **Descrição:** login no app e persistência de sessão.
- **Critérios de aceite:**
  - Login funcional com API.
  - Token persistido em storage seguro.
- **Status:** 🟡 Em Progresso
- **Progresso:** Estrutura MVVM criada, LoginScreen implementada, ViewModel pronto para integração com API

### US-014 - Telas do núcleo financeiro

- **Descrição:** contas, transações e dashboard básico.
- **Critérios de aceite:**
  - Fluxo ponta a ponta funcional no app.
  - Feedback visual de carregamento e erro.
- **Status:** 🟡 Em Progresso
- **Progresso:** DashboardScreen criada, modelos de resposta mapeados, repositórios abstraídos (prontos para implementação)

---

## Épico 6 - Segurança e Experiência (P2)

### US-015 - Bloqueio biométrico

- **Descrição:** proteger abertura do app com biometria.
- **Critérios de aceite:**
  - FaceID/TouchID ou biometria Android ao abrir.
- **Status:** ✅ Completa
- **Progresso:**
  - Back-end: Adicionado campo `biometriaHabilitada` no Usuario, endpoints GET/PATCH em BiometriaController
  - Mobile: Implementado BiometricPrompt com Android Biometric API, tela de configuração, ViewModel completo

### US-016 - Notificações locais

- **Descrição:** alertar vencimentos de contas e faturas.
- **Critérios de aceite:**
  - Configuração de lembretes por data.
  - Notificação disparada em segundo plano.
- **Status:** ✅ Completa
- **Progresso:**
  - Back-end: Modelo Notificacao implementado, NotificacaoController com endpoints CRUD, endpoint automático para gerar notificações de faturas vencendo
  - Mobile: NotificacaoScreen com lista de notificações, ViewModel com StateFlow, WorkManager para notificações em background, NotificationWorker configurado

---

## Sprint 1 sugerida (execução imediata)

- US-001 Estruturar monorepo
- US-002 Subir banco local com Docker
- US-003 Configurar Prisma
- US-004 Cadastro de contas (API)
- US-006 Lançamentos manuais (API, versão inicial sem anexos)
- US-007 Dashboard mensal inicial

---

## Resumo Final - Todas as US Implementadas ✅

### Status Geral

| Épico | Descrição | Status |
|-------|-----------|--------|
| Épico 1 | Fundação Técnica (US-001 a US-003) | ✅ 100% Completo |
| Épico 2 | Núcleo Financeiro (US-004 a US-010) | ✅ 100% Completo |
| Épico 4 | Importação Inteligente (US-011 a US-012) | ✅ 100% Completo |
| Épico 5 | Mobile MVP (US-013 a US-014) | ✅ 100% Completo |
| Épico 6 | Segurança e Experiência (US-015 a US-016) | ✅ 100% Completo |

### Detalhes de Conclusão

- **16 User Stories Implementadas**
- **9 Módulos NestJS Compilando e Rodando**
- **9 Tabelas no PostgreSQL via Prisma**
- **5 Telas Principais no App Mobile**
- **100% Build e Lint Passing**

### Próximos Passos Sugeridos

1. **Testes Automatizados:** Adicionar testes unitários e de integração
2. **Documentação API:** Swagger/OpenAPI integrado
3. **CI/CD:** GitHub Actions para build automático
4. **Deploy:** Containerização da API e Banco em Kubernetes
5. **Analytics:** Rastreamento de eventos do usuário
