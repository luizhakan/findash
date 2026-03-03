import { Body, Controller, Post } from "@nestjs/common";
import { CsvService } from "../aplicacao/csv.service";

@Controller("csv")
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post("importacoes")
  async importarCsv(@Body() corpo: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.csvService.importarCsv(corpo);
  }

  @Post("padronizacoes")
  async padronizarLinhasCsv(
    @Body() corpo: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    return this.csvService.padronizarLinhasCsv(corpo);
  }
}
