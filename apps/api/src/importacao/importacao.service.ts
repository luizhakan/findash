import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Conta, StatusTransacao, TipoTransacao } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ParserService, TransacaoParseada } from './parser.service';
import { ImportarCsvDto } from './dto/importar-csv.dto';

@Injectable()
export class ImportacaoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly parserService: ParserService,
  ) {}

  async procesarArquivoCsv(
    conteudoCsv: string,
    importarCsvDto: ImportarCsvDto,
  ) {
    // Validar que o usuário existe
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: importarCsvDto.usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Validar que a conta existe (se fornecida)
    let contaDestino: Conta | null = null;
    if (importarCsvDto.contaId) {
      contaDestino = await this.prisma.conta.findUnique({
        where: { id: importarCsvDto.contaId },
      });

      if (
        !contaDestino ||
        contaDestino.usuarioId !== importarCsvDto.usuarioId
      ) {
        throw new NotFoundException(
          'Conta não encontrada ou não pertence ao usuário',
        );
      }
    }

    // Fazer parsing do CSV
    const linhas = conteudoCsv.split('\n');
    let transacoesParseadas: TransacaoParseada[] = [];

    const banco = importarCsvDto.banco as unknown as string;

    switch (banco) {
      case 'NUBANK':
        transacoesParseadas = this.parserService.parseNubank(linhas);
        break;
      case 'INTER':
        transacoesParseadas = this.parserService.parseInter(linhas);
        break;
      case 'MERCADO_PAGO':
        transacoesParseadas = this.parserService.parseMercadoPago(linhas);
        break;
      default:
        throw new BadRequestException('Banco não suportado');
    }

    if (transacoesParseadas.length === 0) {
      throw new BadRequestException('Nenhuma transação encontrada no arquivo');
    }

    // Validar anti-duplicidade
    const hashesExistentes = await this.prisma.transacao.findMany({
      where: {
        usuarioId: importarCsvDto.usuarioId,
        hashImportacao: {
          in: transacoesParseadas.map((t) => t.hash),
        },
      },
      select: { hashImportacao: true },
    });

    const hashesExistentesSet = new Set(
      hashesExistentes.map((t) => t.hashImportacao),
    );

    const transacoesNovas = transacoesParseadas.filter(
      (t) => !hashesExistentesSet.has(t.hash),
    );

    const transacoesDuplicadas =
      transacoesParseadas.length - transacoesNovas.length;

    if (transacoesNovas.length === 0) {
      return {
        processadas: 0,
        duplicadas: transacoesDuplicadas,
        mensagem: 'Todas as transações já foram importadas anteriormente',
      };
    }

    // Criar transações no banco
    const transacoesInseridas = await Promise.all(
      transacoesNovas.map((t) =>
        this.prisma.transacao.create({
          data: {
            usuarioId: importarCsvDto.usuarioId,
            tipo: TipoTransacao.DESPESA, // Por padrão, importadas são despesas
            status: StatusTransacao.EFETIVADA,
            valor: t.valor,
            dataOcorrencia: t.data,
            descricao: t.descricao,
            contaId: importarCsvDto.contaId,
            hashImportacao: t.hash,
          },
        }),
      ),
    );

    return {
      processadas: transacoesInseridas.length,
      duplicadas: transacoesDuplicadas,
      mensagem: `${transacoesInseridas.length} transações importadas com sucesso`,
    };
  }
}
