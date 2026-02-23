import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class PagarFaturaDto {
  @IsUUID()
  contaPagamentoId: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valorPago?: number;
}
