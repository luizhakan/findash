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
import { ContaService } from './conta.service';
import { CreateContaDto } from './dto/create-conta.dto';
import { UpdateContaDto } from './dto/update-conta.dto';

@Controller('contas')
export class ContaController {
	constructor(private readonly contaService: ContaService) {}

	@Post()
	criar(@Body() createContaDto: CreateContaDto) {
		return this.contaService.criar(createContaDto);
	}

	@Get()
	listar(@Query('usuarioId', new ParseUUIDPipe()) usuarioId: string) {
		return this.contaService.listar(usuarioId);
	}

	@Get(':id')
	buscarPorId(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.contaService.buscarPorId(id);
	}

	@Patch(':id')
	atualizar(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() updateContaDto: UpdateContaDto,
	) {
		return this.contaService.atualizar(id, updateContaDto);
	}

	@Delete(':id')
	remover(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.contaService.remover(id);
	}
}
