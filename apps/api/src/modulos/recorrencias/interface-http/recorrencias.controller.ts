import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { UsuarioAtualId } from "../../../infraestrutura/http/usuario-atual-id.decorator";
import { RecorrenciasService } from "../aplicacao/recorrencias.service";

@Controller("recorrencias")
export class RecorrenciasController {
  constructor(private readonly recorrenciasService: RecorrenciasService) {}

  @Post()
  async criarLancamentoRecorrente(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.criarLancamentoRecorrente(corpo, usuarioAutenticadoId);
  }

  @Patch(":recorrenciaId/pausar")
  async pausarLancamentoRecorrente(
    @Param("recorrenciaId") recorrenciaId: string,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.pausarLancamentoRecorrente(
      recorrenciaId,
      usuarioAutenticadoId,
    );
  }

  @Patch(":recorrenciaId/reativar")
  async reativarLancamentoRecorrente(
    @Param("recorrenciaId") recorrenciaId: string,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.reativarLancamentoRecorrente(
      recorrenciaId,
      usuarioAutenticadoId,
    );
  }

  @Patch(":recorrenciaId/encerrar")
  async encerrarLancamentoRecorrente(
    @Param("recorrenciaId") recorrenciaId: string,
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.encerrarLancamentoRecorrente(
      recorrenciaId,
      corpo,
      usuarioAutenticadoId,
    );
  }

  @Post("ocorrencias")
  async gerarOcorrenciasNoPeriodo(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.gerarOcorrenciasNoPeriodo(corpo, usuarioAutenticadoId);
  }

  @Patch(":recorrenciaId/proximas")
  async editarProximasOcorrencias(
    @Param("recorrenciaId") recorrenciaId: string,
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.editarProximasOcorrencias(
      recorrenciaId,
      corpo,
      usuarioAutenticadoId,
    );
  }

  @Get()
  async listarLancamentosRecorrentes(
    @Query() query: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.listarLancamentosRecorrentes(
      query,
      usuarioAutenticadoId,
    );
  }

  @Post("cargas-multiusuario")
  async processarCargaRecorrenciasMultiusuario(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.recorrenciasService.processarCargaRecorrenciasMultiusuario(
      corpo,
      usuarioAutenticadoId,
    );
  }
}
