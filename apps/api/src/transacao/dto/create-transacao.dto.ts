import { StatusTransacao, TipoTransacao } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateTransacaoDto {
  @IsUUID()
  usuarioId: string;

  @IsEnum(TipoTransacao)
  tipo: TipoTransacao;

  @IsEnum(StatusTransacao)
  status: StatusTransacao;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor: number;

  @Type(() => Date)
  @IsDate()
  dataOcorrencia: Date;

  @IsString()
  @IsNotEmpty()
  descricao: string;

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
