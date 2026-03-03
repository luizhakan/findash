import { Module } from "@nestjs/common";
import { ContasModule } from "./modulos/contas/contas.module";
import { CarteirasModule } from "./modulos/carteiras/carteiras.module";
import { CartoesModule } from "./modulos/cartoes/cartoes.module";
import { CsvModule } from "./modulos/csv/csv.module";
import { SaldosModule } from "./modulos/saldos/saldos.module";
import { TransferenciasModule } from "./modulos/transferencias/transferencias.module";
import { RecorrenciasModule } from "./modulos/recorrencias/recorrencias.module";
import { OrcamentosModule } from "./modulos/orcamentos/orcamentos.module";

@Module({
  imports: [
    ContasModule,
    CarteirasModule,
    CartoesModule,
    CsvModule,
    SaldosModule,
    TransferenciasModule,
    RecorrenciasModule,
    OrcamentosModule,
  ],
})
export class AppModule {}
