import { Body, Controller, Delete, Patch, Post } from "@nestjs/common";
import { UsuarioAtualId } from "../../../infraestrutura/http/usuario-atual-id.decorator";
import { SaldosService } from "../aplicacao/saldos.service";

@Controller("saldos/consolidado")
export class SaldosController {
  constructor(private readonly saldosService: SaldosService) {}

  @Post("calcular")
  async calcularSaldoConsolidado(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.saldosService.calcularSaldoConsolidado(corpo, usuarioAutenticadoId);
  }

  @Patch("visibilidade")
  async alterarVisibilidadeCarteira(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.saldosService.alterarVisibilidadeCarteira(corpo, usuarioAutenticadoId);
  }

  @Post("registrar-carteira")
  async registrarCarteiraNoConsolidado(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.saldosService.registrarCarteiraNoConsolidado(corpo, usuarioAutenticadoId);
  }

  @Delete("carteira")
  async removerCarteiraDoConsolidado(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.saldosService.removerCarteiraDoConsolidado(corpo, usuarioAutenticadoId);
  }

  @Post("recalcular")
  async recalcularAposMovimentacao(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.saldosService.recalcularAposMovimentacao(corpo, usuarioAutenticadoId);
  }

  @Post("cargas-multiusuario")
  async processarCargaSaldoMultiusuario(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.saldosService.processarCargaSaldoMultiusuario(corpo, usuarioAutenticadoId);
  }
}
