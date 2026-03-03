import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CartoesService } from "../aplicacao/cartoes.service";

@Controller("cartoes")
export class CartoesController {
  constructor(private readonly cartoesService: CartoesService) {}

  @Post()
  async criarCartao(@Body() corpo: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.cartoesService.criarCartao(corpo);
  }

  @Patch(":cartaoId")
  async editarCartao(
    @Param("cartaoId") cartaoId: string,
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.editarCartao(cartaoId, corpo);
  }

  @Post("compras")
  async registrarCompraCartao(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.registrarCompraCartao(corpo);
  }

  @Patch("compras/:compraId")
  async editarCompraCartao(
    @Param("compraId") compraId: string,
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.editarCompraCartao(compraId, corpo);
  }

  @Post("faturas/juros")
  async adicionarJurosManualFatura(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.adicionarJurosManualFatura(corpo);
  }

  @Patch("faturas/juros")
  async editarJurosManualFatura(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.editarJurosManualFatura(corpo);
  }

  @Delete("faturas/:faturaId/juros")
  async removerJurosManualFatura(
    @Param("faturaId") faturaId: string,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.removerJurosManualFatura(faturaId);
  }

  @Get()
  async listarCartoes(@Query() query: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.cartoesService.listarCartoes(query);
  }

  @Get("faturas")
  async listarFaturas(@Query() query: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.cartoesService.listarFaturas(query);
  }
}
