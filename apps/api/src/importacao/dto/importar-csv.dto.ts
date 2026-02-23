import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

enum TipoBanco {
  NUBANK = 'NUBANK',
  INTER = 'INTER',
  MERCADO_PAGO = 'MERCADO_PAGO',
}

export class ImportarCsvDto {
  @IsUUID()
  usuarioId: string;

  @IsEnum(TipoBanco)
  @IsNotEmpty()
  banco: TipoBanco;

  @IsOptional()
  @IsUUID()
  contaId?: string;
}
