# Testes da API

Este diretorio contem testes da API com foco em regras de negocio e contratos de aplicacao.

## Objetivo

- Validar cenarios de contas e importacao de CSV com dados 100% simulados.
- Permitir TDD sem dependencia de banco, fila, cache ou servicos externos.
- Garantir que os testes cubram comportamento esperado antes da implementacao final.

## Estrutura atual

```text
tipos/
├── contas/
│   └── conta.tipos.ts
└── csv/
    └── csv-bancario.tipos.ts

testes/
├── contas/
│   ├── conta.dados-simulados.ts
│   └── conta.casos-de-uso.spec.ts
└── csv/
    ├── csv-bancario.dados-simulados.ts
    └── csv-bancario.casos-de-uso.spec.ts
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

## Escopo dos testes de CSV bancario

- Nubank: importacao valida
- Nubank: falha por coluna obrigatoria ausente
- Nubank: falha por data invalida
- Nubank: falha por valor invalido
- Inter: ignora cabecalho extra
- Inter: importacao valida com saldo por linha
- Inter: falha por coluna obrigatoria ausente
- Inter: falha por data invalida
- Mercado Pago: ignora resumo inicial
- Mercado Pago: importacao valida com identificador de referencia
- Mercado Pago: falha por coluna obrigatoria ausente
- Mercado Pago: falha por data invalida
- Padronizacao para modelo canonico
- Robustez para valor nao numerico
- Robustez para delimitador invalido

## Recomendacoes praticas

- Preferir dados simulados tipados (`jest.Mocked<T>`) para manter seguranca de tipos.
- Reaproveitar dados simulados para evitar duplicacao.
- Separar testes unitarios (casos de uso) de testes de integracao (infraestrutura real).

## Execucao

Quando o `apps/api` estiver com o ambiente Node/NestJS configurado, execute os testes com o comando padrao do projeto (exemplo: `npm test` ou `pnpm test`).
