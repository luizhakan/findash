package com.findash.presentation.screens.transacoes

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
import com.findash.data.models.TransacaoResponse
import com.findash.presentation.viewmodels.TransacoesViewModel

@Composable
fun TransacoesScreen(
    navController: NavHostController,
    viewModel: TransacoesViewModel = hiltViewModel(),
) {
    val uiState by viewModel.uiState.collectAsState()
    val contaSelecionada = uiState.contas.firstOrNull { it.id == uiState.contaSelecionadaId }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        Text("Transações", style = androidx.compose.material3.MaterialTheme.typography.headlineMedium)

        if (uiState.contas.isEmpty()) {
            Text(
                "Crie uma conta antes de lançar transações.",
                color = androidx.compose.material3.MaterialTheme.colorScheme.error,
            )
        } else {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(
                    onClick = { viewModel.onTipoChanged("DESPESA") },
                    enabled = uiState.tipo != "DESPESA",
                ) {
                    Text("Despesa")
                }
                Button(
                    onClick = { viewModel.onTipoChanged("RECEITA") },
                    enabled = uiState.tipo != "RECEITA",
                ) {
                    Text("Receita")
                }
            }

            Text(
                text = "Conta: ${contaSelecionada?.nome ?: "Nenhuma"}",
                style = androidx.compose.material3.MaterialTheme.typography.bodySmall,
            )

            uiState.contas.drop(1).takeIf { it.isNotEmpty() }?.let { outrasContas ->
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    outrasContas.take(3).forEach { conta ->
                        Button(
                            onClick = { viewModel.onContaSelecionada(conta.id) },
                            enabled = conta.id != uiState.contaSelecionadaId,
                        ) {
                            Text(conta.nome)
                        }
                    }
                }
            }

            OutlinedTextField(
                value = uiState.descricao,
                onValueChange = viewModel::onDescricaoChanged,
                label = { Text("Descrição") },
                modifier = Modifier.fillMaxWidth(),
                enabled = !uiState.isLoading,
            )

            OutlinedTextField(
                value = uiState.valorTexto,
                onValueChange = viewModel::onValorChanged,
                label = { Text("Valor") },
                modifier = Modifier.fillMaxWidth(),
                enabled = !uiState.isLoading,
            )

            Button(
                onClick = viewModel::criarTransacao,
                enabled = !uiState.isLoading,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text(if (uiState.isLoading) "Carregando..." else "Adicionar transação")
            }
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
            items(uiState.transacoes) { transacao ->
                TransacaoItem(
                    transacao = transacao,
                    onRemover = { viewModel.removerTransacao(transacao.id) },
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
private fun TransacaoItem(
    transacao: TransacaoResponse,
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
                Text(transacao.descricao, style = androidx.compose.material3.MaterialTheme.typography.titleSmall)
                Text(
                    "${transacao.tipo} - R$ ${"%.2f".format(transacao.valor)}",
                    style = androidx.compose.material3.MaterialTheme.typography.bodySmall,
                )
            }
            Button(onClick = onRemover) {
                Text("Remover")
            }
        }
    }
}
