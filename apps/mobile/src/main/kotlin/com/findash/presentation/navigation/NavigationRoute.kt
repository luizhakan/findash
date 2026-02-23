package com.findash.presentation.navigation

sealed class NavigationRoute(val route: String) {
    data object SplashScreen : NavigationRoute("splash")
    data object LoginScreen : NavigationRoute("login")
    data object RegisterScreen : NavigationRoute("register")
    data object DashboardScreen : NavigationRoute("dashboard")
    data object TransacoesScreen : NavigationRoute("transacoes")
    data object ContasScreen : NavigationRoute("contas")
    data object CategoriasScreen : NavigationRoute("categorias")
    data object CartoesCreditoScreen : NavigationRoute("cartoes_credito")
    data object ImportarCsvScreen : NavigationRoute("importar_csv")
    data object PerfilScreen : NavigationRoute("perfil")
}
