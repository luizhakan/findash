package com.findash.data.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class UsuarioResponse(
    val id: String,
    val nome: String,
    val email: String,
    val cpf: String?,
    @SerialName("criadoEm")
    val criadoEm: String
)

@Serializable
data class ContaResponse(
    val id: String,
    val usuarioId: String,
    val nome: String,
    val saldoInicial: Double,
    @SerialName("incluirSomaTotal")
    val incluirSomaTotal: Boolean,
    val corHex: String?
)

@Serializable
data class TransacaoResponse(
    val id: String,
    val usuarioId: String,
    val contaId: String?,
    val categoryId: String?,
    val tipo: String,
    val status: String,
    val valor: Double,
    @SerialName("dataOcorrencia")
    val dataOcorrencia: String,
    val descricao: String,
    @SerialName("criadoEm")
    val criadoEm: String
)

@Serializable
data class FaturaResponse(
    val id: String,
    val cartaoCreditoId: String,
    val mesReferencia: String,
    val anoReferencia: Int,
    val status: String,
    val valor: Double,
    @SerialName("dataVencimento")
    val dataVencimento: String
)

@Serializable
data class CartaoCreditoResponse(
    val id: String,
    val usuarioId: String,
    val nome: String,
    val numero: String,
    @SerialName("diaFechamento")
    val diaFechamento: Int,
    @SerialName("diaVencimento")
    val diaVencimento: Int,
    val limite: Double,
    @SerialName("contaPagamento")
    val contaPagamento: ContaResponse?
)

@Serializable
data class DashboardResponse(
    val saldoTotal: Double,
    val receitaMes: Double,
    val despesaMes: Double,
    val transacoesRecentes: List<TransacaoResponse>
)
