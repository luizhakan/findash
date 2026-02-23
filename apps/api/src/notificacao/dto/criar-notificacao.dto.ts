import {
  IsString,
  IsOptional,
  IsISO8601,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { TipoNotificacao } from '@prisma/client';

export class CriarNotificacaoDto {
  @IsUUID()
  usuarioId: string;

  @IsEnum(TipoNotificacao)
  tipo: TipoNotificacao;

  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsISO8601()
  dataAgendada: string;
}

export class AtualizarNotificacaoDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsISO8601()
  dataAgendada?: string;
}
