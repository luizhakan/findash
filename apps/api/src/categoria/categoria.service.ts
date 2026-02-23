import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(private readonly prisma: PrismaService) {}

  criar(createCategoriaDto: CreateCategoriaDto) {
    return this.prisma.categoria.create({
      data: {
        usuarioId: createCategoriaDto.usuarioId,
        nome: createCategoriaDto.nome,
        tipo: createCategoriaDto.tipo,
        corHex: createCategoriaDto.corHex,
        icone: createCategoriaDto.icone,
      },
    });
  }

  listar(usuarioId: string) {
    return this.prisma.categoria.findMany({
      where: {
        OR: [{ usuarioId }, { usuarioId: null }],
      },
      orderBy: [{ nome: 'asc' }],
    });
  }

  async buscarPorId(id: string) {
    const categoria = await this.prisma.categoria.findUnique({ where: { id } });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return categoria;
  }

  async atualizar(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    await this.garantirCategoriaExiste(id);

    return this.prisma.categoria.update({
      where: { id },
      data: {
        nome: updateCategoriaDto.nome,
        tipo: updateCategoriaDto.tipo,
        corHex: updateCategoriaDto.corHex,
        icone: updateCategoriaDto.icone,
      },
    });
  }

  async remover(id: string) {
    await this.garantirCategoriaExiste(id);
    await this.prisma.categoria.delete({ where: { id } });

    return { mensagem: 'Categoria removida com sucesso' };
  }

  private async garantirCategoriaExiste(id: string) {
    const categoria = await this.prisma.categoria.findUnique({ where: { id } });

    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }
  }
}
