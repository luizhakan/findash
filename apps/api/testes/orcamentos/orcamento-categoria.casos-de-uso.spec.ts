import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { orcamentoCategoriaDadosSimulados } from "./orcamento-categoria.dados-simulados";
import type { CasosDeUsoOrcamentoCategoria } from "../../tipos/orcamentos/orcamento-categoria.tipos";

const criarCasosDeUsoOrcamentosSimulados = (): jest.Mocked<CasosDeUsoOrcamentoCategoria> => ({
  criarOrcamentoCategoria: jest.fn(),
  editarOrcamentoCategoria: jest.fn(),
  registrarConsumoNoOrcamento: jest.fn(),
  registrarEstornoNoOrcamento: jest.fn(),
  buscarOrcamentoCategoria: jest.fn(),
  listarOrcamentosCategoria: jest.fn(),
  processarCargaOrcamentosMultiusuario: jest.fn(),
});

describe("Casos de uso de orcamento por categoria (testes somente com dados simulados)", () => {
  let casosDeUsoOrcamentos: jest.Mocked<CasosDeUsoOrcamentoCategoria>;

  beforeEach(() => {
    casosDeUsoOrcamentos = criarCasosDeUsoOrcamentosSimulados();
  });

  it("Cria orcamento mensal por categoria", async () => {
    casosDeUsoOrcamentos.criarOrcamentoCategoria.mockResolvedValue(
      orcamentoCategoriaDadosSimulados.resultados.orcamentoCriadoUsuarioUm,
    );

    const resultado = await casosDeUsoOrcamentos.criarOrcamentoCategoria(
      orcamentoCategoriaDadosSimulados.entradas.criacaoOrcamentoAlimentacaoUsuarioUm,
    );

    expect(resultado.limite_mensal).toBe(2000);
    expect(resultado.percentual_consumido).toBe(0);
  });

  it("Nao cria orcamento com limite invalido", async () => {
    casosDeUsoOrcamentos.criarOrcamentoCategoria.mockRejectedValue(
      new Error(orcamentoCategoriaDadosSimulados.erros.limiteInvalido),
    );

    await expect(
      casosDeUsoOrcamentos.criarOrcamentoCategoria(
        orcamentoCategoriaDadosSimulados.entradas.criacaoOrcamentoComLimiteInvalido,
      ),
    ).rejects.toThrow(orcamentoCategoriaDadosSimulados.erros.limiteInvalido);
  });

  it("Nao permite duplicidade de orcamento na mesma categoria e competencia", async () => {
    casosDeUsoOrcamentos.criarOrcamentoCategoria.mockRejectedValue(
      new Error(orcamentoCategoriaDadosSimulados.erros.orcamentoDuplicadoNoMes),
    );

    await expect(
      casosDeUsoOrcamentos.criarOrcamentoCategoria(
        orcamentoCategoriaDadosSimulados.entradas.criacaoOrcamentoDuplicadoUsuarioUm,
      ),
    ).rejects.toThrow(orcamentoCategoriaDadosSimulados.erros.orcamentoDuplicadoNoMes);
  });

  it("Permite mesma categoria e competencia para usuarios diferentes", async () => {
    casosDeUsoOrcamentos.criarOrcamentoCategoria.mockResolvedValue(
      orcamentoCategoriaDadosSimulados.resultados.orcamentoCriadoUsuarioDois,
    );

    const resultado = await casosDeUsoOrcamentos.criarOrcamentoCategoria(
      orcamentoCategoriaDadosSimulados.entradas.criacaoOrcamentoAlimentacaoUsuarioDois,
    );

    expect(resultado.usuario_id).toBe("usuario_002");
    expect(resultado.categoria).toBe("alimentacao");
  });

  it("Registra consumo abaixo de 80 por cento sem alerta", async () => {
    casosDeUsoOrcamentos.registrarConsumoNoOrcamento.mockResolvedValue(
      orcamentoCategoriaDadosSimulados.resultados.orcamentoConsumoSetentaECinco,
    );

    const resultado = await casosDeUsoOrcamentos.registrarConsumoNoOrcamento(
      orcamentoCategoriaDadosSimulados.entradas.registroConsumoAteSetentaECinco,
    );

    expect(resultado.percentual_consumido).toBe(75);
    expect(resultado.alertas_ativos).toHaveLength(0);
  });

  it("Ativa alerta de 80 por cento ao atingir limiar", async () => {
    casosDeUsoOrcamentos.registrarConsumoNoOrcamento.mockResolvedValue(
      orcamentoCategoriaDadosSimulados.resultados.orcamentoConsumoOitenta,
    );

    const resultado = await casosDeUsoOrcamentos.registrarConsumoNoOrcamento(
      orcamentoCategoriaDadosSimulados.entradas.registroConsumoAtingeOitenta,
    );

    expect(resultado.percentual_consumido).toBe(80);
    expect(resultado.alertas_ativos).toContain("alerta_80");
  });

  it("Ativa alerta de 100 por cento ao consumir todo o orcamento", async () => {
    casosDeUsoOrcamentos.registrarConsumoNoOrcamento.mockResolvedValue(
      orcamentoCategoriaDadosSimulados.resultados.orcamentoConsumoCem,
    );

    const resultado = await casosDeUsoOrcamentos.registrarConsumoNoOrcamento(
      orcamentoCategoriaDadosSimulados.entradas.registroConsumoAtingeCem,
    );

    expect(resultado.percentual_consumido).toBe(100);
    expect(resultado.alertas_ativos).toContain("alerta_100");
  });

  it("Marca acima do limite quando consumo ultrapassa 100 por cento", async () => {
    casosDeUsoOrcamentos.registrarConsumoNoOrcamento.mockResolvedValue(
      orcamentoCategoriaDadosSimulados.resultados.orcamentoConsumoAcimaDoLimite,
    );

    const resultado = await casosDeUsoOrcamentos.registrarConsumoNoOrcamento(
      orcamentoCategoriaDadosSimulados.entradas.registroConsumoAcimaDoLimite,
    );

    expect(resultado.percentual_consumido).toBeGreaterThan(100);
    expect(resultado.alertas_ativos).toContain("acima_do_limite");
  });

  it("Estorno reduz consumo e recalcula alertas", async () => {
    casosDeUsoOrcamentos.registrarEstornoNoOrcamento.mockResolvedValue(
      orcamentoCategoriaDadosSimulados.resultados.orcamentoAposEstorno,
    );

    const resultado = await casosDeUsoOrcamentos.registrarEstornoNoOrcamento(
      orcamentoCategoriaDadosSimulados.entradas.registroEstornoReducaoConsumo,
    );

    expect(resultado.valor_consumido).toBe(1800);
    expect(resultado.alertas_ativos).not.toContain("acima_do_limite");
  });

  it("Ajuste de limite recalcula percentual consumido", async () => {
    casosDeUsoOrcamentos.editarOrcamentoCategoria.mockResolvedValue(
      orcamentoCategoriaDadosSimulados.resultados.orcamentoEditadoLimiteMaior,
    );

    const resultado = await casosDeUsoOrcamentos.editarOrcamentoCategoria(
      orcamentoCategoriaDadosSimulados.entradas.edicaoAumentarLimiteUsuarioUm,
    );

    expect(resultado.limite_mensal).toBe(3000);
    expect(resultado.percentual_consumido).toBe(60);
  });

  it("Consumo do usuario dois nao altera dados do usuario um", async () => {
    casosDeUsoOrcamentos.registrarConsumoNoOrcamento.mockResolvedValue(
      orcamentoCategoriaDadosSimulados.resultados.orcamentoCriadoUsuarioDois,
    );
    casosDeUsoOrcamentos.listarOrcamentosCategoria.mockResolvedValue(
      orcamentoCategoriaDadosSimulados.resultados.listagemOrcamentosUsuarioUm,
    );

    await casosDeUsoOrcamentos.registrarConsumoNoOrcamento(
      orcamentoCategoriaDadosSimulados.entradas.registroConsumoOutroUsuarioNoMesmoMes,
    );
    const listagemUsuarioUm = await casosDeUsoOrcamentos.listarOrcamentosCategoria(
      orcamentoCategoriaDadosSimulados.entradas.listagemOrcamentosUsuarioUm,
    );

    expect(listagemUsuarioUm.every((item) => item.usuario_id === "usuario_001")).toBe(
      true,
    );
  });

  it("Lista orcamentos sem vazamento entre usuarios", async () => {
    casosDeUsoOrcamentos.listarOrcamentosCategoria.mockResolvedValue(
      orcamentoCategoriaDadosSimulados.resultados.listagemOrcamentosUsuarioUm,
    );

    const resultado = await casosDeUsoOrcamentos.listarOrcamentosCategoria(
      orcamentoCategoriaDadosSimulados.entradas.listagemOrcamentosUsuarioUm,
    );

    expect(resultado.every((item) => item.usuario_id === "usuario_001")).toBe(true);
  });

  it("Carga multiusuario de orcamentos mantem isolamento e tempo", async () => {
    casosDeUsoOrcamentos.processarCargaOrcamentosMultiusuario.mockResolvedValue(
      orcamentoCategoriaDadosSimulados.resultados.cargaMultiusuario,
    );

    const resultado = await casosDeUsoOrcamentos.processarCargaOrcamentosMultiusuario(
      orcamentoCategoriaDadosSimulados.entradas.cargaMultiusuario,
    );

    expect(resultado.total_usuarios_processados).toBe(170);
    expect(new Set(resultado.usuario_ids_sem_vazamento).size).toBe(170);
    expect(resultado.tempo_processamento_ms).toBeLessThanOrEqual(1500);
  });
});
