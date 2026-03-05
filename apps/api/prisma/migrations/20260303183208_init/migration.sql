-- CreateEnum
CREATE TYPE "StatusUsuario" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "TipoCarteira" AS ENUM ('CONTA_CORRENTE', 'CONTA_PAGAMENTO', 'CARTEIRA_DIGITAL', 'CARTAO_CREDITO', 'DINHEIRO');

-- CreateEnum
CREATE TYPE "ModoMovimentacao" AS ENUM ('CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'TRANSFERENCIA', 'BOLETO', 'DINHEIRO', 'AJUSTE');

-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('ENTRADA', 'SAIDA');

-- CreateEnum
CREATE TYPE "ModoParcelamento" AS ENUM ('FIXO', 'DILUIDO');

-- CreateEnum
CREATE TYPE "FonteOrigemMovimentacao" AS ENUM ('NUBANK', 'INTER', 'MERCADO_PAGO', 'MANUAL');

-- CreateEnum
CREATE TYPE "StatusImportacaoCsv" AS ENUM ('PENDENTE', 'PROCESSANDO', 'CONCLUIDA', 'CONCLUIDA_COM_ERROS', 'FALHA');

-- CreateEnum
CREATE TYPE "StatusItemImportacaoCsv" AS ENUM ('PROCESSADO', 'IGNORADO_DUPLICADO', 'ERRO');

-- CreateEnum
CREATE TYPE "BandeiraCartao" AS ENUM ('VISA', 'MASTERCARD', 'ELO', 'AMEX', 'HIPERCARD', 'OUTRA');

-- CreateEnum
CREATE TYPE "StatusParcela" AS ENUM ('ABERTA', 'PAGA');

-- CreateEnum
CREATE TYPE "PeriodicidadeRecorrencia" AS ENUM ('MENSAL', 'SEMANAL');

-- CreateEnum
CREATE TYPE "StatusOcorrenciaRecorrencia" AS ENUM ('PENDENTE', 'LANCADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "CategoriaOrcamento" AS ENUM ('ALIMENTACAO', 'MORADIA', 'TRANSPORTE', 'SAUDE', 'LAZER', 'EDUCACAO', 'OUTROS');

-- CreateEnum
CREATE TYPE "TipoRegistroOrcamento" AS ENUM ('CONSUMO', 'ESTORNO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "status" "StatusUsuario" NOT NULL DEFAULT 'ATIVO',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "removido_em" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_recuperacao_senha" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expiracao_em" TIMESTAMP(3) NOT NULL,
    "utilizado_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_recuperacao_senha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carteiras" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo_carteira" "TipoCarteira" NOT NULL,
    "moeda" TEXT NOT NULL DEFAULT 'BRL',
    "saldo_inicial" DECIMAL(18,2) NOT NULL,
    "saldo_atual" DECIMAL(18,2) NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "arquivada" BOOLEAN NOT NULL DEFAULT false,
    "criada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizada_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carteiras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimentacoes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "carteira_id" TEXT NOT NULL,
    "modo" "ModoMovimentacao" NOT NULL,
    "tipo" "TipoMovimentacao" NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_movimentacao" TIMESTAMP(3) NOT NULL,
    "saldo_pos_movimento_origem" DECIMAL(18,2),
    "id_origem" TEXT,
    "fonte_origem" "FonteOrigemMovimentacao" NOT NULL,
    "parcelamento_modo" "ModoParcelamento",
    "parcelamento_quantidade" INTEGER,
    "parcelamento_valor_parcela_fixa" DECIMAL(18,2),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transferencias_internas" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "carteira_origem_id" TEXT NOT NULL,
    "carteira_destino_id" TEXT NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_movimentacao" TIMESTAMP(3) NOT NULL,
    "movimentacao_debito_id" TEXT NOT NULL,
    "movimentacao_credito_id" TEXT NOT NULL,
    "criada_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transferencias_internas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "importacoes_csv" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "carteira_id" TEXT NOT NULL,
    "fonte_origem" "FonteOrigemMovimentacao" NOT NULL,
    "hash_arquivo" TEXT NOT NULL,
    "status" "StatusImportacaoCsv" NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizado_em" TIMESTAMP(3),

    CONSTRAINT "importacoes_csv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itens_importacao_csv" (
    "id" TEXT NOT NULL,
    "importacao_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "carteira_id" TEXT NOT NULL,
    "movimentacao_id" TEXT,
    "fonte_origem" "FonteOrigemMovimentacao" NOT NULL,
    "chave_deduplicacao" TEXT NOT NULL,
    "id_origem" TEXT,
    "status" "StatusItemImportacaoCsv" NOT NULL,
    "motivo_erro" TEXT,
    "linha_original" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_importacao_csv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cartoes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "bandeira" "BandeiraCartao" NOT NULL,
    "limite_total" DECIMAL(18,2) NOT NULL,
    "dia_fechamento" INTEGER NOT NULL,
    "dia_vencimento" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cartoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faturas_cartao" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "cartao_id" TEXT NOT NULL,
    "referencia" TEXT NOT NULL,
    "data_fechamento" TIMESTAMP(3) NOT NULL,
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "valor_compras" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "valor_juros_manual" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "valor_total" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faturas_cartao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compras_cartao" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "cartao_id" TEXT NOT NULL,
    "fatura_destino_id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor_total" DECIMAL(18,2) NOT NULL,
    "data_compra" TIMESTAMP(3) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compras_cartao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcelas_compra_cartao" (
    "id" TEXT NOT NULL,
    "compra_id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "status" "StatusParcela" NOT NULL DEFAULT 'ABERTA',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parcelas_compra_cartao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lancamentos_recorrentes" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "carteira_id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "modo" "ModoMovimentacao" NOT NULL,
    "tipo" "TipoMovimentacao" NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,
    "periodicidade" "PeriodicidadeRecorrencia" NOT NULL,
    "dia_execucao" INTEGER NOT NULL,
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "pausado" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lancamentos_recorrentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ocorrencias_lancamento_recorrente" (
    "id" TEXT NOT NULL,
    "recorrencia_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "competencia" TEXT NOT NULL,
    "data_prevista" TIMESTAMP(3) NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,
    "status" "StatusOcorrenciaRecorrencia" NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ocorrencias_lancamento_recorrente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orcamentos_categoria" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "categoria" "CategoriaOrcamento" NOT NULL,
    "competencia" TEXT NOT NULL,
    "moeda" TEXT NOT NULL DEFAULT 'BRL',
    "limite_mensal" DECIMAL(18,2) NOT NULL,
    "valor_consumido" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "percentual_consumido" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "alertas_ativos" JSONB NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orcamentos_categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_orcamento" (
    "id" TEXT NOT NULL,
    "orcamento_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "id_movimentacao" TEXT NOT NULL,
    "tipo_registro" "TipoRegistroOrcamento" NOT NULL,
    "valor" DECIMAL(18,2) NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_orcamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visibilidades_carteira_consolidado" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "carteira_id" TEXT NOT NULL,
    "visivel" BOOLEAN NOT NULL DEFAULT true,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visibilidades_carteira_consolidado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_usuario_key" ON "usuarios"("usuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_recuperacao_senha_token_hash_key" ON "tokens_recuperacao_senha"("token_hash");

-- CreateIndex
CREATE INDEX "tokens_recuperacao_senha_usuario_id_idx" ON "tokens_recuperacao_senha"("usuario_id");

-- CreateIndex
CREATE INDEX "carteiras_usuario_id_idx" ON "carteiras"("usuario_id");

-- CreateIndex
CREATE INDEX "carteiras_usuario_id_ativa_arquivada_idx" ON "carteiras"("usuario_id", "ativa", "arquivada");

-- CreateIndex
CREATE UNIQUE INDEX "uk_carteira_usuario_nome" ON "carteiras"("usuario_id", "nome");

-- CreateIndex
CREATE INDEX "movimentacoes_usuario_id_idx" ON "movimentacoes"("usuario_id");

-- CreateIndex
CREATE INDEX "movimentacoes_usuario_id_carteira_id_idx" ON "movimentacoes"("usuario_id", "carteira_id");

-- CreateIndex
CREATE INDEX "movimentacoes_usuario_id_data_movimentacao_idx" ON "movimentacoes"("usuario_id", "data_movimentacao");

-- CreateIndex
CREATE INDEX "movimentacoes_usuario_id_carteira_id_fonte_origem_id_origem_idx" ON "movimentacoes"("usuario_id", "carteira_id", "fonte_origem", "id_origem");

-- CreateIndex
CREATE UNIQUE INDEX "transferencias_internas_movimentacao_debito_id_key" ON "transferencias_internas"("movimentacao_debito_id");

-- CreateIndex
CREATE UNIQUE INDEX "transferencias_internas_movimentacao_credito_id_key" ON "transferencias_internas"("movimentacao_credito_id");

-- CreateIndex
CREATE INDEX "transferencias_internas_usuario_id_idx" ON "transferencias_internas"("usuario_id");

-- CreateIndex
CREATE INDEX "transferencias_internas_usuario_id_data_movimentacao_idx" ON "transferencias_internas"("usuario_id", "data_movimentacao");

-- CreateIndex
CREATE INDEX "importacoes_csv_usuario_id_carteira_id_idx" ON "importacoes_csv"("usuario_id", "carteira_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_importacao_hash_usuario_carteira" ON "importacoes_csv"("usuario_id", "carteira_id", "hash_arquivo");

-- CreateIndex
CREATE INDEX "itens_importacao_csv_importacao_id_idx" ON "itens_importacao_csv"("importacao_id");

-- CreateIndex
CREATE INDEX "itens_importacao_csv_usuario_id_carteira_id_idx" ON "itens_importacao_csv"("usuario_id", "carteira_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_deduplicacao_item_importacao" ON "itens_importacao_csv"("usuario_id", "carteira_id", "fonte_origem", "chave_deduplicacao");

-- CreateIndex
CREATE INDEX "cartoes_usuario_id_idx" ON "cartoes"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_cartao_usuario_nome" ON "cartoes"("usuario_id", "nome");

-- CreateIndex
CREATE INDEX "faturas_cartao_usuario_id_cartao_id_idx" ON "faturas_cartao"("usuario_id", "cartao_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_fatura_cartao_referencia" ON "faturas_cartao"("cartao_id", "referencia");

-- CreateIndex
CREATE INDEX "compras_cartao_usuario_id_cartao_id_idx" ON "compras_cartao"("usuario_id", "cartao_id");

-- CreateIndex
CREATE INDEX "compras_cartao_fatura_destino_id_idx" ON "compras_cartao"("fatura_destino_id");

-- CreateIndex
CREATE INDEX "parcelas_compra_cartao_data_vencimento_idx" ON "parcelas_compra_cartao"("data_vencimento");

-- CreateIndex
CREATE UNIQUE INDEX "uk_parcela_compra_numero" ON "parcelas_compra_cartao"("compra_id", "numero");

-- CreateIndex
CREATE INDEX "lancamentos_recorrentes_usuario_id_idx" ON "lancamentos_recorrentes"("usuario_id");

-- CreateIndex
CREATE INDEX "lancamentos_recorrentes_usuario_id_ativo_pausado_idx" ON "lancamentos_recorrentes"("usuario_id", "ativo", "pausado");

-- CreateIndex
CREATE INDEX "ocorrencias_lancamento_recorrente_usuario_id_competencia_idx" ON "ocorrencias_lancamento_recorrente"("usuario_id", "competencia");

-- CreateIndex
CREATE UNIQUE INDEX "uk_ocorrencia_recorrencia_competencia" ON "ocorrencias_lancamento_recorrente"("recorrencia_id", "competencia");

-- CreateIndex
CREATE INDEX "orcamentos_categoria_usuario_id_competencia_idx" ON "orcamentos_categoria"("usuario_id", "competencia");

-- CreateIndex
CREATE UNIQUE INDEX "uk_orcamento_categoria_competencia" ON "orcamentos_categoria"("usuario_id", "categoria", "competencia");

-- CreateIndex
CREATE INDEX "registros_orcamento_usuario_id_idx" ON "registros_orcamento"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "uk_registro_orcamento_movimento_tipo" ON "registros_orcamento"("orcamento_id", "id_movimentacao", "tipo_registro");

-- CreateIndex
CREATE INDEX "visibilidades_carteira_consolidado_usuario_id_visivel_idx" ON "visibilidades_carteira_consolidado"("usuario_id", "visivel");

-- CreateIndex
CREATE UNIQUE INDEX "uk_visibilidade_usuario_carteira" ON "visibilidades_carteira_consolidado"("usuario_id", "carteira_id");

-- AddForeignKey
ALTER TABLE "tokens_recuperacao_senha" ADD CONSTRAINT "tokens_recuperacao_senha_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carteiras" ADD CONSTRAINT "carteiras_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes" ADD CONSTRAINT "movimentacoes_carteira_id_fkey" FOREIGN KEY ("carteira_id") REFERENCES "carteiras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias_internas" ADD CONSTRAINT "transferencias_internas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias_internas" ADD CONSTRAINT "transferencias_internas_carteira_origem_id_fkey" FOREIGN KEY ("carteira_origem_id") REFERENCES "carteiras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias_internas" ADD CONSTRAINT "transferencias_internas_carteira_destino_id_fkey" FOREIGN KEY ("carteira_destino_id") REFERENCES "carteiras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias_internas" ADD CONSTRAINT "transferencias_internas_movimentacao_debito_id_fkey" FOREIGN KEY ("movimentacao_debito_id") REFERENCES "movimentacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transferencias_internas" ADD CONSTRAINT "transferencias_internas_movimentacao_credito_id_fkey" FOREIGN KEY ("movimentacao_credito_id") REFERENCES "movimentacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "importacoes_csv" ADD CONSTRAINT "importacoes_csv_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "importacoes_csv" ADD CONSTRAINT "importacoes_csv_carteira_id_fkey" FOREIGN KEY ("carteira_id") REFERENCES "carteiras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_importacao_csv" ADD CONSTRAINT "itens_importacao_csv_importacao_id_fkey" FOREIGN KEY ("importacao_id") REFERENCES "importacoes_csv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_importacao_csv" ADD CONSTRAINT "itens_importacao_csv_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_importacao_csv" ADD CONSTRAINT "itens_importacao_csv_carteira_id_fkey" FOREIGN KEY ("carteira_id") REFERENCES "carteiras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itens_importacao_csv" ADD CONSTRAINT "itens_importacao_csv_movimentacao_id_fkey" FOREIGN KEY ("movimentacao_id") REFERENCES "movimentacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartoes" ADD CONSTRAINT "cartoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faturas_cartao" ADD CONSTRAINT "faturas_cartao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faturas_cartao" ADD CONSTRAINT "faturas_cartao_cartao_id_fkey" FOREIGN KEY ("cartao_id") REFERENCES "cartoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras_cartao" ADD CONSTRAINT "compras_cartao_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras_cartao" ADD CONSTRAINT "compras_cartao_cartao_id_fkey" FOREIGN KEY ("cartao_id") REFERENCES "cartoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras_cartao" ADD CONSTRAINT "compras_cartao_fatura_destino_id_fkey" FOREIGN KEY ("fatura_destino_id") REFERENCES "faturas_cartao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcelas_compra_cartao" ADD CONSTRAINT "parcelas_compra_cartao_compra_id_fkey" FOREIGN KEY ("compra_id") REFERENCES "compras_cartao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos_recorrentes" ADD CONSTRAINT "lancamentos_recorrentes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos_recorrentes" ADD CONSTRAINT "lancamentos_recorrentes_carteira_id_fkey" FOREIGN KEY ("carteira_id") REFERENCES "carteiras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias_lancamento_recorrente" ADD CONSTRAINT "ocorrencias_lancamento_recorrente_recorrencia_id_fkey" FOREIGN KEY ("recorrencia_id") REFERENCES "lancamentos_recorrentes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencias_lancamento_recorrente" ADD CONSTRAINT "ocorrencias_lancamento_recorrente_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamentos_categoria" ADD CONSTRAINT "orcamentos_categoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_orcamento" ADD CONSTRAINT "registros_orcamento_orcamento_id_fkey" FOREIGN KEY ("orcamento_id") REFERENCES "orcamentos_categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_orcamento" ADD CONSTRAINT "registros_orcamento_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visibilidades_carteira_consolidado" ADD CONSTRAINT "visibilidades_carteira_consolidado_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visibilidades_carteira_consolidado" ADD CONSTRAINT "visibilidades_carteira_consolidado_carteira_id_fkey" FOREIGN KEY ("carteira_id") REFERENCES "carteiras"("id") ON DELETE CASCADE ON UPDATE CASCADE;
