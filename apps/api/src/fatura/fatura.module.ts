import { Module } from '@nestjs/common';
import { FaturaController } from './fatura.controller';
import { FaturaService } from './fatura.service';

@Module({
  controllers: [FaturaController],
  providers: [FaturaService],
})
export class FaturaModule {}
