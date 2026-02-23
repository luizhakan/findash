package com.findash.data.models

import com.google.gson.annotations.SerializedName

data class CriarContaRequest(
    val usuarioId: String,
    val nome: String,
    val saldoInicial: Double,
    @SerializedName("incluirSomaTotal")
    val incluirSomaTotal: Boolean = true,
    val corHex: String? = null,
)

data class AtualizarContaRequest(
    val nome: String? = null,
    val saldoInicial: Double? = null,
    @SerializedName("incluirSomaTotal")
    val incluirSomaTotal: Boolean? = null,
    val corHex: String? = null,
)

data class CriarTransacaoRequest(
    val usuarioId: String,
    val tipo: String,
    val status: String,
    val valor: Double,
    @SerializedName("dataOcorrencia")
    val dataOcorrencia: String,
    val descricao: String,
    val contaId: String,
)

data class AtualizarTransacaoRequest(
    val tipo: String? = null,
    val status: String? = null,
    val valor: Double? = null,
    @SerializedName("dataOcorrencia")
    val dataOcorrencia: String? = null,
    val descricao: String? = null,
)

