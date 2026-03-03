import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";
import { cartaoDadosSimulados } from "./cartao.dados-simulados";
import type { CasosDeUsoCartoes } from "../../tipos/cartoes/cartao.tipos";

const criarCasosDeUsoCartoesSimulados = (): jest.Mocked<CasosDeUsoCartoes> => ({
  criarCartao: jest.fn(),
  editarCartao: jest.fn(),
  registrarCompraCartao: jest.fn(),
  editarCompraCartao: jest.fn(),
  adicionarJurosManualFatura: jest.fn(),
  editarJurosManualFatura: jest.fn(),
  removerJurosManualFatura: jest.fn(),
  listarCartoes: jest.fn(),
  listarFaturas: jest.fn(),
});

describe("Casos de uso de cartoes (testes somente com dados simulados)", () => {
  let casosDeUsoCartoes: jest.Mocked<CasosDeUsoCartoes>;

  beforeEach(() => {
    casosDeUsoCartoes = criarCasosDeUsoCartoesSimulados();
  });

  it("Cria cartao com fechamento e vencimento validos", async () => {
    casosDeUsoCartoes.criarCartao.mockResolvedValue(
      cartaoDadosSimulados.resultados.cartaoCriado,
    );

    const resultado = await casosDeUsoCartoes.criarCartao(
      cartaoDadosSimulados.entradas.criacaoCartaoValida,
    );

    expect(resultado.dia_fechamento).toBe(10);
    expect(resultado.dia_vencimento).toBe(17);
  });

  it("Falha ao criar cartao sem fechamento", async () => {
    casosDeUsoCartoes.criarCartao.mockRejectedValue(
      new Error(cartaoDadosSimulados.erros.diaFechamentoObrigatorio),
    );

    await expect(
      casosDeUsoCartoes.criarCartao(
        cartaoDadosSimulados.entradas.criacaoCartaoSemFechamento,
      ),
    ).rejects.toThrow(cartaoDadosSimulados.erros.diaFechamentoObrigatorio);
  });

  it("Falha ao criar cartao sem vencimento", async () => {
    casosDeUsoCartoes.criarCartao.mockRejectedValue(
      new Error(cartaoDadosSimulados.erros.diaVencimentoObrigatorio),
    );

    await expect(
      casosDeUsoCartoes.criarCartao(
        cartaoDadosSimulados.entradas.criacaoCartaoSemVencimento,
      ),
    ).rejects.toThrow(cartaoDadosSimulados.erros.diaVencimentoObrigatorio);
  });

  it("Registra compra e aloca automaticamente na fatura atual", async () => {
    casosDeUsoCartoes.registrarCompraCartao.mockResolvedValue(
      cartaoDadosSimulados.resultados.compraFaturaAtualPadrao,
    );

    const resultado = await casosDeUsoCartoes.registrarCompraCartao(
      cartaoDadosSimulados.entradas.registroCompraFaturaAtualPadrao,
    );

    expect(resultado.id_fatura_destino).toBe("fatura_2026_03_cartao_001");
  });

  it("Registra compra e sobrescreve para fatura futura", async () => {
    casosDeUsoCartoes.registrarCompraCartao.mockResolvedValue(
      cartaoDadosSimulados.resultados.compraFaturaFutura,
    );

    const resultado = await casosDeUsoCartoes.registrarCompraCartao(
      cartaoDadosSimulados.entradas.registroCompraFaturaFutura,
    );

    expect(resultado.id_fatura_destino).toBe("fatura_2026_05_cartao_001");
  });

  it("Edita compra e muda fatura de destino", async () => {
    casosDeUsoCartoes.editarCompraCartao.mockResolvedValue(
      cartaoDadosSimulados.resultados.compraEditadaComFaturaFutura,
    );

    const resultado = await casosDeUsoCartoes.editarCompraCartao(
      cartaoDadosSimulados.entradas.edicaoCompraMudandoFatura,
    );

    expect(resultado.id_fatura_destino).toBe("fatura_2026_05_cartao_001");
  });

  it("Mantem fatura atual quando nao ha sobrescrita na edicao", async () => {
    casosDeUsoCartoes.editarCompraCartao.mockResolvedValue(
      cartaoDadosSimulados.resultados.compraEditadaSemTrocaFatura,
    );

    const resultado = await casosDeUsoCartoes.editarCompraCartao(
      cartaoDadosSimulados.entradas.edicaoCompraSemTrocaFatura,
    );

    expect(resultado.id_fatura_destino).toBe("fatura_2026_03_cartao_001");
  });

  it("Permite fatura maior que limite do cartao", async () => {
    casosDeUsoCartoes.listarFaturas.mockResolvedValue([
      cartaoDadosSimulados.resultados.faturaAcimaDoLimitePermitida,
    ]);

    const faturas = await casosDeUsoCartoes.listarFaturas(
      cartaoDadosSimulados.entradas.listagemFaturasUsuarioUm,
    );

    expect(faturas[0]?.valor_total).toBeGreaterThan(5000);
  });

  it("Adiciona juros manualmente na fatura", async () => {
    casosDeUsoCartoes.adicionarJurosManualFatura.mockResolvedValue(
      cartaoDadosSimulados.resultados.faturaComJurosAdicionado,
    );

    const resultado = await casosDeUsoCartoes.adicionarJurosManualFatura(
      cartaoDadosSimulados.entradas.adicionarJurosManualFatura,
    );

    expect(resultado.valor_juros_manual).toBe(150);
    expect(resultado.valor_total).toBe(2150);
  });

  it("Edita juros manualmente na fatura", async () => {
    casosDeUsoCartoes.editarJurosManualFatura.mockResolvedValue(
      cartaoDadosSimulados.resultados.faturaComJurosEditado,
    );

    const resultado = await casosDeUsoCartoes.editarJurosManualFatura(
      cartaoDadosSimulados.entradas.editarJurosManualFatura,
    );

    expect(resultado.valor_juros_manual).toBe(200);
    expect(resultado.valor_total).toBe(2200);
  });

  it("Remove juros manualmente da fatura", async () => {
    casosDeUsoCartoes.removerJurosManualFatura.mockResolvedValue(
      cartaoDadosSimulados.resultados.faturaSemJuros,
    );

    const resultado = await casosDeUsoCartoes.removerJurosManualFatura(
      cartaoDadosSimulados.entradas.removerJurosManualFatura,
    );

    expect(resultado.valor_juros_manual).toBe(0);
    expect(resultado.valor_total).toBe(2000);
  });

  it("Total da fatura reflete juros manuais corretamente", async () => {
    casosDeUsoCartoes.editarJurosManualFatura.mockResolvedValue(
      cartaoDadosSimulados.resultados.faturaComJurosEditado,
    );

    const resultado = await casosDeUsoCartoes.editarJurosManualFatura(
      cartaoDadosSimulados.entradas.editarJurosManualFatura,
    );

    expect(resultado.valor_total).toBe(
      resultado.valor_compras + resultado.valor_juros_manual,
    );
  });

  it("Usuario nao registra compra em cartao de outro usuario", async () => {
    casosDeUsoCartoes.registrarCompraCartao.mockRejectedValue(
      new Error(cartaoDadosSimulados.erros.acessoNegado),
    );

    await expect(
      casosDeUsoCartoes.registrarCompraCartao(
        cartaoDadosSimulados.entradas.registroCompraCartaoOutroUsuario,
      ),
    ).rejects.toThrow(cartaoDadosSimulados.erros.acessoNegado);
  });

  it("Usuario nao altera fatura de outro usuario", async () => {
    casosDeUsoCartoes.editarJurosManualFatura.mockRejectedValue(
      new Error(cartaoDadosSimulados.erros.acessoNegado),
    );

    await expect(
      casosDeUsoCartoes.editarJurosManualFatura(
        cartaoDadosSimulados.entradas.editarJurosFaturaOutroUsuario,
      ),
    ).rejects.toThrow(cartaoDadosSimulados.erros.acessoNegado);
  });

  it("Listagem de cartoes e faturas nao vaza dados entre usuarios", async () => {
    casosDeUsoCartoes.listarCartoes.mockResolvedValue(
      cartaoDadosSimulados.resultados.listaCartoesUsuarioUm,
    );
    casosDeUsoCartoes.listarFaturas.mockResolvedValue(
      cartaoDadosSimulados.resultados.listaFaturasUsuarioUm,
    );

    const cartoes = await casosDeUsoCartoes.listarCartoes(
      cartaoDadosSimulados.entradas.listagemCartoesUsuarioUm,
    );
    const faturas = await casosDeUsoCartoes.listarFaturas(
      cartaoDadosSimulados.entradas.listagemFaturasUsuarioUm,
    );

    expect(cartoes.every((cartao) => cartao.usuario_id === "usuario_001")).toBe(true);
    expect(faturas.every((fatura) => fatura.usuario_id === "usuario_001")).toBe(true);
  });
});
