import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateCartaoCreditoDto {
  @IsUUID()
  usuarioId: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  limite: number;

  @IsInt()
  @Min(1)
  @Max(31)
  diaFechamento: number;

  @IsInt()
  @Min(1)
  @Max(31)
  diaVencimento: number;

  @IsOptional()
  @IsUUID()
  contaPagamentoId?: string;
}
