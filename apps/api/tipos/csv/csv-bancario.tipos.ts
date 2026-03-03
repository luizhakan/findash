export type FonteCsvBancario = "nubank" | "inter" | "mercado_pago";

export type EntradaAdicionarDadosCsv = {
  fonte: FonteCsvBancario;
  conteudoCsv: string;
};

export type LinhaCanonicaMovimentacao = {
  data_movimentacao: string;
  descricao: string;
  tipo_movimentacao: string;
  valor: number;
  saldo_pos_movimento?: number;
  id_referencia_origem?: string;
};

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
