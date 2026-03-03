# Recomendacoes de Desenvolvimento (Arquitetura Limpa)

Este documento define diretrizes para evoluir a API mantendo baixa complexidade, alta testabilidade e independencia de framework.

## Principios base

- Regra de dependencia: dependencias sempre apontam para dentro (dominio nao conhece infra).
- Casos de uso representam regras de aplicacao e orquestram entidades e portas.
- Frameworks e banco sao detalhes de implementacao, nunca o centro do design.
- Mudancas em transporte (HTTP, gRPC) ou persistencia (Postgres, Prisma) nao devem quebrar dominio.

## Regra de idioma

- Todo codigo novo deve usar Portugues do Brasil em nomes de pastas, arquivos, classes, tipos, funcoes e variaveis.
- Documentacao tecnica interna tambem deve ser escrita em Portugues do Brasil.
- Termos de bibliotecas e APIs externas podem permanecer no idioma original apenas quando forem nomes proprios obrigatorios (ex.: `jest.Mocked`).

## Regra de tipos

- Todos os tipos do sistema devem ficar centralizados em `apps/api/tipos`.
- Evitar declarar tipos e interfaces dentro de arquivos de teste, dados simulados, controladores ou servicos.
- Sempre importar os tipos da pasta dedicada.

## Regra de simplicidade

- Evitar `overengineering`: implementar apenas o necessario para atender ao requisito atual.
- Nao criar camadas, abstracoes, testes ou fluxos extras sem necessidade concreta de negocio.
- Preferir solucao simples, legivel e com menor custo de manutencao.
- Se uma melhoria for apenas hipotetica, registrar como sugestao futura em vez de implementar agora.

## Organizacao por camadas

### 1. Dominio

- Entidades
- Objetos de Valor
- Regras invariantes
- Erros de dominio

Sem imports de NestJS, Prisma ou bibliotecas de transporte.

### 2. Aplicacao

- Casos de uso (ex.: `CriarConta`, `DeletarConta`, `EditarSenha`)
- Portas de entrada e saida (interfaces)
- DTOs internos de comando/resultado

Aqui fica a regra de negocio de alto nivel.

### 3. Infraestrutura

- Repositorios Prisma
- Provedores de hash/token/email
- Gateways externos

Implementa as interfaces definidas pela camada de Aplicacao.

### 4. Adaptadores de Interface

- Controladores HTTP
- Apresentadores / mapeadores de resposta
- Validacao de carga util de entrada

Traduz entrada/saida sem conter regra de negocio central.

## Regras para contas

- Nao persistir senha em texto puro. Sempre hash na borda de infraestrutura.
- Usuario e email devem ter validacao explicita no fluxo de aplicacao.
- Recuperacao de senha deve usar token com expiracao curta e uso unico.
- Alteracao de senha deve invalidar tokens antigos de recuperacao.

## Estrategia de testes

- Unitarios (dominantes): casos de uso com dados simulados de portas.
- Integracao: adaptadores de infraestrutura com banco isolado de teste.
- Contrato HTTP: controladores validando codigo de status, carga util e erros.
- Evitar e2e como primeira camada de seguranca; usar e2e para fluxos criticos.

## Padrao de pastas sugerido

```text
apps/api/src/
└── modulos/
    └── contas/
        ├── dominio/
        ├── aplicacao/
        ├── infraestrutura/
        └── interface/
```

## Lista de verificacao de PR

- Caso de uso novo tem teste unitario?
- Existe acoplamento indevido entre dominio e framework?
- Erros de negocio estao explicitos e mapeados para HTTP?
- Interfaces (portas) estao no lugar certo (aplicacao)?
- Dependencias concretas estao somente na infraestrutura?
- A implementacao evita `overengineering` e nao faz mais do que o necessario?
