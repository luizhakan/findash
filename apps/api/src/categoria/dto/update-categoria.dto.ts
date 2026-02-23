import { TipoCategoria } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateCategoriaDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsEnum(TipoCategoria)
  tipo?: TipoCategoria;

  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6})$/)
  corHex?: string;

  @IsOptional()
  @IsString()
  icone?: string;
}
