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
import { CarteirasService } from "../aplicacao/carteiras.service";

@Controller("carteiras")
export class CarteirasController {
  constructor(private readonly carteirasService: CarteirasService) {}

  @Post()
  async criarCarteira(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.criarCarteira(corpo, usuarioAutenticadoId);
  }

  @Get()
  async listarCarteiras(
    @Query() query: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.listarCarteiras(query, usuarioAutenticadoId);
  }

  @Get(":carteiraId")
  async buscarCarteira(
    @Param("carteiraId") carteiraId: string,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.buscarCarteira(carteiraId, usuarioAutenticadoId);
  }

  @Patch(":carteiraId")
  async editarCarteira(
    @Param("carteiraId") carteiraId: string,
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.editarCarteira(carteiraId, corpo, usuarioAutenticadoId);
  }

  @Delete(":carteiraId")
  async removerCarteira(
    @Param("carteiraId") carteiraId: string,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.removerCarteira(carteiraId, usuarioAutenticadoId);
  }

  @Post(":carteiraId/arquivar")
  async arquivarCarteira(
    @Param("carteiraId") carteiraId: string,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.arquivarCarteira(carteiraId, usuarioAutenticadoId);
  }

  @Post(":carteiraId/movimentacoes")
  async adicionarMovimentacao(
    @Param("carteiraId") carteiraId: string,
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.adicionarMovimentacao(
      carteiraId,
      corpo,
      usuarioAutenticadoId,
    );
  }

  @Post("transferencias-internas")
  async transferirEntreCarteiras(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.transferirEntreCarteiras(corpo, usuarioAutenticadoId);
  }

  @Post("importacoes-csv")
  async importarCsv(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.importarCsv(corpo, usuarioAutenticadoId);
  }

  @Post("cargas-multiusuario")
  async processarCargaMultiusuario(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.carteirasService.processarCargaMultiusuario(
      corpo,
      usuarioAutenticadoId,
    );
  }
}
