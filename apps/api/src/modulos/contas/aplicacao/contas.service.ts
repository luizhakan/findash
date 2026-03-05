import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { PrismaService } from "../../../infraestrutura/prisma/prisma.service";
import {
  garantirString,
} from "../../../infraestrutura/comum/conversao.util";
import {
  gerarHashSenha,
  validarForcaSenha,
  verificarSenha,
} from "../../../infraestrutura/seguranca/senha.util";

@Injectable()
export class ContasService {
  constructor(private readonly prismaService: PrismaService) {}

  async criarConta(dados: Record<string, unknown>): Promise<Record<string, unknown>> {
    const nome = garantirString(dados.nome, "nome") as string;
    const usuario = garantirString(dados.usuario, "usuario") as string;
    const email = (garantirString(dados.email, "email") as string).toLowerCase();
    const senha = garantirString(dados.senha, "senha") as string;

    if (!validarForcaSenha(senha)) {
      throw new BadRequestException(
        "Senha invalida. Use no minimo 8 caracteres com maiuscula, minuscula e numero.",
      );
    }

    const duplicado = await this.prismaService.usuario.findFirst({
      where: {
        OR: [{ email }, { usuario }],
      },
      select: { id: true, email: true, usuario: true },
    });

    if (duplicado?.email === email) {
      throw new BadRequestException("Email ja esta em uso.");
    }

    if (duplicado?.usuario === usuario) {
      throw new BadRequestException("Usuario ja esta em uso.");
    }

    const criado = await this.prismaService.usuario.create({
      data: {
        nome,
        usuario,
        email,
        senha_hash: gerarHashSenha(senha),
      },
      select: {
        id: true,
        nome: true,
        usuario: true,
        email: true,
        status: true,
        criado_em: true,
      },
    });

    return criado;
  }

  async login(dados: Record<string, unknown>): Promise<Record<string, unknown>> {
    const usuarioOuEmail = garantirString(
      dados.usuario_ou_email,
      "usuario_ou_email",
    ) as string;
    const senha = garantirString(dados.senha, "senha") as string;

    const conta = await this.prismaService.usuario.findFirst({
      where: {
        OR: [
          { usuario: usuarioOuEmail },
          { email: usuarioOuEmail.toLowerCase() },
        ],
        status: "ATIVO",
        removido_em: null,
      },
      select: {
        id: true,
        nome: true,
        usuario: true,
        email: true,
        senha_hash: true,
      },
    });

    if (!conta || !verificarSenha(senha, conta.senha_hash)) {
      throw new BadRequestException("Credenciais invalidas.");
    }

    return {
      token: conta.id,
      tipo_token: "bearer",
      usuario: {
        id: conta.id,
        nome: conta.nome,
        usuario: conta.usuario,
        email: conta.email,
      },
    };
  }

  async deletarConta(
    contaId: string,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    this.validarDonoDaConta(contaId, usuarioAutenticadoId);

    await this.prismaService.usuario.update({
      where: { id: contaId },
      data: {
        status: "INATIVO",
        removido_em: new Date(),
      },
    });

    return { mensagem: "Conta removida com sucesso." };
  }

  async editarSenha(
    contaId: string,
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    this.validarDonoDaConta(contaId, usuarioAutenticadoId);

    const novaSenha = garantirString(dados.novaSenha ?? dados.nova_senha, "novaSenha") as string;
    if (!validarForcaSenha(novaSenha)) {
      throw new BadRequestException("Senha invalida.");
    }

    await this.prismaService.usuario.update({
      where: { id: contaId },
      data: {
        senha_hash: gerarHashSenha(novaSenha),
      },
    });

    return { mensagem: "Senha atualizada com sucesso." };
  }

  async editarNome(
    contaId: string,
    dados: Record<string, unknown>,
    usuarioAutenticadoId: string,
  ): Promise<Record<string, unknown>> {
    this.validarDonoDaConta(contaId, usuarioAutenticadoId);

    const novoNome = garantirString(dados.novoNome ?? dados.novo_nome, "novoNome") as string;
    if (novoNome.length < 2) {
      throw new BadRequestException("Nome invalido.");
    }

    const usuario = await this.prismaService.usuario.update({
      where: { id: contaId },
      data: { nome: novoNome },
      select: {
        id: true,
        nome: true,
        usuario: true,
        email: true,
      },
    });

    return {
      mensagem: "Nome atualizado com sucesso.",
      usuario,
    };
  }

  async solicitarRecuperacaoSenha(
    dados: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const email = (garantirString(dados.email, "email") as string).toLowerCase();

    const usuario = await this.prismaService.usuario.findFirst({
      where: {
        email,
        status: "ATIVO",
        removido_em: null,
      },
      select: { id: true },
    });

    if (usuario) {
      const token = `rec_${randomUUID()}`;
      await this.prismaService.tokenRecuperacaoSenha.create({
        data: {
          usuario_id: usuario.id,
          token_hash: gerarHashSenha(token),
          expiracao_em: new Date(Date.now() + 1000 * 60 * 30),
        },
      });
    }

    return {
      mensagem:
        "Se o email existir, enviaremos as instrucoes de recuperacao.",
    };
  }

  private validarDonoDaConta(contaId: string, usuarioAutenticadoId: string): void {
    if (contaId !== usuarioAutenticadoId) {
      throw new ForbiddenException("Usuario autenticado nao pode alterar outra conta.");
    }
  }

  async obterContaAtivaOuFalhar(contaId: string): Promise<void> {
    const conta = await this.prismaService.usuario.findFirst({
      where: {
        id: contaId,
        status: "ATIVO",
        removido_em: null,
      },
      select: { id: true },
    });

    if (!conta) {
      throw new NotFoundException("Conta nao encontrada.");
    }
  }
}
