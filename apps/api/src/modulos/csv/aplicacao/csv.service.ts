import { Injectable } from "@nestjs/common";

@Injectable()
export class CsvService {
  async importarCsv(dados: Record<string, unknown>): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso importar CSV pendente de implementacao.", dados };
  }

  async padronizarLinhasCsv(dados: Record<string, unknown>): Promise<Record<string, unknown>> {
    return { mensagem: "Caso de uso padronizar CSV pendente de implementacao.", dados };
  }
}
