package com.findash.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.findash.data.models.NotificacaoResponse
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class NotificacaoUiState(
    val notificacoes: List<NotificacaoResponse> = emptyList(),
    val notificacoesNaoLidas: Int = 0,
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val mensagemSucesso: String? = null
)

class NotificacaoViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(NotificacaoUiState())
    val uiState: StateFlow<NotificacaoUiState> = _uiState

    fun carregarNotificacoes(usuarioId: String, apenasNaoLidas: Boolean = false) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            try {
                // TODO: Chamar repositório para obter notificações
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    notificacoes = emptyList() // Carregar do repositório
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Erro ao carregar notificações"
                )
            }
        }
    }

    fun marcarComoLido(notificacaoId: String) {
        viewModelScope.launch {
            try {
                // TODO: Chamar repositório para marcar como lido
                val notificacoesAtualizadas = _uiState.value.notificacoes.map { notif ->
                    if (notif.id == notificacaoId) {
                        notif.copy(lido = true)
                    } else {
                        notif
                    }
                }
                _uiState.value = _uiState.value.copy(
                    notificacoes = notificacoesAtualizadas,
                    notificacoesNaoLidas = notificacoesAtualizadas.count { !it.lido }
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = e.message ?: "Erro ao marcar como lido"
                )
            }
        }
    }

    fun marcarTodosComoLido(usuarioId: String) {
        viewModelScope.launch {
            try {
                // TODO: Chamar repositório para marcar todos como lidos
                val notificacoesAtualizadas = _uiState.value.notificacoes.map {
                    it.copy(lido = true)
                }
                _uiState.value = _uiState.value.copy(
                    notificacoes = notificacoesAtualizadas,
                    notificacoesNaoLidas = 0,
                    mensagemSucesso = "Todas as notificações marcadas como lidas"
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = e.message ?: "Erro ao marcar como lidos"
                )
            }
        }
    }

    fun desativarNotificacao(notificacaoId: String) {
        viewModelScope.launch {
            try {
                // TODO: Chamar repositório para desativar
                val notificacoesAtualizadas = _uiState.value.notificacoes.filterNot { it.id == notificacaoId }
                _uiState.value = _uiState.value.copy(
                    notificacoes = notificacoesAtualizadas,
                    mensagemSucesso = "Notificação removida"
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = e.message ?: "Erro ao remover notificação"
                )
            }
        }
    }

    fun limparMensagem() {
        _uiState.value = _uiState.value.copy(mensagemSucesso = null)
    }
}
