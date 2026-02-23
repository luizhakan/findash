package com.findash.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.findash.data.local.SessionManager
import com.findash.data.models.ContaResponse
import com.findash.data.models.TransacaoResponse
import com.findash.data.repositories.ContaRepository
import com.findash.data.repositories.TransacaoRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class TransacoesUiState(
    val transacoes: List<TransacaoResponse> = emptyList(),
    val contas: List<ContaResponse> = emptyList(),
    val contaSelecionadaId: String? = null,
    val descricao: String = "",
    val valorTexto: String = "",
    val tipo: String = "DESPESA",
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val mensagemSucesso: String? = null,
)

@HiltViewModel
class TransacoesViewModel @Inject constructor(
    private val transacaoRepository: TransacaoRepository,
    private val contaRepository: ContaRepository,
    private val sessionManager: SessionManager,
) : ViewModel() {
    private val _uiState = MutableStateFlow(TransacoesUiState())
    val uiState: StateFlow<TransacoesUiState> = _uiState

    init {
        carregarDados()
    }

    fun onDescricaoChanged(valor: String) {
        _uiState.value = _uiState.value.copy(descricao = valor)
    }

    fun onValorChanged(valor: String) {
        _uiState.value = _uiState.value.copy(valorTexto = valor)
    }

    fun onTipoChanged(valor: String) {
        _uiState.value = _uiState.value.copy(tipo = valor)
    }

    fun onContaSelecionada(contaId: String) {
        _uiState.value = _uiState.value.copy(contaSelecionadaId = contaId)
    }

    fun carregarDados() {
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
                val transacoes = transacaoRepository.obterTransacoes(usuarioId)
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    contas = contas,
                    transacoes = transacoes,
                    contaSelecionadaId = _uiState.value.contaSelecionadaId ?: contas.firstOrNull()?.id,
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Erro ao carregar transações",
                )
            }
        }
    }

    fun criarTransacao() {
        viewModelScope.launch {
            val estado = _uiState.value
            val descricao = estado.descricao.trim()
            val valor = estado.valorTexto.replace(',', '.').toDoubleOrNull()

            if (descricao.isBlank()) {
                _uiState.value = estado.copy(errorMessage = "Informe uma descrição")
                return@launch
            }
            if (valor == null || valor <= 0.0) {
                _uiState.value = estado.copy(errorMessage = "Informe um valor válido")
                return@launch
            }
            if (estado.contaSelecionadaId.isNullOrBlank()) {
                _uiState.value = estado.copy(errorMessage = "Crie uma conta antes de lançar transações")
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

                transacaoRepository.criarTransacao(
                    usuarioId = usuarioId,
                    contaId = estado.contaSelecionadaId,
                    descricao = descricao,
                    valor = valor,
                    tipo = estado.tipo,
                )

                val transacoes = transacaoRepository.obterTransacoes(usuarioId)
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    transacoes = transacoes,
                    descricao = "",
                    valorTexto = "",
                    mensagemSucesso = "Transação criada com sucesso",
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Erro ao criar transação",
                )
            }
        }
    }

    fun removerTransacao(transacaoId: String) {
        viewModelScope.launch {
            try {
                val usuarioId = sessionManager.obterUsuarioId()
                if (usuarioId.isNullOrBlank()) {
                    _uiState.value = _uiState.value.copy(
                        errorMessage = "Sessão inválida. Faça login novamente."
                    )
                    return@launch
                }
                transacaoRepository.removerTransacao(transacaoId)
                val transacoes = transacaoRepository.obterTransacoes(usuarioId)
                _uiState.value = _uiState.value.copy(
                    transacoes = transacoes,
                    mensagemSucesso = "Transação removida",
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = e.message ?: "Erro ao remover transação",
                )
            }
        }
    }

    fun limparMensagem() {
        _uiState.value = _uiState.value.copy(mensagemSucesso = null)
    }
}

