import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { UsuarioAtualId } from "../../../infraestrutura/http/usuario-atual-id.decorator";
import { TransferenciasService } from "../aplicacao/transferencias.service";

@Controller("transferencias")
export class TransferenciasController {
  constructor(private readonly transferenciasService: TransferenciasService) {}

  @Post()
  async transferirEntreCarteiras(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.transferenciasService.transferirEntreCarteiras(corpo, usuarioAutenticadoId);
  }

  @Get()
  async listarTransferenciasPorUsuario(
    @Query() query: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.transferenciasService.listarTransferenciasPorUsuario(
      query,
      usuarioAutenticadoId,
    );
  }

  @Post("cargas-multiusuario")
  async processarCargaTransferenciasMultiusuario(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.transferenciasService.processarCargaTransferenciasMultiusuario(
      corpo,
      usuarioAutenticadoId,
    );
  }
}
