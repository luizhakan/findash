package com.findash.data.repositories

import com.findash.data.local.SessionManager
import com.findash.data.models.AtualizarContaRequest
import com.findash.data.models.AtualizarTransacaoRequest
import com.findash.data.models.ApiErrorResponse
import com.findash.data.models.BiometriaResponse
import com.findash.data.models.ContaResponse
import com.findash.data.models.CriarContaRequest
import com.findash.data.models.CriarNotificacaoRequest
import com.findash.data.models.CriarTransacaoRequest
import com.findash.data.models.DashboardResponse
import com.findash.data.models.HabilitarBiometriaRequest
import com.findash.data.models.LoginRequest
import com.findash.data.models.NotificacaoResponse
import com.findash.data.models.RegistroRequest
import com.findash.data.models.TransacaoResponse
import com.findash.data.remote.FinDashApiService
import com.google.gson.Gson
import retrofit2.HttpException
import java.io.IOException
import java.time.Instant
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AutenticacaoRepositoryImpl @Inject constructor(
    private val apiService: FinDashApiService,
    private val sessionManager: SessionManager,
) : AutenticacaoRepository {
    override suspend fun fazerLogin(email: String, senha: String): String {
        return try {
            val sessao = apiService.login(LoginRequest(email = email, senha = senha))
            sessionManager.salvarSessao(
                token = sessao.token,
                usuarioId = sessao.usuarioId,
                nome = sessao.nome,
                email = sessao.email,
            )
            sessao.token
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao fazer login"))
        }
    }

    override suspend fun fazerRegistro(email: String, senha: String, nome: String): String {
        return try {
            val sessao = apiService.registrar(
                RegistroRequest(nome = nome, email = email, senha = senha),
            )
            sessionManager.salvarSessao(
                token = sessao.token,
                usuarioId = sessao.usuarioId,
                nome = sessao.nome,
                email = sessao.email,
            )
            sessao.token
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao cadastrar"))
        }
    }

    override suspend fun fazerLogout() {
        sessionManager.limparSessao()
    }

    override suspend fun verificarAutenticacao(): Boolean {
        return !sessionManager.obterUsuarioId().isNullOrBlank()
    }
}

@Singleton
class DashboardRepositoryImpl @Inject constructor(
    private val apiService: FinDashApiService,
) : DashboardRepository {
    override suspend fun obterDashboard(usuarioId: String): DashboardResponse {
        return try {
            val resumo = apiService.obterResumoMensal(usuarioId)
            DashboardResponse(
                saldoTotal = resumo.saldoTotalContasVisiveis,
                receitaMes = resumo.totalReceitasMes,
                despesaMes = resumo.totalDespesasMes,
                transacoesRecentes = emptyList(),
            )
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao carregar dashboard"))
        }
    }

    override suspend fun obterTransacoes(usuarioId: String): List<TransacaoResponse> {
        return try {
            apiService.obterTransacoes(usuarioId)
        } catch (_: Exception) {
            emptyList()
        }
    }

    override suspend fun obterContas(usuarioId: String): List<ContaResponse> {
        return try {
            apiService.obterContas(usuarioId)
        } catch (_: Exception) {
            emptyList()
        }
    }
}

@Singleton
class ContaRepositoryImpl @Inject constructor(
    private val apiService: FinDashApiService,
) : ContaRepository {
    override suspend fun obterContas(usuarioId: String): List<ContaResponse> {
        return try {
            apiService.obterContas(usuarioId)
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao carregar contas"))
        }
    }

    override suspend fun criarConta(
        usuarioId: String,
        nome: String,
        saldoInicial: Double,
    ): ContaResponse {
        return try {
            apiService.criarConta(
                CriarContaRequest(
                    usuarioId = usuarioId,
                    nome = nome,
                    saldoInicial = saldoInicial,
                ),
            )
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao criar conta"))
        }
    }

    override suspend fun atualizarConta(id: String, nome: String): ContaResponse {
        return try {
            apiService.atualizarConta(
                id = id,
                body = AtualizarContaRequest(nome = nome),
            )
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao atualizar conta"))
        }
    }

    override suspend fun removerConta(id: String) {
        try {
            apiService.removerConta(id)
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao remover conta"))
        }
    }
}

@Singleton
class TransacaoRepositoryImpl @Inject constructor(
    private val apiService: FinDashApiService,
) : TransacaoRepository {
    override suspend fun obterTransacoes(usuarioId: String): List<TransacaoResponse> {
        return try {
            apiService.obterTransacoes(usuarioId)
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao carregar transações"))
        }
    }

    override suspend fun criarTransacao(
        usuarioId: String,
        contaId: String,
        descricao: String,
        valor: Double,
        tipo: String,
        status: String,
    ): TransacaoResponse {
        return try {
            apiService.criarTransacao(
                CriarTransacaoRequest(
                    usuarioId = usuarioId,
                    tipo = tipo,
                    status = status,
                    valor = valor,
                    dataOcorrencia = Instant.now().toString(),
                    descricao = descricao,
                    contaId = contaId,
                ),
            )
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao criar transação"))
        }
    }

    override suspend fun atualizarTransacao(
        id: String,
        descricao: String,
        valor: Double,
        tipo: String,
        status: String,
    ): TransacaoResponse {
        return try {
            apiService.atualizarTransacao(
                id = id,
                body = AtualizarTransacaoRequest(
                    descricao = descricao,
                    valor = valor,
                    tipo = tipo,
                    status = status,
                ),
            )
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao atualizar transação"))
        }
    }

    override suspend fun removerTransacao(id: String) {
        try {
            apiService.removerTransacao(id)
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao remover transação"))
        }
    }
}

@Singleton
class BiometriaRepositoryImpl @Inject constructor(
    private val apiService: FinDashApiService,
) : BiometriaRepository {
    override suspend fun verificarStatusBiometria(usuarioId: String): BiometriaResponse {
        return try {
            apiService.verificarStatusBiometria(usuarioId)
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao verificar biometria"))
        }
    }

    override suspend fun habilitarBiometria(
        usuarioId: String,
        habilitada: Boolean,
    ): BiometriaResponse {
        return try {
            apiService.habilitarBiometria(
                HabilitarBiometriaRequest(
                    usuarioId = usuarioId,
                    habilitada = habilitada,
                ),
            )
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao atualizar biometria"))
        }
    }
}

@Singleton
class NotificacaoRepositoryImpl @Inject constructor(
    private val apiService: FinDashApiService,
) : NotificacaoRepository {
    override suspend fun obterNotificacoes(
        usuarioId: String,
        apenasNaoLidas: Boolean,
    ): List<NotificacaoResponse> {
        return try {
            apiService.obterNotificacoes(usuarioId, apenasNaoLidas)
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao carregar notificações"))
        }
    }

    override suspend fun criarNotificacao(
        request: CriarNotificacaoRequest,
    ): NotificacaoResponse {
        return try {
            apiService.criarNotificacao(request)
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao criar notificação"))
        }
    }

    override suspend fun marcarComoLido(notificacaoId: String): NotificacaoResponse {
        return try {
            apiService.marcarNotificacaoComoLida(notificacaoId)
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao atualizar notificação"))
        }
    }

    override suspend fun marcarTodosComoLido(usuarioId: String): Map<String, Any> {
        return try {
            apiService.marcarTodasNotificacoesComoLidas(usuarioId)
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao atualizar notificações"))
        }
    }

    override suspend fun desativarNotificacao(notificacaoId: String): NotificacaoResponse {
        return try {
            apiService.desativarNotificacao(notificacaoId)
        } catch (exception: Exception) {
            throw Exception(exception.toMensagemAmigavel("Erro ao remover notificação"))
        }
    }
}

private fun Exception.toMensagemAmigavel(padrao: String): String {
    return when (this) {
        is IOException -> "Sem conexão com a internet ou servidor indisponível"
        is HttpException -> {
            val body = response()?.errorBody()?.string().orEmpty()
            val parsed = runCatching {
                Gson().fromJson(body, ApiErrorResponse::class.java)
            }.getOrNull()
            val message = parsed?.message
            when (message) {
                is String -> message
                is List<*> -> message.joinToString(", ") { it.toString() }
                else -> padrao
            }
        }
        else -> message ?: padrao
    }
}
