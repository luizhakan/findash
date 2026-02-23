import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class UpdateCartaoCreditoDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  limite?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  diaFechamento?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  diaVencimento?: number;

  @IsOptional()
  @IsUUID()
  contaPagamentoId?: string;
}
