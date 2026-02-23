import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  criar(createTagDto: CreateTagDto) {
    return this.prisma.tag.create({
      data: {
        usuarioId: createTagDto.usuarioId,
        nome: createTagDto.nome,
      },
    });
  }

  listar(usuarioId: string) {
    return this.prisma.tag.findMany({
      where: { usuarioId },
      orderBy: { nome: 'asc' },
    });
  }

  async buscarPorId(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });

    if (!tag) {
      throw new NotFoundException('Tag não encontrada');
    }

    return tag;
  }

  async atualizar(id: string, updateTagDto: UpdateTagDto) {
    await this.garantirTagExiste(id);

    return this.prisma.tag.update({
      where: { id },
      data: {
        nome: updateTagDto.nome,
      },
    });
  }

  async remover(id: string) {
    await this.garantirTagExiste(id);
    await this.prisma.tag.delete({ where: { id } });

    return { mensagem: 'Tag removida com sucesso' };
  }

  private async garantirTagExiste(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });

    if (!tag) {
      throw new NotFoundException('Tag não encontrada');
    }
  }
}
