package com.findash.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.findash.data.local.SessionManager
import com.findash.data.models.ContaResponse
import com.findash.data.repositories.ContaRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class ContasUiState(
    val contas: List<ContaResponse> = emptyList(),
    val nomeNovaConta: String = "",
    val saldoInicialTexto: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val mensagemSucesso: String? = null,
)

@HiltViewModel
class ContasViewModel @Inject constructor(
    private val contaRepository: ContaRepository,
    private val sessionManager: SessionManager,
) : ViewModel() {
    private val _uiState = MutableStateFlow(ContasUiState())
    val uiState: StateFlow<ContasUiState> = _uiState

    init {
        carregarContas()
    }

    fun onNomeNovaContaChanged(valor: String) {
        _uiState.value = _uiState.value.copy(nomeNovaConta = valor)
    }

    fun onSaldoInicialChanged(valor: String) {
        _uiState.value = _uiState.value.copy(saldoInicialTexto = valor)
    }

    fun carregarContas() {
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

                val contas = contaRepository.obterContas(usuarioId)
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    contas = contas,
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Erro ao carregar contas",
                )
            }
        }
    }

    fun criarConta() {
        viewModelScope.launch {
            val estado = _uiState.value
            val nome = estado.nomeNovaConta.trim()
            if (nome.isBlank()) {
                _uiState.value = estado.copy(errorMessage = "Informe o nome da conta")
                return@launch
            }

            val saldo = estado.saldoInicialTexto.replace(',', '.').toDoubleOrNull()
            if (saldo == null) {
                _uiState.value = estado.copy(errorMessage = "Informe um saldo inicial válido")
                return@launch
            }

            _uiState.value = estado.copy(isLoading = true, errorMessage = null)
            try {
                val usuarioId = sessionManager.obterUsuarioId()
                if (usuarioId.isNullOrBlank()) {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        errorMessage = "Sessão inválida. Faça login novamente."
                    )
                    return@launch
                }

                contaRepository.criarConta(
                    usuarioId = usuarioId,
                    nome = nome,
                    saldoInicial = saldo,
                )

                val contas = contaRepository.obterContas(usuarioId)
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    contas = contas,
                    nomeNovaConta = "",
                    saldoInicialTexto = "",
                    mensagemSucesso = "Conta criada com sucesso",
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Erro ao criar conta",
                )
            }
        }
    }

    fun removerConta(contaId: String) {
        viewModelScope.launch {
            try {
                contaRepository.removerConta(contaId)
                carregarContas()
                _uiState.value = _uiState.value.copy(mensagemSucesso = "Conta removida")
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = e.message ?: "Erro ao remover conta",
                )
            }
        }
    }

    fun limparMensagem() {
        _uiState.value = _uiState.value.copy(mensagemSucesso = null)
    }
}

