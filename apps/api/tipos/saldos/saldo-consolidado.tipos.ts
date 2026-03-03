export type EntradaCalculoSaldoConsolidado = {
  usuario_id: string;
  ids_carteiras_visiveis?: string[];
  considerar_somente_ativas?: boolean;
  incluir_arquivadas?: boolean;
};

export type EntradaAlteracaoVisibilidadeCarteira = {
  usuario_id: string;
  carteira_id: string;
  visivel: boolean;
};

export type EntradaRegistroCarteiraNoConsolidado = {
  usuario_id: string;
  carteira_id: string;
};

export type EntradaRemocaoCarteiraDoConsolidado = {
  usuario_id: string;
  carteira_id: string;
};

export type EntradaRecalculoAposMovimentacao = {
  usuario_id: string;
  carteira_id: string;
  valor_delta: number;
};

export type EntradaCargaSaldoMultiusuario = {
  usuario_ids: string[];
  total_usuarios_esperado: number;
  tempo_maximo_ms: number;
};

export type ResultadoSaldoConsolidado = {
  usuario_id: string;
  saldo_total: number;
  carteiras_incluidas: string[];
  carteiras_excluidas: string[];
  atualizado_em: string;
};

export type ResultadoCargaSaldoMultiusuario = {
  total_usuarios_processados: number;
  usuario_ids_sem_vazamento: string[];
  tempo_processamento_ms: number;
};

export type ErrosSaldoConsolidado = {
  acessoNegado: string;
  carteiraNaoPertenceAoUsuario: string;
};

export interface CasosDeUsoSaldoConsolidado {
  calcularSaldoConsolidado(
    entrada: EntradaCalculoSaldoConsolidado,
  ): Promise<ResultadoSaldoConsolidado>;
  alterarVisibilidadeCarteira(
    entrada: EntradaAlteracaoVisibilidadeCarteira,
  ): Promise<ResultadoSaldoConsolidado>;
  registrarCarteiraNoConsolidado(
    entrada: EntradaRegistroCarteiraNoConsolidado,
  ): Promise<ResultadoSaldoConsolidado>;
  removerCarteiraDoConsolidado(
    entrada: EntradaRemocaoCarteiraDoConsolidado,
  ): Promise<ResultadoSaldoConsolidado>;
  recalcularAposMovimentacao(
    entrada: EntradaRecalculoAposMovimentacao,
  ): Promise<ResultadoSaldoConsolidado>;
  processarCargaSaldoMultiusuario(
    entrada: EntradaCargaSaldoMultiusuario,
  ): Promise<ResultadoCargaSaldoMultiusuario>;
}

export type SaldoConsolidadoDadosSimulados = {
  entradas: {
    calculoPadraoUsuarioUm: EntradaCalculoSaldoConsolidado;
    ocultarCarteiraReservaUsuarioUm: EntradaAlteracaoVisibilidadeCarteira;
    reexibirCarteiraReservaUsuarioUm: EntradaAlteracaoVisibilidadeCarteira;
    ocultarTodasCarteirasUsuarioUm: EntradaCalculoSaldoConsolidado;
    calculoSemArquivadasUsuarioUm: EntradaCalculoSaldoConsolidado;
    calculoSomenteAtivasUsuarioUm: EntradaCalculoSaldoConsolidado;
    ocultarCarteiraOutroUsuario: EntradaAlteracaoVisibilidadeCarteira;
    registrarNovaCarteiraPadraoVisivelUsuarioUm: EntradaRegistroCarteiraNoConsolidado;
    removerCarteiraDoConsolidadoUsuarioUm: EntradaRemocaoCarteiraDoConsolidado;
    recalculoAposMovimentacaoEntrada: EntradaRecalculoAposMovimentacao;
    recalculoAposMovimentacaoSaida: EntradaRecalculoAposMovimentacao;
    calculoPaginadoNaoAfetaTotalUsuarioUm: EntradaCalculoSaldoConsolidado;
    calculoMisturaPositivoNegativoUsuarioUm: EntradaCalculoSaldoConsolidado;
    cargaMultiusuario: EntradaCargaSaldoMultiusuario;
  };
  resultados: {
    saldoPadraoUsuarioUm: ResultadoSaldoConsolidado;
    saldoAposOcultarReservaUsuarioUm: ResultadoSaldoConsolidado;
    saldoAposReexibirReservaUsuarioUm: ResultadoSaldoConsolidado;
    saldoComTodasOcultasUsuarioUm: ResultadoSaldoConsolidado;
    saldoSemArquivadasUsuarioUm: ResultadoSaldoConsolidado;
    saldoSomenteAtivasUsuarioUm: ResultadoSaldoConsolidado;
    saldoAposRegistrarNovaCarteiraVisivel: ResultadoSaldoConsolidado;
    saldoAposRemoverCarteiraDoConsolidado: ResultadoSaldoConsolidado;
    saldoAposMovimentacaoEntrada: ResultadoSaldoConsolidado;
    saldoAposMovimentacaoSaida: ResultadoSaldoConsolidado;
    saldoPaginadoNaoAfetaTotalUsuarioUm: ResultadoSaldoConsolidado;
    saldoMisturaPositivoNegativoUsuarioUm: ResultadoSaldoConsolidado;
    cargaMultiusuario: ResultadoCargaSaldoMultiusuario;
  };
  erros: ErrosSaldoConsolidado;
};
