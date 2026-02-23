import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCartaoCreditoDto } from './dto/create-cartao-credito.dto';
import { UpdateCartaoCreditoDto } from './dto/update-cartao-credito.dto';

@Injectable()
export class CartaoCreditoService {
  constructor(private readonly prisma: PrismaService) {}

  criar(createCartaoCreditoDto: CreateCartaoCreditoDto) {
    return this.prisma.cartaoCredito.create({
      data: {
        usuarioId: createCartaoCreditoDto.usuarioId,
        nome: createCartaoCreditoDto.nome,
        limite: createCartaoCreditoDto.limite,
        diaFechamento: createCartaoCreditoDto.diaFechamento,
        diaVencimento: createCartaoCreditoDto.diaVencimento,
        contaPagamentoId: createCartaoCreditoDto.contaPagamentoId,
      },
    });
  }

  listar(usuarioId: string) {
    return this.prisma.cartaoCredito.findMany({
      where: { usuarioId },
      orderBy: { nome: 'asc' },
      include: { contaPagamento: true },
    });
  }

  async buscarPorId(id: string) {
    const cartao = await this.prisma.cartaoCredito.findUnique({
      where: { id },
      include: { contaPagamento: true, faturas: true },
    });

    if (!cartao) {
      throw new NotFoundException('Cartão de crédito não encontrado');
    }

    return cartao;
  }

  async atualizar(id: string, updateCartaoCreditoDto: UpdateCartaoCreditoDto) {
    await this.garantirCartaoExiste(id);

    return this.prisma.cartaoCredito.update({
      where: { id },
      data: {
        nome: updateCartaoCreditoDto.nome,
        limite: updateCartaoCreditoDto.limite,
        diaFechamento: updateCartaoCreditoDto.diaFechamento,
        diaVencimento: updateCartaoCreditoDto.diaVencimento,
        contaPagamentoId: updateCartaoCreditoDto.contaPagamentoId,
      },
    });
  }

  async remover(id: string) {
    await this.garantirCartaoExiste(id);
    await this.prisma.cartaoCredito.delete({ where: { id } });

    return { mensagem: 'Cartão de crédito removido com sucesso' };
  }

  private async garantirCartaoExiste(id: string) {
    const cartao = await this.prisma.cartaoCredito.findUnique({
      where: { id },
    });

    if (!cartao) {
      throw new NotFoundException('Cartão de crédito não encontrado');
    }
  }
}
