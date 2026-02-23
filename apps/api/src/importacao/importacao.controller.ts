import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { ImportacaoService } from './importacao.service';
import { ImportarCsvDto } from './dto/importar-csv.dto';
import type { ResultadoImportacaoCsv } from './types/resultado-importacao-csv.type';

interface UploadedCsvFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

function isUploadedCsvFile(arquivo: unknown): arquivo is UploadedCsvFile {
  if (typeof arquivo !== 'object' || arquivo === null) {
    return false;
  }

  const candidate = arquivo as Partial<UploadedCsvFile>;
  return (
    Buffer.isBuffer(candidate.buffer) &&
    typeof candidate.mimetype === 'string' &&
    typeof candidate.originalname === 'string'
  );
}

@Controller('importacoes')
export class ImportacaoController {
  constructor(private readonly importacaoService: ImportacaoService) {}

  @Post('csv')
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (
        _req: unknown,
        file: unknown,
        cb: (error: Error | null, acceptFile: boolean) => void,
      ) => {
        if (!isUploadedCsvFile(file)) {
          cb(null, false);
          return;
        }

        if (
          file.mimetype !== 'text/csv' &&
          !file.originalname.endsWith('.csv')
        ) {
          cb(null, false);
          return;
        }

        cb(null, true);
      },
    }),
  )
  importarCsv(
    @UploadedFile() arquivo: unknown,
    @Body() importarCsvDto: ImportarCsvDto,
  ): Promise<ResultadoImportacaoCsv> {
    if (!isUploadedCsvFile(arquivo)) {
      throw new BadRequestException('Arquivo CSV é obrigatório');
    }

    if (
      arquivo.mimetype !== 'text/csv' &&
      !arquivo.originalname.endsWith('.csv')
    ) {
      throw new BadRequestException('Apenas arquivos CSV são permitidos');
    }

    return this.importacaoService.procesarArquivoCsv(
      arquivo.buffer.toString('utf-8'),
      importarCsvDto,
    );
  }
}
