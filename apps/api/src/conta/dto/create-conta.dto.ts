import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateContaDto {
  @IsUUID()
  usuarioId: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  saldoInicial?: number;

  @IsOptional()
  @IsBoolean()
  incluirSomaTotal?: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6})$/)
  corHex?: string;
}
