import { Injectable } from "@nestjs/common";

@Injectable()
export class OrcamentosService {
  async criarOrcamentoCategoria(
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso criarOrcamentoCategoria pendente de implementacao.", dados };
  }

  async editarOrcamentoCategoria(
    orcamentoId: string,
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso editarOrcamentoCategoria pendente de implementacao.", orcamento_id: orcamentoId, dados };
  }

  async registrarConsumoNoOrcamento(
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso registrarConsumoNoOrcamento pendente de implementacao.", dados };
  }

  async registrarEstornoNoOrcamento(
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso registrarEstornoNoOrcamento pendente de implementacao.", dados };
  }

  async buscarOrcamentoCategoria(
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso buscarOrcamentoCategoria pendente de implementacao.", dados };
  }

  async listarOrcamentosCategoria(
    query: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso listarOrcamentosCategoria pendente de implementacao.", query };
  }

  async processarCargaOrcamentosMultiusuario(
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso processarCargaOrcamentosMultiusuario pendente de implementacao.", dados };
  }
}
