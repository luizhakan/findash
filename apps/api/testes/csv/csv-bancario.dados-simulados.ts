import type { CsvBancarioDadosSimulados } from "../../tipos/csv/csv-bancario.tipos";

export const csvBancarioDadosSimulados: CsvBancarioDadosSimulados = {
  entradaNubankValida: {
    fonte: "nubank",
    conteudoCsv: `Data,Valor,Identificador,Descricao
10/01/2026,-100.50,11111111-1111-1111-1111-111111111111,Pagamento de fatura
11/01/2026,250.00,22222222-2222-2222-2222-222222222222,Transferencia recebida pelo Pix`,
  },
  entradaNubankSemColunaObrigatoria: {
    fonte: "nubank",
    conteudoCsv: `Data,Valor,Descricao
10/01/2026,-100.50,Pagamento de fatura`,
  },
  entradaNubankDataInvalida: {
    fonte: "nubank",
    conteudoCsv: `Data,Valor,Identificador,Descricao
2026-01-10,-100.50,33333333-3333-3333-3333-333333333333,Pagamento de fatura`,
  },
  entradaNubankValorInvalido: {
    fonte: "nubank",
    conteudoCsv: `Data,Valor,Identificador,Descricao
10/01/2026,ABC,44444444-4444-4444-4444-444444444444,Pagamento de fatura`,
  },
  entradaInterValidaComCabecalhoExtra: {
    fonte: "inter",
    conteudoCsv: `Conta: 0001
Periodo: 01/09/2025 a 28/02/2026
Saldo atual: 1000.00
Data Lancamento;Historico;Descricao;Valor;Saldo
01/02/2026;Pix enviado;Padaria Bom Dia;-25.90;974.10
02/02/2026;Pix recebido;Freela de cliente;100.00;1074.10`,
  },
  entradaInterSemColunaObrigatoria: {
    fonte: "inter",
    conteudoCsv: `Data Lancamento;Historico;Descricao;Valor
01/02/2026;Pix enviado;Padaria Bom Dia;-25.90`,
  },
  entradaInterDataInvalida: {
    fonte: "inter",
    conteudoCsv: `Data Lancamento;Historico;Descricao;Valor;Saldo
2026-02-01;Pix enviado;Padaria Bom Dia;-25.90;974.10`,
  },
  entradaMercadoPagoValidaComResumoInicial: {
    fonte: "mercado_pago",
    conteudoCsv: `INITIAL_BALANCE;1000.00
CREDITS;300.00
DEBITS;50.00
FINAL_BALANCE;1250.00
RELEASE_DATE;TRANSACTION_TYPE;REFERENCE_ID;TRANSACTION_NET_AMOUNT;PARTIAL_BALANCE
15-01-2026;Transferencia Pix enviada;900001;-50.00;950.00
16-01-2026;Recebimento Pix;900002;300.00;1250.00`,
  },
  entradaMercadoPagoSemColunaObrigatoria: {
    fonte: "mercado_pago",
    conteudoCsv: `RELEASE_DATE;TRANSACTION_TYPE;REFERENCE_ID;TRANSACTION_NET_AMOUNT
15-01-2026;Transferencia Pix enviada;900001;-50.00`,
  },
  entradaMercadoPagoDataInvalida: {
    fonte: "mercado_pago",
    conteudoCsv: `RELEASE_DATE;TRANSACTION_TYPE;REFERENCE_ID;TRANSACTION_NET_AMOUNT;PARTIAL_BALANCE
2026/01/15;Transferencia Pix enviada;900001;-50.00;950.00`,
  },
  entradaValorNaoNumerico: {
    fonte: "mercado_pago",
    conteudoCsv: `RELEASE_DATE;TRANSACTION_TYPE;REFERENCE_ID;TRANSACTION_NET_AMOUNT;PARTIAL_BALANCE
15-01-2026;Transferencia Pix enviada;900001;NAO_NUMERICO;950.00`,
  },
  entradaDelimitadorInvalido: {
    fonte: "inter",
    conteudoCsv: `Data Lancamento,Historico,Descricao,Valor,Saldo
01/02/2026,Pix enviado,Padaria Bom Dia,-25.90,974.10`,
  },
  resultadoNubankCanonico: {
    linhas: [
      {
        data_movimentacao: "2026-01-10",
        descricao: "Pagamento de fatura",
        tipo_movimentacao: "saida",
        valor: -100.5,
        id_referencia_origem: "11111111-1111-1111-1111-111111111111",
      },
      {
        data_movimentacao: "2026-01-11",
        descricao: "Transferencia recebida pelo Pix",
        tipo_movimentacao: "entrada",
        valor: 250,
        id_referencia_origem: "22222222-2222-2222-2222-222222222222",
      },
    ],
  },
  resultadoInterCanonico: {
    linhas: [
      {
        data_movimentacao: "2026-02-01",
        descricao: "Padaria Bom Dia",
        tipo_movimentacao: "Pix enviado",
        valor: -25.9,
        saldo_pos_movimento: 974.1,
      },
      {
        data_movimentacao: "2026-02-02",
        descricao: "Freela de cliente",
        tipo_movimentacao: "Pix recebido",
        valor: 100,
        saldo_pos_movimento: 1074.1,
      },
    ],
  },
  resultadoMercadoPagoCanonico: {
    linhas: [
      {
        data_movimentacao: "2026-01-15",
        descricao: "Transferencia Pix enviada",
        tipo_movimentacao: "Transferencia Pix enviada",
        valor: -50,
        saldo_pos_movimento: 950,
        id_referencia_origem: "900001",
      },
      {
        data_movimentacao: "2026-01-16",
        descricao: "Recebimento Pix",
        tipo_movimentacao: "Recebimento Pix",
        valor: 300,
        saldo_pos_movimento: 1250,
        id_referencia_origem: "900002",
      },
    ],
  },
  erros: {
    colunasObrigatoriasAusentes: "Colunas obrigatorias ausentes.",
    dataInvalida: "Data invalida para a fonte informada.",
    valorInvalido: "Valor invalido no CSV.",
    delimitadorInvalido: "Delimitador invalido para a fonte informada.",
  },
};
