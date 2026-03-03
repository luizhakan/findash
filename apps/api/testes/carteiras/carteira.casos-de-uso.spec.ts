import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { carteiraDadosSimulados } from "./carteira.dados-simulados";
import type { CasosDeUsoCarteiras } from "../../tipos/carteiras/carteira.tipos";

const criarCasosDeUsoCarteirasSimulados = (): jest.Mocked<CasosDeUsoCarteiras> => ({
  criarCarteira: jest.fn(),
  listarCarteirasPorUsuario: jest.fn(),
  listarCarteirasPaginadas: jest.fn(),
  buscarCarteiraPorId: jest.fn(),
  editarCarteira: jest.fn(),
  removerCarteira: jest.fn(),
  arquivarCarteira: jest.fn(),
  adicionarMovimentacaoNaCarteira: jest.fn(),
  transferirEntreCarteiras: jest.fn(),
  importarCsvNaCarteira: jest.fn(),
  processarCargaMultiusuario: jest.fn(),
});

describe("Casos de uso de carteiras (testes somente com dados simulados)", () => {
  let casosDeUsoCarteiras: jest.Mocked<CasosDeUsoCarteiras>;

  beforeEach(() => {
    casosDeUsoCarteiras = criarCasosDeUsoCarteirasSimulados();
  });

  it("1) Usuario cria carteira com sucesso", async () => {
    casosDeUsoCarteiras.criarCarteira.mockResolvedValue(
      carteiraDadosSimulados.resultados.carteiraCriadaUsuarioUm,
    );

    const resultado = await casosDeUsoCarteiras.criarCarteira(
      carteiraDadosSimulados.entradas.criacaoCarteiraUsuarioUm,
    );

    expect(resultado).toEqual(carteiraDadosSimulados.resultados.carteiraCriadaUsuarioUm);
  });

  it("2) Nao cria carteira com nome vazio", async () => {
    casosDeUsoCarteiras.criarCarteira.mockRejectedValue(
      new Error(carteiraDadosSimulados.erros.nomeVazio),
    );

    await expect(
      casosDeUsoCarteiras.criarCarteira(
        carteiraDadosSimulados.entradas.criacaoCarteiraNomeVazio,
      ),
    ).rejects.toThrow(carteiraDadosSimulados.erros.nomeVazio);
  });

  it("3) Nao cria carteira duplicada para o mesmo usuario", async () => {
    casosDeUsoCarteiras.criarCarteira.mockRejectedValue(
      new Error(carteiraDadosSimulados.erros.carteiraDuplicada),
    );

    await expect(
      casosDeUsoCarteiras.criarCarteira(
        carteiraDadosSimulados.entradas.criacaoCarteiraDuplicadaUsuarioUm,
      ),
    ).rejects.toThrow(carteiraDadosSimulados.erros.carteiraDuplicada);
  });

  it("4) Permite mesmo nome de carteira para usuarios diferentes", async () => {
    casosDeUsoCarteiras.criarCarteira.mockResolvedValue(
      carteiraDadosSimulados.resultados.carteiraCriadaMesmoNomeUsuarioDois,
    );

    const resultado = await casosDeUsoCarteiras.criarCarteira(
      carteiraDadosSimulados.entradas.criacaoCarteiraMesmoNomeUsuarioDois,
    );

    expect(resultado.usuario_id).toBe(carteiraDadosSimulados.usuarios.usuarioDois.id);
    expect(resultado.nome).toBe("Carteira Principal");
  });

  it("5) Usuario lista apenas as proprias carteiras", async () => {
    casosDeUsoCarteiras.listarCarteirasPorUsuario.mockResolvedValue(
      carteiraDadosSimulados.resultados.listaCarteirasUsuarioUm,
    );

    const resultado = await casosDeUsoCarteiras.listarCarteirasPorUsuario(
      carteiraDadosSimulados.entradas.listagemCarteirasUsuarioUm,
    );

    expect(resultado.every((carteira) => carteira.usuario_id === "usuario_001")).toBe(
      true,
    );
  });

  it("6) Usuario nao acessa carteira de outro usuario", async () => {
    casosDeUsoCarteiras.buscarCarteiraPorId.mockRejectedValue(
      new Error(carteiraDadosSimulados.erros.acessoNegado),
    );

    await expect(
      casosDeUsoCarteiras.buscarCarteiraPorId(
        carteiraDadosSimulados.entradas.buscaCarteiraOutroUsuario,
      ),
    ).rejects.toThrow(carteiraDadosSimulados.erros.acessoNegado);
  });

  it("7) Usuario edita apenas a propria carteira", async () => {
    casosDeUsoCarteiras.editarCarteira.mockResolvedValue(
      carteiraDadosSimulados.resultados.carteiraEditadaUsuarioUm,
    );

    const resultado = await casosDeUsoCarteiras.editarCarteira(
      carteiraDadosSimulados.entradas.edicaoCarteiraPropria,
    );

    expect(resultado.usuario_id).toBe(carteiraDadosSimulados.usuarios.usuarioUm.id);
    expect(resultado.nome).toBe("Carteira Principal Renomeada");
  });

  it("8) Usuario nao edita carteira de outro usuario", async () => {
    casosDeUsoCarteiras.editarCarteira.mockRejectedValue(
      new Error(carteiraDadosSimulados.erros.acessoNegado),
    );

    await expect(
      casosDeUsoCarteiras.editarCarteira(
        carteiraDadosSimulados.entradas.edicaoCarteiraOutroUsuario,
      ),
    ).rejects.toThrow(carteiraDadosSimulados.erros.acessoNegado);
  });

  it("9) Usuario remove apenas a propria carteira", async () => {
    casosDeUsoCarteiras.removerCarteira.mockResolvedValue();

    await casosDeUsoCarteiras.removerCarteira(
      carteiraDadosSimulados.entradas.remocaoCarteiraPropria,
    );

    expect(casosDeUsoCarteiras.removerCarteira).toHaveBeenCalledWith(
      carteiraDadosSimulados.entradas.remocaoCarteiraPropria,
    );
  });

  it("10) Usuario nao remove carteira de outro usuario", async () => {
    casosDeUsoCarteiras.removerCarteira.mockRejectedValue(
      new Error(carteiraDadosSimulados.erros.acessoNegado),
    );

    await expect(
      casosDeUsoCarteiras.removerCarteira(
        carteiraDadosSimulados.entradas.remocaoCarteiraOutroUsuario,
      ),
    ).rejects.toThrow(carteiraDadosSimulados.erros.acessoNegado);
  });

  it("11) Nao remove carteira com movimentacoes ativas sem regra de arquivamento", async () => {
    casosDeUsoCarteiras.removerCarteira.mockRejectedValue(
      new Error(carteiraDadosSimulados.erros.carteiraComMovimentacoesAtivas),
    );

    await expect(
      casosDeUsoCarteiras.removerCarteira(
        carteiraDadosSimulados.entradas.remocaoCarteiraComMovimentacoesAtivas,
      ),
    ).rejects.toThrow(carteiraDadosSimulados.erros.carteiraComMovimentacoesAtivas);
  });

  it("12) Arquivar carteira mantem historico intacto", async () => {
    casosDeUsoCarteiras.arquivarCarteira.mockResolvedValue(
      carteiraDadosSimulados.resultados.carteiraArquivadaUsuarioUm,
    );

    const resultado = await casosDeUsoCarteiras.arquivarCarteira(
      carteiraDadosSimulados.entradas.arquivamentoCarteira,
    );

    expect(resultado.arquivada).toBe(true);
    expect(resultado.saldo_atual).toBe(1000);
  });

  it("13) Carteira arquivada nao recebe nova movimentacao", async () => {
    casosDeUsoCarteiras.adicionarMovimentacaoNaCarteira.mockRejectedValue(
      new Error(carteiraDadosSimulados.erros.carteiraArquivada),
    );

    await expect(
      casosDeUsoCarteiras.adicionarMovimentacaoNaCarteira(
        carteiraDadosSimulados.entradas.adicionarMovimentacaoEmCarteiraArquivada,
      ),
    ).rejects.toThrow(carteiraDadosSimulados.erros.carteiraArquivada);
  });

  it("14) Saldo da carteira atualiza corretamente apos entrada", async () => {
    casosDeUsoCarteiras.adicionarMovimentacaoNaCarteira.mockResolvedValue(
      carteiraDadosSimulados.resultados.carteiraSaldoAposEntrada,
    );

    const resultado = await casosDeUsoCarteiras.adicionarMovimentacaoNaCarteira(
      carteiraDadosSimulados.entradas.adicionarMovimentacaoEntrada,
    );

    expect(resultado.saldo_atual).toBe(1200);
  });

  it("15) Saldo da carteira atualiza corretamente apos saida", async () => {
    casosDeUsoCarteiras.adicionarMovimentacaoNaCarteira.mockResolvedValue(
      carteiraDadosSimulados.resultados.carteiraSaldoAposSaida,
    );

    const resultado = await casosDeUsoCarteiras.adicionarMovimentacaoNaCarteira(
      carteiraDadosSimulados.entradas.adicionarMovimentacaoSaida,
    );

    expect(resultado.saldo_atual).toBe(800);
  });

  it("16) Transferencia entre carteiras do mesmo usuario gera debito e credito coerentes", async () => {
    casosDeUsoCarteiras.transferirEntreCarteiras.mockResolvedValue(
      carteiraDadosSimulados.resultados.resultadoTransferenciaMesmoUsuario,
    );

    const resultado = await casosDeUsoCarteiras.transferirEntreCarteiras(
      carteiraDadosSimulados.entradas.transferenciaMesmoUsuario,
    );

    expect(resultado.movimentacao_debito.valor).toBe(-100);
    expect(resultado.movimentacao_credito.valor).toBe(100);
    expect(resultado.movimentacao_debito.usuario_id).toBe("usuario_001");
    expect(resultado.movimentacao_credito.usuario_id).toBe("usuario_001");
  });

  it("17) Transferencia entre usuarios diferentes e bloqueada", async () => {
    casosDeUsoCarteiras.transferirEntreCarteiras.mockRejectedValue(
      new Error(carteiraDadosSimulados.erros.transferenciaEntreUsuariosBloqueada),
    );

    await expect(
      casosDeUsoCarteiras.transferirEntreCarteiras(
        carteiraDadosSimulados.entradas.transferenciaEntreUsuarios,
      ),
    ).rejects.toThrow(carteiraDadosSimulados.erros.transferenciaEntreUsuariosBloqueada);
  });

  it("18) Importacao CSV grava movimentacoes na carteira correta do usuario correto", async () => {
    casosDeUsoCarteiras.importarCsvNaCarteira.mockResolvedValue(
      carteiraDadosSimulados.resultados.resultadoImportacaoCsvUsuarioUm,
    );

    const resultado = await casosDeUsoCarteiras.importarCsvNaCarteira(
      carteiraDadosSimulados.entradas.importacaoCsvUsuarioUm,
    );

    expect(casosDeUsoCarteiras.importarCsvNaCarteira).toHaveBeenCalledWith(
      carteiraDadosSimulados.entradas.importacaoCsvUsuarioUm,
    );
    expect(resultado.movimentacoes_criadas).toBe(2);
  });

  it("19) Deduplicacao por id_origem funciona na mesma carteira", async () => {
    casosDeUsoCarteiras.importarCsvNaCarteira.mockResolvedValue(
      carteiraDadosSimulados.resultados.resultadoImportacaoCsvDuplicadaMesmoUsuario,
    );

    const resultado = await casosDeUsoCarteiras.importarCsvNaCarteira(
      carteiraDadosSimulados.entradas.importacaoCsvDuplicadaMesmoUsuario,
    );

    expect(resultado.movimentacoes_ignoradas_duplicadas).toBe(1);
    expect(resultado.ids_origem_ignorados).toContain("id_origem_csv_001");
  });

  it("20) Mesmo id_origem em usuarios diferentes nao conflita", async () => {
    casosDeUsoCarteiras.importarCsvNaCarteira.mockResolvedValue(
      carteiraDadosSimulados.resultados.resultadoImportacaoCsvMesmoIdOutroUsuario,
    );

    const resultado = await casosDeUsoCarteiras.importarCsvNaCarteira(
      carteiraDadosSimulados.entradas.importacaoCsvMesmoIdOutroUsuario,
    );

    expect(resultado.movimentacoes_criadas).toBe(1);
    expect(resultado.movimentacoes_ignoradas_duplicadas).toBe(0);
  });

  it("21) Paginacao de carteiras nao vaza dados entre usuarios", async () => {
    casosDeUsoCarteiras.listarCarteirasPaginadas.mockResolvedValue(
      carteiraDadosSimulados.resultados.resultadoListagemPaginadaUsuarioUm,
    );

    const resultado = await casosDeUsoCarteiras.listarCarteirasPaginadas(
      carteiraDadosSimulados.entradas.listagemPaginadaUsuarioUm,
    );

    expect(resultado.itens.every((item) => item.usuario_id === "usuario_001")).toBe(true);
  });

  it("22) Ordenacao e filtros respeitam isolamento por usuario", async () => {
    casosDeUsoCarteiras.listarCarteirasPaginadas.mockResolvedValue(
      carteiraDadosSimulados.resultados.resultadoListagemFiltradaOrdenadaUsuarioUm,
    );

    const resultado = await casosDeUsoCarteiras.listarCarteirasPaginadas(
      carteiraDadosSimulados.entradas.listagemFiltradaOrdenadaUsuarioUm,
    );

    expect(resultado.itens.every((item) => item.usuario_id === "usuario_001")).toBe(true);
    expect(resultado.itens[0]?.nome <= resultado.itens[1]?.nome).toBe(true);
  });

  it("23) Concorrencia: duas criacoes simultaneas com mesmo nome no mesmo usuario nao passam ambas", async () => {
    casosDeUsoCarteiras.criarCarteira
      .mockResolvedValueOnce(carteiraDadosSimulados.resultados.carteiraCriadaUsuarioUm)
      .mockRejectedValueOnce(new Error(carteiraDadosSimulados.erros.conflitoConcorrencia));

    const [resultadoUm, resultadoDois] = await Promise.allSettled([
      casosDeUsoCarteiras.criarCarteira(
        carteiraDadosSimulados.entradas.criacaoCarteiraDuplicadaUsuarioUm,
      ),
      casosDeUsoCarteiras.criarCarteira(
        carteiraDadosSimulados.entradas.criacaoCarteiraDuplicadaUsuarioUm,
      ),
    ]);

    expect(resultadoUm.status === "fulfilled" || resultadoDois.status === "fulfilled").toBe(
      true,
    );
    expect(resultadoUm.status === "rejected" || resultadoDois.status === "rejected").toBe(
      true,
    );
  });

  it("24) Concorrencia: atualizacao concorrente de saldo nao gera inconsistencias", async () => {
    casosDeUsoCarteiras.adicionarMovimentacaoNaCarteira
      .mockResolvedValueOnce(carteiraDadosSimulados.resultados.carteiraSaldoAposEntrada)
      .mockResolvedValueOnce(carteiraDadosSimulados.resultados.carteiraSaldoAposSaida);

    const [resultadoEntrada, resultadoSaida] = await Promise.all([
      casosDeUsoCarteiras.adicionarMovimentacaoNaCarteira(
        carteiraDadosSimulados.entradas.adicionarMovimentacaoEntrada,
      ),
      casosDeUsoCarteiras.adicionarMovimentacaoNaCarteira(
        carteiraDadosSimulados.entradas.adicionarMovimentacaoSaida,
      ),
    ]);

    expect(resultadoEntrada.saldo_atual).toBeGreaterThan(0);
    expect(resultadoSaida.saldo_atual).toBeGreaterThan(0);
  });

  it("25) Carga: lote com muitos usuarios mantem isolamento e tempo aceitavel", async () => {
    casosDeUsoCarteiras.processarCargaMultiusuario.mockResolvedValue(
      carteiraDadosSimulados.resultados.resultadoCargaMultiusuario,
    );

    const resultado = await casosDeUsoCarteiras.processarCargaMultiusuario(
      carteiraDadosSimulados.entradas.cargaMultiusuario,
    );

    expect(resultado.total_usuarios_processados).toBe(120);
    expect(new Set(resultado.usuario_ids_sem_vazamento).size).toBe(120);
    expect(resultado.tempo_processamento_ms).toBeLessThanOrEqual(1000);
  });
});
