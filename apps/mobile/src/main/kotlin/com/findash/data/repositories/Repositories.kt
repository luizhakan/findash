package com.findash.data.repositories

import com.findash.data.models.DashboardResponse
import com.findash.data.models.TransacaoResponse
import com.findash.data.models.ContaResponse
import com.findash.data.models.BiometriaResponse
import com.findash.data.models.HabilitarBiometriaRequest
import com.findash.data.models.NotificacaoResponse
import com.findash.data.models.CriarNotificacaoRequest

interface DashboardRepository {
    suspend fun obterDashboard(usuarioId: String): DashboardResponse
    suspend fun obterTransacoes(usuarioId: String): List<TransacaoResponse>
    suspend fun obterContas(usuarioId: String): List<ContaResponse>
}

interface AutenticacaoRepository {
    suspend fun fazerLogin(email: String, senha: String): String // Token
    suspend fun fazerRegistro(email: String, senha: String, nome: String): String // Token
    suspend fun fazerLogout()
    suspend fun verificarAutenticacao(): Boolean
}

interface TransacaoRepository {
    suspend fun obterTransacoes(usuarioId: String): List<TransacaoResponse>
    suspend fun criarTransacao(
        usuarioId: String,
        contaId: String,
        descricao: String,
        valor: Double,
        tipo: String,
        status: String = "EFETIVADA",
    ): TransacaoResponse
    suspend fun atualizarTransacao(
        id: String,
        descricao: String,
        valor: Double,
        tipo: String,
        status: String,
    ): TransacaoResponse
    suspend fun removerTransacao(id: String)
}

interface ContaRepository {
    suspend fun obterContas(usuarioId: String): List<ContaResponse>
    suspend fun criarConta(usuarioId: String, nome: String, saldoInicial: Double): ContaResponse
    suspend fun atualizarConta(id: String, nome: String): ContaResponse
    suspend fun removerConta(id: String)
}

interface BiometriaRepository {
    suspend fun verificarStatusBiometria(usuarioId: String): BiometriaResponse
    suspend fun habilitarBiometria(usuarioId: String, habilitada: Boolean): BiometriaResponse
}

interface NotificacaoRepository {
    suspend fun obterNotificacoes(usuarioId: String, apenasNaoLidas: Boolean = false): List<NotificacaoResponse>
    suspend fun criarNotificacao(request: CriarNotificacaoRequest): NotificacaoResponse
    suspend fun marcarComoLido(notificacaoId: String): NotificacaoResponse
    suspend fun marcarTodosComoLido(usuarioId: String): Map<String, Any>
    suspend fun desativarNotificacao(notificacaoId: String): NotificacaoResponse
}
