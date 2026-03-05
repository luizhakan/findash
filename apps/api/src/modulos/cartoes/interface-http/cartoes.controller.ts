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
import { UsuarioAtualId } from "../../../infraestrutura/http/usuario-atual-id.decorator";
import { CartoesService } from "../aplicacao/cartoes.service";

@Controller("cartoes")
export class CartoesController {
  constructor(private readonly cartoesService: CartoesService) {}

  @Post()
  async criarCartao(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.criarCartao(corpo, usuarioAutenticadoId);
  }

  @Patch(":cartaoId")
  async editarCartao(
    @Param("cartaoId") cartaoId: string,
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.editarCartao(cartaoId, corpo, usuarioAutenticadoId);
  }

  @Post("compras")
  async registrarCompraCartao(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.registrarCompraCartao(corpo, usuarioAutenticadoId);
  }

  @Patch("compras/:compraId")
  async editarCompraCartao(
    @Param("compraId") compraId: string,
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.editarCompraCartao(compraId, corpo, usuarioAutenticadoId);
  }

  @Post("faturas/juros")
  async adicionarJurosManualFatura(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.adicionarJurosManualFatura(corpo, usuarioAutenticadoId);
  }

  @Patch("faturas/juros")
  async editarJurosManualFatura(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.editarJurosManualFatura(corpo, usuarioAutenticadoId);
  }

  @Delete("faturas/:faturaId/juros")
  async removerJurosManualFatura(
    @Param("faturaId") faturaId: string,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.removerJurosManualFatura(faturaId, usuarioAutenticadoId);
  }

  @Get()
  async listarCartoes(
    @Query() query: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.listarCartoes(query, usuarioAutenticadoId);
  }

  @Get("faturas")
  async listarFaturas(
    @Query() query: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.cartoesService.listarFaturas(query, usuarioAutenticadoId);
  }
}
