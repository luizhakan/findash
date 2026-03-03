import { Module } from "@nestjs/common";
import { SaldosService } from "./aplicacao/saldos.service";
import { SaldosController } from "./interface-http/saldos.controller";

@Module({
  controllers: [SaldosController],
  providers: [SaldosService],
})
export class SaldosModule {}
