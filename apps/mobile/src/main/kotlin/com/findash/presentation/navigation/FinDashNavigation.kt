package com.findash.presentation.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.findash.presentation.screens.splash.SplashScreen
import com.findash.presentation.screens.login.LoginScreen
import com.findash.presentation.screens.register.RegisterScreen
import com.findash.presentation.screens.dashboard.DashboardScreen

@Composable
fun FinDashNavigation(navController: NavHostController = rememberNavController()) {
    NavHost(
        navController = navController,
        startDestination = NavigationRoute.SplashScreen.route
    ) {
        composable(NavigationRoute.SplashScreen.route) {
            SplashScreen(navController = navController)
        }

        composable(NavigationRoute.LoginScreen.route) {
            LoginScreen(navController = navController)
        }

        composable(NavigationRoute.RegisterScreen.route) {
            RegisterScreen(navController = navController)
        }

        composable(NavigationRoute.DashboardScreen.route) {
            DashboardScreen(navController = navController)
        }
    }
}
