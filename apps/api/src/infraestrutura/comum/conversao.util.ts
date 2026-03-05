import { BadRequestException } from "@nestjs/common";

export const garantirString = (
  valor: unknown,
  campo: string,
  obrigatorio = true,
): string | undefined => {
  if (valor === undefined || valor === null) {
    if (obrigatorio) {
      throw new BadRequestException(`${campo} e obrigatorio.`);
    }
    return undefined;
  }

  const normalizado = String(valor).trim();
  if (!normalizado && obrigatorio) {
    throw new BadRequestException(`${campo} e obrigatorio.`);
  }

  return normalizado || undefined;
};

export const garantirNumero = (
  valor: unknown,
  campo: string,
  obrigatorio = true,
): number | undefined => {
  if (valor === undefined || valor === null || valor === "") {
    if (obrigatorio) {
      throw new BadRequestException(`${campo} e obrigatorio.`);
    }
    return undefined;
  }

  const numero = Number(valor);
  if (!Number.isFinite(numero)) {
    throw new BadRequestException(`${campo} deve ser numerico.`);
  }

  return numero;
};

export const garantirBooleano = (
  valor: unknown,
  campo: string,
  obrigatorio = true,
): boolean | undefined => {
  if (valor === undefined || valor === null || valor === "") {
    if (obrigatorio) {
      throw new BadRequestException(`${campo} e obrigatorio.`);
    }
    return undefined;
  }

  if (typeof valor === "boolean") {
    return valor;
  }

  if (valor === "true") {
    return true;
  }

  if (valor === "false") {
    return false;
  }

  throw new BadRequestException(`${campo} deve ser booleano.`);
};

export const arredondarDuasCasas = (valor: number): number =>
  Math.round((valor + Number.EPSILON) * 100) / 100;

export const paraDataIso = (valor: string, campo: string): Date => {
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) {
    throw new BadRequestException(`${campo} invalido.`);
  }
  return data;
};
