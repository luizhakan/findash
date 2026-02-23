# Documento de Escopo - FinDash (App de Gestão Financeira)

## 1. Visão Geral do Projeto

O FinDash é um sistema de gerenciamento financeiro pessoal focado em dar ao usuário controle total sobre seu dinheiro, misturando a precisão da inserção manual com a conveniência da automação bancária. O sistema operará através de um aplicativo móvel (front-end) consumindo uma API RESTful (back-end).

## 2. Atores do Sistema

- **Usuário Final:** Pessoa física que utilizará o aplicativo no dia a dia para registrar, importar e analisar suas finanças. O sistema é, por padrão, *single-tenant* focado no indivíduo (cada usuário enxerga apenas os próprios dados).

## 3. Módulos e Funcionalidades (Requisitos Funcionais)

### 3.1. Módulo de Contas Bancárias (Carteiras)

- **Cadastro de Contas:** O usuário pode criar múltiplas contas (Ex: Carteira Física, Nubank, Banco Inter, Corretora de Investimentos).
- **Transferências Internas:** Possibilidade de transferir saldos entre as próprias contas sem que isso conte como uma "Despesa" ou "Receita" no fluxo de caixa geral.
- **Visibilidade de Saldo:** O usuário pode marcar se o saldo de uma conta específica deve ou não ser somado ao Saldo Total visível no Dashboard (ideal para ocultar contas de investimento do dinheiro do dia a dia).

### 3.2. Módulo de Transações (Receitas e Despesas Manuais)

- **Lançamentos Básicos:** Inserção de valor (usando interface de calculadora), data, descrição e conta vinculada.
- **Classificação:** Associação obrigatória a uma Categoria e associação opcional a múltiplas Tags (Ex: Categoria "Alimentação", Tag "#viagem-sp").
- **Status da Transação:** Marcar como "Efetivada" (Paga/Recebida) ou "Pendente" (Lançamento Futuro).
- **Recorrência e Parcelamento:** Suporte para despesas/receitas fixas mensais e para compras parceladas.
- **Anexos:** Espaço para notas de texto adicionais e upload de foto do comprovante/nota fiscal (armazenamento em Base64 ou serviço de storage).

### 3.3. Módulo de Cartões de Crédito e Faturas

- **Cadastro de Cartões:** Criação de cartões de crédito informando a data de fechamento e a data de vencimento padrão da fatura.
- **Despesas no Crédito:** Lançamento de despesas vinculadas a um cartão (e não a uma conta). Essas despesas herdam categorização, tags e anexos.
- **Gestão de Faturas:** Agrupamento automático das despesas na fatura correta com base na data da compra e data de fechamento do cartão.
- **Pagamento de Faturas:** Fluxo de pagamento onde o usuário escolhe de qual Conta Corrente o dinheiro sairá para pagar a fatura (integralmente ou parcialmente).

### 3.4. Módulo de Importação Inteligente (CSVs)

- **Upload de Arquivo:** Interface para envio de arquivos CSV gerados por bancos.
- **Parsers Específicos:** O back-end saberá ler e padronizar nativamente os formatos de:
  - Nubank
  - Mercado Pago
  - Banco Inter
- **Motor Anti-Duplicidade:** Algoritmo de geração de *hash* para identificar transações. Caso um arquivo importado contenha transações que já existem no banco de dados, o sistema irá ignorá-las automaticamente para não inflar o saldo.

### 3.5. Módulo de Dashboard e Relatórios

- **Visão Geral:** Exibição do Saldo Total (respeitando a regra de ocultar contas), Total de Receitas e Total de Despesas do mês vigente.
- **Visão Diária e Mensal:** Extrato cronológico mostrando o fluxo de caixa do dia a dia.
- **Orçamentos e Metas (Budgets):** Definição de limites de gastos por categoria no mês, com barra de progresso visual.
- **Previsão do Futuro:** Tela dedicada para visualizar contas a pagar e a receber nos próximos dias/meses.

### 3.6. Segurança e Notificações

- **Bloqueio Biométrico:** Suporte a FaceID/TouchID ao abrir o aplicativo.
- **Alertas:** Notificações locais avisando sobre o vencimento de faturas de cartão e contas a pagar cadastradas no sistema.

## 4. Requisitos Não Funcionais (Stack e Arquitetura)

- **Linguagem Ubíqua:** Todo o código (variáveis, tabelas, métodos) e documentação deverão ser escritos em **Português do Brasil (PT-BR)** para garantir proximidade com o negócio.
- **Front-end:** Flutter (Dart) com arquitetura limpa.
- **Back-end:** NestJS (Node.js + TypeScript).
- **Banco de Dados:** PostgreSQL, gerenciado via Prisma ORM.
- **Infraestrutura:** Docker para conteinerização da API e do Banco de Dados. Repositório organizado no padrão Monorepo.
