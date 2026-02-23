package com.findash.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.findash.data.local.SessionManager
import com.findash.data.repositories.BiometriaRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class BiometriaUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val biometriaHabilitada: Boolean = false,
    val mensagemSucesso: String? = null
)

@HiltViewModel
class BiometriaViewModel @Inject constructor(
    private val biometriaRepository: BiometriaRepository,
    private val sessionManager: SessionManager,
) : ViewModel() {
    private val _uiState = MutableStateFlow(BiometriaUiState())
    val uiState: StateFlow<BiometriaUiState> = _uiState

    fun verificarStatusBiometria() {
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
                val resposta = biometriaRepository.verificarStatusBiometria(usuarioId)
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    biometriaHabilitada = resposta.biometriaHabilitada
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Erro ao verificar biometria"
                )
            }
        }
    }

    fun habilitarBiometria(habilitada: Boolean) {
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
                biometriaRepository.habilitarBiometria(usuarioId, habilitada)
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    biometriaHabilitada = habilitada,
                    mensagemSucesso = if (habilitada) "Biometria habilitada com sucesso" else "Biometria desabilitada"
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Erro ao atualizar biometria"
                )
            }
        }
    }

    fun limparMensagem() {
        _uiState.value = _uiState.value.copy(mensagemSucesso = null)
    }
}
