import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { HabilitarBiometriaDto } from './dto/habilitar-biometria.dto';

@Injectable()
export class BiometriaService {
  private readonly prisma: PrismaClient;

  constructor(prismaService: PrismaService) {
    this.prisma = prismaService;
  }

  async verificarStatusBiometria(
    usuarioId: string,
  ): Promise<{ usuarioId: string; biometriaHabilitada: boolean }> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, biometriaHabilitada: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      usuarioId: usuario.id,
      biometriaHabilitada: usuario.biometriaHabilitada,
    };
  }

  async habilitarBiometria(
    habilitarBiometriaDto: HabilitarBiometriaDto,
  ): Promise<{
    mensagem: string;
    usuarioId: string;
    biometriaHabilitada: boolean;
  }> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: habilitarBiometriaDto.usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const usuarioAtualizado = await this.prisma.usuario.update({
      where: { id: habilitarBiometriaDto.usuarioId },
      data: {
        biometriaHabilitada: habilitarBiometriaDto.habilitada,
      },
      select: {
        id: true,
        biometriaHabilitada: true,
      },
    });

    return {
      mensagem: habilitarBiometriaDto.habilitada
        ? 'Biometria habilitada com sucesso'
        : 'Biometria desabilitada com sucesso',
      usuarioId: usuarioAtualizado.id,
      biometriaHabilitada: usuarioAtualizado.biometriaHabilitada,
    };
  }
}
