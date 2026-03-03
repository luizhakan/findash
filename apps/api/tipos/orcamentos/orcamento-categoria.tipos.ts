export enum CategoriaOrcamentoSistema {
  ALIMENTACAO = "alimentacao",
  MORADIA = "moradia",
  TRANSPORTE = "transporte",
  SAUDE = "saude",
  LAZER = "lazer",
  EDUCACAO = "educacao",
  OUTROS = "outros",
}

export type OrcamentoCategoriaSistema = {
  id: string;
  usuario_id: string;
  categoria: CategoriaOrcamentoSistema;
  competencia: string;
  moeda: string;
  limite_mensal: number;
  valor_consumido: number;
  percentual_consumido: number;
  alertas_ativos: Array<"alerta_80" | "alerta_100" | "acima_do_limite">;
  ativo: boolean;
  criado_em: string;
};

export type EntradaCriacaoOrcamentoCategoria = {
  usuario_id: string;
  categoria: CategoriaOrcamentoSistema;
  competencia: string;
  moeda: string;
  limite_mensal: number;
};

export type EntradaEdicaoOrcamentoCategoria = {
  usuario_id: string;
  orcamento_id: string;
  limite_mensal?: number;
  ativo?: boolean;
};

export type EntradaRegistroConsumoOrcamentoCategoria = {
  usuario_id: string;
  categoria: CategoriaOrcamentoSistema;
  competencia: string;
  valor_despesa: number;
  id_movimentacao: string;
};

export type EntradaRegistroEstornoOrcamentoCategoria = {
  usuario_id: string;
  categoria: CategoriaOrcamentoSistema;
  competencia: string;
  valor_estorno: number;
  id_movimentacao: string;
};

export type EntradaBuscaOrcamentoCategoria = {
  usuario_id: string;
  categoria: CategoriaOrcamentoSistema;
  competencia: string;
};

export type EntradaListagemOrcamentosCategoria = {
  usuario_id: string;
  competencia?: string;
  somente_ativos?: boolean;
};

export type EntradaCargaOrcamentosMultiusuario = {
  usuario_ids: string[];
  total_usuarios_esperado: number;
  tempo_maximo_ms: number;
};

export type ResultadoCargaOrcamentosMultiusuario = {
  total_usuarios_processados: number;
  total_orcamentos_processados: number;
  usuario_ids_sem_vazamento: string[];
  tempo_processamento_ms: number;
};

export type ErrosOrcamentoCategoria = {
  acessoNegado: string;
  limiteInvalido: string;
  orcamentoDuplicadoNoMes: string;
  orcamentoNaoEncontrado: string;
};

export interface CasosDeUsoOrcamentoCategoria {
  criarOrcamentoCategoria(
    entrada: EntradaCriacaoOrcamentoCategoria,
  ): Promise<OrcamentoCategoriaSistema>;
  editarOrcamentoCategoria(
    entrada: EntradaEdicaoOrcamentoCategoria,
  ): Promise<OrcamentoCategoriaSistema>;
  registrarConsumoNoOrcamento(
    entrada: EntradaRegistroConsumoOrcamentoCategoria,
  ): Promise<OrcamentoCategoriaSistema>;
  registrarEstornoNoOrcamento(
    entrada: EntradaRegistroEstornoOrcamentoCategoria,
  ): Promise<OrcamentoCategoriaSistema>;
  buscarOrcamentoCategoria(
    entrada: EntradaBuscaOrcamentoCategoria,
  ): Promise<OrcamentoCategoriaSistema>;
  listarOrcamentosCategoria(
    entrada: EntradaListagemOrcamentosCategoria,
  ): Promise<OrcamentoCategoriaSistema[]>;
  processarCargaOrcamentosMultiusuario(
    entrada: EntradaCargaOrcamentosMultiusuario,
  ): Promise<ResultadoCargaOrcamentosMultiusuario>;
}

export type OrcamentoCategoriaDadosSimulados = {
  entradas: {
    criacaoOrcamentoAlimentacaoUsuarioUm: EntradaCriacaoOrcamentoCategoria;
    criacaoOrcamentoDuplicadoUsuarioUm: EntradaCriacaoOrcamentoCategoria;
    criacaoOrcamentoAlimentacaoUsuarioDois: EntradaCriacaoOrcamentoCategoria;
    criacaoOrcamentoComLimiteInvalido: EntradaCriacaoOrcamentoCategoria;
    registroConsumoAteSetentaECinco: EntradaRegistroConsumoOrcamentoCategoria;
    registroConsumoAtingeOitenta: EntradaRegistroConsumoOrcamentoCategoria;
    registroConsumoAtingeCem: EntradaRegistroConsumoOrcamentoCategoria;
    registroConsumoAcimaDoLimite: EntradaRegistroConsumoOrcamentoCategoria;
    registroEstornoReducaoConsumo: EntradaRegistroEstornoOrcamentoCategoria;
    registroConsumoOutroUsuarioNoMesmoMes: EntradaRegistroConsumoOrcamentoCategoria;
    edicaoAumentarLimiteUsuarioUm: EntradaEdicaoOrcamentoCategoria;
    listagemOrcamentosUsuarioUm: EntradaListagemOrcamentosCategoria;
    cargaMultiusuario: EntradaCargaOrcamentosMultiusuario;
  };
  resultados: {
    orcamentoCriadoUsuarioUm: OrcamentoCategoriaSistema;
    orcamentoCriadoUsuarioDois: OrcamentoCategoriaSistema;
    orcamentoConsumoSetentaECinco: OrcamentoCategoriaSistema;
    orcamentoConsumoOitenta: OrcamentoCategoriaSistema;
    orcamentoConsumoCem: OrcamentoCategoriaSistema;
    orcamentoConsumoAcimaDoLimite: OrcamentoCategoriaSistema;
    orcamentoAposEstorno: OrcamentoCategoriaSistema;
    orcamentoEditadoLimiteMaior: OrcamentoCategoriaSistema;
    listagemOrcamentosUsuarioUm: OrcamentoCategoriaSistema[];
    cargaMultiusuario: ResultadoCargaOrcamentosMultiusuario;
  };
  erros: ErrosOrcamentoCategoria;
};
