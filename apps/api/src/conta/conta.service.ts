import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContaDto } from './dto/create-conta.dto';
import { UpdateContaDto } from './dto/update-conta.dto';

@Injectable()
export class ContaService {
  constructor(private readonly prisma: PrismaService) {}

  criar(createContaDto: CreateContaDto) {
    return this.prisma.conta.create({
      data: {
        usuarioId: createContaDto.usuarioId,
        nome: createContaDto.nome,
        saldoInicial: createContaDto.saldoInicial,
        incluirSomaTotal: createContaDto.incluirSomaTotal,
        corHex: createContaDto.corHex,
      },
    });
  }

  listar(usuarioId: string) {
    return this.prisma.conta.findMany({
      where: { usuarioId },
      orderBy: { nome: 'asc' },
    });
  }

  async buscarPorId(id: string) {
    const conta = await this.prisma.conta.findUnique({ where: { id } });

    if (!conta) {
      throw new NotFoundException('Conta não encontrada');
    }

    return conta;
  }

  async atualizar(id: string, updateContaDto: UpdateContaDto) {
    await this.garantirContaExiste(id);

    return this.prisma.conta.update({
      where: { id },
      data: {
        nome: updateContaDto.nome,
        saldoInicial: updateContaDto.saldoInicial,
        incluirSomaTotal: updateContaDto.incluirSomaTotal,
        corHex: updateContaDto.corHex,
      },
    });
  }

  async remover(id: string) {
    await this.garantirContaExiste(id);
    await this.prisma.conta.delete({ where: { id } });

    return { mensagem: 'Conta removida com sucesso' };
  }

  private async garantirContaExiste(id: string) {
    const conta = await this.prisma.conta.findUnique({ where: { id } });

    if (!conta) {
      throw new NotFoundException('Conta não encontrada');
    }
  }
}
