import { TipoCategoria } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateCategoriaDto {
  @IsUUID()
  usuarioId: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEnum(TipoCategoria)
  tipo: TipoCategoria;

  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6})$/)
  corHex?: string;

  @IsOptional()
  @IsString()
  icone?: string;
}
