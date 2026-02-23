package com.findash.data.models

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class BiometriaResponse(
    val usuarioId: String,
    val biometriaHabilitada: Boolean
)

@Serializable
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

@Serializable
data class NotificacaoResponse(
    val id: String,
    val usuarioId: String,
    val tipo: String,
    val titulo: String,
    val descricao: String?,
    @SerialName("dataAgendada")
    val dataAgendada: String,
    val ativo: Boolean,
    val lido: Boolean,
    @SerialName("criadoEm")
    val criadoEm: String
)

@Serializable
data class CriarNotificacaoRequest(
    val usuarioId: String,
    val tipo: String,
    val titulo: String,
    val descricao: String?,
    @SerialName("dataAgendada")
    val dataAgendada: String
)
