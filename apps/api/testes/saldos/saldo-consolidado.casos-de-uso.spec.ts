import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { saldoConsolidadoDadosSimulados } from "./saldo-consolidado.dados-simulados";
import type { CasosDeUsoSaldoConsolidado } from "../../tipos/saldos/saldo-consolidado.tipos";

const criarCasosDeUsoSaldoConsolidadoSimulados = (): jest.Mocked<CasosDeUsoSaldoConsolidado> => ({
  calcularSaldoConsolidado: jest.fn(),
  alterarVisibilidadeCarteira: jest.fn(),
  registrarCarteiraNoConsolidado: jest.fn(),
  removerCarteiraDoConsolidado: jest.fn(),
  recalcularAposMovimentacao: jest.fn(),
  processarCargaSaldoMultiusuario: jest.fn(),
});

describe("Casos de uso de saldo consolidado (testes somente com dados simulados)", () => {
  let casosDeUsoSaldoConsolidado: jest.Mocked<CasosDeUsoSaldoConsolidado>;

  beforeEach(() => {
    casosDeUsoSaldoConsolidado = criarCasosDeUsoSaldoConsolidadoSimulados();
  });

  it("1) Calcula saldo total somando todas as carteiras visiveis por padrao", async () => {
    casosDeUsoSaldoConsolidado.calcularSaldoConsolidado.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.saldoPadraoUsuarioUm,
    );

    const resultado = await casosDeUsoSaldoConsolidado.calcularSaldoConsolidado(
      saldoConsolidadoDadosSimulados.entradas.calculoPadraoUsuarioUm,
    );

    expect(resultado.saldo_total).toBe(1320);
    expect(resultado.carteiras_excluidas).toHaveLength(0);
  });

  it("2) Permite ocultar uma carteira e recalcula o total sem ela", async () => {
    casosDeUsoSaldoConsolidado.alterarVisibilidadeCarteira.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.saldoAposOcultarReservaUsuarioUm,
    );

    const resultado = await casosDeUsoSaldoConsolidado.alterarVisibilidadeCarteira(
      saldoConsolidadoDadosSimulados.entradas.ocultarCarteiraReservaUsuarioUm,
    );

    expect(resultado.saldo_total).toBe(1120);
    expect(resultado.carteiras_excluidas).toContain("carteira_usuario_001_reserva");
  });

  it("3) Permite reexibir carteira ocultada e retorna ao total anterior", async () => {
    casosDeUsoSaldoConsolidado.alterarVisibilidadeCarteira.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.saldoAposReexibirReservaUsuarioUm,
    );

    const resultado = await casosDeUsoSaldoConsolidado.alterarVisibilidadeCarteira(
      saldoConsolidadoDadosSimulados.entradas.reexibirCarteiraReservaUsuarioUm,
    );

    expect(resultado.saldo_total).toBe(1320);
    expect(resultado.carteiras_excluidas).toHaveLength(0);
  });

  it("4) Com todas ocultas, saldo consolidado fica zero", async () => {
    casosDeUsoSaldoConsolidado.calcularSaldoConsolidado.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.saldoComTodasOcultasUsuarioUm,
    );

    const resultado = await casosDeUsoSaldoConsolidado.calcularSaldoConsolidado(
      saldoConsolidadoDadosSimulados.entradas.ocultarTodasCarteirasUsuarioUm,
    );

    expect(resultado.saldo_total).toBe(0);
    expect(resultado.carteiras_incluidas).toHaveLength(0);
  });

  it("5) Carteira arquivada nao entra quando configurado para excluir arquivadas", async () => {
    casosDeUsoSaldoConsolidado.calcularSaldoConsolidado.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.saldoSemArquivadasUsuarioUm,
    );

    const resultado = await casosDeUsoSaldoConsolidado.calcularSaldoConsolidado(
      saldoConsolidadoDadosSimulados.entradas.calculoSemArquivadasUsuarioUm,
    );

    expect(resultado.carteiras_excluidas).toContain("carteira_usuario_001_arquivada");
  });

  it("6) Carteira inativa nao entra quando configurado para considerar somente ativas", async () => {
    casosDeUsoSaldoConsolidado.calcularSaldoConsolidado.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.saldoSomenteAtivasUsuarioUm,
    );

    const resultado = await casosDeUsoSaldoConsolidado.calcularSaldoConsolidado(
      saldoConsolidadoDadosSimulados.entradas.calculoSomenteAtivasUsuarioUm,
    );

    expect(resultado.carteiras_excluidas).toContain("carteira_usuario_001_inativa");
  });

  it("7) Usuario A nao consegue alterar visibilidade de carteira do usuario B", async () => {
    casosDeUsoSaldoConsolidado.alterarVisibilidadeCarteira.mockRejectedValue(
      new Error(saldoConsolidadoDadosSimulados.erros.carteiraNaoPertenceAoUsuario),
    );

    await expect(
      casosDeUsoSaldoConsolidado.alterarVisibilidadeCarteira(
        saldoConsolidadoDadosSimulados.entradas.ocultarCarteiraOutroUsuario,
      ),
    ).rejects.toThrow(saldoConsolidadoDadosSimulados.erros.carteiraNaoPertenceAoUsuario);
  });

  it("8) Preferencia de visibilidade e persistida por usuario", async () => {
    casosDeUsoSaldoConsolidado.alterarVisibilidadeCarteira.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.saldoAposOcultarReservaUsuarioUm,
    );
    casosDeUsoSaldoConsolidado.calcularSaldoConsolidado.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.saldoAposOcultarReservaUsuarioUm,
    );

    await casosDeUsoSaldoConsolidado.alterarVisibilidadeCarteira(
      saldoConsolidadoDadosSimulados.entradas.ocultarCarteiraReservaUsuarioUm,
    );
    const resultado = await casosDeUsoSaldoConsolidado.calcularSaldoConsolidado(
      saldoConsolidadoDadosSimulados.entradas.calculoPadraoUsuarioUm,
    );

    expect(resultado.carteiras_excluidas).toContain("carteira_usuario_001_reserva");
  });

  it("9) Nova carteira criada entra selecionada por padrao", async () => {
    casosDeUsoSaldoConsolidado.registrarCarteiraNoConsolidado.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.saldoAposRegistrarNovaCarteiraVisivel,
    );

    const resultado = await casosDeUsoSaldoConsolidado.registrarCarteiraNoConsolidado(
      saldoConsolidadoDadosSimulados.entradas.registrarNovaCarteiraPadraoVisivelUsuarioUm,
    );

    expect(resultado.carteiras_incluidas).toContain("carteira_usuario_001_nova");
  });

  it("10) Exclusao de carteira remove da composicao do saldo sem erro", async () => {
    casosDeUsoSaldoConsolidado.removerCarteiraDoConsolidado.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.saldoAposRemoverCarteiraDoConsolidado,
    );

    const resultado = await casosDeUsoSaldoConsolidado.removerCarteiraDoConsolidado(
      saldoConsolidadoDadosSimulados.entradas.removerCarteiraDoConsolidadoUsuarioUm,
    );

    expect(resultado.carteiras_excluidas).toContain("carteira_usuario_001_reserva");
  });

  it("11) Mudanca de saldo de carteira atualiza consolidado corretamente", async () => {
    casosDeUsoSaldoConsolidado.recalcularAposMovimentacao.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.saldoAposMovimentacaoEntrada,
    );

    const resultado = await casosDeUsoSaldoConsolidado.recalcularAposMovimentacao(
      saldoConsolidadoDadosSimulados.entradas.recalculoAposMovimentacaoEntrada,
    );

    expect(resultado.saldo_total).toBe(1620);
  });

  it("12) Movimentacao concorrente em multiplas carteiras mantem total consistente", async () => {
    casosDeUsoSaldoConsolidado.recalcularAposMovimentacao
      .mockResolvedValueOnce(saldoConsolidadoDadosSimulados.resultados.saldoAposMovimentacaoEntrada)
      .mockResolvedValueOnce(saldoConsolidadoDadosSimulados.resultados.saldoAposMovimentacaoSaida);

    const [resultadoEntrada, resultadoSaida] = await Promise.all([
      casosDeUsoSaldoConsolidado.recalcularAposMovimentacao(
        saldoConsolidadoDadosSimulados.entradas.recalculoAposMovimentacaoEntrada,
      ),
      casosDeUsoSaldoConsolidado.recalcularAposMovimentacao(
        saldoConsolidadoDadosSimulados.entradas.recalculoAposMovimentacaoSaida,
      ),
    ]);

    expect(resultadoEntrada.saldo_total).toBeGreaterThan(0);
    expect(resultadoSaida.saldo_total).toBeGreaterThan(0);
  });

  it("13) Paginacao ou listagem parcial nao altera o calculo total do usuario", async () => {
    casosDeUsoSaldoConsolidado.calcularSaldoConsolidado.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.saldoPaginadoNaoAfetaTotalUsuarioUm,
    );

    const resultado = await casosDeUsoSaldoConsolidado.calcularSaldoConsolidado(
      saldoConsolidadoDadosSimulados.entradas.calculoPaginadoNaoAfetaTotalUsuarioUm,
    );

    expect(resultado.saldo_total).toBe(1320);
  });

  it("14) Saldo consolidado considera mistura de positivos e negativos", async () => {
    casosDeUsoSaldoConsolidado.calcularSaldoConsolidado.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.saldoMisturaPositivoNegativoUsuarioUm,
    );

    const resultado = await casosDeUsoSaldoConsolidado.calcularSaldoConsolidado(
      saldoConsolidadoDadosSimulados.entradas.calculoMisturaPositivoNegativoUsuarioUm,
    );

    expect(resultado.saldo_total).toBe(1200);
  });

  it("15) Lote com muitos usuarios mantem isolamento e tempo aceitavel", async () => {
    casosDeUsoSaldoConsolidado.processarCargaSaldoMultiusuario.mockResolvedValue(
      saldoConsolidadoDadosSimulados.resultados.cargaMultiusuario,
    );

    const resultado = await casosDeUsoSaldoConsolidado.processarCargaSaldoMultiusuario(
      saldoConsolidadoDadosSimulados.entradas.cargaMultiusuario,
    );

    expect(resultado.total_usuarios_processados).toBe(150);
    expect(new Set(resultado.usuario_ids_sem_vazamento).size).toBe(150);
    expect(resultado.tempo_processamento_ms).toBeLessThanOrEqual(1200);
  });
});
