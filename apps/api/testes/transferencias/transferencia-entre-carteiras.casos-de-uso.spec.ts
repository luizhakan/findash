import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { transferenciaEntreCarteirasDadosSimulados } from "./transferencia-entre-carteiras.dados-simulados";
import type { CasosDeUsoTransferenciasEntreCarteiras } from "../../tipos/transferencias/transferencia-entre-carteiras.tipos";

const criarCasosDeUsoTransferenciasSimulados = (): jest.Mocked<CasosDeUsoTransferenciasEntreCarteiras> => ({
  transferirEntreCarteiras: jest.fn(),
  listarTransferenciasPorUsuario: jest.fn(),
  processarCargaTransferenciasMultiusuario: jest.fn(),
});

describe("Casos de uso de transferencias entre carteiras (testes somente com dados simulados)", () => {
  let casosDeUsoTransferencias: jest.Mocked<CasosDeUsoTransferenciasEntreCarteiras>;

  beforeEach(() => {
    casosDeUsoTransferencias = criarCasosDeUsoTransferenciasSimulados();
  });

  it("Transfere entre carteiras do mesmo usuario gerando debito e credito", async () => {
    casosDeUsoTransferencias.transferirEntreCarteiras.mockResolvedValue(
      transferenciaEntreCarteirasDadosSimulados.resultados.transferenciaValidaUsuarioUm,
    );

    const resultado = await casosDeUsoTransferencias.transferirEntreCarteiras(
      transferenciaEntreCarteirasDadosSimulados.entradas.transferenciaValidaUsuarioUm,
    );

    expect(resultado.movimentacao_debito.valor).toBe(-250);
    expect(resultado.movimentacao_credito.valor).toBe(250);
    expect(resultado.movimentacao_debito.usuario_id).toBe("usuario_001");
    expect(resultado.movimentacao_credito.usuario_id).toBe("usuario_001");
  });

  it("Transferencia interna nao altera saldo consolidado total do usuario", async () => {
    casosDeUsoTransferencias.transferirEntreCarteiras.mockResolvedValue(
      transferenciaEntreCarteirasDadosSimulados.resultados.transferenciaValidaUsuarioUm,
    );

    const resultado = await casosDeUsoTransferencias.transferirEntreCarteiras(
      transferenciaEntreCarteirasDadosSimulados.entradas.transferenciaValidaUsuarioUm,
    );

    expect(resultado.saldo_total_usuario_depois).toBe(
      resultado.saldo_total_usuario_antes,
    );
  });

  it("Bloqueia transferencia entre usuarios diferentes", async () => {
    casosDeUsoTransferencias.transferirEntreCarteiras.mockRejectedValue(
      new Error(transferenciaEntreCarteirasDadosSimulados.erros.acessoNegado),
    );

    await expect(
      casosDeUsoTransferencias.transferirEntreCarteiras(
        transferenciaEntreCarteirasDadosSimulados.entradas.transferenciaParaOutroUsuario,
      ),
    ).rejects.toThrow(transferenciaEntreCarteirasDadosSimulados.erros.acessoNegado);
  });

  it("Bloqueia transferencia com carteira de origem igual a destino", async () => {
    casosDeUsoTransferencias.transferirEntreCarteiras.mockRejectedValue(
      new Error(
        transferenciaEntreCarteirasDadosSimulados.erros.carteiraOrigemIgualDestino,
      ),
    );

    await expect(
      casosDeUsoTransferencias.transferirEntreCarteiras(
        transferenciaEntreCarteirasDadosSimulados.entradas.transferenciaParaMesmaCarteira,
      ),
    ).rejects.toThrow(
      transferenciaEntreCarteirasDadosSimulados.erros.carteiraOrigemIgualDestino,
    );
  });

  it("Bloqueia transferencia com valor zero ou negativo", async () => {
    casosDeUsoTransferencias.transferirEntreCarteiras.mockRejectedValue(
      new Error(transferenciaEntreCarteirasDadosSimulados.erros.valorInvalido),
    );

    await expect(
      casosDeUsoTransferencias.transferirEntreCarteiras(
        transferenciaEntreCarteirasDadosSimulados.entradas.transferenciaValorZero,
      ),
    ).rejects.toThrow(transferenciaEntreCarteirasDadosSimulados.erros.valorInvalido);
  });

  it("Bloqueia transferencia com carteira de origem arquivada", async () => {
    casosDeUsoTransferencias.transferirEntreCarteiras.mockRejectedValue(
      new Error(transferenciaEntreCarteirasDadosSimulados.erros.carteiraArquivada),
    );

    await expect(
      casosDeUsoTransferencias.transferirEntreCarteiras(
        transferenciaEntreCarteirasDadosSimulados.entradas.transferenciaComCarteiraOrigemArquivada,
      ),
    ).rejects.toThrow(transferenciaEntreCarteirasDadosSimulados.erros.carteiraArquivada);
  });

  it("Bloqueia transferencia com carteira de destino arquivada", async () => {
    casosDeUsoTransferencias.transferirEntreCarteiras.mockRejectedValue(
      new Error(transferenciaEntreCarteirasDadosSimulados.erros.carteiraArquivada),
    );

    await expect(
      casosDeUsoTransferencias.transferirEntreCarteiras(
        transferenciaEntreCarteirasDadosSimulados.entradas.transferenciaComCarteiraDestinoArquivada,
      ),
    ).rejects.toThrow(transferenciaEntreCarteirasDadosSimulados.erros.carteiraArquivada);
  });

  it("Lista transferencias apenas do usuario autenticado", async () => {
    casosDeUsoTransferencias.listarTransferenciasPorUsuario.mockResolvedValue(
      transferenciaEntreCarteirasDadosSimulados.resultados.listagemTransferenciasUsuarioUm,
    );

    const resultado = await casosDeUsoTransferencias.listarTransferenciasPorUsuario(
      transferenciaEntreCarteirasDadosSimulados.entradas.listagemTransferenciasUsuarioUm,
    );

    expect(resultado.every((item) => item.usuario_id === "usuario_001")).toBe(true);
  });

  it("Transferencias concorrentes mantem saldo consolidado estavel", async () => {
    casosDeUsoTransferencias.transferirEntreCarteiras
      .mockResolvedValueOnce(
        transferenciaEntreCarteirasDadosSimulados.resultados.transferenciaValidaUsuarioUm,
      )
      .mockResolvedValueOnce(
        transferenciaEntreCarteirasDadosSimulados.resultados.transferenciaValidaUsuarioUmDois,
      );

    const [primeira, segunda] = await Promise.all([
      casosDeUsoTransferencias.transferirEntreCarteiras(
        transferenciaEntreCarteirasDadosSimulados.entradas.transferenciaValidaUsuarioUm,
      ),
      casosDeUsoTransferencias.transferirEntreCarteiras({
        ...transferenciaEntreCarteirasDadosSimulados.entradas.transferenciaValidaUsuarioUm,
        valor: 100,
        data_movimentacao: "2026-03-04",
      }),
    ]);

    expect(primeira.saldo_total_usuario_antes).toBe(primeira.saldo_total_usuario_depois);
    expect(segunda.saldo_total_usuario_antes).toBe(segunda.saldo_total_usuario_depois);
  });

  it("Carga com muitos usuarios processa sem vazamento", async () => {
    casosDeUsoTransferencias.processarCargaTransferenciasMultiusuario.mockResolvedValue(
      transferenciaEntreCarteirasDadosSimulados.resultados.cargaMultiusuario,
    );

    const resultado =
      await casosDeUsoTransferencias.processarCargaTransferenciasMultiusuario(
        transferenciaEntreCarteirasDadosSimulados.entradas.cargaMultiusuario,
      );

    expect(resultado.total_usuarios_processados).toBe(180);
    expect(new Set(resultado.usuario_ids_sem_vazamento).size).toBe(180);
    expect(resultado.tempo_processamento_ms).toBeLessThanOrEqual(1200);
  });
});
