-- CreateEnum
CREATE TYPE "public"."StatusFatura" AS ENUM ('ABERTA', 'FECHADA', 'PAGA');

-- CreateEnum
CREATE TYPE "public"."TipoTransacao" AS ENUM ('RECEITA', 'DESPESA', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "public"."StatusTransacao" AS ENUM ('EFETIVADA', 'PENDENTE');

-- CreateEnum
CREATE TYPE "public"."TipoCategoria" AS ENUM ('RECEITA', 'DESPESA');

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."contas" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "saldo_inicial" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "incluir_soma_total" BOOLEAN NOT NULL DEFAULT true,
    "cor_hex" TEXT,

    CONSTRAINT "contas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cartoes_credito" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "limite" DECIMAL(10,2) NOT NULL,
    "dia_fechamento" INTEGER NOT NULL,
    "dia_vencimento" INTEGER NOT NULL,
    "conta_pagamento_id" UUID,

    CONSTRAINT "cartoes_credito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."faturas" (
    "id" UUID NOT NULL,
    "cartao_id" UUID NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "status" "public"."StatusFatura" NOT NULL DEFAULT 'ABERTA',

    CONSTRAINT "faturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transacoes" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "tipo" "public"."TipoTransacao" NOT NULL,
    "status" "public"."StatusTransacao" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data_ocorrencia" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "conta_id" UUID,
    "conta_destino_id" UUID,
    "fatura_id" UUID,
    "categoria_id" UUID,
    "parcela_atual" INTEGER,
    "total_parcelas" INTEGER,
    "hash_importacao" TEXT,
    "notas" TEXT,
    "anexo_base64" TEXT,

    CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categorias" (
    "id" UUID NOT NULL,
    "usuario_id" UUID,
    "nome" TEXT NOT NULL,
    "tipo" "public"."TipoCategoria" NOT NULL,
    "cor_hex" TEXT,
    "icone" TEXT,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_TagToTransacao" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_TagToTransacao_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "faturas_cartao_id_mes_ano_key" ON "public"."faturas"("cartao_id", "mes", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "transacoes_hash_importacao_key" ON "public"."transacoes"("hash_importacao");

-- CreateIndex
CREATE INDEX "_TagToTransacao_B_index" ON "public"."_TagToTransacao"("B");

-- AddForeignKey
ALTER TABLE "public"."contas" ADD CONSTRAINT "contas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cartoes_credito" ADD CONSTRAINT "cartoes_credito_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cartoes_credito" ADD CONSTRAINT "cartoes_credito_conta_pagamento_id_fkey" FOREIGN KEY ("conta_pagamento_id") REFERENCES "public"."contas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."faturas" ADD CONSTRAINT "faturas_cartao_id_fkey" FOREIGN KEY ("cartao_id") REFERENCES "public"."cartoes_credito"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transacoes" ADD CONSTRAINT "transacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transacoes" ADD CONSTRAINT "transacoes_conta_id_fkey" FOREIGN KEY ("conta_id") REFERENCES "public"."contas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transacoes" ADD CONSTRAINT "transacoes_conta_destino_id_fkey" FOREIGN KEY ("conta_destino_id") REFERENCES "public"."contas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transacoes" ADD CONSTRAINT "transacoes_fatura_id_fkey" FOREIGN KEY ("fatura_id") REFERENCES "public"."faturas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transacoes" ADD CONSTRAINT "transacoes_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categorias" ADD CONSTRAINT "categorias_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tags" ADD CONSTRAINT "tags_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TagToTransacao" ADD CONSTRAINT "_TagToTransacao_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TagToTransacao" ADD CONSTRAINT "_TagToTransacao_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."transacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
