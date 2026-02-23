import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContaModule } from './conta/conta.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriaModule } from './categoria/categoria.module';
import { TagModule } from './tag/tag.module';
import { TransacaoModule } from './transacao/transacao.module';

@Module({
  imports: [
    PrismaModule,
    ContaModule,
    CategoriaModule,
    TagModule,
    TransacaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
