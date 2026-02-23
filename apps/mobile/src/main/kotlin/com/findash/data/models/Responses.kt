package com.findash.data.models

import com.google.gson.annotations.SerializedName

data class UsuarioResponse(
    val id: String,
    val nome: String,
    val email: String,
    val cpf: String?,
    @SerializedName("criadoEm")
    val criadoEm: String
)

data class ContaResponse(
    val id: String,
    val usuarioId: String,
    val nome: String,
    val saldoInicial: Double,
    @SerializedName("incluirSomaTotal")
    val incluirSomaTotal: Boolean,
    val corHex: String?
)

data class TransacaoResponse(
    val id: String,
    val usuarioId: String,
    val contaId: String?,
    val categoriaId: String?,
    val tipo: String,
    val status: String,
    val valor: Double,
    @SerializedName("dataOcorrencia")
    val dataOcorrencia: String,
    val descricao: String,
    @SerializedName("criadoEm")
    val criadoEm: String
)

data class FaturaResponse(
    val id: String,
    val cartaoCreditoId: String,
    val mesReferencia: String,
    val anoReferencia: Int,
    val status: String,
    val valor: Double,
    @SerializedName("dataVencimento")
    val dataVencimento: String
)

data class CartaoCreditoResponse(
    val id: String,
    val usuarioId: String,
    val nome: String,
    val numero: String,
    @SerializedName("diaFechamento")
    val diaFechamento: Int,
    @SerializedName("diaVencimento")
    val diaVencimento: Int,
    val limite: Double,
    @SerializedName("contaPagamento")
    val contaPagamento: ContaResponse?
)

data class DashboardResponse(
    val saldoTotal: Double,
    val receitaMes: Double,
    val despesaMes: Double,
    val transacoesRecentes: List<TransacaoResponse>
)
