import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { TransferenciasService } from "../aplicacao/transferencias.service";

@Controller("transferencias")
export class TransferenciasController {
  constructor(private readonly transferenciasService: TransferenciasService) {}

  @Post()
  async transferirEntreCarteiras(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.transferenciasService.transferirEntreCarteiras(corpo);
  }

  @Get()
  async listarTransferenciasPorUsuario(
    @Query() query: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.transferenciasService.listarTransferenciasPorUsuario(query);
  }

  @Post("cargas-multiusuario")
  async processarCargaTransferenciasMultiusuario(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.transferenciasService.processarCargaTransferenciasMultiusuario(corpo);
  }
}
