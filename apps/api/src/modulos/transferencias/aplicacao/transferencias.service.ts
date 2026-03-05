import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "../../../infraestrutura/prisma/prisma.service";
import {
  garantirNumero,
  garantirString,
  paraDataIso,
} from "../../../infraestrutura/comum/conversao.util";

@Injectable()
export class TransferenciasService {
  constructor(private readonly prismaService: PrismaService) {}

  async transferirEntreCarteiras(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const carteiraOrigemId = garantirString(dados.carteira_origem_id, "carteira_origem_id") as string;
    const carteiraDestinoId = garantirString(dados.carteira_destino_id, "carteira_destino_id") as string;

    if (carteiraOrigemId === carteiraDestinoId) {
      throw new BadRequestException("Carteira de origem e destino nao podem ser iguais.");
    }

    const valor = garantirNumero(dados.valor, "valor") as number;
    if (valor <= 0) {
      throw new BadRequestException("Valor da transferencia deve ser maior que zero.");
    }

    const descricao = garantirString(dados.descricao, "descricao") as string;
    const dataMovimentacao = paraDataIso(
      garantirString(dados.data_movimentacao, "data_movimentacao") as string,
      "data_movimentacao",
    );

    const origem = await this.prismaService.carteira.findFirst({
      where: { id: carteiraOrigemId },
    });
    const destino = await this.prismaService.carteira.findFirst({
      where: { id: carteiraDestinoId },
    });

    if (!origem || !destino) {
      throw new BadRequestException("Carteira de origem ou destino nao encontrada.");
    }

    if (origem.usuario_id !== usuarioAutenticadoId || destino.usuario_id !== usuarioAutenticadoId) {
      throw new ForbiddenException("Transferencia entre usuarios diferentes nao e permitida.");
    }

    if (origem.arquivada || destino.arquivada) {
      throw new BadRequestException("Carteira arquivada nao pode participar de transferencia.");
    }

    const saldoTotalAntes = Number(origem.saldo_atual) + Number(destino.saldo_atual);

    const resultado = await this.prismaService.$transaction(async (tx: any) => {
      const movimentacaoDebito = await tx.movimentacao.create({
        data: {
          usuario_id: usuarioAutenticadoId,
          carteira_id: origem.id,
          modo: "TRANSFERENCIA",
          tipo: "SAIDA",
          valor: valor * -1,
          descricao,
          data_movimentacao: dataMovimentacao,
          fonte_origem: "MANUAL",
        },
      });

      const movimentacaoCredito = await tx.movimentacao.create({
        data: {
          usuario_id: usuarioAutenticadoId,
          carteira_id: destino.id,
          modo: "TRANSFERENCIA",
          tipo: "ENTRADA",
          valor,
          descricao,
          data_movimentacao: dataMovimentacao,
          fonte_origem: "MANUAL",
        },
      });

      const origemAtualizada = await tx.carteira.update({
        where: { id: origem.id },
        data: { saldo_atual: Number(origem.saldo_atual) - valor },
      });
      const destinoAtualizada = await tx.carteira.update({
        where: { id: destino.id },
        data: { saldo_atual: Number(destino.saldo_atual) + valor },
      });

      const transferencia = await tx.transferenciaInterna.create({
        data: {
          usuario_id: usuarioAutenticadoId,
          carteira_origem_id: origem.id,
          carteira_destino_id: destino.id,
          valor,
          descricao,
          data_movimentacao: dataMovimentacao,
          movimentacao_debito_id: movimentacaoDebito.id,
          movimentacao_credito_id: movimentacaoCredito.id,
        },
      });

      return {
        transferencia,
        movimentacao_debito: movimentacaoDebito,
        movimentacao_credito: movimentacaoCredito,
        saldo_origem: Number(origemAtualizada.saldo_atual),
        saldo_destino: Number(destinoAtualizada.saldo_atual),
      };
    });

    return {
      ...resultado,
      saldo_total_usuario_antes: saldoTotalAntes,
      saldo_total_usuario_depois: resultado.saldo_origem + resultado.saldo_destino,
    };
  }

  async listarTransferenciasPorUsuario(
    query: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const dataInicial = garantirString(query.data_inicial, "data_inicial", false);
    const dataFinal = garantirString(query.data_final, "data_final", false);

    const transferencias = await this.prismaService.transferenciaInterna.findMany({
      where: {
        usuario_id: usuarioAutenticadoId,
        ...(dataInicial || dataFinal
          ? {
              data_movimentacao: {
                ...(dataInicial ? { gte: paraDataIso(dataInicial, "data_inicial") } : {}),
                ...(dataFinal ? { lte: paraDataIso(dataFinal, "data_final") } : {}),
              },
            }
          : {}),
      },
      include: {
        movimentacao_debito_rel: true,
        movimentacao_credito_rel: true,
      },
      orderBy: { data_movimentacao: "desc" },
    });

    return {
      itens: transferencias,
      total_itens: transferencias.length,
    };
  }

  async processarCargaTransferenciasMultiusuario(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const ids = Array.isArray(dados.usuario_ids)
      ? (dados.usuario_ids as unknown[]).map((item) => String(item))
      : [usuarioAutenticadoId];

    if (ids.some((id) => id !== usuarioAutenticadoId)) {
      throw new ForbiddenException(
        "Carga multiusuario nao permitida para usuarios diferentes do autenticado.",
      );
    }

    const inicio = Date.now();
    const totalTransferencias = await this.prismaService.transferenciaInterna.count({
      where: { usuario_id: usuarioAutenticadoId },
    });

    return {
      total_usuarios_processados: 1,
      total_transferencias_processadas: totalTransferencias,
      usuario_ids_sem_vazamento: [usuarioAutenticadoId],
      tempo_processamento_ms: Date.now() - inicio,
    };
  }
}
