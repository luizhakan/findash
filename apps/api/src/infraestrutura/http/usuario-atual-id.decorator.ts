import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";

type RequestComUsuario = Request & {
  usuario_id?: string;
};

export const UsuarioAtualId = createParamDecorator(
  (_dados: unknown, contexto: ExecutionContext): string => {
    const requisicao = contexto.switchToHttp().getRequest<RequestComUsuario>();
    const usuarioId = requisicao.usuario_id;

    if (!usuarioId) {
      throw new UnauthorizedException("Usuario autenticado nao encontrado na requisicao.");
    }

    return usuarioId;
  },
);
