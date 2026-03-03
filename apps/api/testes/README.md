# Testes da API

Este diretorio contem testes da API com foco em regras de negocio e contratos de aplicacao.

## Objetivo

- Validar cenarios de contas e importacao de CSV com dados 100% simulados.
- Permitir TDD sem dependencia de banco, fila, cache ou servicos externos.
- Garantir que os testes cubram comportamento esperado antes da implementacao final.

## Estrutura atual

```text
tipos/
├── sistema/
│   └── financeiro.tipos.ts
├── contas/
│   └── conta.tipos.ts
├── cartoes/
│   └── cartao.tipos.ts
├── carteiras/
│   └── carteira.tipos.ts
├── transferencias/
│   └── transferencia-entre-carteiras.tipos.ts
├── recorrencias/
│   └── lancamento-recorrente.tipos.ts
├── orcamentos/
│   └── orcamento-categoria.tipos.ts
├── saldos/
│   └── saldo-consolidado.tipos.ts
└── csv/
    └── csv-bancario.tipos.ts

testes/
├── contas/
│   ├── conta.dados-simulados.ts
│   └── conta.casos-de-uso.spec.ts
├── cartoes/
│   ├── cartao.dados-simulados.ts
│   └── cartao.casos-de-uso.spec.ts
├── carteiras/
│   ├── carteira.dados-simulados.ts
│   └── carteira.casos-de-uso.spec.ts
├── transferencias/
│   ├── transferencia-entre-carteiras.dados-simulados.ts
│   └── transferencia-entre-carteiras.casos-de-uso.spec.ts
├── recorrencias/
│   ├── lancamento-recorrente.dados-simulados.ts
│   └── lancamento-recorrente.casos-de-uso.spec.ts
├── orcamentos/
│   ├── orcamento-categoria.dados-simulados.ts
│   └── orcamento-categoria.casos-de-uso.spec.ts
├── saldos/
│   ├── saldo-consolidado.dados-simulados.ts
│   └── saldo-consolidado.casos-de-uso.spec.ts
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
- Adicao de despesa parcelada (fixo)
- Adicao de receita parcelada (diluido)
- Parcelamento de transferencia (fixo e diluido)
- Falha por quantidade de parcelas invalida

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

## Escopo dos testes de carteiras

- Criacao, listagem, busca, edicao e remocao com isolamento por usuario
- Bloqueio de acesso entre usuarios
- Arquivamento de carteira com preservacao de historico
- Atualizacao de saldo com entrada e saida
- Transferencia entre carteiras do mesmo usuario
- Bloqueio de transferencia entre usuarios diferentes
- Importacao de CSV com deduplicacao e isolamento por usuario/carteira
- Paginacao e ordenacao sem vazamento de dados
- Concorrencia em criacao de carteira e atualizacao de saldo
- Carga com muitos usuarios mantendo isolamento e tempo aceitavel
- Importacao de multiplos CSVs na propria carteira
- Bloqueio de importacao de CSV em carteira de outro usuario

## Escopo dos testes de cartoes

- Criacao de cartao com fechamento e vencimento obrigatorios
- Compra com fatura atual como padrao
- Compra com alocacao manual para fatura futura
- Edicao de compra com mudanca de fatura
- Fatura acima do limite permitida
- Juros manuais na fatura (adicionar, editar, remover)
- Total da fatura refletindo juros manuais
- Isolamento multiusuario em compras e faturas

## Escopo dos testes de transferencias entre carteiras

- Transferencia interna com debito e credito coerentes
- Saldo consolidado do usuario permanece igual apos transferencia interna
- Bloqueio de transferencia para carteira de outro usuario
- Bloqueio de transferencia para mesma carteira
- Bloqueio de transferencia com valor invalido
- Bloqueio de transferencia envolvendo carteira arquivada
- Listagem sem vazamento entre usuarios
- Carga com muitos usuarios mantendo isolamento

## Escopo dos testes de lancamentos recorrentes

- Criacao de recorrencia de despesa e de receita
- Bloqueio de criacao com valor invalido
- Geracao de ocorrencias por periodo
- Ajuste de data para meses curtos (exemplo: fevereiro)
- Pausa e reativacao de recorrencia
- Encerramento de recorrencia com data fim
- Edicao aplicada apenas para proximas ocorrencias
- Bloqueio de manipulacao de recorrencia de outro usuario
- Listagem sem vazamento entre usuarios
- Carga com muitos usuarios mantendo isolamento

## Escopo dos testes de orcamento por categoria

- Criacao de orcamento mensal por categoria
- Bloqueio de limite invalido
- Bloqueio de duplicidade no mesmo mes e categoria
- Permitido mesma categoria para usuarios diferentes
- Consumo com alertas de 80% e 100%
- Marcacao de acima do limite
- Estorno reduzindo consumo e recalculando alertas
- Edicao de limite recalculando percentual consumido
- Isolamento entre usuarios no consumo e na listagem
- Carga com muitos usuarios mantendo isolamento

## Escopo dos testes de saldo consolidado

- Soma de todas as carteiras visiveis por padrao
- Ocultar e reexibir carteiras no consolidado
- Saldo zero quando nenhuma carteira esta visivel
- Exclusao de carteiras arquivadas/inativas conforme regra
- Persistencia da visibilidade por usuario
- Nova carteira entra visivel por padrao
- Recalculo apos movimentacoes
- Isolamento entre usuarios no consolidado
- Carga multiusuario com tempo aceitavel

## Recomendacoes praticas

- Preferir dados simulados tipados (`jest.Mocked<T>`) para manter seguranca de tipos.
- Reaproveitar dados simulados para evitar duplicacao.
- Separar testes unitarios (casos de uso) de testes de integracao (infraestrutura real).

## Execucao

Quando o `apps/api` estiver com o ambiente Node/NestJS configurado, execute os testes com o comando padrao do projeto (exemplo: `npm test` ou `pnpm test`).
