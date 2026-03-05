import { Body, Controller, Delete, Param, Patch, Post } from "@nestjs/common";
import { Publico } from "../../../infraestrutura/http/publico.decorator";
import { UsuarioAtualId } from "../../../infraestrutura/http/usuario-atual-id.decorator";
import { ContasService } from "../aplicacao/contas.service";

@Controller("contas")
export class ContasController {
  constructor(private readonly contasService: ContasService) {}

  @Publico()
  @Post()
  async criarConta(@Body() corpo: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.contasService.criarConta(corpo);
  }

  @Publico()
  @Post("login")
  async login(@Body() corpo: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.contasService.login(corpo);
  }

  @Delete(":contaId")
  async deletarConta(
    @Param("contaId") contaId: string,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.contasService.deletarConta(contaId, usuarioAutenticadoId);
  }

  @Patch(":contaId/senha")
  async editarSenha(
    @Param("contaId") contaId: string,
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.contasService.editarSenha(contaId, corpo, usuarioAutenticadoId);
  }

  @Patch(":contaId/nome")
  async editarNome(
    @Param("contaId") contaId: string,
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.contasService.editarNome(contaId, corpo, usuarioAutenticadoId);
  }

  @Publico()
  @Post("recuperacao-senha")
  async solicitarRecuperacaoSenha(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.contasService.solicitarRecuperacaoSenha(corpo);
  }
}
