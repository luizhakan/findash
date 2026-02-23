import { Module } from '@nestjs/common';
import { CartaoCreditoController } from './cartao-credito.controller';
import { CartaoCreditoService } from './cartao-credito.service';

@Module({
  controllers: [CartaoCreditoController],
  providers: [CartaoCreditoService],
})
export class CartaoCreditoModule {}
