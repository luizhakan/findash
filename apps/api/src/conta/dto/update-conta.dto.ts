import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateContaDto {
  @IsOptional()
  @IsString()
  nome?: string;

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
