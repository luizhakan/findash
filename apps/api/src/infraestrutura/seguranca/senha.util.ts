import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const TAMANHO_CHAVE = 64;

export const validarForcaSenha = (senha: string): boolean => {
  if (senha.length < 8) {
    return false;
  }

  const temMaiuscula = /[A-Z]/.test(senha);
  const temMinuscula = /[a-z]/.test(senha);
  const temNumero = /\d/.test(senha);

  return temMaiuscula && temMinuscula && temNumero;
};

export const gerarHashSenha = (senha: string): string => {
  const sal = randomBytes(16).toString("hex");
  const hash = scryptSync(senha, sal, TAMANHO_CHAVE).toString("hex");
  return `${sal}:${hash}`;
};

export const verificarSenha = (senha: string, hashPersistido: string): boolean => {
  const [sal, hashAntigo] = hashPersistido.split(":");
  if (!sal || !hashAntigo) {
    return false;
  }

  const hashAtual = scryptSync(senha, sal, TAMANHO_CHAVE);
  const hashBuffer = Buffer.from(hashAntigo, "hex");
  if (hashAtual.length !== hashBuffer.length) {
    return false;
  }

  return timingSafeEqual(hashAtual, hashBuffer);
};
