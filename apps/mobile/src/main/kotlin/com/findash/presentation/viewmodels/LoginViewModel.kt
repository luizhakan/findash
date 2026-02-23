package com.findash.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.findash.data.repositories.AutenticacaoRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class LoginUiState(
    val email: String = "",
    val senha: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val isLoginSuccess: Boolean = false
)

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val autenticacaoRepository: AutenticacaoRepository,
) : ViewModel() {
    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState

    fun onEmailChanged(email: String) {
        _uiState.value = _uiState.value.copy(email = email)
    }

    fun onSenhaChanged(senha: String) {
        _uiState.value = _uiState.value.copy(senha = senha)
    }

    fun login() {
        viewModelScope.launch {
            if (_uiState.value.email.isBlank() || _uiState.value.senha.isBlank()) {
                _uiState.value = _uiState.value.copy(errorMessage = "Informe email e senha")
                return@launch
            }

            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            try {
                autenticacaoRepository.fazerLogin(
                    email = _uiState.value.email.trim(),
                    senha = _uiState.value.senha,
                )
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    isLoginSuccess = true
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Erro ao fazer login"
                )
            }
        }
    }
}
