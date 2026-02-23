import { Module } from '@nestjs/common';
import { ImportacaoController } from './importacao.controller';
import { ImportacaoService } from './importacao.service';
import { ParserService } from './parser.service';

@Module({
  controllers: [ImportacaoController],
  providers: [ImportacaoService, ParserService],
})
export class ImportacaoModule {}
