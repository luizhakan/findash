import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContaModule } from './conta/conta.module';
import { PrismaModule } from './prisma/prisma.module';
import { CartaoCreditoModule } from './cartao-credito/cartao-credito.module';
import { CategoriaModule } from './categoria/categoria.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FaturaModule } from './fatura/fatura.module';
import { TagModule } from './tag/tag.module';
import { TransacaoModule } from './transacao/transacao.module';
import { ImportacaoModule } from './importacao/importacao.module';
import { BiometriaModule } from './biometria/biometria.module';
import { NotificacaoModule } from './notificacao/notificacao.module';
import { AutenticacaoModule } from './autenticacao/autenticacao.module';

@Module({
  imports: [
    PrismaModule,
    ContaModule,
    CategoriaModule,
    TagModule,
    TransacaoModule,
    DashboardModule,
    CartaoCreditoModule,
    FaturaModule,
    ImportacaoModule,
    BiometriaModule,
    NotificacaoModule,
    AutenticacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
