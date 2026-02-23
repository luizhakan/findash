package com.findash.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.findash.data.local.SessionManager
import com.findash.data.models.NotificacaoResponse
import com.findash.data.repositories.NotificacaoRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
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

@HiltViewModel
class NotificacaoViewModel @Inject constructor(
    private val notificacaoRepository: NotificacaoRepository,
    private val sessionManager: SessionManager,
) : ViewModel() {
    private val _uiState = MutableStateFlow(NotificacaoUiState())
    val uiState: StateFlow<NotificacaoUiState> = _uiState

    fun carregarNotificacoes(apenasNaoLidas: Boolean = false) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            try {
                val usuarioId = sessionManager.obterUsuarioId()
                if (usuarioId.isNullOrBlank()) {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        errorMessage = "Sessão inválida. Faça login novamente."
                    )
                    return@launch
                }
                val notificacoes = notificacaoRepository.obterNotificacoes(
                    usuarioId = usuarioId,
                    apenasNaoLidas = apenasNaoLidas,
                )
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    notificacoes = notificacoes,
                    notificacoesNaoLidas = notificacoes.count { !it.lido },
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
                notificacaoRepository.marcarComoLido(notificacaoId)
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

    fun marcarTodosComoLido() {
        viewModelScope.launch {
            try {
                val usuarioId = sessionManager.obterUsuarioId()
                if (usuarioId.isNullOrBlank()) {
                    _uiState.value = _uiState.value.copy(
                        errorMessage = "Sessão inválida. Faça login novamente."
                    )
                    return@launch
                }
                notificacaoRepository.marcarTodosComoLido(usuarioId)
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
                notificacaoRepository.desativarNotificacao(notificacaoId)
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
