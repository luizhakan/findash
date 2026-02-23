package com.findash.data.models

data class LoginRequest(
    val email: String,
    val senha: String,
)

data class RegistroRequest(
    val nome: String,
    val email: String,
    val senha: String,
)

data class SessaoResponse(
    val token: String,
    val usuarioId: String,
    val nome: String,
    val email: String,
)

data class DashboardResumoResponse(
    val totalReceitasMes: Double,
    val totalDespesasMes: Double,
    val saldoTotalContasVisiveis: Double,
)

data class ApiErrorResponse(
    val message: Any? = null,
)

