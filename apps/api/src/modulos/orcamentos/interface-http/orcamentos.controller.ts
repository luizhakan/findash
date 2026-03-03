import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { OrcamentosService } from "../aplicacao/orcamentos.service";

@Controller("orcamentos/categorias")
export class OrcamentosController {
  constructor(private readonly orcamentosService: OrcamentosService) {}

  @Post()
  async criarOrcamentoCategoria(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.criarOrcamentoCategoria(corpo);
  }

  @Patch(":orcamentoId")
  async editarOrcamentoCategoria(
    @Param("orcamentoId") orcamentoId: string,
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.editarOrcamentoCategoria(orcamentoId, corpo);
  }

  @Post("consumo")
  async registrarConsumoNoOrcamento(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.registrarConsumoNoOrcamento(corpo);
  }

  @Post("estorno")
  async registrarEstornoNoOrcamento(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.registrarEstornoNoOrcamento(corpo);
  }

  @Post("busca")
  async buscarOrcamentoCategoria(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.buscarOrcamentoCategoria(corpo);
  }

  @Get()
  async listarOrcamentosCategoria(
    @Query() query: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.listarOrcamentosCategoria(query);
  }

  @Post("cargas-multiusuario")
  async processarCargaOrcamentosMultiusuario(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.orcamentosService.processarCargaOrcamentosMultiusuario(corpo);
  }
}
