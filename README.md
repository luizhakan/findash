# 💰 FinDash (Nome Provisório) - Personal Finance Manager

Um aplicativo completo para gestão de finanças pessoais, desenhado para ser rápido, seguro e flexível. O projeto permite o controle total de receitas e despesas, suportando múltiplas contas bancárias e a importação inteligente de dados via arquivos CSV de diferentes bancos (Nubank, Banco Inter e Mercado Pago), com algoritmo anti-duplicidade.

## 🚀 O Projeto

A proposta principal deste aplicativo é facilitar a vida financeira do usuário, removendo o atrito de registrar transações manualmente, mas sem perder o controle. O aplicativo é dividido em um front-end Mobile altamente responsivo e um back-end robusto e tipado, utilizando arquitetura de Monorepo.

### ✨ Funcionalidades Principais (Roadmap Inicial)

- **Gestão de Múltiplas Contas:** Crie e gerencie contas diferentes (Ex: Carteira, Nubank, Inter).
- **Controle de Saldo Visível:** Opção de incluir ou ocultar contas específicas do cálculo do saldo total do usuário.
- **Importação de CSVs Bancários:** Algoritmo inteligente no back-end para ler, padronizar e salvar transações vindas de extratos bancários (Nubank, Mercado Pago, Inter), garantindo que não haja dados duplicados.
- **Gestão Manual de Lançamentos:** Adição, edição e exclusão de receitas e despesas avulsas.
- **Dashboard Resumo:** Visão geral do saldo atualizado, receitas e despesas do período.

## 🛠️ Stack Tecnológica

O projeto adota uma stack moderna, escalável e baseada na tipagem forte (TypeScript/Kotlin):

- **Mobile App:** Kotlin
- **Back-end API:** NestJS (Node.js + TypeScript)
- **Banco de Dados:** PostgreSQL
- **ORM:** Prisma ORM
- **Infraestrutura:** Docker (Containers para fácil deploy no VPS)

## 📁 Estrutura do Monorepo

O código-fonte está organizado em um único repositório para facilitar o desenvolvimento integrado:

```text
/
├── apps/
│   ├── mobile/         # Aplicativo Kotlin (iOS e Android)
│   └── api/            # Back-end NestJS (Regras de negócio e rotas)
├── docker-compose.yml  # Configuração de containers (Postgres, API, etc)
└── README.md
```

## ⚙️ Como rodar o projeto localmente (Em breve)

*(Esta seção será preenchida conforme configurarmos o ambiente com Docker, Prisma e Kotlin).*

1. Clonar o repositório.
2. Subir o banco de dados via Docker.
3. Rodar as migrations do Prisma.
4. Iniciar o servidor NestJS.
5. Rodar o app Kotlin no emulador ou dispositivo físico.
