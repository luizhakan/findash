import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FaturaService } from './fatura.service';
import { PagarFaturaDto } from './dto/pagar-fatura.dto';

@Controller('faturas')
export class FaturaController {
  constructor(private readonly faturaService: FaturaService) {}

  @Get('cartao/:cartaoId')
  listarPorCartao(@Param('cartaoId', new ParseUUIDPipe()) cartaoId: string) {
    return this.faturaService.listarPorCartao(cartaoId);
  }

  @Get(':id')
  buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.faturaService.buscarPorId(id);
  }

  @Post(':id/pagar')
  pagarFatura(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() pagarFaturaDto: PagarFaturaDto,
  ) {
    return this.faturaService.pagarFatura(id, pagarFaturaDto);
  }
}
