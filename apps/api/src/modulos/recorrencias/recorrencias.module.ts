import { Module } from "@nestjs/common";
import { RecorrenciasService } from "./aplicacao/recorrencias.service";
import { RecorrenciasController } from "./interface-http/recorrencias.controller";

@Module({
  controllers: [RecorrenciasController],
  providers: [RecorrenciasService],
})
export class RecorrenciasModule {}
