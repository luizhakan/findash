import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface TransacaoParseada {
  data: Date;
  descricao: string;
  valor: number;
  hash: string;
}

@Injectable()
export class ParserService {
  parseNubank(linhas: string[]): TransacaoParseada[] {
    // Formato esperado do Nubank (simplificado):
    // Data,Descrição,Valor
    // 2026-02-20,Compra no débito,150.00
    // 2026-02-21,Transferência,500.00

    return linhas
      .slice(1) // Pula header
      .filter((linha) => linha.trim().length > 0)
      .map((linha) => {
        const [dataStr, descricao, valorStr] = linha.split(',');
        const data = new Date(dataStr.trim());
        const valor = Math.abs(parseFloat(valorStr.trim()));
        const hash = this.gerarHash(`${dataStr.trim()}_${descricao}_${valor}`);

        return {
          data,
          descricao: descricao.trim(),
          valor,
          hash,
        };
      });
  }

  parseInter(linhas: string[]): TransacaoParseada[] {
    // Formato esperado do Banco Inter (simplificado):
    // Data,Descrição,Débito,Crédito
    // 2026-02-20,Compra débito,150.00,
    // 2026-02-21,Transferência recebida,,500.00

    return linhas
      .slice(1)
      .filter((linha) => linha.trim().length > 0)
      .map((linha) => {
        const [dataStr, descricao, debito, credito] = linha.split(',');
        const data = new Date(dataStr.trim());
        const valor = parseFloat(debito || '0') + parseFloat(credito || '0');
        const hash = this.gerarHash(`${dataStr.trim()}_${descricao}_${valor}`);

        return {
          data,
          descricao: descricao.trim(),
          valor,
          hash,
        };
      });
  }

  parseMercadoPago(linhas: string[]): TransacaoParseada[] {
    // Formato esperado do Mercado Pago (simplificado):
    // Data,Descrição,Valor
    // 2026-02-20,Pagamento,100.00
    // 2026-02-21,Reembolso,50.00

    return linhas
      .slice(1)
      .filter((linha) => linha.trim().length > 0)
      .map((linha) => {
        const [dataStr, descricao, valorStr] = linha.split(',');
        const data = new Date(dataStr.trim());
        const valor = Math.abs(parseFloat(valorStr.trim()));
        const hash = this.gerarHash(`${dataStr.trim()}_${descricao}_${valor}`);

        return {
          data,
          descricao: descricao.trim(),
          valor,
          hash,
        };
      });
  }

  private gerarHash(texto: string): string {
    return crypto.createHash('sha256').update(texto).digest('hex');
  }
}
