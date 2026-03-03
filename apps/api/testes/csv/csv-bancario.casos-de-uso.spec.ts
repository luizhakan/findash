import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { csvBancarioDadosSimulados } from "./csv-bancario.dados-simulados";
import type { CasosDeUsoDadosCsv } from "../../tipos/csv/csv-bancario.tipos";

const criarCasosDeUsoDadosCsvSimulados = (): jest.Mocked<CasosDeUsoDadosCsv> => ({
  adicionarDadosPorCsv: jest.fn(),
});

describe("Casos de uso de dados por CSV bancario (testes somente com dados simulados)", () => {
  let casosDeUsoDadosCsv: jest.Mocked<CasosDeUsoDadosCsv>;

  beforeEach(() => {
    casosDeUsoDadosCsv = criarCasosDeUsoDadosCsvSimulados();
  });

  it("Nubank: importa CSV valido", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockResolvedValue(
      csvBancarioDadosSimulados.resultadoNubankCanonico,
    );

    const resultado = await casosDeUsoDadosCsv.adicionarDadosPorCsv(
      csvBancarioDadosSimulados.entradaNubankValida,
    );

    expect(casosDeUsoDadosCsv.adicionarDadosPorCsv).toHaveBeenCalledTimes(1);
    expect(casosDeUsoDadosCsv.adicionarDadosPorCsv).toHaveBeenCalledWith(
      csvBancarioDadosSimulados.entradaNubankValida,
    );
    expect(resultado).toEqual(csvBancarioDadosSimulados.resultadoNubankCanonico);
  });

  it("Nubank: falha quando falta coluna obrigatoria", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockRejectedValue(
      new Error(csvBancarioDadosSimulados.erros.colunasObrigatoriasAusentes),
    );

    await expect(
      casosDeUsoDadosCsv.adicionarDadosPorCsv(
        csvBancarioDadosSimulados.entradaNubankSemColunaObrigatoria,
      ),
    ).rejects.toThrow(csvBancarioDadosSimulados.erros.colunasObrigatoriasAusentes);
  });

  it("Nubank: falha com data invalida", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockRejectedValue(
      new Error(csvBancarioDadosSimulados.erros.dataInvalida),
    );

    await expect(
      casosDeUsoDadosCsv.adicionarDadosPorCsv(
        csvBancarioDadosSimulados.entradaNubankDataInvalida,
      ),
    ).rejects.toThrow(csvBancarioDadosSimulados.erros.dataInvalida);
  });

  it("Nubank: falha com valor invalido", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockRejectedValue(
      new Error(csvBancarioDadosSimulados.erros.valorInvalido),
    );

    await expect(
      casosDeUsoDadosCsv.adicionarDadosPorCsv(
        csvBancarioDadosSimulados.entradaNubankValorInvalido,
      ),
    ).rejects.toThrow(csvBancarioDadosSimulados.erros.valorInvalido);
  });

  it("Inter: ignora cabecalho extra e importa dados", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockResolvedValue(
      csvBancarioDadosSimulados.resultadoInterCanonico,
    );

    const resultado = await casosDeUsoDadosCsv.adicionarDadosPorCsv(
      csvBancarioDadosSimulados.entradaInterValidaComCabecalhoExtra,
    );

    expect(casosDeUsoDadosCsv.adicionarDadosPorCsv).toHaveBeenCalledWith(
      csvBancarioDadosSimulados.entradaInterValidaComCabecalhoExtra,
    );
    expect(resultado).toEqual(csvBancarioDadosSimulados.resultadoInterCanonico);
  });

  it("Inter: importa CSV valido com saldo por linha", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockResolvedValue(
      csvBancarioDadosSimulados.resultadoInterCanonico,
    );

    const resultado = await casosDeUsoDadosCsv.adicionarDadosPorCsv(
      csvBancarioDadosSimulados.entradaInterValidaComCabecalhoExtra,
    );

    expect(resultado.linhas[0]?.saldo_pos_movimento).toBeDefined();
    expect(resultado.linhas[1]?.saldo_pos_movimento).toBeDefined();
  });

  it("Inter: falha quando falta coluna obrigatoria", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockRejectedValue(
      new Error(csvBancarioDadosSimulados.erros.colunasObrigatoriasAusentes),
    );

    await expect(
      casosDeUsoDadosCsv.adicionarDadosPorCsv(
        csvBancarioDadosSimulados.entradaInterSemColunaObrigatoria,
      ),
    ).rejects.toThrow(csvBancarioDadosSimulados.erros.colunasObrigatoriasAusentes);
  });

  it("Inter: falha com data invalida", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockRejectedValue(
      new Error(csvBancarioDadosSimulados.erros.dataInvalida),
    );

    await expect(
      casosDeUsoDadosCsv.adicionarDadosPorCsv(
        csvBancarioDadosSimulados.entradaInterDataInvalida,
      ),
    ).rejects.toThrow(csvBancarioDadosSimulados.erros.dataInvalida);
  });

  it("Mercado Pago: ignora resumo inicial e importa dados", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockResolvedValue(
      csvBancarioDadosSimulados.resultadoMercadoPagoCanonico,
    );

    const resultado = await casosDeUsoDadosCsv.adicionarDadosPorCsv(
      csvBancarioDadosSimulados.entradaMercadoPagoValidaComResumoInicial,
    );

    expect(casosDeUsoDadosCsv.adicionarDadosPorCsv).toHaveBeenCalledWith(
      csvBancarioDadosSimulados.entradaMercadoPagoValidaComResumoInicial,
    );
    expect(resultado).toEqual(csvBancarioDadosSimulados.resultadoMercadoPagoCanonico);
  });

  it("Mercado Pago: importa CSV valido com REFERENCE_ID numerico", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockResolvedValue(
      csvBancarioDadosSimulados.resultadoMercadoPagoCanonico,
    );

    const resultado = await casosDeUsoDadosCsv.adicionarDadosPorCsv(
      csvBancarioDadosSimulados.entradaMercadoPagoValidaComResumoInicial,
    );

    expect(resultado.linhas[0]?.id_referencia_origem).toBe("900001");
    expect(resultado.linhas[1]?.id_referencia_origem).toBe("900002");
  });

  it("Mercado Pago: falha quando falta coluna obrigatoria", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockRejectedValue(
      new Error(csvBancarioDadosSimulados.erros.colunasObrigatoriasAusentes),
    );

    await expect(
      casosDeUsoDadosCsv.adicionarDadosPorCsv(
        csvBancarioDadosSimulados.entradaMercadoPagoSemColunaObrigatoria,
      ),
    ).rejects.toThrow(csvBancarioDadosSimulados.erros.colunasObrigatoriasAusentes);
  });

  it("Mercado Pago: falha com data invalida", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockRejectedValue(
      new Error(csvBancarioDadosSimulados.erros.dataInvalida),
    );

    await expect(
      casosDeUsoDadosCsv.adicionarDadosPorCsv(
        csvBancarioDadosSimulados.entradaMercadoPagoDataInvalida,
      ),
    ).rejects.toThrow(csvBancarioDadosSimulados.erros.dataInvalida);
  });

  it("Padronizacao: mapeia para campos canonicos", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockResolvedValue(
      csvBancarioDadosSimulados.resultadoInterCanonico,
    );

    const resultado = await casosDeUsoDadosCsv.adicionarDadosPorCsv(
      csvBancarioDadosSimulados.entradaInterValidaComCabecalhoExtra,
    );

    expect(resultado.linhas[0]).toMatchObject({
      data_movimentacao: "2026-02-01",
      descricao: "Padaria Bom Dia",
      tipo_movimentacao: "Pix enviado",
      valor: -25.9,
      saldo_pos_movimento: 974.1,
    });
  });

  it("Robustez: rejeita linha com valor nao numerico", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockRejectedValue(
      new Error(csvBancarioDadosSimulados.erros.valorInvalido),
    );

    await expect(
      casosDeUsoDadosCsv.adicionarDadosPorCsv(
        csvBancarioDadosSimulados.entradaValorNaoNumerico,
      ),
    ).rejects.toThrow(csvBancarioDadosSimulados.erros.valorInvalido);
  });

  it("Robustez: rejeita delimitador invalido", async () => {
    casosDeUsoDadosCsv.adicionarDadosPorCsv.mockRejectedValue(
      new Error(csvBancarioDadosSimulados.erros.delimitadorInvalido),
    );

    await expect(
      casosDeUsoDadosCsv.adicionarDadosPorCsv(
        csvBancarioDadosSimulados.entradaDelimitadorInvalido,
      ),
    ).rejects.toThrow(csvBancarioDadosSimulados.erros.delimitadorInvalido);
  });
});
