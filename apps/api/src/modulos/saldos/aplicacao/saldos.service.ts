import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../../infraestrutura/prisma/prisma.service";
import {
  garantirBooleano,
  garantirNumero,
  garantirString,
} from "../../../infraestrutura/comum/conversao.util";

@Injectable()
export class SaldosService {
  constructor(private readonly prismaService: PrismaService) {}

  async calcularSaldoConsolidado(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const idsCarteirasVisiveis = Array.isArray(dados.ids_carteiras_visiveis)
      ? (dados.ids_carteiras_visiveis as unknown[]).map((item) => String(item))
      : undefined;

    const considerarSomenteAtivas =
      garantirBooleano(
        dados.considerar_somente_ativas,
        "considerar_somente_ativas",
        false,
      ) ?? false;
    const incluirArquivadas =
      garantirBooleano(dados.incluir_arquivadas, "incluir_arquivadas", false) ?? true;

    const carteiras = await this.prismaService.carteira.findMany({
      where: {
        usuario_id: usuarioAutenticadoId,
      },
      select: {
        id: true,
        saldo_atual: true,
        ativa: true,
        arquivada: true,
      },
    });

    const visibilidades = await this.prismaService.visibilidadeCarteiraConsolidado.findMany({
      where: { usuario_id: usuarioAutenticadoId },
      select: {
        carteira_id: true,
        visivel: true,
      },
    });

    const mapaVisibilidade = new Map(
      visibilidades.map((v: { carteira_id: string; visivel: boolean }) => [
        v.carteira_id,
        v.visivel,
      ]),
    );

    const carteirasIncluidas: string[] = [];
    const carteirasExcluidas: string[] = [];
    let saldoTotal = 0;

    for (const carteira of carteiras) {
      const visivelPorPreferencia = mapaVisibilidade.get(carteira.id) ?? true;
      const visivelPorSelecao = idsCarteirasVisiveis
        ? idsCarteirasVisiveis.includes(carteira.id)
        : true;
      const passouFiltroArquivada = incluirArquivadas ? true : !carteira.arquivada;
      const passouFiltroAtiva = considerarSomenteAtivas ? carteira.ativa : true;

      const incluir =
        visivelPorPreferencia && visivelPorSelecao && passouFiltroArquivada && passouFiltroAtiva;

      if (incluir) {
        carteirasIncluidas.push(carteira.id);
        saldoTotal += Number(carteira.saldo_atual);
      } else {
        carteirasExcluidas.push(carteira.id);
      }
    }

    return {
      usuario_id: usuarioAutenticadoId,
      saldo_total: saldoTotal,
      carteiras_incluidas: carteirasIncluidas,
      carteiras_excluidas: carteirasExcluidas,
      atualizado_em: new Date().toISOString(),
    };
  }

  async alterarVisibilidadeCarteira(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const carteiraId = garantirString(dados.carteira_id, "carteira_id") as string;
    const visivel = garantirBooleano(dados.visivel, "visivel") as boolean;

    await this.validarCarteiraDoUsuario(carteiraId, usuarioAutenticadoId);

    await this.prismaService.visibilidadeCarteiraConsolidado.upsert({
      where: {
        usuario_id_carteira_id: {
          usuario_id: usuarioAutenticadoId,
          carteira_id: carteiraId,
        },
      },
      update: {
        visivel,
      },
      create: {
        usuario_id: usuarioAutenticadoId,
        carteira_id: carteiraId,
        visivel,
      },
    });

    return this.calcularSaldoConsolidado({}, usuarioAutenticadoId);
  }

  async registrarCarteiraNoConsolidado(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const carteiraId = garantirString(dados.carteira_id, "carteira_id") as string;

    await this.validarCarteiraDoUsuario(carteiraId, usuarioAutenticadoId);

    await this.prismaService.visibilidadeCarteiraConsolidado.upsert({
      where: {
        usuario_id_carteira_id: {
          usuario_id: usuarioAutenticadoId,
          carteira_id: carteiraId,
        },
      },
      update: {
        visivel: true,
      },
      create: {
        usuario_id: usuarioAutenticadoId,
        carteira_id: carteiraId,
        visivel: true,
      },
    });

    return this.calcularSaldoConsolidado({}, usuarioAutenticadoId);
  }

  async removerCarteiraDoConsolidado(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const carteiraId = garantirString(dados.carteira_id, "carteira_id") as string;

    await this.validarCarteiraDoUsuario(carteiraId, usuarioAutenticadoId);

    await this.prismaService.visibilidadeCarteiraConsolidado.upsert({
      where: {
        usuario_id_carteira_id: {
          usuario_id: usuarioAutenticadoId,
          carteira_id: carteiraId,
        },
      },
      update: {
        visivel: false,
      },
      create: {
        usuario_id: usuarioAutenticadoId,
        carteira_id: carteiraId,
        visivel: false,
      },
    });

    return this.calcularSaldoConsolidado({}, usuarioAutenticadoId);
  }

  async recalcularAposMovimentacao(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const carteiraId = garantirString(dados.carteira_id, "carteira_id") as string;
    const valorDelta = garantirNumero(dados.valor_delta, "valor_delta") as number;

    await this.validarCarteiraDoUsuario(carteiraId, usuarioAutenticadoId);

    await this.prismaService.carteira.update({
      where: { id: carteiraId },
      data: {
        saldo_atual: {
          increment: valorDelta,
        },
      },
    });

    return this.calcularSaldoConsolidado({}, usuarioAutenticadoId);
  }

  async processarCargaSaldoMultiusuario(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const usuarioIds = Array.isArray(dados.usuario_ids)
      ? (dados.usuario_ids as unknown[]).map((item) => String(item))
      : [usuarioAutenticadoId];

    if (usuarioIds.some((id) => id !== usuarioAutenticadoId)) {
      throw new ForbiddenException(
        "Carga multiusuario nao permitida para usuarios diferentes do autenticado.",
      );
    }

    const inicio = Date.now();
    const totalCarteiras = await this.prismaService.carteira.count({
      where: { usuario_id: usuarioAutenticadoId },
    });

    return {
      total_usuarios_processados: 1,
      usuario_ids_sem_vazamento: [usuarioAutenticadoId],
      total_carteiras_processadas: totalCarteiras,
      tempo_processamento_ms: Date.now() - inicio,
    };
  }

  private async validarCarteiraDoUsuario(
    carteiraId: string,
    usuarioAutenticadoId: string,
  ): Promise<void> {
    const carteira = await this.prismaService.carteira.findFirst({
      where: {
        id: carteiraId,
      },
      select: {
        usuario_id: true,
      },
    });

    if (!carteira || carteira.usuario_id !== usuarioAutenticadoId) {
      throw new ForbiddenException(
        "Carteira informada nao pertence ao usuario para consolidacao.",
      );
    }
  }
}
