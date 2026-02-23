import { IsBoolean, IsUUID } from 'class-validator';

export class HabilitarBiometriaDto {
  @IsUUID()
  usuarioId: string;

  @IsBoolean()
  habilitada: boolean;
}
