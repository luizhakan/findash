import { Injectable } from "@nestjs/common";

@Injectable()
export class CartoesService {
  async criarCartao(dados: Record<string, unknown>): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso criarCartao pendente de implementacao.", dados };
  }

  async editarCartao(
    cartaoId: string,
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso editarCartao pendente de implementacao.", cartao_id: cartaoId, dados };
  }

  async registrarCompraCartao(
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso registrarCompraCartao pendente de implementacao.", dados };
  }

  async editarCompraCartao(
    compraId: string,
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso editarCompraCartao pendente de implementacao.", compra_id: compraId, dados };
  }

  async adicionarJurosManualFatura(
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso adicionarJurosManualFatura pendente de implementacao.", dados };
  }

  async editarJurosManualFatura(
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso editarJurosManualFatura pendente de implementacao.", dados };
  }

  async removerJurosManualFatura(faturaId: string): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso removerJurosManualFatura pendente de implementacao.", fatura_id: faturaId };
  }

  async listarCartoes(query: Record<string, unknown>): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso listarCartoes pendente de implementacao.", query };
  }

  async listarFaturas(query: Record<string, unknown>): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso listarFaturas pendente de implementacao.", query };
  }
}
