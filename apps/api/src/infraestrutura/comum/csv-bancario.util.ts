import { BadRequestException } from "@nestjs/common";

type FonteCsv = "nubank" | "inter" | "mercado_pago";

export type LinhaCanonicaCsv = {
  data_movimentacao: string;
  valor: number;
  id_origem?: string;
  descricao: string;
  saldo_pos_movimento_origem?: number;
};

const limparNumero = (valor: string): number => {
  const normalizado = valor.replace(/\./g, "").replace(",", ".").trim();
  const numero = Number(normalizado);
  if (!Number.isFinite(numero)) {
    throw new BadRequestException("Valor invalido no CSV.");
  }
  return numero;
};

const normalizarDataParaIso = (valor: string): string => {
  const limpo = valor.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(limpo)) {
    return limpo;
  }

  const barra = limpo.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (barra) {
    const [, dia, mes, ano] = barra;
    return `${ano}-${mes}-${dia}`;
  }

  const hifen = limpo.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (hifen) {
    const [, dia, mes, ano] = hifen;
    return `${ano}-${mes}-${dia}`;
  }

  throw new BadRequestException("Data invalida no CSV.");
};

const quebrarLinhas = (conteudoCsv: string): string[] =>
  conteudoCsv
    .split(/\r?\n/)
    .map((linha) => linha.trim())
    .filter(Boolean);

export const padronizarCsvBancario = (
  fonte: FonteCsv,
  conteudoCsv: string,
): LinhaCanonicaCsv[] => {
  const linhas = quebrarLinhas(conteudoCsv);
  if (!linhas.length) {
    throw new BadRequestException("CSV vazio.");
  }

  if (fonte === "nubank") {
    const cabecalho = linhas[0]!.split(",").map((c) => c.trim().toLowerCase());
    if (!cabecalho.includes("data") || !cabecalho.includes("valor")) {
      throw new BadRequestException("CSV Nubank sem colunas obrigatorias.");
    }

    return linhas.slice(1).map((linha) => {
      const partes = linha.split(",");
      const data = normalizarDataParaIso(partes[0] ?? "");
      const valor = limparNumero(partes[1] ?? "");
      const idOrigem = (partes[2] ?? "").trim() || undefined;
      const descricao = (partes[3] ?? "").trim() || "Movimentacao CSV";

      return {
        data_movimentacao: data,
        valor,
        id_origem: idOrigem,
        descricao,
      };
    });
  }

  if (fonte === "inter") {
    const linhaCabecalho = linhas.find((linha) =>
      linha.toLowerCase().includes("data lançamento") ||
      linha.toLowerCase().includes("data lancamento"),
    );
    if (!linhaCabecalho) {
      throw new BadRequestException("CSV Inter sem cabecalho de movimentacoes.");
    }

    const indiceCabecalho = linhas.indexOf(linhaCabecalho);
    const linhasDados = linhas.slice(indiceCabecalho + 1);

    return linhasDados.map((linha, indice) => {
      const partes = linha.split(";");
      const data = normalizarDataParaIso(partes[0] ?? "");
      const historico = (partes[1] ?? "").trim();
      const descricaoDetalhe = (partes[2] ?? "").trim();
      const valor = limparNumero(partes[3] ?? "");
      const saldo = limparNumero(partes[4] ?? "0");

      return {
        data_movimentacao: data,
        valor,
        id_origem: `inter_${data}_${indice + 1}`,
        descricao: `${historico} - ${descricaoDetalhe}`.trim(),
        saldo_pos_movimento_origem: saldo,
      };
    });
  }

  const linhaCabecalho = linhas.find((linha) =>
    linha.toUpperCase().includes("RELEASE_DATE;") ||
    linha.toUpperCase() === "RELEASE_DATE;TRANSACTION_TYPE;REFERENCE_ID;TRANSACTION_NET_AMOUNT;PARTIAL_BALANCE",
  );

  if (!linhaCabecalho) {
    throw new BadRequestException("CSV Mercado Pago sem cabecalho esperado.");
  }

  const indiceCabecalho = linhas.indexOf(linhaCabecalho);
  const linhasDados = linhas.slice(indiceCabecalho + 1);

  return linhasDados.map((linha) => {
    const partes = linha.split(";");
    const data = normalizarDataParaIso(partes[0] ?? "");
    const tipo = (partes[1] ?? "").trim();
    const referencia = (partes[2] ?? "").trim();
    const valor = limparNumero(partes[3] ?? "");
    const saldo = limparNumero(partes[4] ?? "0");

    return {
      data_movimentacao: data,
      valor,
      id_origem: referencia || undefined,
      descricao: tipo || "Movimentacao Mercado Pago",
      saldo_pos_movimento_origem: saldo,
    };
  });
};
