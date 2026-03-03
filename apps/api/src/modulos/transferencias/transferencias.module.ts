import { Module } from "@nestjs/common";
import { TransferenciasService } from "./aplicacao/transferencias.service";
import { TransferenciasController } from "./interface-http/transferencias.controller";

@Module({
  controllers: [TransferenciasController],
  providers: [TransferenciasService],
})
export class TransferenciasModule {}
