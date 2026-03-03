import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { RecorrenciasService } from "../aplicacao/recorrencias.service";

@Controller("recorrencias")
export class RecorrenciasController {
  constructor(private readonly recorrenciasService: RecorrenciasService) {}

  @Post()
  async criarLancamentoRecorrente(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.criarLancamentoRecorrente(corpo);
  }

  @Patch(":recorrenciaId/pausar")
  async pausarLancamentoRecorrente(
    @Param("recorrenciaId") recorrenciaId: string,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.pausarLancamentoRecorrente(recorrenciaId);
  }

  @Patch(":recorrenciaId/reativar")
  async reativarLancamentoRecorrente(
    @Param("recorrenciaId") recorrenciaId: string,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.reativarLancamentoRecorrente(recorrenciaId);
  }

  @Patch(":recorrenciaId/encerrar")
  async encerrarLancamentoRecorrente(
    @Param("recorrenciaId") recorrenciaId: string,
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.encerrarLancamentoRecorrente(recorrenciaId, corpo);
  }

  @Post("ocorrencias")
  async gerarOcorrenciasNoPeriodo(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.gerarOcorrenciasNoPeriodo(corpo);
  }

  @Patch(":recorrenciaId/proximas")
  async editarProximasOcorrencias(
    @Param("recorrenciaId") recorrenciaId: string,
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.editarProximasOcorrencias(recorrenciaId, corpo);
  }

  @Get()
  async listarLancamentosRecorrentes(
    @Query() query: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.listarLancamentosRecorrentes(query);
  }

  @Post("cargas-multiusuario")
  async processarCargaRecorrenciasMultiusuario(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.processarCargaRecorrenciasMultiusuario(corpo);
  }
}
