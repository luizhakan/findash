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
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  criar(@Body() createTagDto: CreateTagDto) {
    return this.tagService.criar(createTagDto);
  }

  @Get()
  listar(@Query('usuarioId', new ParseUUIDPipe()) usuarioId: string) {
    return this.tagService.listar(usuarioId);
  }

  @Get(':id')
  buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tagService.buscarPorId(id);
  }

  @Patch(':id')
  atualizar(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.atualizar(id, updateTagDto);
  }

  @Delete(':id')
  remover(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.tagService.remover(id);
  }
}
