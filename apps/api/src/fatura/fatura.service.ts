import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  StatusFatura,
  StatusTransacao,
  TipoTransacao,
  Transacao,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PagarFaturaDto } from './dto/pagar-fatura.dto';

@Injectable()
export class FaturaService {
  constructor(private readonly prisma: PrismaService) {}

  async listarPorCartao(cartaoId: string) {
    const cartao = await this.prisma.cartaoCredito.findUnique({
      where: { id: cartaoId },
    });

    if (!cartao) {
      throw new NotFoundException('Cartão de crédito não encontrado');
    }

    const faturas = await this.prisma.fatura.findMany({
      where: { cartaoId },
      orderBy: [{ ano: 'desc' }, { mes: 'desc' }],
      include: {
        transacoes: {
          where: { status: StatusTransacao.EFETIVADA },
          select: { valor: true, tipo: true },
        },
      },
    });

    return faturas.map((fatura) => ({
      ...fatura,
      totalDespesas: this.somarDespesasFatura(
        fatura.transacoes as Pick<Transacao, 'valor' | 'tipo'>[],
      ),
    }));
  }

  async buscarPorId(id: string) {
    const fatura = await this.prisma.fatura.findUnique({
      where: { id },
      include: {
        cartao: true,
        transacoes: {
          where: { status: StatusTransacao.EFETIVADA },
        },
      },
    });

    if (!fatura) {
      throw new NotFoundException('Fatura não encontrada');
    }

    const totalDespesas = this.somarDespesasFatura(fatura.transacoes);

    return {
      ...fatura,
      totalDespesas,
    };
  }

  async pagarFatura(id: string, pagarFaturaDto: PagarFaturaDto) {
    const fatura = await this.buscarPorId(id);

    if (fatura.status === StatusFatura.PAGA) {
      throw new BadRequestException('Fatura já foi paga');
    }

    const contaPagamento = await this.prisma.conta.findUnique({
      where: { id: pagarFaturaDto.contaPagamentoId },
    });

    if (!contaPagamento) {
      throw new NotFoundException('Conta de pagamento não encontrada');
    }

    const valorPago = pagarFaturaDto.valorPago ?? fatura.totalDespesas;

    if (valorPago <= 0 || valorPago > fatura.totalDespesas) {
      throw new BadRequestException(
        `Valor do pagamento deve estar entre 0.01 e ${fatura.totalDespesas}`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const descricao = `Pagamento da fatura do cartão ${fatura.cartao.nome} (${fatura.mes}/${fatura.ano})`;

      await tx.transacao.create({
        data: {
          usuarioId: fatura.cartao.usuarioId,
          tipo: TipoTransacao.DESPESA,
          status: StatusTransacao.EFETIVADA,
          valor: valorPago,
          dataOcorrencia: new Date(),
          descricao,
          contaId: contaPagamento.id,
        },
      });

      const statusFinal =
        valorPago === fatura.totalDespesas
          ? StatusFatura.PAGA
          : StatusFatura.FECHADA;

      const faturaAtualizada = await tx.fatura.update({
        where: { id },
        data: { status: statusFinal },
      });

      return {
        fatura: faturaAtualizada,
        transacao: {
          descricao,
          valor: valorPago,
          contaPagamento: contaPagamento.nome,
        },
      };
    });
  }

  private somarDespesasFatura(
    transacoes: Pick<Transacao, 'valor' | 'tipo'>[],
  ): number {
    return transacoes.reduce((total, transacao) => {
      const valor = this.decimalParaNumero(transacao.valor);

      if (transacao.tipo === TipoTransacao.RECEITA) {
        return total - valor;
      }

      return total + valor;
    }, 0);
  }

  private decimalParaNumero(valor?: Prisma.Decimal | null) {
    if (!valor) {
      return 0;
    }

    return Number(valor.toString());
  }
}
