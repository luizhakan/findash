import { Body, Controller, Post } from "@nestjs/common";
import { UsuarioAtualId } from "../../../infraestrutura/http/usuario-atual-id.decorator";
import { CsvService } from "../aplicacao/csv.service";

@Controller("csv")
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Post("importacoes")
  async importarCsv(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.csvService.importarCsv(corpo, usuarioAutenticadoId);
  }

  @Post("padronizacoes")
  async padronizarLinhasCsv(
    @Body() corpo: Record<string, unknown>,
    @UsuarioAtualId() usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    return this.csvService.padronizarLinhasCsv(corpo, usuarioAutenticadoId);
  }
}
