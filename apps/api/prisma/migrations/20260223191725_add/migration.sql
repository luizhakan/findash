-- CreateEnum
CREATE TYPE "public"."TipoNotificacao" AS ENUM ('FATURA_VENCENDO', 'CONTA_PAGAMENTO', 'LEMBRETE_CUSTOMIZADO', 'IMPORTACAO_CONCLUIDA');

-- AlterTable
ALTER TABLE "public"."usuarios" ADD COLUMN     "biometria_habilitada" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."notificacoes" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "tipo" "public"."TipoNotificacao" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "data_agendada" TIMESTAMP(3) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "lido" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."notificacoes" ADD CONSTRAINT "notificacoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
