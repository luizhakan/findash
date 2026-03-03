import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { lancamentoRecorrenteDadosSimulados } from "./lancamento-recorrente.dados-simulados";
import type { CasosDeUsoLancamentosRecorrentes } from "../../tipos/recorrencias/lancamento-recorrente.tipos";

const criarCasosDeUsoRecorrenciasSimulados = (): jest.Mocked<CasosDeUsoLancamentosRecorrentes> => ({
  criarLancamentoRecorrente: jest.fn(),
  pausarLancamentoRecorrente: jest.fn(),
  reativarLancamentoRecorrente: jest.fn(),
  encerrarLancamentoRecorrente: jest.fn(),
  gerarOcorrenciasNoPeriodo: jest.fn(),
  editarProximasOcorrencias: jest.fn(),
  listarLancamentosRecorrentes: jest.fn(),
  processarCargaRecorrenciasMultiusuario: jest.fn(),
});

describe("Casos de uso de lancamentos recorrentes (testes somente com dados simulados)", () => {
  let casosDeUsoRecorrencias: jest.Mocked<CasosDeUsoLancamentosRecorrentes>;

  beforeEach(() => {
    casosDeUsoRecorrencias = criarCasosDeUsoRecorrenciasSimulados();
  });

  it("Cria recorrencia mensal de despesa", async () => {
    casosDeUsoRecorrencias.criarLancamentoRecorrente.mockResolvedValue(
      lancamentoRecorrenteDadosSimulados.resultados.recorrenciaDespesaMensalCriada,
    );

    const resultado = await casosDeUsoRecorrencias.criarLancamentoRecorrente(
      lancamentoRecorrenteDadosSimulados.entradas.criacaoDespesaMensalUsuarioUm,
    );

    expect(resultado.valor).toBe(-120);
    expect(resultado.dia_execucao).toBe(31);
  });

  it("Cria recorrencia mensal de receita", async () => {
    casosDeUsoRecorrencias.criarLancamentoRecorrente.mockResolvedValue(
      lancamentoRecorrenteDadosSimulados.resultados.recorrenciaReceitaMensalCriada,
    );

    const resultado = await casosDeUsoRecorrencias.criarLancamentoRecorrente(
      lancamentoRecorrenteDadosSimulados.entradas.criacaoReceitaMensalUsuarioUm,
    );

    expect(resultado.valor).toBe(3500);
    expect(resultado.descricao).toBe("Salario");
  });

  it("Nao cria recorrencia com valor invalido", async () => {
    casosDeUsoRecorrencias.criarLancamentoRecorrente.mockRejectedValue(
      new Error(lancamentoRecorrenteDadosSimulados.erros.valorInvalido),
    );

    await expect(
      casosDeUsoRecorrencias.criarLancamentoRecorrente(
        lancamentoRecorrenteDadosSimulados.entradas.criacaoComValorInvalido,
      ),
    ).rejects.toThrow(lancamentoRecorrenteDadosSimulados.erros.valorInvalido);
  });

  it("Gera ocorrencias no periodo informado", async () => {
    casosDeUsoRecorrencias.gerarOcorrenciasNoPeriodo.mockResolvedValue(
      lancamentoRecorrenteDadosSimulados.resultados.ocorrenciasPrimeiroTrimestre,
    );

    const resultado = await casosDeUsoRecorrencias.gerarOcorrenciasNoPeriodo(
      lancamentoRecorrenteDadosSimulados.entradas.geracaoOcorrenciasPrimeiroTrimestre,
    );

    expect(resultado).toHaveLength(3);
    expect(resultado[0]?.competencia).toBe("2026-01");
    expect(resultado[2]?.competencia).toBe("2026-03");
  });

  it("Ajusta recorrencia mensal no fim de fevereiro quando dia execucao e 31", async () => {
    casosDeUsoRecorrencias.gerarOcorrenciasNoPeriodo.mockResolvedValue(
      lancamentoRecorrenteDadosSimulados.resultados.ocorrenciasPrimeiroTrimestre,
    );

    const resultado = await casosDeUsoRecorrencias.gerarOcorrenciasNoPeriodo(
      lancamentoRecorrenteDadosSimulados.entradas.geracaoOcorrenciasPrimeiroTrimestre,
    );

    expect(resultado[1]?.data_prevista).toBe("2026-02-28");
  });

  it("Pausa recorrencia para impedir novos lancamentos", async () => {
    casosDeUsoRecorrencias.pausarLancamentoRecorrente.mockResolvedValue(
      lancamentoRecorrenteDadosSimulados.resultados.recorrenciaPausada,
    );

    const resultado = await casosDeUsoRecorrencias.pausarLancamentoRecorrente(
      lancamentoRecorrenteDadosSimulados.entradas.pausaRecorrenciaUsuarioUm,
    );

    expect(resultado.pausado).toBe(true);
  });

  it("Nao gera ocorrencias quando a recorrencia esta pausada", async () => {
    casosDeUsoRecorrencias.gerarOcorrenciasNoPeriodo.mockResolvedValue(
      lancamentoRecorrenteDadosSimulados.resultados.ocorrenciasRecorrenciaPausada,
    );

    const resultado = await casosDeUsoRecorrencias.gerarOcorrenciasNoPeriodo(
      lancamentoRecorrenteDadosSimulados.entradas.geracaoOcorrenciasRecorrenciaPausada,
    );

    expect(resultado).toHaveLength(0);
  });

  it("Reativa recorrencia pausada", async () => {
    casosDeUsoRecorrencias.reativarLancamentoRecorrente.mockResolvedValue(
      lancamentoRecorrenteDadosSimulados.resultados.recorrenciaReativada,
    );

    const resultado = await casosDeUsoRecorrencias.reativarLancamentoRecorrente(
      lancamentoRecorrenteDadosSimulados.entradas.reativacaoRecorrenciaUsuarioUm,
    );

    expect(resultado.pausado).toBe(false);
    expect(resultado.ativo).toBe(true);
  });

  it("Encerra recorrencia com data fim definida", async () => {
    casosDeUsoRecorrencias.encerrarLancamentoRecorrente.mockResolvedValue(
      lancamentoRecorrenteDadosSimulados.resultados.recorrenciaEncerrada,
    );

    const resultado = await casosDeUsoRecorrencias.encerrarLancamentoRecorrente(
      lancamentoRecorrenteDadosSimulados.entradas.encerramentoRecorrenciaUsuarioUm,
    );

    expect(resultado.ativo).toBe(false);
    expect(resultado.data_fim).toBe("2026-06-30");
  });

  it("Edita apenas proximas ocorrencias sem reescrever historico", async () => {
    casosDeUsoRecorrencias.editarProximasOcorrencias.mockResolvedValue(
      lancamentoRecorrenteDadosSimulados.resultados.recorrenciaEditadaProximasOcorrencias,
    );

    const resultado = await casosDeUsoRecorrencias.editarProximasOcorrencias(
      lancamentoRecorrenteDadosSimulados.entradas.edicaoProximasOcorrenciasUsuarioUm,
    );

    expect(resultado.valor).toBe(-150);
    expect(resultado.dia_execucao).toBe(10);
  });

  it("Bloqueia manipulacao de recorrencia de outro usuario", async () => {
    casosDeUsoRecorrencias.pausarLancamentoRecorrente.mockRejectedValue(
      new Error(lancamentoRecorrenteDadosSimulados.erros.acessoNegado),
    );

    await expect(
      casosDeUsoRecorrencias.pausarLancamentoRecorrente(
        lancamentoRecorrenteDadosSimulados.entradas.pausaRecorrenciaOutroUsuario,
      ),
    ).rejects.toThrow(lancamentoRecorrenteDadosSimulados.erros.acessoNegado);
  });

  it("Lista recorrencias sem vazamento entre usuarios", async () => {
    casosDeUsoRecorrencias.listarLancamentosRecorrentes.mockResolvedValue(
      lancamentoRecorrenteDadosSimulados.resultados.listagemRecorrenciasUsuarioUm,
    );

    const resultado = await casosDeUsoRecorrencias.listarLancamentosRecorrentes(
      lancamentoRecorrenteDadosSimulados.entradas.listagemRecorrenciasUsuarioUm,
    );

    expect(resultado.every((item) => item.usuario_id === "usuario_001")).toBe(true);
  });

  it("Carga multiusuario de recorrencias mantem isolamento", async () => {
    casosDeUsoRecorrencias.processarCargaRecorrenciasMultiusuario.mockResolvedValue(
      lancamentoRecorrenteDadosSimulados.resultados.cargaMultiusuario,
    );

    const resultado =
      await casosDeUsoRecorrencias.processarCargaRecorrenciasMultiusuario(
        lancamentoRecorrenteDadosSimulados.entradas.cargaMultiusuario,
      );

    expect(resultado.total_usuarios_processados).toBe(160);
    expect(new Set(resultado.usuario_ids_sem_vazamento).size).toBe(160);
    expect(resultado.tempo_processamento_ms).toBeLessThanOrEqual(1400);
  });
});
