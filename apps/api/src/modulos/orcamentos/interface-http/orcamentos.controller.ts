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
import { OrcamentosService } from "../aplicacao/orcamentos.service";

@Controller("orcamentos/categorias")
export class OrcamentosController {
  constructor(private readonly orcamentosService: OrcamentosService) {}

  @Post()
  async criarOrcamentoCategoria(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.criarOrcamentoCategoria(corpo, usuarioAutenticadoId);
  }

  @Patch(":orcamentoId")
  async editarOrcamentoCategoria(
    @Param("orcamentoId") orcamentoId: string,
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.editarOrcamentoCategoria(
      orcamentoId,
      corpo,
      usuarioAutenticadoId,
    );
  }

  @Post("consumo")
  async registrarConsumoNoOrcamento(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.registrarConsumoNoOrcamento(corpo, usuarioAutenticadoId);
  }

  @Post("estorno")
  async registrarEstornoNoOrcamento(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.registrarEstornoNoOrcamento(corpo, usuarioAutenticadoId);
  }

  @Post("busca")
  async buscarOrcamentoCategoria(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.buscarOrcamentoCategoria(corpo, usuarioAutenticadoId);
  }

  @Get()
  async listarOrcamentosCategoria(
    @Query() query: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.listarOrcamentosCategoria(query, usuarioAutenticadoId);
  }

  @Post("cargas-multiusuario")
  async processarCargaOrcamentosMultiusuario(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.processarCargaOrcamentosMultiusuario(
      corpo,
      usuarioAutenticadoId,
    );
  }
}
