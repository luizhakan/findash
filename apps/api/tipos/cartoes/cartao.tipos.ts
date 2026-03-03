import type {
  ModoParcelamentoSistema,
  ParcelaSistema,
} from "../sistema/financeiro.tipos";

export type BandeiraCartaoSistema =
  | "visa"
  | "mastercard"
  | "elo"
  | "amex"
  | "hipercard"
  | "outra";

export type CartaoSistema = {
  id: string;
  usuario_id: string;
  nome: string;
  bandeira: BandeiraCartaoSistema;
  limite_total: number;
  dia_fechamento: number;
  dia_vencimento: number;
  ativo: boolean;
  criado_em: string;
};

export type FaturaCartaoSistema = {
  id_fatura: string;
  usuario_id: string;
  cartao_id: string;
  referencia: string;
  data_fechamento: string;
  data_vencimento: string;
  valor_compras: number;
  valor_juros_manual: number;
  valor_total: number;
};

export type CompraCartaoSistema = {
  id_compra: string;
  usuario_id: string;
  cartao_id: string;
  descricao: string;
  valor_total: number;
  data_compra: string;
  id_fatura_destino: string;
  parcelas: ParcelaSistema[];
};

export type EntradaCriacaoCartao = {
  usuario_id: string;
  nome: string;
  bandeira: BandeiraCartaoSistema;
  limite_total: number;
  dia_fechamento?: number;
  dia_vencimento?: number;
};

export type EntradaEdicaoCartao = {
  usuario_id: string;
  id_cartao: string;
  nome?: string;
  limite_total?: number;
  dia_fechamento?: number;
  dia_vencimento?: number;
};

export type EntradaParcelamentoCompraCartao = {
  modo: ModoParcelamentoSistema;
  quantidade_parcelas: number;
  valor_parcela_fixa?: number;
};

export type EntradaRegistroCompraCartao = {
  usuario_id: string;
  id_cartao: string;
  descricao: string;
  valor_total: number;
  data_compra: string;
  id_fatura_destino?: string;
  parcelamento?: EntradaParcelamentoCompraCartao;
};

export type EntradaEdicaoCompraCartao = {
  usuario_id: string;
  id_compra: string;
  descricao?: string;
  valor_total?: number;
  id_fatura_destino?: string;
};

export type EntradaAdicionarJurosManualFatura = {
  usuario_id: string;
  id_fatura: string;
  valor_juros: number;
};

export type EntradaEditarJurosManualFatura = {
  usuario_id: string;
  id_fatura: string;
  valor_juros: number;
};

export type EntradaRemoverJurosManualFatura = {
  usuario_id: string;
  id_fatura: string;
};

export type EntradaListagemCartoes = {
  usuario_id: string;
};

export type EntradaListagemFaturas = {
  usuario_id: string;
  id_cartao?: string;
};

export type ErrosCartao = {
  diaFechamentoObrigatorio: string;
  diaVencimentoObrigatorio: string;
  diaFechamentoInvalido: string;
  diaVencimentoInvalido: string;
  acessoNegado: string;
};

export interface CasosDeUsoCartoes {
  criarCartao(entrada: EntradaCriacaoCartao): Promise<CartaoSistema>;
  editarCartao(entrada: EntradaEdicaoCartao): Promise<CartaoSistema>;
  registrarCompraCartao(entrada: EntradaRegistroCompraCartao): Promise<CompraCartaoSistema>;
  editarCompraCartao(entrada: EntradaEdicaoCompraCartao): Promise<CompraCartaoSistema>;
  adicionarJurosManualFatura(
    entrada: EntradaAdicionarJurosManualFatura,
  ): Promise<FaturaCartaoSistema>;
  editarJurosManualFatura(
    entrada: EntradaEditarJurosManualFatura,
  ): Promise<FaturaCartaoSistema>;
  removerJurosManualFatura(
    entrada: EntradaRemoverJurosManualFatura,
  ): Promise<FaturaCartaoSistema>;
  listarCartoes(entrada: EntradaListagemCartoes): Promise<CartaoSistema[]>;
  listarFaturas(entrada: EntradaListagemFaturas): Promise<FaturaCartaoSistema[]>;
}

export type CartaoDadosSimulados = {
  entradas: {
    criacaoCartaoValida: EntradaCriacaoCartao;
    criacaoCartaoSemFechamento: EntradaCriacaoCartao;
    criacaoCartaoSemVencimento: EntradaCriacaoCartao;
    registroCompraFaturaAtualPadrao: EntradaRegistroCompraCartao;
    registroCompraFaturaFutura: EntradaRegistroCompraCartao;
    edicaoCompraMudandoFatura: EntradaEdicaoCompraCartao;
    edicaoCompraSemTrocaFatura: EntradaEdicaoCompraCartao;
    adicionarJurosManualFatura: EntradaAdicionarJurosManualFatura;
    editarJurosManualFatura: EntradaEditarJurosManualFatura;
    removerJurosManualFatura: EntradaRemoverJurosManualFatura;
    registroCompraCartaoOutroUsuario: EntradaRegistroCompraCartao;
    editarJurosFaturaOutroUsuario: EntradaEditarJurosManualFatura;
    listagemCartoesUsuarioUm: EntradaListagemCartoes;
    listagemFaturasUsuarioUm: EntradaListagemFaturas;
  };
  resultados: {
    cartaoCriado: CartaoSistema;
    compraFaturaAtualPadrao: CompraCartaoSistema;
    compraFaturaFutura: CompraCartaoSistema;
    compraEditadaComFaturaFutura: CompraCartaoSistema;
    compraEditadaSemTrocaFatura: CompraCartaoSistema;
    faturaComJurosAdicionado: FaturaCartaoSistema;
    faturaComJurosEditado: FaturaCartaoSistema;
    faturaSemJuros: FaturaCartaoSistema;
    faturaAcimaDoLimitePermitida: FaturaCartaoSistema;
    listaCartoesUsuarioUm: CartaoSistema[];
    listaFaturasUsuarioUm: FaturaCartaoSistema[];
  };
  erros: ErrosCartao;
};
