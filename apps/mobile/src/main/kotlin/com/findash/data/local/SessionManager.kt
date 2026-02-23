package com.findash.data.local

import android.content.Context
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.emptyPreferences
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import java.io.IOException
import javax.inject.Inject
import javax.inject.Singleton

private val Context.sessionDataStore by preferencesDataStore(name = "findash_session")

@Singleton
class SessionManager @Inject constructor(
    @ApplicationContext private val context: Context,
) {
    suspend fun salvarSessao(
        token: String,
        usuarioId: String,
        nome: String,
        email: String,
    ) {
        context.sessionDataStore.edit { preferences ->
            preferences[TOKEN] = token
            preferences[USUARIO_ID] = usuarioId
            preferences[NOME] = nome
            preferences[EMAIL] = email
        }
    }

    suspend fun limparSessao() {
        context.sessionDataStore.edit { preferences ->
            preferences.clear()
        }
    }

    suspend fun obterUsuarioId(): String? = context.sessionDataStore.data
        .catch { exception ->
            if (exception is IOException) {
                emit(emptyPreferences())
            } else {
                throw exception
            }
        }
        .map { preferences -> preferences[USUARIO_ID] }
        .first()

    fun observarUsuarioId(): Flow<String?> = context.sessionDataStore.data
        .catch { exception ->
            if (exception is IOException) {
                emit(emptyPreferences())
            } else {
                throw exception
            }
        }
        .map { preferences -> preferences[USUARIO_ID] }

    companion object {
        private val TOKEN = stringPreferencesKey("token")
        private val USUARIO_ID = stringPreferencesKey("usuario_id")
        private val NOME = stringPreferencesKey("nome")
        private val EMAIL = stringPreferencesKey("email")
    }
}

