# Código de Conduta e Boas Práticas - FinDash

Este documento estabelece os padrões arquiteturais e de código para todo o desenvolvimento do FinDash. Qualquer desenvolvedor (humano ou Inteligência Artificial) deve seguir estas regras estritamente.

## 1. Idioma e Nomenclatura (Domain-Driven Design)

- **Domínio em PT-BR:** Nomes de variáveis, tabelas do banco, classes de modelo e funções que representam regras de negócio **devem** ser em Português (ex: `Fatura`, `calcularSaldo()`, `Usuario`).
- **Sufixos Técnicos em Inglês:** Padrões de arquitetura e design patterns mantêm seu nome original. Misture os dois de forma clara (ex: `FaturaController`, `UsuarioService`, `TransacaoRepository`, `CreateTransacaoDto`).
- **Padrões de Caixa:**
  - `camelCase`: Variáveis e funções (ex: `buscarFatura`).
  - `PascalCase`: Classes e Interfaces (ex: `UsuarioService`).
  - `UPPER_SNAKE_CASE`: Constantes e Enums (ex: `STATUS_PAGO`).

## 2. Back-end (NestJS)

- **Uso do CLI:** Todo novo módulo, controller ou service deve ser gerado pelo CLI do NestJS (`nest g resource ...`) para manter a consistência dos arquivos `.spec` e atualizações automáticas nos módulos.
- **Responsabilidade Única (Clean Architecture):**
  - **Controllers:** Só devem receber a requisição, validar dados básicos e chamar o Service. Proibido regras de negócio no Controller.
  - **Services:** Onde a mágica acontece. Toda a regra de negócio (cálculos de fatura, regras de limite) fica aqui.
  - **Prisma (Data Access):** O Service chama o Prisma. Evite fazer chamadas pesadas ao Prisma diretamente nos Controllers.
- **Validação (DTOs):** Toda entrada de dados deve ser validada usando `class-validator` e `class-transformer` através de Data Transfer Objects (DTOs). Proibido usar `any`.

## 3. Banco de Dados e ORM (Prisma)

- **Migrations:** É estritamente proibido alterar a estrutura do banco de dados manualmente via SQL ou ferramentas visuais. Toda alteração de tabela/coluna deve ser feita no `schema.prisma` rodando o comando `npx prisma migrate dev`.
- **Sem exclusão física (Soft Delete):** (Opcional, mas recomendado) Evite deletar registros financeiros. Prefira usar um campo booleano `ativo: false` ou `deletadoEm: DateTime`.

## 4. Front-end (Kotlin)

- **Gerenciamento de Estado:** (Definir o padrão, ex: `ViewModel`, `Jetpack Compose` ou `MVVM`). Nenhuma regra de negócio deve ficar solta dentro das Activities/Fragments.
- **Componentização:** Se um Widget (ex: um botão personalizado ou um card de transação) for usado mais de duas vezes, ele deve ser extraído para uma pasta `core/ui/widgets`.
- **Separação de Camadas:**
  - `data/`: Modelos, Repositórios e chamadas de API (Dio/HTTP).
  - `domain/`: Regras de negócio puras (UseCases).
  - `presentation/`: Telas e Widgets.

## 5. Versionamento (Git)

Utilizamos o padrão **Conventional Commits**. As mensagens de commit devem seguir o formato:

- `feat:` (nova funcionalidade)
- `fix:` (correção de bug)
- `refactor:` (refatoração de código sem mudar comportamento)
- `docs:` (alterações na documentação)
- `chore:` (atualização de pacotes, docker, configs)

Exemplo: `feat: adiciona algoritmo de geracao de hash para importacao de csv`

---
