package com.findash.data.repositories

import com.findash.data.local.SessionManager
import com.findash.data.models.ApiErrorResponse
import com.findash.data.models.DashboardResponse
import com.findash.data.models.LoginRequest
import com.findash.data.models.RegistroRequest
import com.findash.data.models.TransacaoResponse
import com.findash.data.models.ContaResponse
import com.findash.data.remote.FinDashApiService
import com.google.gson.Gson
import retrofit2.HttpException
import java.io.IOException
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

