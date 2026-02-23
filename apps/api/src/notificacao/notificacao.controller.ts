import {
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  Post,
  Param,
  Query,
} from '@nestjs/common';
import { NotificacaoService } from './notificacao.service';
import { Notificacao } from '@prisma/client';
import {
  CriarNotificacaoDto,
  AtualizarNotificacaoDto,
} from './dto/criar-notificacao.dto';

@Controller('notificacoes')
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @Get('usuario/:usuarioId')
  async obterNotificacoes(
    @Param('usuarioId') usuarioId: string,
    @Query('naoLidas') naoLidas = false,
  ): Promise<Notificacao[]> {
    return this.notificacaoService.obterNotificacoes(usuarioId, naoLidas);
  }

  @Post('criar')
  async criar(
    @Body() criarNotificacaoDto: CriarNotificacaoDto,
  ): Promise<Notificacao> {
    return this.notificacaoService.criarNotificacao(criarNotificacaoDto);
  }

  @Patch('lido/:notificacaoId')
  async marcarComoLido(
    @Param('notificacaoId') notificacaoId: string,
  ): Promise<Notificacao> {
    return this.notificacaoService.marcarComoLido(notificacaoId);
  }

  @Patch('lido-todos/:usuarioId')
  async marcarTodosComoLido(
    @Param('usuarioId') usuarioId: string,
  ): Promise<{ notificacoesAtualizadas: number; mensagem: string }> {
    return this.notificacaoService.marcarTodosComoLido(usuarioId);
  }

  @Delete(':notificacaoId')
  async desativar(
    @Param('notificacaoId') notificacaoId: string,
  ): Promise<Notificacao> {
    return this.notificacaoService.desativarNotificacao(notificacaoId);
  }

  @Patch(':notificacaoId')
  async atualizar(
    @Param('notificacaoId') notificacaoId: string,
    @Body() atualizarNotificacaoDto: AtualizarNotificacaoDto,
  ): Promise<Notificacao> {
    return this.notificacaoService.atualizarNotificacao(
      notificacaoId,
      atualizarNotificacaoDto,
    );
  }

  @Post('gerar-automaticas-fatura')
  async gerarNotificacoesAutomaticasFatura() {
    return this.notificacaoService.criarNotificacoesAutomaticasFaturaVencendo();
  }
}
