import { Body, Controller, Delete, Patch, Post } from "@nestjs/common";
import { SaldosService } from "../aplicacao/saldos.service";

@Controller("saldos/consolidado")
export class SaldosController {
  constructor(private readonly saldosService: SaldosService) {}

  @Post("calcular")
  async calcularSaldoConsolidado(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.saldosService.calcularSaldoConsolidado(corpo);
  }

  @Patch("visibilidade")
  async alterarVisibilidadeCarteira(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.saldosService.alterarVisibilidadeCarteira(corpo);
  }

  @Post("registrar-carteira")
  async registrarCarteiraNoConsolidado(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.saldosService.registrarCarteiraNoConsolidado(corpo);
  }

  @Delete("carteira")
  async removerCarteiraDoConsolidado(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.saldosService.removerCarteiraDoConsolidado(corpo);
  }

  @Post("recalcular")
  async recalcularAposMovimentacao(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.saldosService.recalcularAposMovimentacao(corpo);
  }

  @Post("cargas-multiusuario")
  async processarCargaSaldoMultiusuario(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.saldosService.processarCargaSaldoMultiusuario(corpo);
  }
}
