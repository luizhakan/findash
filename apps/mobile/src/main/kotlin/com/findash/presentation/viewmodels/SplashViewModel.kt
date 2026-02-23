package com.findash.presentation.viewmodels

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.findash.data.repositories.AutenticacaoRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

data class SplashUiState(
    val carregando: Boolean = true,
    val autenticado: Boolean = false,
)

@HiltViewModel
class SplashViewModel @Inject constructor(
    private val autenticacaoRepository: AutenticacaoRepository,
) : ViewModel() {
    private val _uiState = MutableStateFlow(SplashUiState())
    val uiState: StateFlow<SplashUiState> = _uiState

    init {
        verificarSessao()
    }

    private fun verificarSessao() {
        viewModelScope.launch {
            delay(900)
            val autenticado = autenticacaoRepository.verificarAutenticacao()
            _uiState.value = SplashUiState(
                carregando = false,
                autenticado = autenticado,
            )
        }
    }
}

