import { Body, Controller, Get, Patch, Param } from '@nestjs/common';
import { BiometriaService } from './biometria.service';
import { HabilitarBiometriaDto } from './dto/habilitar-biometria.dto';

@Controller('biometria')
export class BiometriaController {
  constructor(private readonly biometriaService: BiometriaService) {}

  @Get(':usuarioId/status')
  async verificarStatus(@Param('usuarioId') usuarioId: string) {
    return this.biometriaService.verificarStatusBiometria(usuarioId);
  }

  @Patch('habilitar')
  async habilitar(@Body() habilitarBiometriaDto: HabilitarBiometriaDto) {
    return this.biometriaService.habilitarBiometria(habilitarBiometriaDto);
  }
}
