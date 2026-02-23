import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CriarNotificacaoDto,
  AtualizarNotificacaoDto,
} from './dto/criar-notificacao.dto';
import { Notificacao, PrismaClient, TipoNotificacao } from '@prisma/client';

@Injectable()
export class NotificacaoService {
  private readonly prisma: PrismaClient;

  constructor(prismaService: PrismaService) {
    this.prisma = prismaService;
  }

  async obterNotificacoes(
    usuarioId: string,
    apenasNaoLidas = false,
  ): Promise<Notificacao[]> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return await this.prisma.notificacao.findMany({
      where: {
        usuarioId,
        ...(apenasNaoLidas && { lido: false }),
        ativo: true,
      },
      orderBy: { dataAgendada: 'desc' },
    });
  }

  async criarNotificacao(
    criarNotificacaoDto: CriarNotificacaoDto,
  ): Promise<Notificacao> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: criarNotificacaoDto.usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const dataAgendada = new Date(criarNotificacaoDto.dataAgendada);
    if (dataAgendada < new Date()) {
      throw new BadRequestException('Data agendada não pode ser no passado');
    }

    return await this.prisma.notificacao.create({
      data: {
        usuarioId: criarNotificacaoDto.usuarioId,
        tipo: criarNotificacaoDto.tipo,
        titulo: criarNotificacaoDto.titulo,
        descricao: criarNotificacaoDto.descricao,
        dataAgendada,
      },
    });
  }

  async marcarComoLido(notificacaoId: string): Promise<Notificacao> {
    const notificacao = await this.prisma.notificacao.findUnique({
      where: { id: notificacaoId },
    });

    if (!notificacao) {
      throw new NotFoundException('Notificação não encontrada');
    }

    return await this.prisma.notificacao.update({
      where: { id: notificacaoId },
      data: { lido: true },
    });
  }

  async marcarTodosComoLido(
    usuarioId: string,
  ): Promise<{ notificacoesAtualizadas: number; mensagem: string }> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const resultado = await this.prisma.notificacao.updateMany({
      where: {
        usuarioId,
        lido: false,
      },
      data: { lido: true },
    });

    return {
      notificacoesAtualizadas: resultado.count,
      mensagem: `${resultado.count} notificações marcadas como lidas`,
    };
  }

  async desativarNotificacao(notificacaoId: string): Promise<Notificacao> {
    const notificacao = await this.prisma.notificacao.findUnique({
      where: { id: notificacaoId },
    });

    if (!notificacao) {
      throw new NotFoundException('Notificação não encontrada');
    }

    return await this.prisma.notificacao.update({
      where: { id: notificacaoId },
      data: { ativo: false },
    });
  }

  async atualizarNotificacao(
    notificacaoId: string,
    atualizarNotificacaoDto: AtualizarNotificacaoDto,
  ): Promise<Notificacao> {
    const notificacao = await this.prisma.notificacao.findUnique({
      where: { id: notificacaoId },
    });

    if (!notificacao) {
      throw new NotFoundException('Notificação não encontrada');
    }

    return await this.prisma.notificacao.update({
      where: { id: notificacaoId },
      data: {
        ...(atualizarNotificacaoDto.titulo && {
          titulo: atualizarNotificacaoDto.titulo,
        }),
        ...(atualizarNotificacaoDto.descricao && {
          descricao: atualizarNotificacaoDto.descricao,
        }),
        ...(atualizarNotificacaoDto.dataAgendada && {
          dataAgendada: new Date(atualizarNotificacaoDto.dataAgendada),
        }),
      },
    });
  }

  async criarNotificacoesAutomaticasFaturaVencendo(): Promise<{
    notificacoesGeradas: number;
  }> {
    // Buscar faturas que vencem nos próximos 7 dias
    const proximosDias = new Date();
    proximosDias.setDate(proximosDias.getDate() + 7);

    const faturas = await this.prisma.fatura.findMany({
      where: {
        status: 'ABERTA',
      },
      include: {
        cartao: {
          include: {
            usuario: true,
          },
        },
      },
    });

    const notificacoesParaCriar = faturas
      .filter((fatura) => {
        const dataVencimento = new Date(
          fatura.ano,
          fatura.mes - 1,
          fatura.cartao.diaVencimento,
        );
        return dataVencimento <= proximosDias && dataVencimento >= new Date();
      })
      .map((fatura) => ({
        usuarioId: fatura.cartao.usuario.id,
        tipo: 'FATURA_VENCENDO' as TipoNotificacao,
        titulo: `Fatura do ${fatura.cartao.nome} vencendo`,
        descricao: `Fatura de ${fatura.mes}/${fatura.ano} vence em breve`,
        dataAgendada: new Date(
          fatura.ano,
          fatura.mes - 1,
          fatura.cartao.diaVencimento - 2,
        ),
      }));

    if (notificacoesParaCriar.length > 0) {
      await this.prisma.notificacao.createMany({
        data: notificacoesParaCriar,
        skipDuplicates: true,
      });
    }

    return {
      notificacoesGeradas: notificacoesParaCriar.length,
    };
  }
}
