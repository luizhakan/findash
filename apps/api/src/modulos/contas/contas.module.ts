import { Module } from "@nestjs/common";
import { ContasService } from "./aplicacao/contas.service";
import { ContasController } from "./interface-http/contas.controller";

@Module({
  controllers: [ContasController],
  providers: [ContasService],
})
export class ContasModule {}
