import { Module } from "@nestjs/common";
import { CartoesService } from "./aplicacao/cartoes.service";
import { CartoesController } from "./interface-http/cartoes.controller";

@Module({
  controllers: [CartoesController],
  providers: [CartoesService],
})
export class CartoesModule {}
