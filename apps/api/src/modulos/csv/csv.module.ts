import { Module } from "@nestjs/common";
import { CsvService } from "./aplicacao/csv.service";
import { CsvController } from "./interface-http/csv.controller";

@Module({
  controllers: [CsvController],
  providers: [CsvService],
})
export class CsvModule {}
