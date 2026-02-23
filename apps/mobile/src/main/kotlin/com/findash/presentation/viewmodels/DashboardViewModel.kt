package com.findash.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.findash.data.local.SessionManager
import com.findash.data.repositories.AutenticacaoRepository
import com.findash.data.repositories.DashboardRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class DashboardUiState(
    val saldoTotal: Double = 0.0,
    val receitaMes: Double = 0.0,
    val despesaMes: Double = 0.0,
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val isLogoutSuccess: Boolean = false,
)

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val dashboardRepository: DashboardRepository,
    private val sessionManager: SessionManager,
    private val autenticacaoRepository: AutenticacaoRepository,
) : ViewModel() {
    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState: StateFlow<DashboardUiState> = _uiState

    init {
        carregarDados()
    }

    fun recarregarDados() {
        carregarDados()
    }

    private fun carregarDados() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            try {
                val usuarioId = sessionManager.obterUsuarioId()
                if (usuarioId.isNullOrBlank()) {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        errorMessage = "Sessão inválida. Faça login novamente.",
                    )
                    return@launch
                }

                val dashboard = dashboardRepository.obterDashboard(usuarioId)
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    saldoTotal = dashboard.saldoTotal,
                    receitaMes = dashboard.receitaMes,
                    despesaMes = dashboard.despesaMes,
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Erro ao carregar dashboard"
                )
            }
        }
    }

    fun sair() {
        viewModelScope.launch {
            try {
                autenticacaoRepository.fazerLogout()
                _uiState.value = _uiState.value.copy(isLogoutSuccess = true)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    errorMessage = e.message ?: "Erro ao sair"
                )
            }
        }
    }
}
