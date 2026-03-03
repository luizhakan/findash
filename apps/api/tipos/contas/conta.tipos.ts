export type ContaSimulada = {
  id: string;
  nome: string;
  usuario: string;
  email: string;
  senha: string;
};

export type EntradaCriacaoConta = {
  nome: string;
  usuario: string;
  email: string;
  senha: string;
};

export type EntradaEdicaoSenha = {
  idConta: string;
  novaSenha: string;
};

export type EntradaMudancaNome = {
  idConta: string;
  novoNome: string;
};

export type EntradaRecuperacaoSenha = {
  email: string;
};

export type SaidaRecuperacaoSenha = {
  mensagem: string;
};

export type ErrosConta = {
  emailJaEmUso: string;
  usuarioJaEmUso: string;
  senhaInvalida: string;
  nomeInvalido: string;
};

export interface CasosDeUsoConta {
  criarConta(entrada: EntradaCriacaoConta): Promise<ContaSimulada>;
  deletarConta(idConta: string): Promise<void>;
  editarSenha(entrada: EntradaEdicaoSenha): Promise<void>;
  mudarNome(entrada: EntradaMudancaNome): Promise<void>;
  solicitarRecuperacaoSenha(
    entrada: EntradaRecuperacaoSenha,
  ): Promise<SaidaRecuperacaoSenha>;
}

export type ContaDadosSimulados = {
  entradaCriacao: EntradaCriacaoConta;
  entradaCriacaoComEmailDuplicado: EntradaCriacaoConta;
  entradaCriacaoComUsuarioDuplicado: EntradaCriacaoConta;
  contaExistente: ContaSimulada;
  entradaEdicaoSenha: EntradaEdicaoSenha;
  entradaEdicaoSenhaComSenhaFraca: EntradaEdicaoSenha;
  entradaMudancaNome: EntradaMudancaNome;
  entradaMudancaNomeVazio: EntradaMudancaNome;
  entradaMudancaNomeAbaixoDoMinimo: EntradaMudancaNome;
  entradaRecuperacaoSenha: EntradaRecuperacaoSenha;
  entradaRecuperacaoSenhaEmailInexistente: EntradaRecuperacaoSenha;
  respostaRecuperacaoSenha: SaidaRecuperacaoSenha;
  respostaRecuperacaoSenhaGenerica: SaidaRecuperacaoSenha;
  erros: ErrosConta;
};
