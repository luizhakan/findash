import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../../infraestrutura/prisma/prisma.service";
import {
  garantirNumero,
  garantirString,
  paraDataIso,
} from "../../../infraestrutura/comum/conversao.util";
import {
  calcularParcelas,
  referenciaAnoMes,
} from "../../../infraestrutura/comum/parcelamento.util";

const mapearBandeira = (valor: string): string => {
  const normalizado = valor.trim().toUpperCase();
  const permitidos = ["VISA", "MASTERCARD", "ELO", "AMEX", "HIPERCARD", "OUTRA"];

  if (!permitidos.includes(normalizado)) {
    throw new BadRequestException("Bandeira invalida.");
  }

  return normalizado;
};

const validarDiaMes = (dia: number, nomeCampo: string): void => {
  if (!Number.isInteger(dia) || dia < 1 || dia > 31) {
    throw new BadRequestException(`${nomeCampo} invalido.`);
  }
};

const calcularDatasFatura = (referencia: string, diaFechamento: number, diaVencimento: number) => {
  const [anoTexto, mesTexto] = referencia.split("-");
  const ano = Number(anoTexto);
  const mes = Number(mesTexto);

  const dataFechamento = new Date(Date.UTC(ano, mes - 1, diaFechamento));
  const dataVencimento = new Date(Date.UTC(ano, mes - 1, diaVencimento));

  return {
    dataFechamento,
    dataVencimento,
  };
};

@Injectable()
export class CartoesService {
  constructor(private readonly prismaService: PrismaService) {}

  async criarCartao(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const nome = garantirString(dados.nome, "nome") as string;
    const bandeira = mapearBandeira(garantirString(dados.bandeira, "bandeira") as string);
    const limiteTotal = garantirNumero(dados.limite_total, "limite_total") as number;
    const diaFechamento = garantirNumero(dados.dia_fechamento, "dia_fechamento") as number;
    const diaVencimento = garantirNumero(dados.dia_vencimento, "dia_vencimento") as number;

    validarDiaMes(diaFechamento, "dia_fechamento");
    validarDiaMes(diaVencimento, "dia_vencimento");

    return this.prismaService.cartao.create({
      data: {
        usuario_id: usuarioAutenticadoId,
        nome,
        bandeira: bandeira as never,
        limite_total: limiteTotal,
        dia_fechamento: diaFechamento,
        dia_vencimento: diaVencimento,
      },
    });
  }

  async editarCartao(
    cartaoId: string,
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const cartao = await this.obterCartaoOuFalhar(cartaoId, usuarioAutenticadoId);

    const payload: Record<string, unknown> = {};

    if (dados.nome !== undefined) {
      payload.nome = garantirString(dados.nome, "nome") as string;
    }

    if (dados.limite_total !== undefined) {
      payload.limite_total = garantirNumero(dados.limite_total, "limite_total") as number;
    }

    if (dados.dia_fechamento !== undefined) {
      const valor = garantirNumero(dados.dia_fechamento, "dia_fechamento") as number;
      validarDiaMes(valor, "dia_fechamento");
      payload.dia_fechamento = valor;
    }

    if (dados.dia_vencimento !== undefined) {
      const valor = garantirNumero(dados.dia_vencimento, "dia_vencimento") as number;
      validarDiaMes(valor, "dia_vencimento");
      payload.dia_vencimento = valor;
    }

    if (Object.keys(payload).length === 0) {
      throw new BadRequestException("Nenhum campo valido para editar cartao.");
    }

    return this.prismaService.cartao.update({
      where: { id: cartao.id },
      data: payload,
    });
  }

  async registrarCompraCartao(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const cartaoId = garantirString(dados.id_cartao, "id_cartao") as string;
    const cartao = await this.obterCartaoOuFalhar(cartaoId, usuarioAutenticadoId);

    const descricao = garantirString(dados.descricao, "descricao") as string;
    const valorTotal = garantirNumero(dados.valor_total, "valor_total") as number;
    const dataCompra = paraDataIso(
      garantirString(dados.data_compra, "data_compra") as string,
      "data_compra",
    );

    let faturaDestinoId = garantirString(dados.id_fatura_destino, "id_fatura_destino", false);
    let faturaDestino = null;

    if (faturaDestinoId) {
      faturaDestino = await this.prismaService.faturaCartao.findFirst({
        where: {
          id: faturaDestinoId,
          usuario_id: usuarioAutenticadoId,
          cartao_id: cartao.id,
        },
      });

      if (!faturaDestino) {
        throw new NotFoundException("Fatura de destino nao encontrada.");
      }
    } else {
      const referencia = referenciaAnoMes(dataCompra);
      const { dataFechamento, dataVencimento } = calcularDatasFatura(
        referencia,
        cartao.dia_fechamento,
        cartao.dia_vencimento,
      );

      faturaDestino = await this.prismaService.faturaCartao.upsert({
        where: {
          cartao_id_referencia: {
            cartao_id: cartao.id,
            referencia,
          },
        },
        update: {},
        create: {
          usuario_id: usuarioAutenticadoId,
          cartao_id: cartao.id,
          referencia,
          data_fechamento: dataFechamento,
          data_vencimento: dataVencimento,
          valor_compras: 0,
          valor_total: 0,
        },
      });
      faturaDestinoId = faturaDestino.id;
    }

    const parcelamento =
      typeof dados.parcelamento === "object" && dados.parcelamento
        ? (dados.parcelamento as Record<string, unknown>)
        : undefined;

    const parcelas = parcelamento
      ? calcularParcelas(
          valorTotal,
          garantirNumero(parcelamento.quantidade_parcelas, "quantidade_parcelas") as number,
          new Date(faturaDestino.data_vencimento),
          (garantirString(parcelamento.modo, "modo") as string).toLowerCase() as
            | "fixo"
            | "diluido",
          garantirNumero(parcelamento.valor_parcela_fixa, "valor_parcela_fixa", false),
        )
      : [
          {
            numero: 1,
            valor: valorTotal,
            data_vencimento: new Date(faturaDestino.data_vencimento),
            status: "ABERTA" as const,
          },
        ];

    return this.prismaService.$transaction(async (tx: any) => {
      const compra = await tx.compraCartao.create({
        data: {
          usuario_id: usuarioAutenticadoId,
          cartao_id: cartao.id,
          fatura_destino_id: faturaDestinoId as string,
          descricao,
          valor_total: valorTotal,
          data_compra: dataCompra,
          parcelas: {
            create: parcelas.map((parcela) => ({
              numero: parcela.numero,
              valor: parcela.valor,
              data_vencimento: parcela.data_vencimento,
              status: parcela.status,
            })),
          },
        },
        include: {
          parcelas: true,
        },
      });

      const faturaAtualizada = await tx.faturaCartao.update({
        where: { id: faturaDestinoId as string },
        data: {
          valor_compras: {
            increment: valorTotal,
          },
          valor_total: {
            increment: valorTotal,
          },
        },
      });

      return {
        compra,
        fatura: faturaAtualizada,
      };
    });
  }

  async editarCompraCartao(
    compraId: string,
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const compra = await this.prismaService.compraCartao.findFirst({
      where: { id: compraId },
      include: { fatura_destino_rel: true },
    });

    if (!compra) {
      throw new NotFoundException("Compra nao encontrada.");
    }

    if (compra.usuario_id !== usuarioAutenticadoId) {
      throw new ForbiddenException("Nao e permitido editar compra de outro usuario.");
    }

    const novaDescricao =
      dados.descricao !== undefined
        ? (garantirString(dados.descricao, "descricao") as string)
        : compra.descricao;
    const novoValor =
      dados.valor_total !== undefined
        ? (garantirNumero(dados.valor_total, "valor_total") as number)
        : Number(compra.valor_total);

    const novaFaturaDestinoId =
      (garantirString(dados.id_fatura_destino, "id_fatura_destino", false) as string | undefined) ??
      compra.fatura_destino_id;

    const novaFatura = await this.prismaService.faturaCartao.findFirst({
      where: {
        id: novaFaturaDestinoId,
        usuario_id: usuarioAutenticadoId,
      },
    });

    if (!novaFatura) {
      throw new NotFoundException("Fatura de destino nao encontrada para edicao.");
    }

    const valorAnterior = Number(compra.valor_total);

    return this.prismaService.$transaction(async (tx: any) => {
      if (compra.fatura_destino_id !== novaFaturaDestinoId) {
        await tx.faturaCartao.update({
          where: { id: compra.fatura_destino_id },
          data: {
            valor_compras: { decrement: valorAnterior },
            valor_total: { decrement: valorAnterior },
          },
        });

        await tx.faturaCartao.update({
          where: { id: novaFaturaDestinoId },
          data: {
            valor_compras: { increment: novoValor },
            valor_total: { increment: novoValor },
          },
        });
      } else {
        const delta = novoValor - valorAnterior;
        if (delta !== 0) {
          await tx.faturaCartao.update({
            where: { id: compra.fatura_destino_id },
            data: {
              valor_compras: { increment: delta },
              valor_total: { increment: delta },
            },
          });
        }
      }

      const compraAtualizada = await tx.compraCartao.update({
        where: { id: compra.id },
        data: {
          descricao: novaDescricao,
          valor_total: novoValor,
          fatura_destino_id: novaFaturaDestinoId,
        },
        include: {
          parcelas: true,
        },
      });

      return compraAtualizada;
    });
  }

  async adicionarJurosManualFatura(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.atualizarJurosDaFatura(dados, usuarioAutenticadoId);
  }

  async editarJurosManualFatura(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.atualizarJurosDaFatura(dados, usuarioAutenticadoId);
  }

  async removerJurosManualFatura(
    faturaId: string,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const fatura = await this.obterFaturaOuFalhar(faturaId, usuarioAutenticadoId);

    return this.prismaService.faturaCartao.update({
      where: { id: fatura.id },
      data: {
        valor_juros_manual: 0,
        valor_total: Number(fatura.valor_compras),
      },
    });
  }

  async listarCartoes(
    _query: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const cartoes = await this.prismaService.cartao.findMany({
      where: {
        usuario_id: usuarioAutenticadoId,
      },
      orderBy: { criado_em: "asc" },
    });

    return {
      itens: cartoes,
      total_itens: cartoes.length,
    };
  }

  async listarFaturas(
    query: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const cartaoId = garantirString(query.id_cartao, "id_cartao", false);

    const faturas = await this.prismaService.faturaCartao.findMany({
      where: {
        usuario_id: usuarioAutenticadoId,
        ...(cartaoId ? { cartao_id: cartaoId } : {}),
      },
      orderBy: { referencia: "desc" },
    });

    return {
      itens: faturas,
      total_itens: faturas.length,
    };
  }

  private async atualizarJurosDaFatura(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const faturaId = garantirString(dados.id_fatura, "id_fatura") as string;
    const valorJuros = garantirNumero(dados.valor_juros, "valor_juros") as number;
    if (valorJuros < 0) {
      throw new BadRequestException("valor_juros nao pode ser negativo.");
    }

    const fatura = await this.obterFaturaOuFalhar(faturaId, usuarioAutenticadoId);

    return this.prismaService.faturaCartao.update({
      where: { id: fatura.id },
      data: {
        valor_juros_manual: valorJuros,
        valor_total: Number(fatura.valor_compras) + valorJuros,
      },
    });
  }

  private async obterCartaoOuFalhar(cartaoId: string, usuarioId: string) {
    const cartao = await this.prismaService.cartao.findFirst({
      where: { id: cartaoId },
    });

    if (!cartao) {
      throw new NotFoundException("Cartao nao encontrado.");
    }

    if (cartao.usuario_id !== usuarioId) {
      throw new ForbiddenException("Acesso negado ao cartao de outro usuario.");
    }

    return cartao;
  }

  private async obterFaturaOuFalhar(faturaId: string, usuarioId: string) {
    const fatura = await this.prismaService.faturaCartao.findFirst({
      where: { id: faturaId },
    });

    if (!fatura) {
      throw new NotFoundException("Fatura nao encontrada.");
    }

    if (fatura.usuario_id !== usuarioId) {
      throw new ForbiddenException("Acesso negado a fatura de outro usuario.");
    }

    return fatura;
  }
}
