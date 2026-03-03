# Testes da API

Este diretorio contem testes da API com foco em regras de negocio e contratos de aplicacao.

## Objetivo

- Validar cenarios de contas com dados 100% simulados.
- Permitir TDD sem dependencia de banco, fila, cache ou servicos externos.
- Garantir que os testes cubram comportamento esperado antes da implementacao final.

## Estrutura atual

```text
tipos/
└── contas/
    └── conta.tipos.ts

testes/
└── contas/
    ├── conta.dados-simulados.ts
    └── conta.casos-de-uso.spec.ts
```

## Convencoes

- Arquivos de teste: `*.spec.ts`
- Dados simulados centralizados por contexto: `*.dados-simulados.ts`
- Tipos centralizados exclusivamente em `apps/api/tipos`
- Nao usar dados reais em teste (email real, senha real, IDs reais).
- Cada teste deve seguir o padrao `Preparar -> Executar -> Validar`.
- Nomes de pastas, arquivos e identificadores devem ser em Portugues do Brasil.

## Escopo dos testes de contas

- Criacao de conta
- Criacao de conta com email duplicado (deve falhar)
- Criacao de conta com usuario duplicado (deve falhar)
- Delecao de conta
- Edicao de senha
- Edicao de senha fraca/invalida (deve falhar)
- Alteracao de nome
- Alteracao de nome vazio ou abaixo do minimo (deve falhar)
- Solicitacao de recuperacao de senha
- Recuperacao para email inexistente com resposta generica

## Recomendacoes praticas

- Preferir dados simulados tipados (`jest.Mocked<T>`) para manter seguranca de tipos.
- Reaproveitar dados simulados para evitar duplicacao.
- Separar testes unitarios (casos de uso) de testes de integracao (infraestrutura real).

## Execucao

Quando o `apps/api` estiver com o ambiente Node/NestJS configurado, execute os testes com o comando padrao do projeto (exemplo: `npm test` ou `pnpm test`).
