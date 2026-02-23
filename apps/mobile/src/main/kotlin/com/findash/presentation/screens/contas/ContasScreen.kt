package com.findash.presentation.screens.contas

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import com.findash.data.models.ContaResponse
import com.findash.presentation.viewmodels.ContasViewModel

@Composable
fun ContasScreen(
    navController: NavHostController,
    viewModel: ContasViewModel = hiltViewModel(),
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Contas", style = androidx.compose.material3.MaterialTheme.typography.headlineMedium)

        OutlinedTextField(
            value = uiState.nomeNovaConta,
            onValueChange = viewModel::onNomeNovaContaChanged,
            label = { Text("Nome da conta") },
            modifier = Modifier.fillMaxWidth(),
            enabled = !uiState.isLoading,
        )

        OutlinedTextField(
            value = uiState.saldoInicialTexto,
            onValueChange = viewModel::onSaldoInicialChanged,
            label = { Text("Saldo inicial") },
            modifier = Modifier.fillMaxWidth(),
            enabled = !uiState.isLoading,
        )

        Button(
            onClick = viewModel::criarConta,
            enabled = !uiState.isLoading,
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text(if (uiState.isLoading) "Carregando..." else "Criar conta")
        }

        if (!uiState.errorMessage.isNullOrBlank()) {
            Text(uiState.errorMessage!!, color = androidx.compose.material3.MaterialTheme.colorScheme.error)
        }

        if (!uiState.mensagemSucesso.isNullOrBlank()) {
            Text(uiState.mensagemSucesso!!, color = androidx.compose.material3.MaterialTheme.colorScheme.primary)
            LaunchedEffect(uiState.mensagemSucesso) {
                viewModel.limparMensagem()
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            items(uiState.contas) { conta ->
                ContaItem(
                    conta = conta,
                    onRemover = { viewModel.removerConta(conta.id) },
                )
            }
        }

        Button(
            onClick = { navController.popBackStack() },
            modifier = Modifier.fillMaxWidth(),
        ) {
            Text("Voltar")
        }
    }
}

@Composable
private fun ContaItem(
    conta: ContaResponse,
    onRemover: () -> Unit,
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = androidx.compose.material3.MaterialTheme.colorScheme.surface,
        ),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(conta.nome, style = androidx.compose.material3.MaterialTheme.typography.titleMedium)
                Text(
                    "Saldo inicial: R$ ${"%.2f".format(conta.saldoInicial)}",
                    style = androidx.compose.material3.MaterialTheme.typography.bodySmall,
                )
            }
            Button(onClick = onRemover) {
                Text("Remover")
            }
        }
    }
}
