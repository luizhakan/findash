import { Module } from "@nestjs/common";
import { CarteirasService } from "./aplicacao/carteiras.service";
import { CarteirasController } from "./interface-http/carteiras.controller";

@Module({
  controllers: [CarteirasController],
  providers: [CarteirasService],
})
export class CarteirasModule {}
