package com.findash.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class BiometriaUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val biometriaHabilitada: Boolean = false,
    val mensagemSucesso: String? = null
)

class BiometriaViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(BiometriaUiState())
    val uiState: StateFlow<BiometriaUiState> = _uiState

    fun verificarStatusBiometria(usuarioId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            try {
                // TODO: Chamar repositório para verificar status
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    biometriaHabilitada = false // Carregar do repositório
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Erro ao verificar biometria"
                )
            }
        }
    }

    fun habilitarBiometria(usuarioId: String, habilitada: Boolean) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            try {
                // TODO: Chamar repositório para habilitar/desabilitar
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
