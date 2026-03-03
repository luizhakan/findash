import { Injectable } from "@nestjs/common";

@Injectable()
export class ContasService {
  async criarConta(dados: Record<string, unknown>): Promise<Record<string, unknown>> {
    return {
      mensagem: "Caso de uso criarConta pendente de implementacao.",
      dados,
    };
  }

  async deletarConta(contaId: string): Promise<Record<string, unknown>> {
    return {
      mensagem: "Caso de uso deletarConta pendente de implementacao.",
      conta_id: contaId,
    };
  }

  async editarSenha(
    contaId: string,
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return {
      mensagem: "Caso de uso editarSenha pendente de implementacao.",
      conta_id: contaId,
      dados,
    };
  }

  async editarNome(
    contaId: string,
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return {
      mensagem: "Caso de uso editarNome pendente de implementacao.",
      conta_id: contaId,
      dados,
    };
  }

  async solicitarRecuperacaoSenha(
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return {
      mensagem: "Caso de uso solicitarRecuperacaoSenha pendente de implementacao.",
      dados,
    };
  }
}
