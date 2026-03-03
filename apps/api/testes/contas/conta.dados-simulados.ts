import type { ContaDadosSimulados } from "../../tipos/contas/conta.tipos";
import {
  ModoMovimentacaoSistema,
  ModoParcelamentoSistema,
  TipoMovimentacaoSistema,
} from "../../tipos/sistema/financeiro.tipos";

export const contaDadosSimulados: ContaDadosSimulados = {
  entradaCriacao: {
    nome: "Luiz Hakan",
    usuario: "luizhakan",
    email: "luiz.hakan@example.com",
    senha: "SenhaForteSimulada#2026",
  },
  entradaCriacaoComEmailDuplicado: {
    nome: "Maria Oliveira",
    usuario: "mariaoliveira",
    email: "luiz.hakan@example.com",
    senha: "SenhaForteSimulada#2026",
  },
  entradaCriacaoComUsuarioDuplicado: {
    nome: "Maria Oliveira",
    usuario: "luizhakan",
    email: "maria.oliveira@example.com",
    senha: "SenhaForteSimulada#2026",
  },
  contaExistente: {
    id: "conta_simulada_001",
    nome: "Luiz Hakan",
    usuario: "luizhakan",
    email: "luiz.hakan@example.com",
    senha: "SenhaComHashSimulada#2026",
  },
  entradaEdicaoSenha: {
    idConta: "conta_simulada_001",
    novaSenha: "NovaSenhaForteSimulada#2026",
  },
  entradaEdicaoSenhaComSenhaFraca: {
    idConta: "conta_simulada_001",
    novaSenha: "123",
  },
  entradaMudancaNome: {
    idConta: "conta_simulada_001",
    novoNome: "Luiz Hakan Silva",
  },
  entradaMudancaNomeVazio: {
    idConta: "conta_simulada_001",
    novoNome: "",
  },
  entradaMudancaNomeAbaixoDoMinimo: {
    idConta: "conta_simulada_001",
    novoNome: "A",
  },
  entradaRecuperacaoSenha: {
    email: "luiz.hakan@example.com",
  },
  entradaRecuperacaoSenhaEmailInexistente: {
    email: "nao.existe@example.com",
  },
  respostaRecuperacaoSenha: {
    mensagem: "Solicitacao de recuperacao de senha aceita.",
  },
  respostaRecuperacaoSenhaGenerica: {
    mensagem: "Se o email existir, enviaremos as instrucoes de recuperacao.",
  },
  entradaAdicionarDespesaParceladaFixa: {
    usuario_id: "usuario_001",
    idContaFinanceira: "conta_financeira_001",
    tipo: TipoMovimentacaoSistema.SAIDA,
    modo: ModoMovimentacaoSistema.TRANSFERENCIA,
    valor_total: 600,
    descricao: "Curso tecnico parcelado",
    data_primeiro_vencimento: "2026-03-10",
    parcelamento: {
      modo: ModoParcelamentoSistema.FIXO,
      quantidade_parcelas: 3,
      valor_parcela_fixa: 200,
    },
  },
  entradaAdicionarReceitaParceladaDiluida: {
    usuario_id: "usuario_001",
    idContaFinanceira: "conta_financeira_001",
    tipo: TipoMovimentacaoSistema.ENTRADA,
    modo: ModoMovimentacaoSistema.PIX,
    valor_total: 1000,
    descricao: "Projeto freelance",
    data_primeiro_vencimento: "2026-03-15",
    parcelamento: {
      modo: ModoParcelamentoSistema.DILUIDO,
      quantidade_parcelas: 3,
    },
  },
  entradaParcelarTransferenciaFixa: {
    usuario_id: "usuario_001",
    idLancamento: "lancamento_transferencia_001",
    modo: ModoParcelamentoSistema.FIXO,
    quantidade_parcelas: 3,
    valor_parcela_fixa: 300,
  },
  entradaParcelarTransferenciaDiluida: {
    usuario_id: "usuario_001",
    idLancamento: "lancamento_transferencia_002",
    modo: ModoParcelamentoSistema.DILUIDO,
    quantidade_parcelas: 3,
  },
  entradaParcelarComQuantidadeInvalida: {
    usuario_id: "usuario_001",
    idLancamento: "lancamento_transferencia_003",
    modo: ModoParcelamentoSistema.DILUIDO,
    quantidade_parcelas: 1,
  },
  saidaDespesaParceladaFixa: {
    idLancamento: "lancamento_despesa_001",
    usuario_id: "usuario_001",
    idContaFinanceira: "conta_financeira_001",
    tipo: TipoMovimentacaoSistema.SAIDA,
    modo: ModoMovimentacaoSistema.TRANSFERENCIA,
    valor_total: 600,
    descricao: "Curso tecnico parcelado",
    parcelas: [
      {
        numero: 1,
        valor: 200,
        data_vencimento: "2026-03-10",
        status: "aberta",
      },
      {
        numero: 2,
        valor: 200,
        data_vencimento: "2026-04-10",
        status: "aberta",
      },
      {
        numero: 3,
        valor: 200,
        data_vencimento: "2026-05-10",
        status: "aberta",
      },
    ],
  },
  saidaReceitaParceladaDiluida: {
    idLancamento: "lancamento_receita_001",
    usuario_id: "usuario_001",
    idContaFinanceira: "conta_financeira_001",
    tipo: TipoMovimentacaoSistema.ENTRADA,
    modo: ModoMovimentacaoSistema.PIX,
    valor_total: 1000,
    descricao: "Projeto freelance",
    parcelas: [
      {
        numero: 1,
        valor: 333.33,
        data_vencimento: "2026-03-15",
        status: "aberta",
      },
      {
        numero: 2,
        valor: 333.33,
        data_vencimento: "2026-04-15",
        status: "aberta",
      },
      {
        numero: 3,
        valor: 333.34,
        data_vencimento: "2026-05-15",
        status: "aberta",
      },
    ],
  },
  saidaTransferenciaParceladaFixa: {
    idLancamento: "lancamento_transferencia_001",
    usuario_id: "usuario_001",
    idContaFinanceira: "conta_financeira_001",
    tipo: TipoMovimentacaoSistema.SAIDA,
    modo: ModoMovimentacaoSistema.TRANSFERENCIA,
    valor_total: 900,
    descricao: "Transferencia parcelada fixa",
    parcelas: [
      {
        numero: 1,
        valor: 300,
        data_vencimento: "2026-03-20",
        status: "aberta",
      },
      {
        numero: 2,
        valor: 300,
        data_vencimento: "2026-04-20",
        status: "aberta",
      },
      {
        numero: 3,
        valor: 300,
        data_vencimento: "2026-05-20",
        status: "aberta",
      },
    ],
  },
  saidaTransferenciaParceladaDiluida: {
    idLancamento: "lancamento_transferencia_002",
    usuario_id: "usuario_001",
    idContaFinanceira: "conta_financeira_001",
    tipo: TipoMovimentacaoSistema.SAIDA,
    modo: ModoMovimentacaoSistema.TRANSFERENCIA,
    valor_total: 1000,
    descricao: "Transferencia parcelada diluida",
    parcelas: [
      {
        numero: 1,
        valor: 333.33,
        data_vencimento: "2026-03-20",
        status: "aberta",
      },
      {
        numero: 2,
        valor: 333.33,
        data_vencimento: "2026-04-20",
        status: "aberta",
      },
      {
        numero: 3,
        valor: 333.34,
        data_vencimento: "2026-05-20",
        status: "aberta",
      },
    ],
  },
  erros: {
    emailJaEmUso: "Email ja esta em uso.",
    usuarioJaEmUso: "Usuario ja esta em uso.",
    senhaInvalida: "Senha invalida.",
    nomeInvalido: "Nome invalido.",
    quantidadeParcelasInvalida: "Quantidade de parcelas invalida.",
    valorTotalInvalido: "Valor total invalido para parcelamento.",
  },
};
