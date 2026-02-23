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
import { CartaoCreditoService } from './cartao-credito.service';
import { CreateCartaoCreditoDto } from './dto/create-cartao-credito.dto';
import { UpdateCartaoCreditoDto } from './dto/update-cartao-credito.dto';

@Controller('cartoes-credito')
export class CartaoCreditoController {
  constructor(private readonly cartaoCreditoService: CartaoCreditoService) {}

  @Post()
  criar(@Body() createCartaoCreditoDto: CreateCartaoCreditoDto) {
    return this.cartaoCreditoService.criar(createCartaoCreditoDto);
  }

  @Get()
  listar(@Query('usuarioId', new ParseUUIDPipe()) usuarioId: string) {
    return this.cartaoCreditoService.listar(usuarioId);
  }

  @Get(':id')
  buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.cartaoCreditoService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCartaoCreditoDto: UpdateCartaoCreditoDto,
  ) {
    return this.cartaoCreditoService.atualizar(id, updateCartaoCreditoDto);
  }

  @Delete(':id')
  remover(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.cartaoCreditoService.remover(id);
  }
}
