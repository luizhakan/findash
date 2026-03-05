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
} from "../../../infraestrutura/comum/conversao.util";

const mapearCategoria = (valor: string): string => {
  const normalizado = valor.trim().toUpperCase();
  const permitidos = [
    "ALIMENTACAO",
    "MORADIA",
    "TRANSPORTE",
    "SAUDE",
    "LAZER",
    "EDUCACAO",
    "OUTROS",
  ];

  if (!permitidos.includes(normalizado)) {
    throw new BadRequestException("Categoria invalida.");
  }

  return normalizado;
};

const calcularAlertas = (percentualConsumido: number): string[] => {
  const alertas: string[] = [];

  if (percentualConsumido >= 80) {
    alertas.push("alerta_80");
  }

  if (percentualConsumido >= 100) {
    alertas.push("alerta_100");
  }

  if (percentualConsumido > 100) {
    alertas.push("acima_do_limite");
  }

  return alertas;
};

@Injectable()
export class OrcamentosService {
  constructor(private readonly prismaService: PrismaService) {}

  async criarOrcamentoCategoria(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const categoria = mapearCategoria(garantirString(dados.categoria, "categoria") as string);
    const competencia = garantirString(dados.competencia, "competencia") as string;
    const moeda = (garantirString(dados.moeda, "moeda", false) ?? "BRL").toUpperCase();
    const limiteMensal = garantirNumero(dados.limite_mensal, "limite_mensal") as number;

    if (limiteMensal <= 0) {
      throw new BadRequestException("Limite mensal deve ser maior que zero.");
    }

    const existente = await this.prismaService.orcamentoCategoria.findFirst({
      where: {
        usuario_id: usuarioAutenticadoId,
        categoria: categoria as never,
        competencia,
      },
      select: { id: true },
    });

    if (existente) {
      throw new BadRequestException(
        "Ja existe orcamento para categoria e competencia informadas.",
      );
    }

    return this.prismaService.orcamentoCategoria.create({
      data: {
        usuario_id: usuarioAutenticadoId,
        categoria: categoria as never,
        competencia,
        moeda,
        limite_mensal: limiteMensal,
        valor_consumido: 0,
        percentual_consumido: 0,
        alertas_ativos: [],
      },
    });
  }

  async editarOrcamentoCategoria(
    orcamentoId: string,
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const orcamento = await this.obterOrcamentoOuFalhar(orcamentoId, usuarioAutenticadoId);

    const limiteMensal = garantirNumero(
      dados.limite_mensal,
      "limite_mensal",
      false,
    );

    const ativo = dados.ativo !== undefined ? Boolean(dados.ativo) : orcamento.ativo;
    const novoLimite = limiteMensal ?? Number(orcamento.limite_mensal);

    if (novoLimite <= 0) {
      throw new BadRequestException("Limite mensal deve ser maior que zero.");
    }

    const percentualConsumido = (Number(orcamento.valor_consumido) / novoLimite) * 100;
    const alertasAtivos = calcularAlertas(percentualConsumido);

    return this.prismaService.orcamentoCategoria.update({
      where: { id: orcamento.id },
      data: {
        limite_mensal: novoLimite,
        ativo,
        percentual_consumido: percentualConsumido,
        alertas_ativos: alertasAtivos,
      },
    });
  }

  async registrarConsumoNoOrcamento(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.registrarMovimentoNoOrcamento(dados, usuarioAutenticadoId, "CONSUMO");
  }

  async registrarEstornoNoOrcamento(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.registrarMovimentoNoOrcamento(dados, usuarioAutenticadoId, "ESTORNO");
  }

  async buscarOrcamentoCategoria(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const categoria = mapearCategoria(garantirString(dados.categoria, "categoria") as string);
    const competencia = garantirString(dados.competencia, "competencia") as string;

    const orcamento = await this.prismaService.orcamentoCategoria.findFirst({
      where: {
        usuario_id: usuarioAutenticadoId,
        categoria: categoria as never,
        competencia,
      },
    });

    if (!orcamento) {
      throw new NotFoundException(
        "Orcamento nao encontrado para categoria e competencia informadas.",
      );
    }

    return orcamento;
  }

  async listarOrcamentosCategoria(
    query: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const competencia = garantirString(query.competencia, "competencia", false);
    const somenteAtivos = query.somente_ativos !== undefined ? Boolean(query.somente_ativos) : false;

    const itens = await this.prismaService.orcamentoCategoria.findMany({
      where: {
        usuario_id: usuarioAutenticadoId,
        ...(competencia ? { competencia } : {}),
        ...(somenteAtivos ? { ativo: true } : {}),
      },
      orderBy: [{ competencia: "desc" }, { categoria: "asc" }],
    });

    return {
      itens,
      total_itens: itens.length,
    };
  }

  async processarCargaOrcamentosMultiusuario(
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
    const totalOrcamentos = await this.prismaService.orcamentoCategoria.count({
      where: { usuario_id: usuarioAutenticadoId },
    });

    return {
      total_usuarios_processados: 1,
      total_orcamentos_processados: totalOrcamentos,
      usuario_ids_sem_vazamento: [usuarioAutenticadoId],
      tempo_processamento_ms: Date.now() - inicio,
    };
  }

  private async registrarMovimentoNoOrcamento(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
    tipoRegistro: "CONSUMO" | "ESTORNO",
  ): Promise<Record<string, unknown>> {
    const categoria = mapearCategoria(garantirString(dados.categoria, "categoria") as string);
    const competencia = garantirString(dados.competencia, "competencia") as string;
    const idMovimentacao = garantirString(dados.id_movimentacao, "id_movimentacao") as string;

    const campoValor = tipoRegistro === "CONSUMO" ? "valor_despesa" : "valor_estorno";
    const valor = garantirNumero(dados[campoValor], campoValor) as number;

    if (valor <= 0) {
      throw new BadRequestException(`${campoValor} deve ser maior que zero.`);
    }

    const orcamento = await this.prismaService.orcamentoCategoria.findFirst({
      where: {
        usuario_id: usuarioAutenticadoId,
        categoria: categoria as never,
        competencia,
      },
    });

    if (!orcamento) {
      throw new NotFoundException(
        "Orcamento nao encontrado para categoria e competencia informadas.",
      );
    }

    const delta = tipoRegistro === "CONSUMO" ? valor : valor * -1;
    const novoConsumido = Math.max(0, Number(orcamento.valor_consumido) + delta);
    const percentualConsumido = (novoConsumido / Number(orcamento.limite_mensal)) * 100;
    const alertasAtivos = calcularAlertas(percentualConsumido);

    const resultado = await this.prismaService.$transaction(async (tx: any) => {
      await tx.registroOrcamento.create({
        data: {
          orcamento_id: orcamento.id,
          usuario_id: usuarioAutenticadoId,
          id_movimentacao: idMovimentacao,
          tipo_registro: tipoRegistro,
          valor,
        },
      });

      return tx.orcamentoCategoria.update({
        where: { id: orcamento.id },
        data: {
          valor_consumido: novoConsumido,
          percentual_consumido: percentualConsumido,
          alertas_ativos: alertasAtivos,
        },
      });
    });

    return resultado;
  }

  private async obterOrcamentoOuFalhar(orcamentoId: string, usuarioId: string) {
    const orcamento = await this.prismaService.orcamentoCategoria.findFirst({
      where: { id: orcamentoId },
    });

    if (!orcamento) {
      throw new NotFoundException("Orcamento nao encontrado.");
    }

    if (orcamento.usuario_id !== usuarioId) {
      throw new ForbiddenException("Usuario nao pode alterar orcamento de outro usuario.");
    }

    return orcamento;
  }
}
