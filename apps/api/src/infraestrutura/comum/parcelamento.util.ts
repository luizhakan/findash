import {
  BadRequestException,
} from "@nestjs/common";
import { arredondarDuasCasas } from "./conversao.util";

export type ParcelaCalculada = {
  numero: number;
  valor: number;
  data_vencimento: Date;
  status: "ABERTA";
};

const adicionarMeses = (data: Date, quantidadeMeses: number): Date => {
  const base = new Date(data);
  const dia = base.getDate();
  base.setMonth(base.getMonth() + quantidadeMeses);

  // Ajusta para ultimo dia do mes quando o dia original nao existe no destino.
  if (base.getDate() < dia) {
    base.setDate(0);
  }

  return base;
};

export const calcularParcelas = (
  valorTotal: number,
  quantidadeParcelas: number,
  dataPrimeiroVencimento: Date,
  modo: "fixo" | "diluido",
  valorParcelaFixa?: number,
): ParcelaCalculada[] => {
  if (!Number.isFinite(valorTotal) || valorTotal === 0) {
    throw new BadRequestException("valor_total invalido para parcelamento.");
  }

  if (!Number.isInteger(quantidadeParcelas) || quantidadeParcelas < 2) {
    throw new BadRequestException("quantidade_parcelas invalida.");
  }

  if (modo === "fixo") {
    if (!valorParcelaFixa || valorParcelaFixa <= 0) {
      throw new BadRequestException("valor_parcela_fixa invalido.");
    }

    const totalCalculado = arredondarDuasCasas(valorParcelaFixa * quantidadeParcelas);
    if (arredondarDuasCasas(valorTotal) !== totalCalculado) {
      throw new BadRequestException(
        "valor_total deve ser igual a quantidade_parcelas * valor_parcela_fixa.",
      );
    }

    return Array.from({ length: quantidadeParcelas }, (_vazio, indice) => ({
      numero: indice + 1,
      valor: arredondarDuasCasas(valorParcelaFixa),
      data_vencimento: adicionarMeses(dataPrimeiroVencimento, indice),
      status: "ABERTA",
    }));
  }

  const base = Math.trunc((Math.abs(valorTotal) * 100) / quantidadeParcelas) / 100;
  const sinal = valorTotal < 0 ? -1 : 1;
  const parcelas = Array.from({ length: quantidadeParcelas }, (_vazio, indice) => ({
    numero: indice + 1,
    valor: arredondarDuasCasas(base * sinal),
    data_vencimento: adicionarMeses(dataPrimeiroVencimento, indice),
    status: "ABERTA" as const,
  }));

  const somaBase = arredondarDuasCasas(parcelas.reduce((ac, parcela) => ac + parcela.valor, 0));
  const diferenca = arredondarDuasCasas(valorTotal - somaBase);
  parcelas[parcelas.length - 1]!.valor = arredondarDuasCasas(
    parcelas[parcelas.length - 1]!.valor + diferenca,
  );

  return parcelas;
};

export const referenciaAnoMes = (data: Date): string => {
  const ano = data.getUTCFullYear();
  const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
  return `${ano}-${mes}`;
};
