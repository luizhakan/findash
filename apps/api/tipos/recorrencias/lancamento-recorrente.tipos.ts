import type {
  ModoMovimentacaoSistema,
  TipoMovimentacaoSistema,
} from "../sistema/financeiro.tipos";

export enum PeriodicidadeRecorrenciaSistema {
  MENSAL = "mensal",
  SEMANAL = "semanal",
}

export type LancamentoRecorrenteSistema = {
  id: string;
  usuario_id: string;
  carteira_id: string;
  descricao: string;
  modo: ModoMovimentacaoSistema;
  tipo: TipoMovimentacaoSistema;
  valor: number;
  periodicidade: PeriodicidadeRecorrenciaSistema;
  dia_execucao: number;
  data_inicio: string;
  data_fim?: string;
  ativo: boolean;
  pausado: boolean;
  criado_em: string;
};

export type OcorrenciaLancamentoRecorrenteSistema = {
  id_ocorrencia: string;
  recorrencia_id: string;
  usuario_id: string;
  competencia: string;
  data_prevista: string;
  valor: number;
  status: "pendente" | "lancada" | "cancelada";
};

export type EntradaCriacaoLancamentoRecorrente = {
  usuario_id: string;
  carteira_id: string;
  descricao: string;
  modo: ModoMovimentacaoSistema;
  tipo: TipoMovimentacaoSistema;
  valor: number;
  periodicidade: PeriodicidadeRecorrenciaSistema;
  dia_execucao: number;
  data_inicio: string;
  data_fim?: string;
};

export type EntradaPausaLancamentoRecorrente = {
  usuario_id: string;
  recorrencia_id: string;
};

export type EntradaReativacaoLancamentoRecorrente = {
  usuario_id: string;
  recorrencia_id: string;
};

export type EntradaEncerramentoLancamentoRecorrente = {
  usuario_id: string;
  recorrencia_id: string;
  data_fim: string;
};

export type EntradaGeracaoOcorrenciasRecorrentes = {
  usuario_id: string;
  data_inicial: string;
  data_final: string;
};

export type EntradaEdicaoProximasOcorrencias = {
  usuario_id: string;
  recorrencia_id: string;
  data_corte: string;
  novo_valor?: number;
  novo_dia_execucao?: number;
};

export type EntradaListagemLancamentosRecorrentes = {
  usuario_id: string;
  incluir_pausados?: boolean;
  incluir_encerrados?: boolean;
};

export type EntradaCargaRecorrenciasMultiusuario = {
  usuario_ids: string[];
  total_usuarios_esperado: number;
  tempo_maximo_ms: number;
};

export type ResultadoCargaRecorrenciasMultiusuario = {
  total_usuarios_processados: number;
  total_recorrencias_processadas: number;
  usuario_ids_sem_vazamento: string[];
  tempo_processamento_ms: number;
};

export type ErrosLancamentoRecorrente = {
  acessoNegado: string;
  valorInvalido: string;
  diaExecucaoInvalido: string;
  recorrenciaPausada: string;
};

export interface CasosDeUsoLancamentosRecorrentes {
  criarLancamentoRecorrente(
    entrada: EntradaCriacaoLancamentoRecorrente,
  ): Promise<LancamentoRecorrenteSistema>;
  pausarLancamentoRecorrente(
    entrada: EntradaPausaLancamentoRecorrente,
  ): Promise<LancamentoRecorrenteSistema>;
  reativarLancamentoRecorrente(
    entrada: EntradaReativacaoLancamentoRecorrente,
  ): Promise<LancamentoRecorrenteSistema>;
  encerrarLancamentoRecorrente(
    entrada: EntradaEncerramentoLancamentoRecorrente,
  ): Promise<LancamentoRecorrenteSistema>;
  gerarOcorrenciasNoPeriodo(
    entrada: EntradaGeracaoOcorrenciasRecorrentes,
  ): Promise<OcorrenciaLancamentoRecorrenteSistema[]>;
  editarProximasOcorrencias(
    entrada: EntradaEdicaoProximasOcorrencias,
  ): Promise<LancamentoRecorrenteSistema>;
  listarLancamentosRecorrentes(
    entrada: EntradaListagemLancamentosRecorrentes,
  ): Promise<LancamentoRecorrenteSistema[]>;
  processarCargaRecorrenciasMultiusuario(
    entrada: EntradaCargaRecorrenciasMultiusuario,
  ): Promise<ResultadoCargaRecorrenciasMultiusuario>;
}

export type LancamentoRecorrenteDadosSimulados = {
  entradas: {
    criacaoDespesaMensalUsuarioUm: EntradaCriacaoLancamentoRecorrente;
    criacaoReceitaMensalUsuarioUm: EntradaCriacaoLancamentoRecorrente;
    criacaoComValorInvalido: EntradaCriacaoLancamentoRecorrente;
    pausaRecorrenciaUsuarioUm: EntradaPausaLancamentoRecorrente;
    reativacaoRecorrenciaUsuarioUm: EntradaReativacaoLancamentoRecorrente;
    encerramentoRecorrenciaUsuarioUm: EntradaEncerramentoLancamentoRecorrente;
    geracaoOcorrenciasPrimeiroTrimestre: EntradaGeracaoOcorrenciasRecorrentes;
    geracaoOcorrenciasRecorrenciaPausada: EntradaGeracaoOcorrenciasRecorrentes;
    edicaoProximasOcorrenciasUsuarioUm: EntradaEdicaoProximasOcorrencias;
    pausaRecorrenciaOutroUsuario: EntradaPausaLancamentoRecorrente;
    listagemRecorrenciasUsuarioUm: EntradaListagemLancamentosRecorrentes;
    cargaMultiusuario: EntradaCargaRecorrenciasMultiusuario;
  };
  resultados: {
    recorrenciaDespesaMensalCriada: LancamentoRecorrenteSistema;
    recorrenciaReceitaMensalCriada: LancamentoRecorrenteSistema;
    recorrenciaPausada: LancamentoRecorrenteSistema;
    recorrenciaReativada: LancamentoRecorrenteSistema;
    recorrenciaEncerrada: LancamentoRecorrenteSistema;
    recorrenciaEditadaProximasOcorrencias: LancamentoRecorrenteSistema;
    ocorrenciasPrimeiroTrimestre: OcorrenciaLancamentoRecorrenteSistema[];
    ocorrenciasRecorrenciaPausada: OcorrenciaLancamentoRecorrenteSistema[];
    listagemRecorrenciasUsuarioUm: LancamentoRecorrenteSistema[];
    cargaMultiusuario: ResultadoCargaRecorrenciasMultiusuario;
  };
  erros: ErrosLancamentoRecorrente;
};
