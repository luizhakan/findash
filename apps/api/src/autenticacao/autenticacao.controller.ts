import { Body, Controller, Post } from '@nestjs/common';
import {
  AutenticacaoService,
  SessaoAutenticacaoDto,
} from './autenticacao.service';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';

@Controller('autenticacao')
export class AutenticacaoController {
  constructor(private readonly autenticacaoService: AutenticacaoService) {}

  @Post('registro')
  registrar(@Body() registroDto: RegistroDto): Promise<SessaoAutenticacaoDto> {
    return this.autenticacaoService.registrar(registroDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<SessaoAutenticacaoDto> {
    return this.autenticacaoService.login(loginDto);
  }
}
