import {
  contaDadosSimulados,
} from "./conta.dados-simulados";
import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import type {
  CasosDeUsoConta,
  CasosDeUsoContaFinanceira,
} from "../../tipos/contas/conta.tipos";

type CasosDeUsoContaComFinanceiro = CasosDeUsoConta & CasosDeUsoContaFinanceira;

const criarCasosDeUsoContaSimulados = (): jest.Mocked<CasosDeUsoContaComFinanceiro> => ({
  criarConta: jest.fn(),
  deletarConta: jest.fn(),
  editarSenha: jest.fn(),
  mudarNome: jest.fn(),
  solicitarRecuperacaoSenha: jest.fn(),
  adicionarLancamentoConta: jest.fn(),
  editarLancamentoConta: jest.fn(),
  parcelarLancamentoConta: jest.fn(),
});

describe("Casos de uso de conta (testes somente com dados simulados)", () => {
  let casosDeUsoConta: jest.Mocked<CasosDeUsoContaComFinanceiro>;

  beforeEach(() => {
    casosDeUsoConta = criarCasosDeUsoContaSimulados();
  });

  it("O usuario pode criar uma conta", async () => {
    casosDeUsoConta.criarConta.mockResolvedValue(
      contaDadosSimulados.contaExistente,
    );

    const resultado = await casosDeUsoConta.criarConta(
      contaDadosSimulados.entradaCriacao,
    );

    expect(casosDeUsoConta.criarConta).toHaveBeenCalledTimes(1);
    expect(casosDeUsoConta.criarConta).toHaveBeenCalledWith(
      contaDadosSimulados.entradaCriacao,
    );
    expect(resultado).toEqual(contaDadosSimulados.contaExistente);
  });

  it("O usuario nao pode criar conta com email ja existente", async () => {
    casosDeUsoConta.criarConta.mockRejectedValue(
      new Error(contaDadosSimulados.erros.emailJaEmUso),
    );

    await expect(
      casosDeUsoConta.criarConta(
        contaDadosSimulados.entradaCriacaoComEmailDuplicado,
      ),
    ).rejects.toThrow(contaDadosSimulados.erros.emailJaEmUso);

    expect(casosDeUsoConta.criarConta).toHaveBeenCalledTimes(1);
    expect(casosDeUsoConta.criarConta).toHaveBeenCalledWith(
      contaDadosSimulados.entradaCriacaoComEmailDuplicado,
    );
  });

  it("O usuario nao pode criar conta com usuario ja existente", async () => {
    casosDeUsoConta.criarConta.mockRejectedValue(
      new Error(contaDadosSimulados.erros.usuarioJaEmUso),
    );

    await expect(
      casosDeUsoConta.criarConta(
        contaDadosSimulados.entradaCriacaoComUsuarioDuplicado,
      ),
    ).rejects.toThrow(contaDadosSimulados.erros.usuarioJaEmUso);

    expect(casosDeUsoConta.criarConta).toHaveBeenCalledTimes(1);
    expect(casosDeUsoConta.criarConta).toHaveBeenCalledWith(
      contaDadosSimulados.entradaCriacaoComUsuarioDuplicado,
    );
  });

  it("O usuario pode deletar uma conta", async () => {
    casosDeUsoConta.deletarConta.mockResolvedValue();

    await casosDeUsoConta.deletarConta(contaDadosSimulados.contaExistente.id);

    expect(casosDeUsoConta.deletarConta).toHaveBeenCalledTimes(1);
    expect(casosDeUsoConta.deletarConta).toHaveBeenCalledWith(
      contaDadosSimulados.contaExistente.id,
    );
  });

  it("O usuario pode editar a senha", async () => {
    casosDeUsoConta.editarSenha.mockResolvedValue();

    await casosDeUsoConta.editarSenha(contaDadosSimulados.entradaEdicaoSenha);

    expect(casosDeUsoConta.editarSenha).toHaveBeenCalledTimes(1);
    expect(casosDeUsoConta.editarSenha).toHaveBeenCalledWith(
      contaDadosSimulados.entradaEdicaoSenha,
    );
  });

  it("O usuario nao pode editar a senha para uma senha fraca", async () => {
    casosDeUsoConta.editarSenha.mockRejectedValue(
      new Error(contaDadosSimulados.erros.senhaInvalida),
    );

    await expect(
      casosDeUsoConta.editarSenha(
        contaDadosSimulados.entradaEdicaoSenhaComSenhaFraca,
      ),
    ).rejects.toThrow(contaDadosSimulados.erros.senhaInvalida);

    expect(casosDeUsoConta.editarSenha).toHaveBeenCalledTimes(1);
    expect(casosDeUsoConta.editarSenha).toHaveBeenCalledWith(
      contaDadosSimulados.entradaEdicaoSenhaComSenhaFraca,
    );
  });

  it("O usuario pode mudar o nome", async () => {
    casosDeUsoConta.mudarNome.mockResolvedValue();

    await casosDeUsoConta.mudarNome(contaDadosSimulados.entradaMudancaNome);

    expect(casosDeUsoConta.mudarNome).toHaveBeenCalledTimes(1);
    expect(casosDeUsoConta.mudarNome).toHaveBeenCalledWith(
      contaDadosSimulados.entradaMudancaNome,
    );
  });

  it("O usuario nao pode mudar o nome para vazio", async () => {
    casosDeUsoConta.mudarNome.mockRejectedValue(
      new Error(contaDadosSimulados.erros.nomeInvalido),
    );

    await expect(
      casosDeUsoConta.mudarNome(contaDadosSimulados.entradaMudancaNomeVazio),
    ).rejects.toThrow(contaDadosSimulados.erros.nomeInvalido);

    expect(casosDeUsoConta.mudarNome).toHaveBeenCalledTimes(1);
    expect(casosDeUsoConta.mudarNome).toHaveBeenCalledWith(
      contaDadosSimulados.entradaMudancaNomeVazio,
    );
  });

  it("O usuario nao pode mudar o nome para abaixo do minimo", async () => {
    casosDeUsoConta.mudarNome.mockRejectedValue(
      new Error(contaDadosSimulados.erros.nomeInvalido),
    );

    await expect(
      casosDeUsoConta.mudarNome(
        contaDadosSimulados.entradaMudancaNomeAbaixoDoMinimo,
      ),
    ).rejects.toThrow(contaDadosSimulados.erros.nomeInvalido);

    expect(casosDeUsoConta.mudarNome).toHaveBeenCalledTimes(1);
    expect(casosDeUsoConta.mudarNome).toHaveBeenCalledWith(
      contaDadosSimulados.entradaMudancaNomeAbaixoDoMinimo,
    );
  });

  it("O usuario pode pedir para recuperar senha", async () => {
    casosDeUsoConta.solicitarRecuperacaoSenha.mockResolvedValue(
      contaDadosSimulados.respostaRecuperacaoSenha,
    );

    const resposta = await casosDeUsoConta.solicitarRecuperacaoSenha(
      contaDadosSimulados.entradaRecuperacaoSenha,
    );

    expect(casosDeUsoConta.solicitarRecuperacaoSenha).toHaveBeenCalledTimes(1);
    expect(casosDeUsoConta.solicitarRecuperacaoSenha).toHaveBeenCalledWith(
      contaDadosSimulados.entradaRecuperacaoSenha,
    );
    expect(resposta).toEqual(contaDadosSimulados.respostaRecuperacaoSenha);
  });

  it("Recuperacao para email inexistente retorna resposta generica", async () => {
    casosDeUsoConta.solicitarRecuperacaoSenha.mockResolvedValue(
      contaDadosSimulados.respostaRecuperacaoSenhaGenerica,
    );

    const resposta = await casosDeUsoConta.solicitarRecuperacaoSenha(
      contaDadosSimulados.entradaRecuperacaoSenhaEmailInexistente,
    );

    expect(casosDeUsoConta.solicitarRecuperacaoSenha).toHaveBeenCalledTimes(1);
    expect(casosDeUsoConta.solicitarRecuperacaoSenha).toHaveBeenCalledWith(
      contaDadosSimulados.entradaRecuperacaoSenhaEmailInexistente,
    );
    expect(resposta).toEqual(contaDadosSimulados.respostaRecuperacaoSenhaGenerica);
  });

  it("O usuario pode adicionar despesa parcelada em modo fixo", async () => {
    casosDeUsoConta.adicionarLancamentoConta.mockResolvedValue(
      contaDadosSimulados.saidaDespesaParceladaFixa,
    );

    const resposta = await casosDeUsoConta.adicionarLancamentoConta(
      contaDadosSimulados.entradaAdicionarDespesaParceladaFixa,
    );

    expect(casosDeUsoConta.adicionarLancamentoConta).toHaveBeenCalledTimes(1);
    expect(casosDeUsoConta.adicionarLancamentoConta).toHaveBeenCalledWith(
      contaDadosSimulados.entradaAdicionarDespesaParceladaFixa,
    );
    expect(resposta.parcelas).toHaveLength(3);
    expect(resposta.parcelas[0]?.valor).toBe(200);
  });

  it("O usuario pode adicionar receita parcelada em modo diluido", async () => {
    casosDeUsoConta.adicionarLancamentoConta.mockResolvedValue(
      contaDadosSimulados.saidaReceitaParceladaDiluida,
    );

    const resposta = await casosDeUsoConta.adicionarLancamentoConta(
      contaDadosSimulados.entradaAdicionarReceitaParceladaDiluida,
    );

    expect(resposta.parcelas).toHaveLength(3);
    expect(resposta.parcelas[0]?.valor).toBe(333.33);
    expect(resposta.parcelas[2]?.valor).toBe(333.34);
  });

  it("O usuario pode parcelar transferencia em modo fixo", async () => {
    casosDeUsoConta.parcelarLancamentoConta.mockResolvedValue(
      contaDadosSimulados.saidaTransferenciaParceladaFixa,
    );

    const resposta = await casosDeUsoConta.parcelarLancamentoConta(
      contaDadosSimulados.entradaParcelarTransferenciaFixa,
    );

    expect(casosDeUsoConta.parcelarLancamentoConta).toHaveBeenCalledTimes(1);
    expect(casosDeUsoConta.parcelarLancamentoConta).toHaveBeenCalledWith(
      contaDadosSimulados.entradaParcelarTransferenciaFixa,
    );
    expect(resposta.parcelas.map((parcela) => parcela.valor)).toEqual([300, 300, 300]);
  });

  it("O usuario pode parcelar transferencia em modo diluido", async () => {
    casosDeUsoConta.parcelarLancamentoConta.mockResolvedValue(
      contaDadosSimulados.saidaTransferenciaParceladaDiluida,
    );

    const resposta = await casosDeUsoConta.parcelarLancamentoConta(
      contaDadosSimulados.entradaParcelarTransferenciaDiluida,
    );

    expect(resposta.parcelas).toHaveLength(3);
    expect(resposta.parcelas[0]?.valor).toBe(333.33);
    expect(resposta.parcelas[2]?.valor).toBe(333.34);
  });

  it("O usuario nao pode parcelar com quantidade de parcelas invalida", async () => {
    casosDeUsoConta.parcelarLancamentoConta.mockRejectedValue(
      new Error(contaDadosSimulados.erros.quantidadeParcelasInvalida),
    );

    await expect(
      casosDeUsoConta.parcelarLancamentoConta(
        contaDadosSimulados.entradaParcelarComQuantidadeInvalida,
      ),
    ).rejects.toThrow(contaDadosSimulados.erros.quantidadeParcelasInvalida);
  });
});
