import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { ContasService } from "../aplicacao/contas.service";

@Controller("contas")
export class ContasController {
  constructor(private readonly contasService: ContasService) {}

  @Post()
  async criarConta(@Body() corpo: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.contasService.criarConta(corpo);
  }

  @Delete(":contaId")
  async deletarConta(@Param("contaId") contaId: string): Promise<Record<string, unknown>> {
    return this.contasService.deletarConta(contaId);
  }

  @Patch(":contaId/senha")
  async editarSenha(
    @Param("contaId") contaId: string,
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.contasService.editarSenha(contaId, corpo);
  }

  @Patch(":contaId/nome")
  async editarNome(
    @Param("contaId") contaId: string,
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.contasService.editarNome(contaId, corpo);
  }

  @Post("recuperacao-senha")
  async solicitarRecuperacaoSenha(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.contasService.solicitarRecuperacaoSenha(corpo);
  }
}
