import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegistroDto } from './dto/registro.dto';

const scryptAsync = promisify(scrypt);

export interface SessaoAutenticacaoDto {
  token: string;
  usuarioId: string;
  nome: string;
  email: string;
}

@Injectable()
export class AutenticacaoService {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(registroDto: RegistroDto): Promise<SessaoAutenticacaoDto> {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email: registroDto.email },
      select: { id: true },
    });

    if (usuarioExistente) {
      throw new ConflictException('Email já está em uso');
    }

    const senhaHash = await this.gerarSenhaHash(registroDto.senha);
    const usuario = await this.prisma.usuario.create({
      data: {
        nome: registroDto.nome.trim(),
        email: registroDto.email.trim().toLowerCase(),
        senhaHash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    return {
      token: this.gerarTokenSessao(),
      usuarioId: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };
  }

  async login(loginDto: LoginDto): Promise<SessaoAutenticacaoDto> {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: loginDto.email.trim().toLowerCase() },
      select: {
        id: true,
        nome: true,
        email: true,
        senhaHash: true,
      },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await this.validarSenha(
      loginDto.senha,
      usuario.senhaHash,
    );
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return {
      token: this.gerarTokenSessao(),
      usuarioId: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    };
  }

  private async gerarSenhaHash(senha: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(senha, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  private async validarSenha(
    senha: string,
    senhaHash: string,
  ): Promise<boolean> {
    const partesHash = senhaHash.split(':');
    if (partesHash.length !== 2) {
      return false;
    }

    const [salt, hashHex] = partesHash;
    const hashEsperado = Buffer.from(hashHex, 'hex');
    const hashCalculado = (await scryptAsync(senha, salt, 64)) as Buffer;

    if (hashEsperado.length !== hashCalculado.length) {
      return false;
    }

    return timingSafeEqual(hashEsperado, hashCalculado);
  }

  private gerarTokenSessao(): string {
    return randomBytes(32).toString('base64url');
  }
}
