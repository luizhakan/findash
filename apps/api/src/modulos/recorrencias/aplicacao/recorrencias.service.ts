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

const mapearModo = (valor: string): string => {
  const normalizado = valor.trim().toUpperCase();
  const permitidos = [
    "CARTAO_CREDITO",
    "CARTAO_DEBITO",
    "PIX",
    "TRANSFERENCIA",
    "BOLETO",
    "DINHEIRO",
    "AJUSTE",
  ];
  if (!permitidos.includes(normalizado)) {
    throw new BadRequestException("modo invalido.");
  }
  return normalizado;
};

const mapearTipo = (valor: string): string => {
  const normalizado = valor.trim().toUpperCase();
  if (normalizado !== "ENTRADA" && normalizado !== "SAIDA") {
    throw new BadRequestException("tipo invalido.");
  }
  return normalizado;
};

const mapearPeriodicidade = (valor: string): string => {
  const normalizado = valor.trim().toUpperCase();
  if (normalizado !== "MENSAL" && normalizado !== "SEMANAL") {
    throw new BadRequestException("periodicidade invalida.");
  }
  return normalizado;
};

const adicionarMesesComAjuste = (data: Date, meses: number, diaExecucao: number): Date => {
  const proxima = new Date(Date.UTC(data.getUTCFullYear(), data.getUTCMonth() + meses, 1));
  const ultimoDiaMes = new Date(
    Date.UTC(proxima.getUTCFullYear(), proxima.getUTCMonth() + 1, 0),
  ).getUTCDate();
  const dia = Math.min(diaExecucao, ultimoDiaMes);
  return new Date(Date.UTC(proxima.getUTCFullYear(), proxima.getUTCMonth(), dia));
};

const competenciaMensal = (data: Date): string => {
  const ano = data.getUTCFullYear();
  const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
  return `${ano}-${mes}`;
};

const competenciaSemanal = (data: Date): string =>
  data.toISOString().slice(0, 10);

@Injectable()
export class RecorrenciasService {
  constructor(private readonly prismaService: PrismaService) {}

  async criarLancamentoRecorrente(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const carteiraId = garantirString(dados.carteira_id, "carteira_id") as string;
    const descricao = garantirString(dados.descricao, "descricao") as string;
    const modo = mapearModo(garantirString(dados.modo, "modo") as string);
    const tipo = mapearTipo(garantirString(dados.tipo, "tipo") as string);
    const valor = garantirNumero(dados.valor, "valor") as number;
    const periodicidade = mapearPeriodicidade(
      garantirString(dados.periodicidade, "periodicidade") as string,
    );
    const diaExecucao = garantirNumero(dados.dia_execucao, "dia_execucao") as number;
    const dataInicio = paraDataIso(
      garantirString(dados.data_inicio, "data_inicio") as string,
      "data_inicio",
    );
    const dataFimTexto = garantirString(dados.data_fim, "data_fim", false);

    if (valor === 0) {
      throw new BadRequestException("Valor da recorrencia deve ser diferente de zero.");
    }

    if (!Number.isInteger(diaExecucao) || diaExecucao < 1 || diaExecucao > 31) {
      throw new BadRequestException("Dia de execucao invalido para periodicidade mensal.");
    }

    const carteira = await this.prismaService.carteira.findFirst({
      where: {
        id: carteiraId,
      },
      select: {
        usuario_id: true,
      },
    });

    if (!carteira || carteira.usuario_id !== usuarioAutenticadoId) {
      throw new ForbiddenException("Carteira nao pertence ao usuario autenticado.");
    }

    return this.prismaService.lancamentoRecorrente.create({
      data: {
        usuario_id: usuarioAutenticadoId,
        carteira_id: carteiraId,
        descricao,
        modo: modo as never,
        tipo: tipo as never,
        valor,
        periodicidade: periodicidade as never,
        dia_execucao: diaExecucao,
        data_inicio: dataInicio,
        data_fim: dataFimTexto ? paraDataIso(dataFimTexto, "data_fim") : null,
      },
    });
  }

  async pausarLancamentoRecorrente(
    recorrenciaId: string,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const recorrencia = await this.obterRecorrenciaOuFalhar(recorrenciaId, usuarioAutenticadoId);

    return this.prismaService.lancamentoRecorrente.update({
      where: { id: recorrencia.id },
      data: { pausado: true },
    });
  }

  async reativarLancamentoRecorrente(
    recorrenciaId: string,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const recorrencia = await this.obterRecorrenciaOuFalhar(recorrenciaId, usuarioAutenticadoId);

    return this.prismaService.lancamentoRecorrente.update({
      where: { id: recorrencia.id },
      data: {
        pausado: false,
        ativo: true,
      },
    });
  }

  async encerrarLancamentoRecorrente(
    recorrenciaId: string,
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const recorrencia = await this.obterRecorrenciaOuFalhar(recorrenciaId, usuarioAutenticadoId);
    const dataFim = paraDataIso(
      garantirString(dados.data_fim, "data_fim") as string,
      "data_fim",
    );

    return this.prismaService.lancamentoRecorrente.update({
      where: { id: recorrencia.id },
      data: {
        data_fim: dataFim,
        ativo: false,
        pausado: false,
      },
    });
  }

  async gerarOcorrenciasNoPeriodo(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const dataInicial = paraDataIso(
      garantirString(dados.data_inicial, "data_inicial") as string,
      "data_inicial",
    );
    const dataFinal = paraDataIso(
      garantirString(dados.data_final, "data_final") as string,
      "data_final",
    );

    const recorrencias = await this.prismaService.lancamentoRecorrente.findMany({
      where: {
        usuario_id: usuarioAutenticadoId,
        ativo: true,
        pausado: false,
      },
    });

    const ocorrenciasCriadas: Array<Record<string, unknown>> = [];

    await this.prismaService.$transaction(async (tx: any) => {
      for (const recorrencia of recorrencias) {
        if (recorrencia.periodicidade === "MENSAL") {
          let cursor = new Date(recorrencia.data_inicio);
          cursor = adicionarMesesComAjuste(cursor, 0, recorrencia.dia_execucao);

          while (cursor <= dataFinal) {
            if (
              cursor >= dataInicial &&
              (!recorrencia.data_fim || cursor <= recorrencia.data_fim)
            ) {
              const competencia = competenciaMensal(cursor);
              const ocorrencia = await tx.ocorrenciaLancamentoRecorrente.upsert({
                where: {
                  recorrencia_id_competencia: {
                    recorrencia_id: recorrencia.id,
                    competencia,
                  },
                },
                update: {
                  data_prevista: cursor,
                  valor: recorrencia.valor,
                },
                create: {
                  recorrencia_id: recorrencia.id,
                  usuario_id: usuarioAutenticadoId,
                  competencia,
                  data_prevista: cursor,
                  valor: recorrencia.valor,
                  status: "PENDENTE",
                },
              });

              ocorrenciasCriadas.push(ocorrencia);
            }

            cursor = adicionarMesesComAjuste(cursor, 1, recorrencia.dia_execucao);
          }
        } else {
          let cursor = new Date(recorrencia.data_inicio);
          while (cursor <= dataFinal) {
            if (
              cursor >= dataInicial &&
              (!recorrencia.data_fim || cursor <= recorrencia.data_fim)
            ) {
              const competencia = competenciaSemanal(cursor);
              const ocorrencia = await tx.ocorrenciaLancamentoRecorrente.upsert({
                where: {
                  recorrencia_id_competencia: {
                    recorrencia_id: recorrencia.id,
                    competencia,
                  },
                },
                update: {
                  data_prevista: cursor,
                  valor: recorrencia.valor,
                },
                create: {
                  recorrencia_id: recorrencia.id,
                  usuario_id: usuarioAutenticadoId,
                  competencia,
                  data_prevista: cursor,
                  valor: recorrencia.valor,
                  status: "PENDENTE",
                },
              });

              ocorrenciasCriadas.push(ocorrencia);
            }

            cursor = new Date(cursor.getTime() + 7 * 24 * 60 * 60 * 1000);
          }
        }
      }
    });

    return {
      itens: ocorrenciasCriadas,
      total_itens: ocorrenciasCriadas.length,
    };
  }

  async editarProximasOcorrencias(
    recorrenciaId: string,
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const recorrencia = await this.obterRecorrenciaOuFalhar(recorrenciaId, usuarioAutenticadoId);

    const novoValor = garantirNumero(dados.novo_valor, "novo_valor", false);
    const novoDiaExecucao = garantirNumero(
      dados.novo_dia_execucao,
      "novo_dia_execucao",
      false,
    );

    if (novoDiaExecucao !== undefined) {
      if (!Number.isInteger(novoDiaExecucao) || novoDiaExecucao < 1 || novoDiaExecucao > 31) {
        throw new BadRequestException("Dia de execucao invalido para periodicidade mensal.");
      }
    }

    return this.prismaService.lancamentoRecorrente.update({
      where: { id: recorrencia.id },
      data: {
        ...(novoValor !== undefined ? { valor: novoValor } : {}),
        ...(novoDiaExecucao !== undefined ? { dia_execucao: novoDiaExecucao } : {}),
      },
    });
  }

  async listarLancamentosRecorrentes(
    query: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const incluirPausados = query.incluir_pausados !== undefined ? Boolean(query.incluir_pausados) : true;
    const incluirEncerrados = query.incluir_encerrados !== undefined ? Boolean(query.incluir_encerrados) : true;

    const itens = await this.prismaService.lancamentoRecorrente.findMany({
      where: {
        usuario_id: usuarioAutenticadoId,
        ...(incluirPausados ? {} : { pausado: false }),
        ...(incluirEncerrados ? {} : { ativo: true }),
      },
      orderBy: { criado_em: "desc" },
    });

    return {
      itens,
      total_itens: itens.length,
    };
  }

  async processarCargaRecorrenciasMultiusuario(
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
    const totalRecorrencias = await this.prismaService.lancamentoRecorrente.count({
      where: {
        usuario_id: usuarioAutenticadoId,
      },
    });

    return {
      total_usuarios_processados: 1,
      total_recorrencias_processadas: totalRecorrencias,
      usuario_ids_sem_vazamento: [usuarioAutenticadoId],
      tempo_processamento_ms: Date.now() - inicio,
    };
  }

  private async obterRecorrenciaOuFalhar(recorrenciaId: string, usuarioId: string) {
    const recorrencia = await this.prismaService.lancamentoRecorrente.findFirst({
      where: { id: recorrenciaId },
    });

    if (!recorrencia) {
      throw new NotFoundException("Recorrencia nao encontrada.");
    }

    if (recorrencia.usuario_id !== usuarioId) {
      throw new ForbiddenException("Usuario nao pode manipular recorrencia de outro usuario.");
    }

    return recorrencia;
  }
}
