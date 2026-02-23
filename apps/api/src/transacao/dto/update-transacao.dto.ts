import { StatusTransacao, TipoTransacao } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class UpdateTransacaoDto {
  @IsOptional()
  @IsEnum(TipoTransacao)
  tipo?: TipoTransacao;

  @IsOptional()
  @IsEnum(StatusTransacao)
  status?: StatusTransacao;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataOcorrencia?: Date;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsUUID()
  contaId?: string;

  @IsOptional()
  @IsUUID()
  contaDestinoId?: string;

  @IsOptional()
  @IsUUID()
  faturaId?: string;

  @IsOptional()
  @IsUUID()
  categoriaId?: string;

  @IsOptional()
  @IsInt()
  parcelaAtual?: number;

  @IsOptional()
  @IsInt()
  totalParcelas?: number;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsOptional()
  @IsString()
  anexoBase64?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];
}
