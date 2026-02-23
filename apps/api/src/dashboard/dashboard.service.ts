import { Injectable } from '@nestjs/common';
import { Prisma, StatusTransacao, TipoTransacao } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ResumoMensalQueryDto } from './dto/resumo-mensal-query.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async buscarResumoMensal(query: ResumoMensalQueryDto) {
    const hoje = new Date();
    const ano = query.ano ?? hoje.getFullYear();
    const mes = query.mes ?? hoje.getMonth() + 1;

    const inicioMes = new Date(ano, mes - 1, 1, 0, 0, 0, 0);
    const fimMes = new Date(ano, mes, 0, 23, 59, 59, 999);

    const [totalReceitasMes, totalDespesasMes, saldoTotalContasVisiveis] =
      await Promise.all([
        this.somarTransacoesMensais(
          query.usuarioId,
          TipoTransacao.RECEITA,
          inicioMes,
          fimMes,
        ),
        this.somarTransacoesMensais(
          query.usuarioId,
          TipoTransacao.DESPESA,
          inicioMes,
          fimMes,
        ),
        this.calcularSaldoTotalContasVisiveis(query.usuarioId),
      ]);

    return {
      referencia: { ano, mes },
      totalReceitasMes,
      totalDespesasMes,
      saldoMes: this.arredondar(totalReceitasMes - totalDespesasMes),
      saldoTotalContasVisiveis,
    };
  }

  private async somarTransacoesMensais(
    usuarioId: string,
    tipo: TipoTransacao,
    inicioMes: Date,
    fimMes: Date,
  ) {
    const agregacao = await this.prisma.transacao.aggregate({
      where: {
        usuarioId,
        tipo,
        status: StatusTransacao.EFETIVADA,
        dataOcorrencia: {
          gte: inicioMes,
          lte: fimMes,
        },
      },
      _sum: { valor: true },
    });

    return this.decimalParaNumero(agregacao._sum.valor);
  }

  private async calcularSaldoTotalContasVisiveis(usuarioId: string) {
    const contasVisiveis = await this.prisma.conta.findMany({
      where: {
        usuarioId,
        incluirSomaTotal: true,
      },
      select: {
        id: true,
        saldoInicial: true,
      },
    });

    if (contasVisiveis.length === 0) {
      return 0;
    }

    const idsContasVisiveis = contasVisiveis.map((conta) => conta.id);

    const transacoesEfetivadas = await this.prisma.transacao.findMany({
      where: {
        usuarioId,
        status: StatusTransacao.EFETIVADA,
        OR: [
          { contaId: { in: idsContasVisiveis } },
          { contaDestinoId: { in: idsContasVisiveis } },
        ],
      },
      select: {
        tipo: true,
        valor: true,
        contaId: true,
        contaDestinoId: true,
      },
    });

    const saldoPorConta = new Map<string, number>();

    for (const conta of contasVisiveis) {
      saldoPorConta.set(conta.id, this.decimalParaNumero(conta.saldoInicial));
    }

    for (const transacao of transacoesEfetivadas) {
      const valor = this.decimalParaNumero(transacao.valor);

      if (transacao.tipo === TipoTransacao.RECEITA && transacao.contaId) {
        this.adicionarSaldo(saldoPorConta, transacao.contaId, valor);
        continue;
      }

      if (transacao.tipo === TipoTransacao.DESPESA && transacao.contaId) {
        this.adicionarSaldo(saldoPorConta, transacao.contaId, -valor);
        continue;
      }

      if (transacao.tipo === TipoTransacao.TRANSFERENCIA) {
        if (transacao.contaId) {
          this.adicionarSaldo(saldoPorConta, transacao.contaId, -valor);
        }

        if (transacao.contaDestinoId) {
          this.adicionarSaldo(saldoPorConta, transacao.contaDestinoId, valor);
        }
      }
    }

    const saldoTotal = [...saldoPorConta.values()].reduce(
      (acumulado, saldoConta) => acumulado + saldoConta,
      0,
    );

    return this.arredondar(saldoTotal);
  }

  private adicionarSaldo(
    saldoPorConta: Map<string, number>,
    contaId: string,
    valor: number,
  ) {
    if (!saldoPorConta.has(contaId)) {
      return;
    }

    const saldoAtual = saldoPorConta.get(contaId) ?? 0;
    saldoPorConta.set(contaId, saldoAtual + valor);
  }

  private decimalParaNumero(valor?: Prisma.Decimal | null) {
    if (!valor) {
      return 0;
    }

    return Number(valor.toString());
  }

  private arredondar(valor: number) {
    return Number(valor.toFixed(2));
  }
}
