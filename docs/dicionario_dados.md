# Dicionário de Dados - FinDash

Este documento descreve a estrutura das tabelas do banco de dados relacional (PostgreSQL) do sistema, focando nas regras de negócio de transações, contas e cartões de crédito.

## 1. Tabelas de Domínio Principal

### 1.1. `Usuario`

Armazena os dados do dono da conta. O sistema é multilocatário (multi-tenant) a nível de banco, mas cada usuário só vê seus dados.

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador único do usuário. |
| `nome` | String | Not Null | Nome completo ou apelido. |
| `email` | String | Unique, Not Null | E-mail para login. |
| `senha_hash` | String | Not Null | Hash da senha para autenticação. |
| `criado_em` | DateTime | Default Now() | Data de registro no app. |

### 1.2. `Conta` (Carteiras/Bancos)

Representa os locais físicos ou virtuais onde o usuário possui saldo (ex: Nubank, Inter, Dinheiro Físico).

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador único da conta. |
| `usuario_id` | UUID | FK | Referência ao `Usuario`. |
| `nome` | String | Not Null | Nome da conta (Ex: "Conta Corrente Inter"). |
| `saldo_inicial` | Decimal | Default 0.0 | Saldo base inicial da conta (para cálculos). |
| `incluir_soma_total` | Boolean | Default True | Se `false`, o saldo não aparece no painel geral. |
| `cor_hex` | String | Nullable | Cor para identificação no Front-end (Ex: "#8A05BE"). |

### 1.3. `CartaoCredito`

Representa um cartão de crédito. Não possui "saldo", mas sim limite e gera faturas mensais.

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador único do cartão. |
| `usuario_id` | UUID | FK | Referência ao `Usuario`. |
| `nome` | String | Not Null | Nome do cartão (Ex: "Cartão Nubank"). |
| `limite` | Decimal | Not Null | Limite total concedido. |
| `dia_fechamento` | Int | 1 a 31 | Dia em que a fatura "vira". |
| `dia_vencimento` | Int | 1 a 31 | Dia limite para o pagamento. |
| `conta_pagamento_id` | UUID | FK (Nullable) | Conta padrão de onde o dinheiro sai para pagar a fatura. |

### 1.4. `Fatura`

Gerada automaticamente (ou sob demanda) para agrupar as despesas de um cartão em um mês específico.

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador único da fatura. |
| `cartao_id` | UUID | FK | Referência ao `CartaoCredito`. |
| `mes` | Int | 1 a 12 | Mês de referência da fatura. |
| `ano` | Int | Ex: 2026 | Ano de referência. |
| `status` | Enum | ABERTA, FECHADA, PAGA | Situação atual da fatura. |

---

## 2. Tabelas de Movimentação

### 2.1. `Transacao`

A tabela mais importante do sistema. Centraliza Receitas, Despesas de Conta, Despesas de Cartão e Transferências. A unificação facilita relatórios gerais.

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador único. |
| `usuario_id` | UUID | FK | Referência ao dono da transação. |
| `tipo` | Enum | Not Null | `RECEITA`, `DESPESA`, `TRANSFERENCIA`. |
| `status` | Enum | Not Null | `EFETIVADA`, `PENDENTE`. |
| `valor` | Decimal | Not Null | Valor absoluto da transação. |
| `data_ocorrencia` | DateTime | Not Null | Data e hora em que a transação ocorreu/ocorrerá. |
| `descricao` | String | Not Null | Nome ou histórico da transação. |
| `conta_id` | UUID | FK (Nullable) | Conta de origem (obrigatório se não for no Cartão). |
| `conta_destino_id` | UUID | FK (Nullable) | Conta de destino (usado apenas se `tipo = TRANSFERENCIA`). |
| `fatura_id` | UUID | FK (Nullable) | Fatura vinculada (se for uma despesa no Cartão de Crédito). |
| `categoria_id` | UUID | FK (Nullable) | Referência à `Categoria`. |
| `parcela_atual` | Int | Nullable | Indica a parcela atual (Ex: 1 de 12). |
| `total_parcelas` | Int | Nullable | Quantidade total de parcelas (Ex: 12). |
| `hash_importacao` | String | Unique, Nullable | Hash MD5/SHA256 usado para evitar duplicidade via CSV. |
| `notas` | Text | Nullable | Observações em texto livre. |
| `anexo_base64` | Text | Nullable | Foto do recibo/nota fiscal (em base64 ou URL de storage). |

---

## 3. Tabelas de Apoio (Classificação)

### 3.1. `Categoria`

Organiza as transações (Ex: Alimentação, Transporte, Salário).

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador da categoria. |
| `usuario_id` | UUID | FK | Para categorias customizadas pelo usuário. |
| `nome` | String | Not Null | Nome da categoria. |
| `tipo` | Enum | RECEITA, DESPESA | Se a categoria é para ganho ou gasto. |
| `cor_hex` | String | Nullable | Cor de exibição no app. |
| `icone` | String | Nullable | Nome do ícone (Ex: "fast-food"). |

### 3.2. `Tag` e `Transacao_Tag` (N:M)

Permite que uma mesma transação tenha múltiplas tags (Ex: `#viagem-sp`, `#trabalho`).

**Tabela `Tag`**

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `id` | UUID | PK | Identificador. |
| `usuario_id` | UUID | FK | Dono da tag. |
| `nome` | String | Not Null | Nome (Ex: "viagem-sp"). |

**Tabela `Transacao_Tag` (Tabela Pivô)**

| Coluna | Tipo | Restrições | Descrição |
| --- | --- | --- | --- |
| `transacao_id` | UUID | FK, PK composta | Referência à Transação. |
| `tag_id` | UUID | FK, PK composta | Referência à Tag. |

---

## 4. Regras de Negócio Aplicadas no Modelo

1. **Despesa Comum:** Cria-se uma `Transacao` com `tipo = DESPESA`, apontando para `conta_id`. O `fatura_id` fica nulo.
2. **Despesa no Crédito:** Cria-se uma `Transacao` com `tipo = DESPESA`, apontando para uma `fatura_id`. O `conta_id` fica nulo.
3. **Transferência:** Cria-se uma `Transacao` com `tipo = TRANSFERENCIA`, preenchendo tanto `conta_id` (de onde sai) quanto `conta_destino_id` (pra onde vai).
4. **Pagamento da Fatura:** Cria-se uma `Transacao` comum (saída da Conta), e o back-end atualiza o `status` da tabela `Fatura` para `PAGA`.
