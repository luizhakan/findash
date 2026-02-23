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
import { CategoriaService } from './categoria.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  criar(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriaService.criar(createCategoriaDto);
  }

  @Get()
  listar(@Query('usuarioId', new ParseUUIDPipe()) usuarioId: string) {
    return this.categoriaService.listar(usuarioId);
  }

  @Get(':id')
  buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriaService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriaService.atualizar(id, updateCategoriaDto);
  }

  @Delete(':id')
  remover(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.categoriaService.remover(id);
  }
}
