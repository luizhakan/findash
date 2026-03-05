import { SetMetadata } from "@nestjs/common";

export const ROTA_PUBLICA_CHAVE = "rota_publica";

export const Publico = (): MethodDecorator & ClassDecorator =>
  SetMetadata(ROTA_PUBLICA_CHAVE, true);
