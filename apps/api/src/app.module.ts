import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ContasModule } from "./modulos/contas/contas.module";
import { CarteirasModule } from "./modulos/carteiras/carteiras.module";
import { CartoesModule } from "./modulos/cartoes/cartoes.module";
import { CsvModule } from "./modulos/csv/csv.module";
import { SaldosModule } from "./modulos/saldos/saldos.module";
import { TransferenciasModule } from "./modulos/transferencias/transferencias.module";
import { RecorrenciasModule } from "./modulos/recorrencias/recorrencias.module";
import { OrcamentosModule } from "./modulos/orcamentos/orcamentos.module";
import { AutenticacaoGuard } from "./infraestrutura/http/autenticacao.guard";
import { InfraestruturaModule } from "./infraestrutura/infraestrutura.module";

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    InfraestruturaModule,
    ContasModule,
    CarteirasModule,
    CartoesModule,
    CsvModule,
    SaldosModule,
    TransferenciasModule,
    RecorrenciasModule,
    OrcamentosModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AutenticacaoGuard,
    },
  ],
})
export class AppModule {}
