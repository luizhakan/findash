package com.findash.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.findash.data.repositories.AutenticacaoRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class RegisterUiState(
    val nome: String = "",
    val email: String = "",
    val senha: String = "",
    val confirmarSenha: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val isRegisterSuccess: Boolean = false,
)

@HiltViewModel
class RegisterViewModel @Inject constructor(
    private val autenticacaoRepository: AutenticacaoRepository,
) : ViewModel() {
    private val _uiState = MutableStateFlow(RegisterUiState())
    val uiState: StateFlow<RegisterUiState> = _uiState

    fun onNomeChanged(nome: String) {
        _uiState.value = _uiState.value.copy(nome = nome)
    }

    fun onEmailChanged(email: String) {
        _uiState.value = _uiState.value.copy(email = email)
    }

    fun onSenhaChanged(senha: String) {
        _uiState.value = _uiState.value.copy(senha = senha)
    }

    fun onConfirmarSenhaChanged(confirmarSenha: String) {
        _uiState.value = _uiState.value.copy(confirmarSenha = confirmarSenha)
    }

    fun cadastrar() {
        viewModelScope.launch {
            val state = _uiState.value

            if (state.nome.isBlank()) {
                _uiState.value = state.copy(errorMessage = "Informe o nome")
                return@launch
            }

            if (!state.email.contains("@") || !state.email.contains(".")) {
                _uiState.value = state.copy(errorMessage = "Informe um email válido")
                return@launch
            }

            if (state.senha.length < 6) {
                _uiState.value = state.copy(errorMessage = "A senha deve ter no mínimo 6 caracteres")
                return@launch
            }

            if (state.senha != state.confirmarSenha) {
                _uiState.value = state.copy(errorMessage = "As senhas não coincidem")
                return@launch
            }

            _uiState.value = state.copy(isLoading = true, errorMessage = null)

            try {
                autenticacaoRepository.fazerRegistro(
                    email = state.email.trim(),
                    senha = state.senha,
                    nome = state.nome.trim(),
                )
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    isRegisterSuccess = true,
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Erro ao cadastrar",
                )
            }
        }
    }
}
