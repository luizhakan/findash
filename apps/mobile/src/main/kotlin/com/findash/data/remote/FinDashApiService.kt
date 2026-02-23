package com.findash.data.remote

import com.findash.data.models.AtualizarContaRequest
import com.findash.data.models.AtualizarTransacaoRequest
import com.findash.data.models.BiometriaResponse
import com.findash.data.models.ContaResponse
import com.findash.data.models.CriarContaRequest
import com.findash.data.models.CriarNotificacaoRequest
import com.findash.data.models.CriarTransacaoRequest
import com.findash.data.models.DashboardResumoResponse
import com.findash.data.models.HabilitarBiometriaRequest
import com.findash.data.models.LoginRequest
import com.findash.data.models.NotificacaoResponse
import com.findash.data.models.RegistroRequest
import com.findash.data.models.SessaoResponse
import com.findash.data.models.TransacaoResponse
import retrofit2.http.DELETE
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface FinDashApiService {
    @POST("autenticacao/login")
    suspend fun login(@Body body: LoginRequest): SessaoResponse

    @POST("autenticacao/registro")
    suspend fun registrar(@Body body: RegistroRequest): SessaoResponse

    @GET("dashboard/resumo-mensal")
    suspend fun obterResumoMensal(
        @Query("usuarioId") usuarioId: String,
    ): DashboardResumoResponse

    @GET("transacoes")
    suspend fun obterTransacoes(
        @Query("usuarioId") usuarioId: String,
    ): List<TransacaoResponse>

    @GET("contas")
    suspend fun obterContas(
        @Query("usuarioId") usuarioId: String,
    ): List<ContaResponse>

    @POST("contas")
    suspend fun criarConta(@Body body: CriarContaRequest): ContaResponse

    @PATCH("contas/{id}")
    suspend fun atualizarConta(
        @Path("id") id: String,
        @Body body: AtualizarContaRequest,
    ): ContaResponse

    @DELETE("contas/{id}")
    suspend fun removerConta(@Path("id") id: String): Map<String, String>

    @POST("transacoes")
    suspend fun criarTransacao(@Body body: CriarTransacaoRequest): TransacaoResponse

    @PATCH("transacoes/{id}")
    suspend fun atualizarTransacao(
        @Path("id") id: String,
        @Body body: AtualizarTransacaoRequest,
    ): TransacaoResponse

    @DELETE("transacoes/{id}")
    suspend fun removerTransacao(@Path("id") id: String): Map<String, String>

    @GET("biometria/{usuarioId}/status")
    suspend fun verificarStatusBiometria(
        @Path("usuarioId") usuarioId: String,
    ): BiometriaResponse

    @PATCH("biometria/habilitar")
    suspend fun habilitarBiometria(
        @Body body: HabilitarBiometriaRequest,
    ): BiometriaResponse

    @GET("notificacoes/usuario/{usuarioId}")
    suspend fun obterNotificacoes(
        @Path("usuarioId") usuarioId: String,
        @Query("naoLidas") apenasNaoLidas: Boolean = false,
    ): List<NotificacaoResponse>

    @POST("notificacoes/criar")
    suspend fun criarNotificacao(
        @Body body: CriarNotificacaoRequest,
    ): NotificacaoResponse

    @PATCH("notificacoes/lido/{notificacaoId}")
    suspend fun marcarNotificacaoComoLida(
        @Path("notificacaoId") notificacaoId: String,
    ): NotificacaoResponse

    @PATCH("notificacoes/lido-todos/{usuarioId}")
    suspend fun marcarTodasNotificacoesComoLidas(
        @Path("usuarioId") usuarioId: String,
    ): Map<String, Any>

    @DELETE("notificacoes/{notificacaoId}")
    suspend fun desativarNotificacao(
        @Path("notificacaoId") notificacaoId: String,
    ): NotificacaoResponse
}
