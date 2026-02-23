import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ImportacaoService } from './importacao.service';
import { ImportarCsvDto } from './dto/importar-csv.dto';

@Controller('importacoes')
export class ImportacaoController {
  constructor(private readonly importacaoService: ImportacaoService) {}

  @Post('csv')
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
      fileFilter: (_req, file, cb) => {
        if (
          file.mimetype !== 'text/csv' &&
          !file.originalname.endsWith('.csv')
        ) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  importarCsv(
    @UploadedFile() arquivo: Express.Multer.File,
    @Body() importarCsvDto: ImportarCsvDto,
  ) {
    if (!arquivo) {
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
