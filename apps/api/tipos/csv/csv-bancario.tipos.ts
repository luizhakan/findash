import type { MovimentacaoSistemaParaPersistencia } from "../sistema/financeiro.tipos";

export type FonteCsvBancario = "nubank" | "inter" | "mercado_pago";

export type EntradaAdicionarDadosCsv = {
  fonte: FonteCsvBancario;
  usuario_id: string;
  carteira_id: string;
  conteudoCsv: string;
};

export type LinhaCanonicaMovimentacao = MovimentacaoSistemaParaPersistencia;

export type ResultadoAdicionarDadosCsv = {
  linhas: LinhaCanonicaMovimentacao[];
};

export type ErrosCsvBancario = {
  colunasObrigatoriasAusentes: string;
  dataInvalida: string;
  valorInvalido: string;
  delimitadorInvalido: string;
};

export interface CasosDeUsoDadosCsv {
  adicionarDadosPorCsv(
    entrada: EntradaAdicionarDadosCsv,
  ): Promise<ResultadoAdicionarDadosCsv>;
}

export type CsvBancarioDadosSimulados = {
  entradaNubankValida: EntradaAdicionarDadosCsv;
  entradaNubankSemColunaObrigatoria: EntradaAdicionarDadosCsv;
  entradaNubankDataInvalida: EntradaAdicionarDadosCsv;
  entradaNubankValorInvalido: EntradaAdicionarDadosCsv;
  entradaInterValidaComCabecalhoExtra: EntradaAdicionarDadosCsv;
  entradaInterSemColunaObrigatoria: EntradaAdicionarDadosCsv;
  entradaInterDataInvalida: EntradaAdicionarDadosCsv;
  entradaMercadoPagoValidaComResumoInicial: EntradaAdicionarDadosCsv;
  entradaMercadoPagoSemColunaObrigatoria: EntradaAdicionarDadosCsv;
  entradaMercadoPagoDataInvalida: EntradaAdicionarDadosCsv;
  entradaValorNaoNumerico: EntradaAdicionarDadosCsv;
  entradaDelimitadorInvalido: EntradaAdicionarDadosCsv;
  resultadoNubankCanonico: ResultadoAdicionarDadosCsv;
  resultadoInterCanonico: ResultadoAdicionarDadosCsv;
  resultadoMercadoPagoCanonico: ResultadoAdicionarDadosCsv;
  erros: ErrosCsvBancario;
};
