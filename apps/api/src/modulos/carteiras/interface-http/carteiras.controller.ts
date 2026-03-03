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
import { CarteirasService } from "../aplicacao/carteiras.service";

@Controller("carteiras")
export class CarteirasController {
  constructor(private readonly carteirasService: CarteirasService) {}

  @Post()
  async criarCarteira(@Body() corpo: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.carteirasService.criarCarteira(corpo);
  }

  @Get()
  async listarCarteiras(
    @Query() query: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.listarCarteiras(query);
  }

  @Get(":carteiraId")
  async buscarCarteira(
    @Param("carteiraId") carteiraId: string,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.buscarCarteira(carteiraId);
  }

  @Patch(":carteiraId")
  async editarCarteira(
    @Param("carteiraId") carteiraId: string,
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.editarCarteira(carteiraId, corpo);
  }

  @Delete(":carteiraId")
  async removerCarteira(
    @Param("carteiraId") carteiraId: string,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.removerCarteira(carteiraId);
  }

  @Post(":carteiraId/arquivar")
  async arquivarCarteira(
    @Param("carteiraId") carteiraId: string,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.arquivarCarteira(carteiraId);
  }

  @Post(":carteiraId/movimentacoes")
  async adicionarMovimentacao(
    @Param("carteiraId") carteiraId: string,
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.adicionarMovimentacao(carteiraId, corpo);
  }

  @Post("transferencias-internas")
  async transferirEntreCarteiras(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.transferirEntreCarteiras(corpo);
  }

  @Post("importacoes-csv")
  async importarCsv(@Body() corpo: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.carteirasService.importarCsv(corpo);
  }

  @Post("cargas-multiusuario")
  async processarCargaMultiusuario(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.processarCargaMultiusuario(corpo);
  }
}
