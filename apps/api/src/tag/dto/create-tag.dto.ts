import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTagDto {
  @IsUUID()
  usuarioId: string;

  @IsString()
  @IsNotEmpty()
  nome: string;
}
