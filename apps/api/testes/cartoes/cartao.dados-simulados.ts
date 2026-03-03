import type { CartaoDadosSimulados } from "../../tipos/cartoes/cartao.tipos";
import { ModoParcelamentoSistema } from "../../tipos/sistema/financeiro.tipos";

const usuarioUmId = "usuario_001";
const usuarioDoisId = "usuario_002";

const cartaoUsuarioUmId = "cartao_usuario_001_001";
const cartaoUsuarioDoisId = "cartao_usuario_002_001";

const faturaAtualUsuarioUmId = "fatura_2026_03_cartao_001";
const faturaFuturaUsuarioUmId = "fatura_2026_05_cartao_001";
const faturaUsuarioDoisId = "fatura_2026_03_cartao_002";

export const cartaoDadosSimulados: CartaoDadosSimulados = {
  entradas: {
    criacaoCartaoValida: {
      usuario_id: usuarioUmId,
      nome: "Cartao Principal",
      bandeira: "visa",
      limite_total: 5000,
      dia_fechamento: 10,
      dia_vencimento: 17,
    },
    criacaoCartaoSemFechamento: {
      usuario_id: usuarioUmId,
      nome: "Cartao Sem Fechamento",
      bandeira: "mastercard",
      limite_total: 2500,
      dia_vencimento: 17,
    },
    criacaoCartaoSemVencimento: {
      usuario_id: usuarioUmId,
      nome: "Cartao Sem Vencimento",
      bandeira: "elo",
      limite_total: 2500,
      dia_fechamento: 8,
    },
    registroCompraFaturaAtualPadrao: {
      usuario_id: usuarioUmId,
      id_cartao: cartaoUsuarioUmId,
      descricao: "Compra de supermercado",
      valor_total: 450,
      data_compra: "2026-03-04",
      parcelamento: {
        modo: ModoParcelamentoSistema.FIXO,
        quantidade_parcelas: 3,
        valor_parcela_fixa: 150,
      },
    },
    registroCompraFaturaFutura: {
      usuario_id: usuarioUmId,
      id_cartao: cartaoUsuarioUmId,
      descricao: "Notebook",
      valor_total: 3000,
      data_compra: "2026-02-20",
      id_fatura_destino: faturaFuturaUsuarioUmId,
      parcelamento: {
        modo: ModoParcelamentoSistema.DILUIDO,
        quantidade_parcelas: 3,
      },
    },
    edicaoCompraMudandoFatura: {
      usuario_id: usuarioUmId,
      id_compra: "compra_001",
      id_fatura_destino: faturaFuturaUsuarioUmId,
    },
    edicaoCompraSemTrocaFatura: {
      usuario_id: usuarioUmId,
      id_compra: "compra_002",
      descricao: "Compra ajustada sem trocar fatura",
    },
    adicionarJurosManualFatura: {
      usuario_id: usuarioUmId,
      id_fatura: faturaAtualUsuarioUmId,
      valor_juros: 150,
    },
    editarJurosManualFatura: {
      usuario_id: usuarioUmId,
      id_fatura: faturaAtualUsuarioUmId,
      valor_juros: 200,
    },
    removerJurosManualFatura: {
      usuario_id: usuarioUmId,
      id_fatura: faturaAtualUsuarioUmId,
    },
    registroCompraCartaoOutroUsuario: {
      usuario_id: usuarioUmId,
      id_cartao: cartaoUsuarioDoisId,
      descricao: "Tentativa indevida",
      valor_total: 100,
      data_compra: "2026-03-05",
    },
    editarJurosFaturaOutroUsuario: {
      usuario_id: usuarioUmId,
      id_fatura: faturaUsuarioDoisId,
      valor_juros: 30,
    },
    listagemCartoesUsuarioUm: {
      usuario_id: usuarioUmId,
    },
    listagemFaturasUsuarioUm: {
      usuario_id: usuarioUmId,
      id_cartao: cartaoUsuarioUmId,
    },
  },
  resultados: {
    cartaoCriado: {
      id: cartaoUsuarioUmId,
      usuario_id: usuarioUmId,
      nome: "Cartao Principal",
      bandeira: "visa",
      limite_total: 5000,
      dia_fechamento: 10,
      dia_vencimento: 17,
      ativo: true,
      criado_em: "2026-03-03T12:00:00.000Z",
    },
    compraFaturaAtualPadrao: {
      id_compra: "compra_001",
      usuario_id: usuarioUmId,
      cartao_id: cartaoUsuarioUmId,
      descricao: "Compra de supermercado",
      valor_total: 450,
      data_compra: "2026-03-04",
      id_fatura_destino: faturaAtualUsuarioUmId,
      parcelas: [
        {
          numero: 1,
          valor: 150,
          data_vencimento: "2026-03-17",
          status: "aberta",
        },
        {
          numero: 2,
          valor: 150,
          data_vencimento: "2026-04-17",
          status: "aberta",
        },
        {
          numero: 3,
          valor: 150,
          data_vencimento: "2026-05-17",
          status: "aberta",
        },
      ],
    },
    compraFaturaFutura: {
      id_compra: "compra_002",
      usuario_id: usuarioUmId,
      cartao_id: cartaoUsuarioUmId,
      descricao: "Notebook",
      valor_total: 3000,
      data_compra: "2026-02-20",
      id_fatura_destino: faturaFuturaUsuarioUmId,
      parcelas: [
        {
          numero: 1,
          valor: 1000,
          data_vencimento: "2026-05-17",
          status: "aberta",
        },
        {
          numero: 2,
          valor: 1000,
          data_vencimento: "2026-06-17",
          status: "aberta",
        },
        {
          numero: 3,
          valor: 1000,
          data_vencimento: "2026-07-17",
          status: "aberta",
        },
      ],
    },
    compraEditadaComFaturaFutura: {
      id_compra: "compra_001",
      usuario_id: usuarioUmId,
      cartao_id: cartaoUsuarioUmId,
      descricao: "Compra de supermercado",
      valor_total: 450,
      data_compra: "2026-03-04",
      id_fatura_destino: faturaFuturaUsuarioUmId,
      parcelas: [
        {
          numero: 1,
          valor: 150,
          data_vencimento: "2026-05-17",
          status: "aberta",
        },
        {
          numero: 2,
          valor: 150,
          data_vencimento: "2026-06-17",
          status: "aberta",
        },
        {
          numero: 3,
          valor: 150,
          data_vencimento: "2026-07-17",
          status: "aberta",
        },
      ],
    },
    compraEditadaSemTrocaFatura: {
      id_compra: "compra_002",
      usuario_id: usuarioUmId,
      cartao_id: cartaoUsuarioUmId,
      descricao: "Compra ajustada sem trocar fatura",
      valor_total: 3000,
      data_compra: "2026-02-20",
      id_fatura_destino: faturaAtualUsuarioUmId,
      parcelas: [
        {
          numero: 1,
          valor: 1000,
          data_vencimento: "2026-03-17",
          status: "aberta",
        },
        {
          numero: 2,
          valor: 1000,
          data_vencimento: "2026-04-17",
          status: "aberta",
        },
        {
          numero: 3,
          valor: 1000,
          data_vencimento: "2026-05-17",
          status: "aberta",
        },
      ],
    },
    faturaComJurosAdicionado: {
      id_fatura: faturaAtualUsuarioUmId,
      usuario_id: usuarioUmId,
      cartao_id: cartaoUsuarioUmId,
      referencia: "2026-03",
      data_fechamento: "2026-03-10",
      data_vencimento: "2026-03-17",
      valor_compras: 2000,
      valor_juros_manual: 150,
      valor_total: 2150,
    },
    faturaComJurosEditado: {
      id_fatura: faturaAtualUsuarioUmId,
      usuario_id: usuarioUmId,
      cartao_id: cartaoUsuarioUmId,
      referencia: "2026-03",
      data_fechamento: "2026-03-10",
      data_vencimento: "2026-03-17",
      valor_compras: 2000,
      valor_juros_manual: 200,
      valor_total: 2200,
    },
    faturaSemJuros: {
      id_fatura: faturaAtualUsuarioUmId,
      usuario_id: usuarioUmId,
      cartao_id: cartaoUsuarioUmId,
      referencia: "2026-03",
      data_fechamento: "2026-03-10",
      data_vencimento: "2026-03-17",
      valor_compras: 2000,
      valor_juros_manual: 0,
      valor_total: 2000,
    },
    faturaAcimaDoLimitePermitida: {
      id_fatura: faturaAtualUsuarioUmId,
      usuario_id: usuarioUmId,
      cartao_id: cartaoUsuarioUmId,
      referencia: "2026-03",
      data_fechamento: "2026-03-10",
      data_vencimento: "2026-03-17",
      valor_compras: 6200,
      valor_juros_manual: 0,
      valor_total: 6200,
    },
    listaCartoesUsuarioUm: [
      {
        id: cartaoUsuarioUmId,
        usuario_id: usuarioUmId,
        nome: "Cartao Principal",
        bandeira: "visa",
        limite_total: 5000,
        dia_fechamento: 10,
        dia_vencimento: 17,
        ativo: true,
        criado_em: "2026-03-03T12:00:00.000Z",
      },
    ],
    listaFaturasUsuarioUm: [
      {
        id_fatura: faturaAtualUsuarioUmId,
        usuario_id: usuarioUmId,
        cartao_id: cartaoUsuarioUmId,
        referencia: "2026-03",
        data_fechamento: "2026-03-10",
        data_vencimento: "2026-03-17",
        valor_compras: 2000,
        valor_juros_manual: 0,
        valor_total: 2000,
      },
      {
        id_fatura: faturaFuturaUsuarioUmId,
        usuario_id: usuarioUmId,
        cartao_id: cartaoUsuarioUmId,
        referencia: "2026-05",
        data_fechamento: "2026-05-10",
        data_vencimento: "2026-05-17",
        valor_compras: 3000,
        valor_juros_manual: 0,
        valor_total: 3000,
      },
    ],
  },
  erros: {
    diaFechamentoObrigatorio: "Dia de fechamento e obrigatorio.",
    diaVencimentoObrigatorio: "Dia de vencimento e obrigatorio.",
    diaFechamentoInvalido: "Dia de fechamento invalido.",
    diaVencimentoInvalido: "Dia de vencimento invalido.",
    acessoNegado: "Acesso negado para recurso de outro usuario.",
  },
};
