import { Module } from "@nestjs/common";
import { OrcamentosService } from "./aplicacao/orcamentos.service";
import { OrcamentosController } from "./interface-http/orcamentos.controller";

@Module({
  controllers: [OrcamentosController],
  providers: [OrcamentosService],
})
export class OrcamentosModule {}
