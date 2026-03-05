import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../../infraestrutura/prisma/prisma.service";
import { garantirString } from "../../../infraestrutura/comum/conversao.util";
import { padronizarCsvBancario } from "../../../infraestrutura/comum/csv-bancario.util";

@Injectable()
export class CsvService {
  constructor(private readonly prismaService: PrismaService) {}

  async importarCsv(
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const fonte = garantirString(dados.fonte, "fonte") as "nubank" | "inter" | "mercado_pago";
    const carteiraId = garantirString(dados.carteira_id, "carteira_id") as string;
    const conteudoCsv = garantirString(dados.conteudoCsv, "conteudoCsv") as string;

    const carteira = await this.prismaService.carteira.findFirst({
      where: {
        id: carteiraId,
        usuario_id: usuarioAutenticadoId,
      },
    });

    if (!carteira) {
      throw new NotFoundException("Carteira nao encontrada para importacao CSV.");
    }

    const linhasCanonicas = padronizarCsvBancario(fonte, conteudoCsv);

    if (!linhasCanonicas.length) {
      throw new BadRequestException("CSV sem linhas validas para importar.");
    }

    const fonteEnum = fonte.toUpperCase();
    const importacao = await this.prismaService.importacaoCsv.create({
      data: {
        usuario_id: usuarioAutenticadoId,
        carteira_id: carteira.id,
        fonte_origem: fonteEnum as never,
        hash_arquivo: `${Date.now()}_${Math.random()}`,
        status: "CONCLUIDA",
        finalizado_em: new Date(),
      },
    });

    return {
      importacao_id: importacao.id,
      fonte,
      total_linhas: linhasCanonicas.length,
      linhas: linhasCanonicas,
    };
  }

  async padronizarLinhasCsv(
    dados: Record<string, unknown>,
    _usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    const fonte = garantirString(dados.fonte, "fonte") as "nubank" | "inter" | "mercado_pago";
    const conteudoCsv = garantirString(dados.conteudoCsv, "conteudoCsv") as string;

    const linhasCanonicas = padronizarCsvBancario(fonte, conteudoCsv);

    return {
      fonte,
      total_linhas: linhasCanonicas.length,
      linhas: linhasCanonicas,
    };
  }
}
