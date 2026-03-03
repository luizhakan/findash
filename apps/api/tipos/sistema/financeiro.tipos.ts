export enum TipoCarteiraSistema {
  CONTA_CORRENTE = "conta_corrente",
  CONTA_PAGAMENTO = "conta_pagamento",
  CARTEIRA_DIGITAL = "carteira_digital",
  CARTAO_CREDITO = "cartao_credito",
  DINHEIRO = "dinheiro",
}

export enum ModoMovimentacaoSistema {
  CARTAO_CREDITO = "cartao_credito",
  CARTAO_DEBITO = "cartao_debito",
  PIX = "pix",
  TRANSFERENCIA = "transferencia",
  BOLETO = "boleto",
  DINHEIRO = "dinheiro",
  AJUSTE = "ajuste",
}

export enum TipoMovimentacaoSistema {
  ENTRADA = "entrada",
  SAIDA = "saida",
}

export enum FonteOrigemMovimentacaoSistema {
  NUBANK = "nubank",
  INTER = "inter",
  MERCADO_PAGO = "mercado_pago",
  MANUAL = "manual",
}

export enum StatusImportacaoCsvSistema {
  PENDENTE = "pendente",
  PROCESSANDO = "processando",
  CONCLUIDA = "concluida",
  CONCLUIDA_COM_ERROS = "concluida_com_erros",
  FALHA = "falha",
}

export type UsuarioSistema = {
  id: string;
  nome: string;
  email: string;
  status: "ativo" | "inativo";
};

export type CarteiraSistema = {
  id: string;
  usuario_id: string;
  nome: string;
  tipo_carteira: TipoCarteiraSistema;
  moeda: string;
  saldo_inicial: number;
  saldo_atual: number;
  ativa: boolean;
  arquivada: boolean;
  criada_em: string;
};

export type MovimentacaoSistema = {
  id: string;
  usuario_id: string;
  carteira_id: string;
  modo: ModoMovimentacaoSistema;
  tipo: TipoMovimentacaoSistema;
  valor: number;
  descricao: string;
  data_movimentacao: string;
  saldo_pos_movimento_origem?: number;
  id_origem?: string;
  fonte_origem: FonteOrigemMovimentacaoSistema;
  criada_em: string;
};

export type MovimentacaoSistemaParaPersistencia = Omit<
  MovimentacaoSistema,
  "id" | "criada_em"
>;

export type ImportacaoCsvSistema = {
  id: string;
  usuario_id: string;
  carteira_id: string;
  fonte_origem: FonteOrigemMovimentacaoSistema;
  hash_arquivo: string;
  status: StatusImportacaoCsvSistema;
  criada_em: string;
};

export type ItemImportacaoCsvSistema = {
  id: string;
  importacao_id: string;
  id_origem?: string;
  status: "processado" | "ignorado_duplicado" | "erro";
  motivo_erro?: string;
};
