import type { SaldoConsolidadoDadosSimulados } from "../../tipos/saldos/saldo-consolidado.tipos";

const usuarioUmId = "usuario_001";
const usuarioDoisId = "usuario_002";

const carteiraPrincipal = "carteira_usuario_001_principal";
const carteiraReserva = "carteira_usuario_001_reserva";
const carteiraArquivada = "carteira_usuario_001_arquivada";
const carteiraInativa = "carteira_usuario_001_inativa";
const carteiraNova = "carteira_usuario_001_nova";
const carteiraOutroUsuario = "carteira_usuario_002_principal";

const usuariosCarga = Array.from({ length: 150 }, (_, indice) => {
  const sufixo = String(indice + 1).padStart(3, "0");
  return `usuario_saldo_${sufixo}`;
});

export const saldoConsolidadoDadosSimulados: SaldoConsolidadoDadosSimulados = {
  entradas: {
    calculoPadraoUsuarioUm: {
      usuario_id: usuarioUmId,
      considerar_somente_ativas: false,
      incluir_arquivadas: true,
    },
    ocultarCarteiraReservaUsuarioUm: {
      usuario_id: usuarioUmId,
      carteira_id: carteiraReserva,
      visivel: false,
    },
    reexibirCarteiraReservaUsuarioUm: {
      usuario_id: usuarioUmId,
      carteira_id: carteiraReserva,
      visivel: true,
    },
    ocultarTodasCarteirasUsuarioUm: {
      usuario_id: usuarioUmId,
      ids_carteiras_visiveis: [],
      considerar_somente_ativas: false,
      incluir_arquivadas: false,
    },
    calculoSemArquivadasUsuarioUm: {
      usuario_id: usuarioUmId,
      considerar_somente_ativas: false,
      incluir_arquivadas: false,
      ids_carteiras_visiveis: [carteiraPrincipal, carteiraReserva, carteiraInativa],
    },
    calculoSomenteAtivasUsuarioUm: {
      usuario_id: usuarioUmId,
      considerar_somente_ativas: true,
      incluir_arquivadas: false,
      ids_carteiras_visiveis: [carteiraPrincipal, carteiraReserva, carteiraInativa],
    },
    ocultarCarteiraOutroUsuario: {
      usuario_id: usuarioUmId,
      carteira_id: carteiraOutroUsuario,
      visivel: false,
    },
    registrarNovaCarteiraPadraoVisivelUsuarioUm: {
      usuario_id: usuarioUmId,
      carteira_id: carteiraNova,
    },
    removerCarteiraDoConsolidadoUsuarioUm: {
      usuario_id: usuarioUmId,
      carteira_id: carteiraReserva,
    },
    recalculoAposMovimentacaoEntrada: {
      usuario_id: usuarioUmId,
      carteira_id: carteiraPrincipal,
      valor_delta: 300,
    },
    recalculoAposMovimentacaoSaida: {
      usuario_id: usuarioUmId,
      carteira_id: carteiraPrincipal,
      valor_delta: -120,
    },
    calculoPaginadoNaoAfetaTotalUsuarioUm: {
      usuario_id: usuarioUmId,
      ids_carteiras_visiveis: [carteiraPrincipal],
      considerar_somente_ativas: false,
      incluir_arquivadas: true,
    },
    calculoMisturaPositivoNegativoUsuarioUm: {
      usuario_id: usuarioUmId,
      ids_carteiras_visiveis: [carteiraPrincipal, carteiraReserva],
      considerar_somente_ativas: false,
      incluir_arquivadas: false,
    },
    cargaMultiusuario: {
      usuario_ids: usuariosCarga,
      total_usuarios_esperado: 150,
      tempo_maximo_ms: 1200,
    },
  },
  resultados: {
    saldoPadraoUsuarioUm: {
      usuario_id: usuarioUmId,
      saldo_total: 1320,
      carteiras_incluidas: [
        carteiraPrincipal,
        carteiraReserva,
        carteiraArquivada,
        carteiraInativa,
      ],
      carteiras_excluidas: [],
      atualizado_em: "2026-03-03T12:00:00.000Z",
    },
    saldoAposOcultarReservaUsuarioUm: {
      usuario_id: usuarioUmId,
      saldo_total: 1120,
      carteiras_incluidas: [carteiraPrincipal, carteiraArquivada, carteiraInativa],
      carteiras_excluidas: [carteiraReserva],
      atualizado_em: "2026-03-03T12:01:00.000Z",
    },
    saldoAposReexibirReservaUsuarioUm: {
      usuario_id: usuarioUmId,
      saldo_total: 1320,
      carteiras_incluidas: [
        carteiraPrincipal,
        carteiraReserva,
        carteiraArquivada,
        carteiraInativa,
      ],
      carteiras_excluidas: [],
      atualizado_em: "2026-03-03T12:02:00.000Z",
    },
    saldoComTodasOcultasUsuarioUm: {
      usuario_id: usuarioUmId,
      saldo_total: 0,
      carteiras_incluidas: [],
      carteiras_excluidas: [
        carteiraPrincipal,
        carteiraReserva,
        carteiraArquivada,
        carteiraInativa,
      ],
      atualizado_em: "2026-03-03T12:03:00.000Z",
    },
    saldoSemArquivadasUsuarioUm: {
      usuario_id: usuarioUmId,
      saldo_total: 1020,
      carteiras_incluidas: [carteiraPrincipal, carteiraReserva, carteiraInativa],
      carteiras_excluidas: [carteiraArquivada],
      atualizado_em: "2026-03-03T12:04:00.000Z",
    },
    saldoSomenteAtivasUsuarioUm: {
      usuario_id: usuarioUmId,
      saldo_total: 1200,
      carteiras_incluidas: [carteiraPrincipal, carteiraReserva],
      carteiras_excluidas: [carteiraArquivada, carteiraInativa],
      atualizado_em: "2026-03-03T12:05:00.000Z",
    },
    saldoAposRegistrarNovaCarteiraVisivel: {
      usuario_id: usuarioUmId,
      saldo_total: 1320,
      carteiras_incluidas: [
        carteiraPrincipal,
        carteiraReserva,
        carteiraArquivada,
        carteiraInativa,
        carteiraNova,
      ],
      carteiras_excluidas: [],
      atualizado_em: "2026-03-03T12:06:00.000Z",
    },
    saldoAposRemoverCarteiraDoConsolidado: {
      usuario_id: usuarioUmId,
      saldo_total: 1120,
      carteiras_incluidas: [carteiraPrincipal, carteiraArquivada, carteiraInativa],
      carteiras_excluidas: [carteiraReserva],
      atualizado_em: "2026-03-03T12:07:00.000Z",
    },
    saldoAposMovimentacaoEntrada: {
      usuario_id: usuarioUmId,
      saldo_total: 1620,
      carteiras_incluidas: [
        carteiraPrincipal,
        carteiraReserva,
        carteiraArquivada,
        carteiraInativa,
      ],
      carteiras_excluidas: [],
      atualizado_em: "2026-03-03T12:08:00.000Z",
    },
    saldoAposMovimentacaoSaida: {
      usuario_id: usuarioUmId,
      saldo_total: 1200,
      carteiras_incluidas: [
        carteiraPrincipal,
        carteiraReserva,
        carteiraArquivada,
        carteiraInativa,
      ],
      carteiras_excluidas: [],
      atualizado_em: "2026-03-03T12:09:00.000Z",
    },
    saldoPaginadoNaoAfetaTotalUsuarioUm: {
      usuario_id: usuarioUmId,
      saldo_total: 1320,
      carteiras_incluidas: [
        carteiraPrincipal,
        carteiraReserva,
        carteiraArquivada,
        carteiraInativa,
      ],
      carteiras_excluidas: [],
      atualizado_em: "2026-03-03T12:10:00.000Z",
    },
    saldoMisturaPositivoNegativoUsuarioUm: {
      usuario_id: usuarioUmId,
      saldo_total: 1200,
      carteiras_incluidas: [carteiraPrincipal, carteiraReserva],
      carteiras_excluidas: [carteiraArquivada, carteiraInativa],
      atualizado_em: "2026-03-03T12:11:00.000Z",
    },
    cargaMultiusuario: {
      total_usuarios_processados: 150,
      usuario_ids_sem_vazamento: usuariosCarga,
      tempo_processamento_ms: 680,
    },
  },
  erros: {
    acessoNegado: "Acesso negado para alterar saldo consolidado de outro usuario.",
    carteiraNaoPertenceAoUsuario:
      "Carteira informada nao pertence ao usuario para consolidacao.",
  },
};
