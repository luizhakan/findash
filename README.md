# 💰 FinDash - Personal Finance Manager

[![Kotlin](https://img.shields.io/badge/Kotlin-Mobile-7F52FF?style=flat&logo=kotlin)](https://kotlinlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-Backend-E0234E?style=flat&logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)

Um aplicativo completo para gestão de finanças pessoais, desenhado para ser rápido, seguro e flexível. O projeto permite o controle total de receitas, despesas e cartões de crédito, suportando múltiplas contas bancárias e a importação inteligente de dados via arquivos CSV de diferentes bancos (Nubank, Banco Inter e Mercado Pago), com algoritmo anti-duplicidade.

## 🚀 O Projeto

A proposta principal deste aplicativo é dar controle financeiro total ao usuário. Ele suporta desde o registro manual detalhado de transações (com calculadoras, fotos de notas fiscais e categorização) até a automação via importação de extratos bancários. Tudo gerido através de um app Kotlin (Android) e um back-end NestJS em arquitetura Monorepo.

### ✨ Funcionalidades Principais

#### 🏦 Gestão de Contas e Saldos

- **Múltiplas Contas:** Criação de diferentes contas (Ex: Carteira, Nubank, Inter, Conta de Investimentos).
- **Transferência entre Contas:** Movimentação de saldos entre contas cadastradas (Ex: Transferir da 'Conta Corrente' para 'Investimentos').
- **Controle de Visibilidade:** Opção de incluir ou ocultar contas específicas do cálculo do saldo total do usuário no Dashboard.

#### 💵 Receitas e Despesas (Lançamentos Manuais)

- **Inserção Detalhada:** Registro com valor (via calculadora embutida), data, descrição e seleção de conta.
- **Categorização:** Organização por categorias personalizadas.
- **Status de Pagamento:** Marcação se a transação já foi paga/recebida ou se é um lançamento futuro.
- **Recorrência e Parcelamento:** Suporte a transações que se repetem mensalmente ou compras/receitas parceladas.
- **Anexos:** Inserção de notas textuais e upload de fotos de recibos/notas fiscais (armazenadas em Base64).

#### 💳 Gestão de Cartões de Crédito e Faturas

- **Cadastro de Cartões:** Múltiplos cartões com definição de data de fechamento e data de vencimento da fatura.
- **Despesas no Crédito:** Lançamentos atrelados a um cartão específico, seguindo a mesma riqueza de detalhes das despesas comuns (categorias, notas).
- **Faturas Inteligentes:** Despesas vinculadas automaticamente à fatura correta com base na data da compra e data de fechamento.
- **Parcelamento no Cartão:** Gestão de compras divididas em várias faturas.
- **Pagamento de Fatura:** Fluxo dedicado para o pagamento total ou parcial (com opção de parcelamento) da fatura do mês.

#### 🤖 Automação e Importação

- **Importação de CSVs:** Algoritmo inteligente no back-end para ler, padronizar e salvar transações vindas de extratos bancários (Nubank, Mercado Pago, Inter).
- **Anti-Duplicidade:** Prevenção de dados duplicados ao importar o mesmo arquivo ou arquivos sobrepostos.

#### 📊 Dashboard e Relatórios

- **Sumário Mensal:** Visão agregada de gastos e ganhos do mês atual, separados por categorias.
- **Sumário Diário:** Acompanhamento do fluxo de caixa dia a dia.
- **Lançamentos Futuros:** Visualização clara das contas a pagar e a receber nos próximos meses.

## 🛠️ Stack Tecnológica

- **Mobile App:** Kotlin com Jetpack Compose
- **Back-end API:** NestJS (Node.js + TypeScript)
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma ORM
- **Infraestrutura:** Docker (Containers para deploy no VPS)

## 📁 Estrutura do Monorepo

```text
/
├── apps/
│   ├── mobile/         # Aplicativo Flutter (iOS e Android)
│   └── api/            # Back-end NestJS (Regras de negócio e rotas)
├── docker-compose.yml  # Configuração de containers (Postgres, API, etc)
└── README.md

## ⚙️ Setup local (estado atual)

### Pré-requisitos

- Node.js 20+
- Docker + Docker Compose

### Passos

1. Instalar dependências: `npm install`
2. Subir banco: `npm run db:up`
3. Configurar ambiente da API: `cp apps/api/.env.example apps/api/.env`
4. Aplicar migrations: `npm run prisma:migrate`
5. Rodar API: `npm run dev:api`

O PostgreSQL local está configurado para a porta `55432`.

### Endpoint inicial implementado

- `POST /contas`
- `GET /contas?usuarioId=<uuid>`
- `GET /contas/:id`
- `PATCH /contas/:id`
- `DELETE /contas/:id`
