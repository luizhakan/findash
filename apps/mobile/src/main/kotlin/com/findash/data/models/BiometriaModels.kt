package com.findash.data.models

import com.google.gson.annotations.SerializedName

data class BiometriaResponse(
    val usuarioId: String,
    val biometriaHabilitada: Boolean
)

data class HabilitarBiometriaRequest(
    val usuarioId: String,
    val habilitada: Boolean
)

enum class TipoNotificacao {
    FATURA_VENCENDO,
    CONTA_PAGAMENTO,
    LEMBRETE_CUSTOMIZADO,
    IMPORTACAO_CONCLUIDA
}

data class NotificacaoResponse(
    val id: String,
    val usuarioId: String,
    val tipo: String,
    val titulo: String,
    val descricao: String?,
    @SerializedName("dataAgendada")
    val dataAgendada: String,
    val ativo: Boolean,
    val lido: Boolean,
    @SerializedName("criadoEm")
    val criadoEm: String
)

data class CriarNotificacaoRequest(
    val usuarioId: String,
    val tipo: String,
    val titulo: String,
    val descricao: String?,
    @SerializedName("dataAgendada")
    val dataAgendada: String
)
