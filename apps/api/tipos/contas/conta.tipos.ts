import type {
  ModoMovimentacaoSistema,
  ModoParcelamentoSistema,
  ParcelaSistema,
  TipoMovimentacaoSistema,
} from "../sistema/financeiro.tipos";

export type ContaSimulada = {
  id: string;
  nome: string;
  usuario: string;
  email: string;
  senha: string;
};

export type EntradaCriacaoConta = {
  nome: string;
  usuario: string;
  email: string;
  senha: string;
};

export type EntradaEdicaoSenha = {
  idConta: string;
  novaSenha: string;
};

export type EntradaMudancaNome = {
  idConta: string;
  novoNome: string;
};

export type EntradaRecuperacaoSenha = {
  email: string;
};

export type SaidaRecuperacaoSenha = {
  mensagem: string;
};

export type ErrosConta = {
  emailJaEmUso: string;
  usuarioJaEmUso: string;
  senhaInvalida: string;
  nomeInvalido: string;
  quantidadeParcelasInvalida: string;
  valorTotalInvalido: string;
};

export type EntradaParcelamentoConta = {
  modo: ModoParcelamentoSistema;
  quantidade_parcelas: number;
  valor_parcela_fixa?: number;
};

export type EntradaAdicionarLancamentoConta = {
  usuario_id: string;
  idContaFinanceira: string;
  tipo: TipoMovimentacaoSistema;
  modo: ModoMovimentacaoSistema;
  valor_total: number;
  descricao: string;
  data_primeiro_vencimento: string;
  parcelamento?: EntradaParcelamentoConta;
};

export type EntradaEditarLancamentoConta = {
  usuario_id: string;
  idLancamento: string;
  descricao?: string;
  valor_total?: number;
};

export type EntradaParcelarLancamentoConta = {
  usuario_id: string;
  idLancamento: string;
  modo: ModoParcelamentoSistema;
  quantidade_parcelas: number;
  valor_parcela_fixa?: number;
};

export type SaidaLancamentoConta = {
  idLancamento: string;
  usuario_id: string;
  idContaFinanceira: string;
  tipo: TipoMovimentacaoSistema;
  modo: ModoMovimentacaoSistema;
  valor_total: number;
  descricao: string;
  parcelas: ParcelaSistema[];
};

export interface CasosDeUsoConta {
  criarConta(entrada: EntradaCriacaoConta): Promise<ContaSimulada>;
  deletarConta(idConta: string): Promise<void>;
  editarSenha(entrada: EntradaEdicaoSenha): Promise<void>;
  mudarNome(entrada: EntradaMudancaNome): Promise<void>;
  solicitarRecuperacaoSenha(
    entrada: EntradaRecuperacaoSenha,
  ): Promise<SaidaRecuperacaoSenha>;
}

export interface CasosDeUsoContaFinanceira {
  adicionarLancamentoConta(
    entrada: EntradaAdicionarLancamentoConta,
  ): Promise<SaidaLancamentoConta>;
  editarLancamentoConta(
    entrada: EntradaEditarLancamentoConta,
  ): Promise<SaidaLancamentoConta>;
  parcelarLancamentoConta(
    entrada: EntradaParcelarLancamentoConta,
  ): Promise<SaidaLancamentoConta>;
}

export type ContaDadosSimulados = {
  entradaCriacao: EntradaCriacaoConta;
  entradaCriacaoComEmailDuplicado: EntradaCriacaoConta;
  entradaCriacaoComUsuarioDuplicado: EntradaCriacaoConta;
  contaExistente: ContaSimulada;
  entradaEdicaoSenha: EntradaEdicaoSenha;
  entradaEdicaoSenhaComSenhaFraca: EntradaEdicaoSenha;
  entradaMudancaNome: EntradaMudancaNome;
  entradaMudancaNomeVazio: EntradaMudancaNome;
  entradaMudancaNomeAbaixoDoMinimo: EntradaMudancaNome;
  entradaRecuperacaoSenha: EntradaRecuperacaoSenha;
  entradaRecuperacaoSenhaEmailInexistente: EntradaRecuperacaoSenha;
  respostaRecuperacaoSenha: SaidaRecuperacaoSenha;
  respostaRecuperacaoSenhaGenerica: SaidaRecuperacaoSenha;
  entradaAdicionarDespesaParceladaFixa: EntradaAdicionarLancamentoConta;
  entradaAdicionarReceitaParceladaDiluida: EntradaAdicionarLancamentoConta;
  entradaParcelarTransferenciaFixa: EntradaParcelarLancamentoConta;
  entradaParcelarTransferenciaDiluida: EntradaParcelarLancamentoConta;
  entradaParcelarComQuantidadeInvalida: EntradaParcelarLancamentoConta;
  saidaDespesaParceladaFixa: SaidaLancamentoConta;
  saidaReceitaParceladaDiluida: SaidaLancamentoConta;
  saidaTransferenciaParceladaFixa: SaidaLancamentoConta;
  saidaTransferenciaParceladaDiluida: SaidaLancamentoConta;
  erros: ErrosConta;
};
