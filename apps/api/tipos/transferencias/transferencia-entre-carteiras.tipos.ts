import type { MovimentacaoSistemaParaPersistencia } from "../sistema/financeiro.tipos";

export type EntradaTransferenciaEntreCarteiras = {
  usuario_id: string;
  carteira_origem_id: string;
  carteira_destino_id: string;
  valor: number;
  descricao: string;
  data_movimentacao: string;
};

export type EntradaListagemTransferenciasUsuario = {
  usuario_id: string;
  data_inicial?: string;
  data_final?: string;
};

export type EntradaCargaTransferenciasMultiusuario = {
  usuario_ids: string[];
  total_usuarios_esperado: number;
  tempo_maximo_ms: number;
};

export type ResultadoTransferenciaEntreCarteiras = {
  id_transferencia: string;
  usuario_id: string;
  movimentacao_debito: MovimentacaoSistemaParaPersistencia;
  movimentacao_credito: MovimentacaoSistemaParaPersistencia;
  saldo_total_usuario_antes: number;
  saldo_total_usuario_depois: number;
  criada_em: string;
};

export type ResultadoCargaTransferenciasMultiusuario = {
  total_usuarios_processados: number;
  total_transferencias_processadas: number;
  usuario_ids_sem_vazamento: string[];
  tempo_processamento_ms: number;
};

export type ErrosTransferenciaEntreCarteiras = {
  acessoNegado: string;
  carteiraOrigemIgualDestino: string;
  valorInvalido: string;
  carteiraArquivada: string;
};

export interface CasosDeUsoTransferenciasEntreCarteiras {
  transferirEntreCarteiras(
    entrada: EntradaTransferenciaEntreCarteiras,
  ): Promise<ResultadoTransferenciaEntreCarteiras>;
  listarTransferenciasPorUsuario(
    entrada: EntradaListagemTransferenciasUsuario,
  ): Promise<ResultadoTransferenciaEntreCarteiras[]>;
  processarCargaTransferenciasMultiusuario(
    entrada: EntradaCargaTransferenciasMultiusuario,
  ): Promise<ResultadoCargaTransferenciasMultiusuario>;
}

export type TransferenciaEntreCarteirasDadosSimulados = {
  entradas: {
    transferenciaValidaUsuarioUm: EntradaTransferenciaEntreCarteiras;
    transferenciaParaMesmaCarteira: EntradaTransferenciaEntreCarteiras;
    transferenciaValorZero: EntradaTransferenciaEntreCarteiras;
    transferenciaParaOutroUsuario: EntradaTransferenciaEntreCarteiras;
    transferenciaComCarteiraOrigemArquivada: EntradaTransferenciaEntreCarteiras;
    transferenciaComCarteiraDestinoArquivada: EntradaTransferenciaEntreCarteiras;
    listagemTransferenciasUsuarioUm: EntradaListagemTransferenciasUsuario;
    cargaMultiusuario: EntradaCargaTransferenciasMultiusuario;
  };
  resultados: {
    transferenciaValidaUsuarioUm: ResultadoTransferenciaEntreCarteiras;
    transferenciaValidaUsuarioUmDois: ResultadoTransferenciaEntreCarteiras;
    listagemTransferenciasUsuarioUm: ResultadoTransferenciaEntreCarteiras[];
    cargaMultiusuario: ResultadoCargaTransferenciasMultiusuario;
  };
  erros: ErrosTransferenciaEntreCarteiras;
};
