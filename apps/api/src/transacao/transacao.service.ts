import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TipoTransacao } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { UpdateTransacaoDto } from './dto/update-transacao.dto';

@Injectable()
export class TransacaoService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(createTransacaoDto: CreateTransacaoDto) {
    this.validarRegrasDeTipo(
      createTransacaoDto.tipo,
      createTransacaoDto.contaId,
      createTransacaoDto.contaDestinoId,
    );
    await this.validarTagsDoUsuario(
      createTransacaoDto.usuarioId,
      createTransacaoDto.tagIds,
    );

    return this.prisma.transacao.create({
      data: {
        usuarioId: createTransacaoDto.usuarioId,
        tipo: createTransacaoDto.tipo,
        status: createTransacaoDto.status,
        valor: createTransacaoDto.valor,
        dataOcorrencia: createTransacaoDto.dataOcorrencia,
        descricao: createTransacaoDto.descricao,
        contaId: createTransacaoDto.contaId,
        contaDestinoId: createTransacaoDto.contaDestinoId,
        faturaId: createTransacaoDto.faturaId,
        categoriaId: createTransacaoDto.categoriaId,
        parcelaAtual: createTransacaoDto.parcelaAtual,
        totalParcelas: createTransacaoDto.totalParcelas,
        notas: createTransacaoDto.notas,
        anexoBase64: createTransacaoDto.anexoBase64,
        tags: this.mapearTags(createTransacaoDto.tagIds),
      },
      include: { tags: true },
    });
  }

  listar(usuarioId: string) {
    return this.prisma.transacao.findMany({
      where: { usuarioId },
      orderBy: [{ dataOcorrencia: 'desc' }],
      include: { tags: true },
    });
  }

  async buscarPorId(id: string) {
    const transacao = await this.prisma.transacao.findUnique({
      where: { id },
      include: { tags: true },
    });

    if (!transacao) {
      throw new NotFoundException('Transação não encontrada');
    }

    return transacao;
  }

  async atualizar(id: string, updateTransacaoDto: UpdateTransacaoDto) {
    const transacaoAtual = await this.prisma.transacao.findUnique({
      where: { id },
    });

    if (!transacaoAtual) {
      throw new NotFoundException('Transação não encontrada');
    }

    const tipoFinal = updateTransacaoDto.tipo ?? transacaoAtual.tipo;
    const contaIdFinal =
      'contaId' in updateTransacaoDto
        ? (updateTransacaoDto.contaId ?? null)
        : transacaoAtual.contaId;
    const contaDestinoIdFinal =
      'contaDestinoId' in updateTransacaoDto
        ? (updateTransacaoDto.contaDestinoId ?? null)
        : transacaoAtual.contaDestinoId;

    this.validarRegrasDeTipo(tipoFinal, contaIdFinal, contaDestinoIdFinal);

    if (updateTransacaoDto.tagIds) {
      await this.validarTagsDoUsuario(
        transacaoAtual.usuarioId,
        updateTransacaoDto.tagIds,
      );
    }

    return this.prisma.transacao.update({
      where: { id },
      data: {
        tipo: updateTransacaoDto.tipo,
        status: updateTransacaoDto.status,
        valor: updateTransacaoDto.valor,
        dataOcorrencia: updateTransacaoDto.dataOcorrencia,
        descricao: updateTransacaoDto.descricao,
        contaId: updateTransacaoDto.contaId,
        contaDestinoId: updateTransacaoDto.contaDestinoId,
        faturaId: updateTransacaoDto.faturaId,
        categoriaId: updateTransacaoDto.categoriaId,
        parcelaAtual: updateTransacaoDto.parcelaAtual,
        totalParcelas: updateTransacaoDto.totalParcelas,
        notas: updateTransacaoDto.notas,
        anexoBase64: updateTransacaoDto.anexoBase64,
        tags:
          updateTransacaoDto.tagIds !== undefined
            ? { set: updateTransacaoDto.tagIds.map((idTag) => ({ id: idTag })) }
            : undefined,
      },
      include: { tags: true },
    });
  }

  async remover(id: string) {
    await this.buscarPorId(id);
    await this.prisma.transacao.delete({ where: { id } });

    return { mensagem: 'Transação removida com sucesso' };
  }

  private validarRegrasDeTipo(
    tipo: TipoTransacao,
    contaId?: string | null,
    contaDestinoId?: string | null,
  ) {
    if (tipo === TipoTransacao.TRANSFERENCIA) {
      if (!contaId || !contaDestinoId) {
        throw new BadRequestException(
          'Transferência exige conta de origem e conta de destino',
        );
      }

      if (contaId === contaDestinoId) {
        throw new BadRequestException(
          'Conta de origem e destino devem ser diferentes',
        );
      }

      return;
    }

    if (!contaId) {
      throw new BadRequestException(
        'Receitas e despesas manuais exigem conta de origem',
      );
    }

    if (contaDestinoId) {
      throw new BadRequestException(
        'Conta de destino só pode ser usada em transferências',
      );
    }
  }

  private mapearTags(tagIds?: string[]) {
    if (!tagIds || tagIds.length === 0) {
      return undefined;
    }

    return { connect: tagIds.map((idTag) => ({ id: idTag })) };
  }

  private async validarTagsDoUsuario(usuarioId: string, tagIds?: string[]) {
    if (!tagIds || tagIds.length === 0) {
      return;
    }

    const quantidadeTags = await this.prisma.tag.count({
      where: {
        usuarioId,
        id: { in: tagIds },
      },
    });

    if (quantidadeTags !== tagIds.length) {
      throw new BadRequestException(
        'Uma ou mais tags não pertencem ao usuário informado',
      );
    }
  }
}
