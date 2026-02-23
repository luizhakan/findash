package com.findash.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class DashboardUiState(
    val saldoTotal: Double = 0.0,
    val receitaMes: Double = 0.0,
    val despesaMes: Double = 0.0,
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

class DashboardViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState: StateFlow<DashboardUiState> = _uiState

    init {
        carregarDados()
    }

    private fun carregarDados() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, errorMessage = null)
            try {
                // TODO: Implementar chamada à API de dashboard
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    saldoTotal = 5000.0,
                    receitaMes = 3000.0,
                    despesaMes = 1500.0
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    errorMessage = e.message ?: "Erro ao carregar dashboard"
                )
            }
        }
    }
}
