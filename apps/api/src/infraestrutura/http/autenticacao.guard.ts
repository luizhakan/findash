import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";
import { PrismaService } from "../prisma/prisma.service";
import { ROTA_PUBLICA_CHAVE } from "./publico.decorator";

type RequestComUsuario = Request & {
  usuario_id?: string;
};

@Injectable()
export class AutenticacaoGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const rotaPublica = this.reflector.getAllAndOverride<boolean>(ROTA_PUBLICA_CHAVE, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);

    if (rotaPublica) {
      return true;
    }

    const requisicao = contexto.switchToHttp().getRequest<RequestComUsuario>();
    const usuarioId = this.extrairUsuarioIdDaCredencial(requisicao);

    if (!usuarioId) {
      throw new UnauthorizedException(
        "Credencial ausente. Use Authorization: Bearer <usuario_id> ou x-usuario-id.",
      );
    }

    const usuario = await this.prismaService.usuario.findFirst({
      where: {
        id: usuarioId,
        status: "ATIVO",
        removido_em: null,
      },
      select: { id: true },
    });

    if (!usuario) {
      throw new UnauthorizedException("Credencial invalida para usuario ativo.");
    }

    requisicao.usuario_id = usuario.id;
    return true;
  }

  private extrairUsuarioIdDaCredencial(requisicao: Request): string | null {
    const cabecalhoUsuario = requisicao.header("x-usuario-id")?.trim();
    if (cabecalhoUsuario) {
      return cabecalhoUsuario;
    }

    const cabecalhoAutorizacao = requisicao.header("authorization") ?? "";
    if (cabecalhoAutorizacao.startsWith("Bearer ")) {
      const token = cabecalhoAutorizacao.slice(7).trim();
      return token || null;
    }

    return null;
  }
}
