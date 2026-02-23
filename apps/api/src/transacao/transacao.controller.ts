import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransacaoService } from './transacao.service';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { UpdateTransacaoDto } from './dto/update-transacao.dto';

@Controller('transacoes')
export class TransacaoController {
  constructor(private readonly transacaoService: TransacaoService) {}

  @Post()
  criar(@Body() createTransacaoDto: CreateTransacaoDto) {
    return this.transacaoService.criar(createTransacaoDto);
  }

  @Get()
  listar(@Query('usuarioId', new ParseUUIDPipe()) usuarioId: string) {
    return this.transacaoService.listar(usuarioId);
  }

  @Get(':id')
  buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.transacaoService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTransacaoDto: UpdateTransacaoDto,
  ) {
    return this.transacaoService.atualizar(id, updateTransacaoDto);
  }

  @Delete(':id')
  remover(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.transacaoService.remover(id);
  }
}
