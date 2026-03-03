import type { TransferenciaEntreCarteirasDadosSimulados } from "../../tipos/transferencias/transferencia-entre-carteiras.tipos";
import {
  FonteOrigemMovimentacaoSistema,
  ModoMovimentacaoSistema,
  TipoMovimentacaoSistema,
} from "../../tipos/sistema/financeiro.tipos";

const usuarioUmId = "usuario_001";
const usuarioDoisId = "usuario_002";

const carteiraUsuarioUmOrigem = "carteira_usuario_001_principal";
const carteiraUsuarioUmDestino = "carteira_usuario_001_reserva";
const carteiraUsuarioUmArquivada = "carteira_usuario_001_arquivada";
const carteiraUsuarioDois = "carteira_usuario_002_principal";

const usuariosCarga = Array.from({ length: 180 }, (_, indice) => {
  const sufixo = String(indice + 1).padStart(3, "0");
  return `usuario_transferencia_${sufixo}`;
});

export const transferenciaEntreCarteirasDadosSimulados: TransferenciaEntreCarteirasDadosSimulados = {
  entradas: {
    transferenciaValidaUsuarioUm: {
      usuario_id: usuarioUmId,
      carteira_origem_id: carteiraUsuarioUmOrigem,
      carteira_destino_id: carteiraUsuarioUmDestino,
      valor: 250,
      descricao: "Transferencia para reserva",
      data_movimentacao: "2026-03-03",
    },
    transferenciaParaMesmaCarteira: {
      usuario_id: usuarioUmId,
      carteira_origem_id: carteiraUsuarioUmOrigem,
      carteira_destino_id: carteiraUsuarioUmOrigem,
      valor: 100,
      descricao: "Transferencia invalida para mesma carteira",
      data_movimentacao: "2026-03-03",
    },
    transferenciaValorZero: {
      usuario_id: usuarioUmId,
      carteira_origem_id: carteiraUsuarioUmOrigem,
      carteira_destino_id: carteiraUsuarioUmDestino,
      valor: 0,
      descricao: "Transferencia invalida valor zero",
      data_movimentacao: "2026-03-03",
    },
    transferenciaParaOutroUsuario: {
      usuario_id: usuarioUmId,
      carteira_origem_id: carteiraUsuarioUmOrigem,
      carteira_destino_id: carteiraUsuarioDois,
      valor: 75,
      descricao: "Tentativa de transferencia entre usuarios",
      data_movimentacao: "2026-03-03",
    },
    transferenciaComCarteiraOrigemArquivada: {
      usuario_id: usuarioUmId,
      carteira_origem_id: carteiraUsuarioUmArquivada,
      carteira_destino_id: carteiraUsuarioUmDestino,
      valor: 20,
      descricao: "Tentativa com origem arquivada",
      data_movimentacao: "2026-03-03",
    },
    transferenciaComCarteiraDestinoArquivada: {
      usuario_id: usuarioUmId,
      carteira_origem_id: carteiraUsuarioUmOrigem,
      carteira_destino_id: carteiraUsuarioUmArquivada,
      valor: 20,
      descricao: "Tentativa com destino arquivado",
      data_movimentacao: "2026-03-03",
    },
    listagemTransferenciasUsuarioUm: {
      usuario_id: usuarioUmId,
      data_inicial: "2026-03-01",
      data_final: "2026-03-31",
    },
    cargaMultiusuario: {
      usuario_ids: usuariosCarga,
      total_usuarios_esperado: 180,
      tempo_maximo_ms: 1200,
    },
  },
  resultados: {
    transferenciaValidaUsuarioUm: {
      id_transferencia: "transferencia_001",
      usuario_id: usuarioUmId,
      movimentacao_debito: {
        usuario_id: usuarioUmId,
        carteira_id: carteiraUsuarioUmOrigem,
        modo: ModoMovimentacaoSistema.TRANSFERENCIA,
        tipo: TipoMovimentacaoSistema.SAIDA,
        valor: -250,
        descricao: "Transferencia para reserva",
        data_movimentacao: "2026-03-03",
        id_origem: "transferencia_001_debito",
        fonte_origem: FonteOrigemMovimentacaoSistema.MANUAL,
      },
      movimentacao_credito: {
        usuario_id: usuarioUmId,
        carteira_id: carteiraUsuarioUmDestino,
        modo: ModoMovimentacaoSistema.TRANSFERENCIA,
        tipo: TipoMovimentacaoSistema.ENTRADA,
        valor: 250,
        descricao: "Transferencia para reserva",
        data_movimentacao: "2026-03-03",
        id_origem: "transferencia_001_credito",
        fonte_origem: FonteOrigemMovimentacaoSistema.MANUAL,
      },
      saldo_total_usuario_antes: 1320,
      saldo_total_usuario_depois: 1320,
      criada_em: "2026-03-03T13:00:00.000Z",
    },
    transferenciaValidaUsuarioUmDois: {
      id_transferencia: "transferencia_002",
      usuario_id: usuarioUmId,
      movimentacao_debito: {
        usuario_id: usuarioUmId,
        carteira_id: carteiraUsuarioUmOrigem,
        modo: ModoMovimentacaoSistema.TRANSFERENCIA,
        tipo: TipoMovimentacaoSistema.SAIDA,
        valor: -100,
        descricao: "Transferencia para reserva",
        data_movimentacao: "2026-03-04",
        id_origem: "transferencia_002_debito",
        fonte_origem: FonteOrigemMovimentacaoSistema.MANUAL,
      },
      movimentacao_credito: {
        usuario_id: usuarioUmId,
        carteira_id: carteiraUsuarioUmDestino,
        modo: ModoMovimentacaoSistema.TRANSFERENCIA,
        tipo: TipoMovimentacaoSistema.ENTRADA,
        valor: 100,
        descricao: "Transferencia para reserva",
        data_movimentacao: "2026-03-04",
        id_origem: "transferencia_002_credito",
        fonte_origem: FonteOrigemMovimentacaoSistema.MANUAL,
      },
      saldo_total_usuario_antes: 1320,
      saldo_total_usuario_depois: 1320,
      criada_em: "2026-03-04T13:00:00.000Z",
    },
    listagemTransferenciasUsuarioUm: [
      {
        id_transferencia: "transferencia_001",
        usuario_id: usuarioUmId,
        movimentacao_debito: {
          usuario_id: usuarioUmId,
          carteira_id: carteiraUsuarioUmOrigem,
          modo: ModoMovimentacaoSistema.TRANSFERENCIA,
          tipo: TipoMovimentacaoSistema.SAIDA,
          valor: -250,
          descricao: "Transferencia para reserva",
          data_movimentacao: "2026-03-03",
          id_origem: "transferencia_001_debito",
          fonte_origem: FonteOrigemMovimentacaoSistema.MANUAL,
        },
        movimentacao_credito: {
          usuario_id: usuarioUmId,
          carteira_id: carteiraUsuarioUmDestino,
          modo: ModoMovimentacaoSistema.TRANSFERENCIA,
          tipo: TipoMovimentacaoSistema.ENTRADA,
          valor: 250,
          descricao: "Transferencia para reserva",
          data_movimentacao: "2026-03-03",
          id_origem: "transferencia_001_credito",
          fonte_origem: FonteOrigemMovimentacaoSistema.MANUAL,
        },
        saldo_total_usuario_antes: 1320,
        saldo_total_usuario_depois: 1320,
        criada_em: "2026-03-03T13:00:00.000Z",
      },
      {
        id_transferencia: "transferencia_002",
        usuario_id: usuarioUmId,
        movimentacao_debito: {
          usuario_id: usuarioUmId,
          carteira_id: carteiraUsuarioUmOrigem,
          modo: ModoMovimentacaoSistema.TRANSFERENCIA,
          tipo: TipoMovimentacaoSistema.SAIDA,
          valor: -100,
          descricao: "Transferencia para reserva",
          data_movimentacao: "2026-03-04",
          id_origem: "transferencia_002_debito",
          fonte_origem: FonteOrigemMovimentacaoSistema.MANUAL,
        },
        movimentacao_credito: {
          usuario_id: usuarioUmId,
          carteira_id: carteiraUsuarioUmDestino,
          modo: ModoMovimentacaoSistema.TRANSFERENCIA,
          tipo: TipoMovimentacaoSistema.ENTRADA,
          valor: 100,
          descricao: "Transferencia para reserva",
          data_movimentacao: "2026-03-04",
          id_origem: "transferencia_002_credito",
          fonte_origem: FonteOrigemMovimentacaoSistema.MANUAL,
        },
        saldo_total_usuario_antes: 1320,
        saldo_total_usuario_depois: 1320,
        criada_em: "2026-03-04T13:00:00.000Z",
      },
    ],
    cargaMultiusuario: {
      total_usuarios_processados: 180,
      total_transferencias_processadas: 360,
      usuario_ids_sem_vazamento: usuariosCarga,
      tempo_processamento_ms: 910,
    },
  },
  erros: {
    acessoNegado: "Transferencia entre usuarios diferentes nao e permitida.",
    carteiraOrigemIgualDestino: "Carteira de origem e destino nao podem ser iguais.",
    valorInvalido: "Valor da transferencia deve ser maior que zero.",
    carteiraArquivada: "Carteira arquivada nao pode participar de transferencia.",
  },
};
