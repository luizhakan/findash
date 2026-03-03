import type { CsvBancarioDadosSimulados } from "../../tipos/csv/csv-bancario.tipos";
import {
  FonteOrigemMovimentacaoSistema,
  ModoMovimentacaoSistema,
  TipoMovimentacaoSistema,
} from "../../tipos/sistema/financeiro.tipos";

const usuarioCsv = "usuario_csv_001";
const carteiraNubank = "carteira_csv_nubank_001";
const carteiraInter = "carteira_csv_inter_001";
const carteiraMercadoPago = "carteira_csv_mp_001";

export const csvBancarioDadosSimulados: CsvBancarioDadosSimulados = {
  entradaNubankValida: {
    fonte: "nubank",
    usuario_id: usuarioCsv,
    carteira_id: carteiraNubank,
    conteudoCsv: `Data,Valor,Identificador,Descricao
10/01/2026,-100.50,11111111-1111-1111-1111-111111111111,Pagamento de fatura
11/01/2026,250.00,22222222-2222-2222-2222-222222222222,Transferencia recebida pelo Pix`,
  },
  entradaNubankSemColunaObrigatoria: {
    fonte: "nubank",
    usuario_id: usuarioCsv,
    carteira_id: carteiraNubank,
    conteudoCsv: `Data,Valor,Descricao
10/01/2026,-100.50,Pagamento de fatura`,
  },
  entradaNubankDataInvalida: {
    fonte: "nubank",
    usuario_id: usuarioCsv,
    carteira_id: carteiraNubank,
    conteudoCsv: `Data,Valor,Identificador,Descricao
2026-01-10,-100.50,33333333-3333-3333-3333-333333333333,Pagamento de fatura`,
  },
  entradaNubankValorInvalido: {
    fonte: "nubank",
    usuario_id: usuarioCsv,
    carteira_id: carteiraNubank,
    conteudoCsv: `Data,Valor,Identificador,Descricao
10/01/2026,ABC,44444444-4444-4444-4444-444444444444,Pagamento de fatura`,
  },
  entradaInterValidaComCabecalhoExtra: {
    fonte: "inter",
    usuario_id: usuarioCsv,
    carteira_id: carteiraInter,
    conteudoCsv: `Conta: 0001
Periodo: 01/09/2025 a 28/02/2026
Saldo atual: 1000.00
Data Lancamento;Historico;Descricao;Valor;Saldo
01/02/2026;Pix enviado;Padaria Bom Dia;-25.90;974.10
02/02/2026;Pix recebido;Freela de cliente;100.00;1074.10`,
  },
  entradaInterSemColunaObrigatoria: {
    fonte: "inter",
    usuario_id: usuarioCsv,
    carteira_id: carteiraInter,
    conteudoCsv: `Data Lancamento;Historico;Descricao;Valor
01/02/2026;Pix enviado;Padaria Bom Dia;-25.90`,
  },
  entradaInterDataInvalida: {
    fonte: "inter",
    usuario_id: usuarioCsv,
    carteira_id: carteiraInter,
    conteudoCsv: `Data Lancamento;Historico;Descricao;Valor;Saldo
2026-02-01;Pix enviado;Padaria Bom Dia;-25.90;974.10`,
  },
  entradaMercadoPagoValidaComResumoInicial: {
    fonte: "mercado_pago",
    usuario_id: usuarioCsv,
    carteira_id: carteiraMercadoPago,
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
    usuario_id: usuarioCsv,
    carteira_id: carteiraMercadoPago,
    conteudoCsv: `RELEASE_DATE;TRANSACTION_TYPE;REFERENCE_ID;TRANSACTION_NET_AMOUNT
15-01-2026;Transferencia Pix enviada;900001;-50.00`,
  },
  entradaMercadoPagoDataInvalida: {
    fonte: "mercado_pago",
    usuario_id: usuarioCsv,
    carteira_id: carteiraMercadoPago,
    conteudoCsv: `RELEASE_DATE;TRANSACTION_TYPE;REFERENCE_ID;TRANSACTION_NET_AMOUNT;PARTIAL_BALANCE
2026/01/15;Transferencia Pix enviada;900001;-50.00;950.00`,
  },
  entradaValorNaoNumerico: {
    fonte: "mercado_pago",
    usuario_id: usuarioCsv,
    carteira_id: carteiraMercadoPago,
    conteudoCsv: `RELEASE_DATE;TRANSACTION_TYPE;REFERENCE_ID;TRANSACTION_NET_AMOUNT;PARTIAL_BALANCE
15-01-2026;Transferencia Pix enviada;900001;NAO_NUMERICO;950.00`,
  },
  entradaDelimitadorInvalido: {
    fonte: "inter",
    usuario_id: usuarioCsv,
    carteira_id: carteiraInter,
    conteudoCsv: `Data Lancamento,Historico,Descricao,Valor,Saldo
01/02/2026,Pix enviado,Padaria Bom Dia,-25.90,974.10`,
  },
  resultadoNubankCanonico: {
    linhas: [
      {
        usuario_id: usuarioCsv,
        carteira_id: carteiraNubank,
        modo: ModoMovimentacaoSistema.TRANSFERENCIA,
        tipo: TipoMovimentacaoSistema.SAIDA,
        valor: -100.5,
        descricao: "Pagamento de fatura",
        data_movimentacao: "2026-01-10",
        id_origem: "11111111-1111-1111-1111-111111111111",
        fonte_origem: FonteOrigemMovimentacaoSistema.NUBANK,
      },
      {
        usuario_id: usuarioCsv,
        carteira_id: carteiraNubank,
        modo: ModoMovimentacaoSistema.PIX,
        tipo: TipoMovimentacaoSistema.ENTRADA,
        valor: 250,
        descricao: "Transferencia recebida pelo Pix",
        data_movimentacao: "2026-01-11",
        id_origem: "22222222-2222-2222-2222-222222222222",
        fonte_origem: FonteOrigemMovimentacaoSistema.NUBANK,
      },
    ],
  },
  resultadoInterCanonico: {
    linhas: [
      {
        usuario_id: usuarioCsv,
        carteira_id: carteiraInter,
        modo: ModoMovimentacaoSistema.PIX,
        tipo: TipoMovimentacaoSistema.SAIDA,
        valor: -25.9,
        descricao: "Padaria Bom Dia",
        data_movimentacao: "2026-02-01",
        saldo_pos_movimento_origem: 974.1,
        fonte_origem: FonteOrigemMovimentacaoSistema.INTER,
      },
      {
        usuario_id: usuarioCsv,
        carteira_id: carteiraInter,
        modo: ModoMovimentacaoSistema.PIX,
        tipo: TipoMovimentacaoSistema.ENTRADA,
        valor: 100,
        descricao: "Freela de cliente",
        data_movimentacao: "2026-02-02",
        saldo_pos_movimento_origem: 1074.1,
        fonte_origem: FonteOrigemMovimentacaoSistema.INTER,
      },
    ],
  },
  resultadoMercadoPagoCanonico: {
    linhas: [
      {
        usuario_id: usuarioCsv,
        carteira_id: carteiraMercadoPago,
        modo: ModoMovimentacaoSistema.PIX,
        tipo: TipoMovimentacaoSistema.SAIDA,
        valor: -50,
        descricao: "Transferencia Pix enviada",
        data_movimentacao: "2026-01-15",
        saldo_pos_movimento_origem: 950,
        id_origem: "900001",
        fonte_origem: FonteOrigemMovimentacaoSistema.MERCADO_PAGO,
      },
      {
        usuario_id: usuarioCsv,
        carteira_id: carteiraMercadoPago,
        modo: ModoMovimentacaoSistema.PIX,
        tipo: TipoMovimentacaoSistema.ENTRADA,
        valor: 300,
        descricao: "Recebimento Pix",
        data_movimentacao: "2026-01-16",
        saldo_pos_movimento_origem: 1250,
        id_origem: "900002",
        fonte_origem: FonteOrigemMovimentacaoSistema.MERCADO_PAGO,
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
