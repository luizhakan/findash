import type { ContaDadosSimulados } from "../../tipos/contas/conta.tipos";

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
  erros: {
    emailJaEmUso: "Email ja esta em uso.",
    usuarioJaEmUso: "Usuario ja esta em uso.",
    senhaInvalida: "Senha invalida.",
    nomeInvalido: "Nome invalido.",
  },
};
