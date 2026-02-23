package com.findash.workers

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.work.Worker
import androidx.work.WorkerParameters
import com.findash.R

class NotificacaoWorker(
    context: Context,
    params: WorkerParameters
) : Worker(context, params) {

    override fun doWork(): Result {
        return try {
            val titulo = inputData.getString("titulo") ?: "FinDash"
            val descricao = inputData.getString("descricao") ?: "Você tem uma notificação"
            val notificacaoId = inputData.getInt("notificacao_id", 1)

            mostrarNotificacao(titulo, descricao, notificacaoId)

            Result.success()
        } catch (e: Exception) {
            e.printStackTrace()
            Result.retry()
        }
    }

    private fun mostrarNotificacao(titulo: String, descricao: String, id: Int) {
        val context = applicationContext
        val notificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        // Criar canal de notificação (required for Android 8.0+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "FinDash Notificações",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Notificações de eventos financeiros"
            }
            notificationManager.createNotificationChannel(channel)
        }

        // Construir notificação
        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher_foreground) // Substituir com ícone real
            .setContentTitle(titulo)
            .setContentText(descricao)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .build()

        // Mostrar notificação
        notificationManager.notify(id, notification)
    }

    companion object {
        const val CHANNEL_ID = "findash_notifications"
        const val WORK_NAME = "findash_notification_work"
    }
}
