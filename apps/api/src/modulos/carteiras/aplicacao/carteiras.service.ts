import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../../infraestrutura/prisma/prisma.service";
import {
  garantirBooleano,
  garantirNumero,
  garantirString,
  paraDataIso,
} from "../../../infraestrutura/comum/conversao.util";
import { padronizarCsvBancario } from "../../../infraestrutura/comum/csv-bancario.util";

const mapearTipoCarteira = (valor: string): string => {
  const normalizado = valor.trim().toUpperCase();
  const permitidos = [
    "CONTA_CORRENTE",
    "CONTA_PAGAMENTO",
    "CARTEIRA_DIGITAL",
    "CARTAO_CREDITO",
    "DINHEIRO",
  ];

  if (!permitidos.includes(normalizado)) {
    throw new BadRequestException("tipo_carteira invalido.");
  }

  return normalizado;
};

const mapearModoMovimentacao = (valor: string): string => {
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

const mapearTipoMovimentacao = (valor: string): string => {
  const normalizado = valor.trim().toUpperCase();
  if (normalizado !== "ENTRADA" && normalizado !== "SAIDA") {
    throw new BadRequestException("tipo de movimentacao invalido.");
  }
  return normalizado;
};

const mapearFonteMovimentacao = (valor: string): string => {
  const normalizado = valor.trim().toUpperCase();
  const permitidos = ["NUBANK", "INTER", "MERCADO_PAGO", "MANUAL"];
  if (!permitidos.includes(normalizado)) {
    throw new BadRequestException("fonte_origem invalida.");
  }
  return normalizado;
};

@Injectable()
export class CarteirasService {
  constructor(private readonly prismaService: PrismaService) {}

  async criarCarteira(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const nome = garantirString(dados.nome, "nome") as string;
    const tipoCarteira = mapearTipoCarteira(
      garantirString(dados.tipo_carteira, "tipo_carteira") as string,
    );
    const moeda = (garantirString(dados.moeda, "moeda", false) ?? "BRL").toUpperCase();
    const saldoInicial = garantirNumero(dados.saldo_inicial ?? 0, "saldo_inicial", false) ?? 0;

    const existente = await this.prismaService.carteira.findFirst({
      where: {
        usuario_id: usuarioAutenticadoId,
        nome,
      },
      select: { id: true },
    });

    if (existente) {
      throw new BadRequestException("Carteira duplicada para o usuario.");
    }

    return this.prismaService.carteira.create({
      data: {
        usuario_id: usuarioAutenticadoId,
        nome,
        tipo_carteira: tipoCarteira as never,
        moeda,
        saldo_inicial: saldoInicial,
        saldo_atual: saldoInicial,
      },
    });
  }

  async listarCarteiras(
    query: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const incluirArquivadas =
      garantirBooleano(query.incluir_arquivadas, "incluir_arquivadas", false) ?? false;

    const carteiras = await this.prismaService.carteira.findMany({
      where: {
        usuario_id: usuarioAutenticadoId,
        ...(incluirArquivadas ? {} : { arquivada: false }),
      },
      orderBy: { criada_em: "asc" },
    });

    return {
      itens: carteiras,
      total_itens: carteiras.length,
    };
  }

  async buscarCarteira(
    carteiraId: string,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.obterCarteiraOuFalhar(carteiraId, usuarioAutenticadoId);
  }

  async editarCarteira(
    carteiraId: string,
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    await this.obterCarteiraOuFalhar(carteiraId, usuarioAutenticadoId);

    const payloadAtualizacao: Record<string, unknown> = {};

    if (dados.nome !== undefined) {
      payloadAtualizacao.nome = garantirString(dados.nome, "nome") as string;
    }

    if (dados.ativa !== undefined) {
      payloadAtualizacao.ativa = garantirBooleano(dados.ativa, "ativa") as boolean;
    }

    if (Object.keys(payloadAtualizacao).length === 0) {
      throw new BadRequestException("Nenhum campo valido para editar carteira.");
    }

    return this.prismaService.carteira.update({
      where: { id: carteiraId },
      data: payloadAtualizacao,
    });
  }

  async removerCarteira(
    carteiraId: string,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    await this.obterCarteiraOuFalhar(carteiraId, usuarioAutenticadoId);

    const totalMovimentacoes = await this.prismaService.movimentacao.count({
      where: {
        carteira_id: carteiraId,
      },
    });

    if (totalMovimentacoes > 0) {
      throw new BadRequestException(
        "Carteira com movimentacoes ativas deve ser arquivada, nao removida.",
      );
    }

    await this.prismaService.carteira.delete({
      where: { id: carteiraId },
    });

    return { mensagem: "Carteira removida com sucesso." };
  }

  async arquivarCarteira(
    carteiraId: string,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    await this.obterCarteiraOuFalhar(carteiraId, usuarioAutenticadoId);

    return this.prismaService.carteira.update({
      where: { id: carteiraId },
      data: {
        arquivada: true,
        ativa: false,
      },
    });
  }

  async adicionarMovimentacao(
    carteiraId: string,
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const carteira = await this.obterCarteiraOuFalhar(carteiraId, usuarioAutenticadoId);

    if (carteira.arquivada) {
      throw new BadRequestException("Carteira arquivada nao recebe movimentacao.");
    }

    const dadosMovimentacao =
      typeof dados.movimentacao === "object" && dados.movimentacao
        ? (dados.movimentacao as Record<string, unknown>)
        : dados;

    const tipo = mapearTipoMovimentacao(
      garantirString(dadosMovimentacao.tipo, "tipo") as string,
    );
    const modo = mapearModoMovimentacao(
      garantirString(dadosMovimentacao.modo, "modo") as string,
    );
    const valorEntrada = garantirNumero(dadosMovimentacao.valor, "valor") as number;
    const descricao = garantirString(dadosMovimentacao.descricao, "descricao") as string;
    const dataMovimentacao = paraDataIso(
      garantirString(dadosMovimentacao.data_movimentacao, "data_movimentacao") as string,
      "data_movimentacao",
    );
    const idOrigem = garantirString(dadosMovimentacao.id_origem, "id_origem", false);
    const fonte = mapearFonteMovimentacao(
      garantirString(dadosMovimentacao.fonte_origem ?? "MANUAL", "fonte_origem", false) ??
        "MANUAL",
    );

    let valorFinal = valorEntrada;
    if (tipo === "SAIDA" && valorFinal > 0) {
      valorFinal = valorFinal * -1;
    }
    if (tipo === "ENTRADA" && valorFinal < 0) {
      valorFinal = Math.abs(valorFinal);
    }

    if (idOrigem) {
      const existente = await this.prismaService.movimentacao.findFirst({
        where: {
          usuario_id: usuarioAutenticadoId,
          carteira_id: carteiraId,
          fonte_origem: fonte as never,
          id_origem: idOrigem,
        },
        select: { id: true },
      });

      if (existente) {
        throw new BadRequestException(
          "Movimentacao duplicada para fonte_origem + id_origem na carteira.",
        );
      }
    }

    const saldoNovo = Number(carteira.saldo_atual) + valorFinal;

    const resultado = await this.prismaService.$transaction(async (tx: any) => {
      const movimentacao = await tx.movimentacao.create({
        data: {
          usuario_id: usuarioAutenticadoId,
          carteira_id: carteiraId,
          modo: modo as never,
          tipo: tipo as never,
          valor: valorFinal,
          descricao,
          data_movimentacao: dataMovimentacao,
          id_origem: idOrigem,
          fonte_origem: fonte as never,
          saldo_pos_movimento_origem: saldoNovo,
        },
      });

      const carteiraAtualizada = await tx.carteira.update({
        where: { id: carteiraId },
        data: { saldo_atual: saldoNovo },
      });

      return {
        carteira: carteiraAtualizada,
        movimentacao,
      };
    });

    return resultado;
  }

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

    const origem = await this.obterCarteiraOuFalhar(carteiraOrigemId, usuarioAutenticadoId);
    const destino = await this.obterCarteiraOuFalhar(carteiraDestinoId, usuarioAutenticadoId);

    if (origem.arquivada || destino.arquivada) {
      throw new BadRequestException(
        "Carteira arquivada nao pode participar de transferencia.",
      );
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

      const carteiraOrigemAtualizada = await tx.carteira.update({
        where: { id: origem.id },
        data: {
          saldo_atual: Number(origem.saldo_atual) - valor,
        },
      });

      const carteiraDestinoAtualizada = await tx.carteira.update({
        where: { id: destino.id },
        data: {
          saldo_atual: Number(destino.saldo_atual) + valor,
        },
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
        saldo_origem: carteiraOrigemAtualizada.saldo_atual,
        saldo_destino: carteiraDestinoAtualizada.saldo_atual,
      };
    });

    const saldoTotalDepois = Number(resultado.saldo_origem) + Number(resultado.saldo_destino);

    return {
      ...resultado,
      saldo_total_usuario_antes: saldoTotalAntes,
      saldo_total_usuario_depois: saldoTotalDepois,
    };
  }

  async importarCsv(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const fonte = garantirString(dados.fonte, "fonte") as "nubank" | "inter" | "mercado_pago";
    const carteiraId = garantirString(dados.carteira_id, "carteira_id") as string;
    const conteudoCsv = garantirString(dados.conteudoCsv, "conteudoCsv") as string;

    const carteira = await this.obterCarteiraOuFalhar(carteiraId, usuarioAutenticadoId);

    const linhasCanonicas = padronizarCsvBancario(fonte, conteudoCsv);
    const fonteEnum = mapearFonteMovimentacao(fonte);

    const importacao = await this.prismaService.importacaoCsv.create({
      data: {
        usuario_id: usuarioAutenticadoId,
        carteira_id: carteira.id,
        fonte_origem: fonteEnum as never,
        hash_arquivo: `${Date.now()}_${Math.random()}`,
        status: "PROCESSANDO",
      },
    });

    let saldoAtual = Number(carteira.saldo_atual);
    let movimentacoesCriadas = 0;
    let movimentacoesIgnoradasDuplicadas = 0;
    const idsOrigemCriados: string[] = [];
    const idsOrigemIgnorados: string[] = [];

    await this.prismaService.$transaction(async (tx: any) => {
      for (let indice = 0; indice < linhasCanonicas.length; indice += 1) {
        const linha = linhasCanonicas[indice]!;
        const chaveDeduplicacao =
          linha.id_origem ??
          `${linha.data_movimentacao}_${linha.valor}_${linha.descricao}`;

        const itemExistente = await tx.itemImportacaoCsv.findFirst({
          where: {
            usuario_id: usuarioAutenticadoId,
            carteira_id: carteiraId,
            fonte_origem: fonteEnum as never,
            chave_deduplicacao: chaveDeduplicacao,
          },
          select: { id: true },
        });

        if (itemExistente) {
          movimentacoesIgnoradasDuplicadas += 1;
          idsOrigemIgnorados.push(chaveDeduplicacao);
          await tx.itemImportacaoCsv.create({
            data: {
              importacao_id: importacao.id,
              usuario_id: usuarioAutenticadoId,
              carteira_id: carteiraId,
              fonte_origem: fonteEnum as never,
              chave_deduplicacao: `${chaveDeduplicacao}_duplicado_${indice}`,
              id_origem: linha.id_origem,
              status: "IGNORADO_DUPLICADO",
              linha_original: linha.descricao,
            },
          });
          continue;
        }

        saldoAtual += linha.valor;

        const tipo = linha.valor >= 0 ? "ENTRADA" : "SAIDA";
        const movimentacao = await tx.movimentacao.create({
          data: {
            usuario_id: usuarioAutenticadoId,
            carteira_id: carteiraId,
            modo: "AJUSTE",
            tipo: tipo as never,
            valor: linha.valor,
            descricao: linha.descricao,
            data_movimentacao: paraDataIso(linha.data_movimentacao, "data_movimentacao"),
            saldo_pos_movimento_origem: saldoAtual,
            id_origem: linha.id_origem,
            fonte_origem: fonteEnum as never,
          },
        });

        await tx.itemImportacaoCsv.create({
          data: {
            importacao_id: importacao.id,
            usuario_id: usuarioAutenticadoId,
            carteira_id: carteiraId,
            movimentacao_id: movimentacao.id,
            fonte_origem: fonteEnum as never,
            chave_deduplicacao: chaveDeduplicacao,
            id_origem: linha.id_origem,
            status: "PROCESSADO",
            linha_original: linha.descricao,
          },
        });

        movimentacoesCriadas += 1;
        if (linha.id_origem) {
          idsOrigemCriados.push(linha.id_origem);
        }
      }

      await tx.carteira.update({
        where: { id: carteiraId },
        data: { saldo_atual: saldoAtual },
      });

      await tx.importacaoCsv.update({
        where: { id: importacao.id },
        data: {
          status: "CONCLUIDA",
          finalizado_em: new Date(),
        },
      });
    });

    return {
      importacao_id: importacao.id,
      movimentacoes_criadas: movimentacoesCriadas,
      movimentacoes_ignoradas_duplicadas: movimentacoesIgnoradasDuplicadas,
      ids_origem_criados: idsOrigemCriados,
      ids_origem_ignorados: idsOrigemIgnorados,
    };
  }

  async processarCargaMultiusuario(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const usuarioIdsEntrada = Array.isArray(dados.usuario_ids)
      ? (dados.usuario_ids as unknown[]).map((valor) => String(valor))
      : [usuarioAutenticadoId];

    if (
      usuarioIdsEntrada.some((usuarioId) => usuarioId !== usuarioAutenticadoId)
    ) {
      throw new ForbiddenException(
        "Carga multiusuario so e permitida para o proprio usuario autenticado.",
      );
    }

    const inicio = Date.now();
    const totalCarteiras = await this.prismaService.carteira.count({
      where: {
        usuario_id: usuarioAutenticadoId,
      },
    });

    return {
      total_usuarios_processados: 1,
      total_carteiras_processadas: totalCarteiras,
      usuario_ids_sem_vazamento: [usuarioAutenticadoId],
      tempo_processamento_ms: Date.now() - inicio,
    };
  }

  private async obterCarteiraOuFalhar(
    carteiraId: string,
    usuarioId: string,
  ): Promise<{
    id: string;
    usuario_id: string;
    saldo_atual: number;
    arquivada: boolean;
  }> {
    const carteira = await this.prismaService.carteira.findFirst({
      where: {
        id: carteiraId,
      },
      select: {
        id: true,
        usuario_id: true,
        saldo_atual: true,
        arquivada: true,
      },
    });

    if (!carteira) {
      throw new NotFoundException("Carteira nao encontrada.");
    }

    if (carteira.usuario_id !== usuarioId) {
      throw new ForbiddenException("Acesso negado a carteira de outro usuario.");
    }

    return {
      id: carteira.id,
      usuario_id: carteira.usuario_id,
      saldo_atual: Number(carteira.saldo_atual),
      arquivada: carteira.arquivada,
    };
  }
}
