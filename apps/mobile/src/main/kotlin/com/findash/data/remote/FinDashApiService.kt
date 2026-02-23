package com.findash.data.remote

import com.findash.data.models.ContaResponse
import com.findash.data.models.DashboardResumoResponse
import com.findash.data.models.LoginRequest
import com.findash.data.models.RegistroRequest
import com.findash.data.models.SessaoResponse
import com.findash.data.models.TransacaoResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
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
}

