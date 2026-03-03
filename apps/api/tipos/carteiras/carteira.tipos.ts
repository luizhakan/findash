import type {
  CarteiraSistema,
  MovimentacaoSistemaParaPersistencia,
  TipoCarteiraSistema,
} from "../sistema/financeiro.tipos";
import type { EntradaAdicionarDadosCsv } from "../csv/csv-bancario.tipos";

export type EntradaCriacaoCarteira = {
  usuario_id: string;
  nome: string;
  tipo_carteira: TipoCarteiraSistema;
  moeda: string;
  saldo_inicial: number;
};

export type EntradaListagemCarteiras = {
  usuario_id: string;
  incluir_arquivadas?: boolean;
  ordenar_por?: "nome" | "saldo_atual" | "criada_em";
  ordem?: "asc" | "desc";
};

export type EntradaListagemCarteirasPaginada = EntradaListagemCarteiras & {
  pagina: number;
  tamanho_pagina: number;
};

export type ResultadoListagemCarteirasPaginada = {
  itens: CarteiraSistema[];
  pagina: number;
  tamanho_pagina: number;
  total_itens: number;
  total_paginas: number;
};

export type EntradaBuscaCarteira = {
  usuario_id: string;
  carteira_id: string;
};

export type EntradaEdicaoCarteira = {
  usuario_id: string;
  carteira_id: string;
  nome?: string;
  ativa?: boolean;
};

export type EntradaRemocaoCarteira = {
  usuario_id: string;
  carteira_id: string;
};

export type EntradaArquivamentoCarteira = {
  usuario_id: string;
  carteira_id: string;
};

export type EntradaAdicionarMovimentacaoNaCarteira = {
  usuario_id: string;
  carteira_id: string;
  movimentacao: MovimentacaoSistemaParaPersistencia;
};

export type EntradaTransferenciaEntreCarteiras = {
  usuario_id: string;
  carteira_origem_id: string;
  carteira_destino_id: string;
  valor: number;
  descricao: string;
  data_movimentacao: string;
};

export type ResultadoTransferenciaEntreCarteiras = {
  movimentacao_debito: MovimentacaoSistemaParaPersistencia;
  movimentacao_credito: MovimentacaoSistemaParaPersistencia;
  saldo_origem: number;
  saldo_destino: number;
};

export type EntradaImportacaoCsvNaCarteira = EntradaAdicionarDadosCsv;

export type ResultadoImportacaoCsvNaCarteira = {
  movimentacoes_criadas: number;
  movimentacoes_ignoradas_duplicadas: number;
  ids_origem_criados: string[];
  ids_origem_ignorados: string[];
};

export type EntradaCargaMultiusuario = {
  usuario_ids: string[];
  total_usuarios_esperado: number;
  tempo_maximo_ms: number;
};

export type ResultadoCargaMultiusuario = {
  total_usuarios_processados: number;
  total_carteiras_processadas: number;
  usuario_ids_sem_vazamento: string[];
  tempo_processamento_ms: number;
};

export type ErrosCarteira = {
  nomeVazio: string;
  carteiraDuplicada: string;
  acessoNegado: string;
  carteiraComMovimentacoesAtivas: string;
  carteiraArquivada: string;
  transferenciaEntreUsuariosBloqueada: string;
  conflitoConcorrencia: string;
  saldoInconsistente: string;
};

export interface CasosDeUsoCarteiras {
  criarCarteira(entrada: EntradaCriacaoCarteira): Promise<CarteiraSistema>;
  listarCarteirasPorUsuario(
    entrada: EntradaListagemCarteiras,
  ): Promise<CarteiraSistema[]>;
  listarCarteirasPaginadas(
    entrada: EntradaListagemCarteirasPaginada,
  ): Promise<ResultadoListagemCarteirasPaginada>;
  buscarCarteiraPorId(entrada: EntradaBuscaCarteira): Promise<CarteiraSistema>;
  editarCarteira(entrada: EntradaEdicaoCarteira): Promise<CarteiraSistema>;
  removerCarteira(entrada: EntradaRemocaoCarteira): Promise<void>;
  arquivarCarteira(entrada: EntradaArquivamentoCarteira): Promise<CarteiraSistema>;
  adicionarMovimentacaoNaCarteira(
    entrada: EntradaAdicionarMovimentacaoNaCarteira,
  ): Promise<CarteiraSistema>;
  transferirEntreCarteiras(
    entrada: EntradaTransferenciaEntreCarteiras,
  ): Promise<ResultadoTransferenciaEntreCarteiras>;
  importarCsvNaCarteira(
    entrada: EntradaImportacaoCsvNaCarteira,
  ): Promise<ResultadoImportacaoCsvNaCarteira>;
  processarCargaMultiusuario(
    entrada: EntradaCargaMultiusuario,
  ): Promise<ResultadoCargaMultiusuario>;
}
