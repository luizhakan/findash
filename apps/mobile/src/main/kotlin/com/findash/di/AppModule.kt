package com.findash.di

import com.findash.BuildConfig
import com.findash.data.remote.FinDashApiService
import com.findash.data.remote.StringOrNumberToDoubleAdapter
import com.findash.data.repositories.AutenticacaoRepository
import com.findash.data.repositories.AutenticacaoRepositoryImpl
import com.findash.data.repositories.BiometriaRepositoryImpl
import com.findash.data.repositories.BiometriaRepository
import com.findash.data.repositories.ContaRepositoryImpl
import com.findash.data.repositories.ContaRepository
import com.findash.data.repositories.DashboardRepository
import com.findash.data.repositories.DashboardRepositoryImpl
import com.findash.data.repositories.NotificacaoRepository
import com.findash.data.repositories.NotificacaoRepositoryImpl
import com.findash.data.repositories.TransacaoRepository
import com.findash.data.repositories.TransacaoRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    @Singleton
    fun provideHttpLoggingInterceptor(): HttpLoggingInterceptor {
        val level = if (BuildConfig.DEBUG) {
            HttpLoggingInterceptor.Level.BODY
        } else {
            HttpLoggingInterceptor.Level.BASIC
        }
        return HttpLoggingInterceptor().apply { this.level = level }
    }

    @Provides
    @Singleton
    fun provideOkHttpClient(
        loggingInterceptor: HttpLoggingInterceptor,
    ): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(20, TimeUnit.SECONDS)
            .readTimeout(20, TimeUnit.SECONDS)
            .writeTimeout(20, TimeUnit.SECONDS)
            .addInterceptor(loggingInterceptor)
            .build()
    }

    @Provides
    @Singleton
    fun provideGson(): Gson {
        return GsonBuilder()
            .registerTypeAdapter(Double::class.java, StringOrNumberToDoubleAdapter())
            .registerTypeAdapter(java.lang.Double::class.java, StringOrNumberToDoubleAdapter())
            .create()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient, gson: Gson): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create(gson))
            .build()
    }

    @Provides
    @Singleton
    fun provideFinDashApiService(retrofit: Retrofit): FinDashApiService {
        return retrofit.create(FinDashApiService::class.java)
    }

    @Provides
    @Singleton
    fun provideAutenticacaoRepository(
        repositoryImpl: AutenticacaoRepositoryImpl,
    ): AutenticacaoRepository {
        return repositoryImpl
    }

    @Provides
    @Singleton
    fun provideDashboardRepository(
        repositoryImpl: DashboardRepositoryImpl,
    ): DashboardRepository {
        return repositoryImpl
    }

    @Provides
    @Singleton
    fun provideContaRepository(
        repositoryImpl: ContaRepositoryImpl,
    ): ContaRepository {
        return repositoryImpl
    }

    @Provides
    @Singleton
    fun provideTransacaoRepository(
        repositoryImpl: TransacaoRepositoryImpl,
    ): TransacaoRepository {
        return repositoryImpl
    }

    @Provides
    @Singleton
    fun provideBiometriaRepository(
        repositoryImpl: BiometriaRepositoryImpl,
    ): BiometriaRepository {
        return repositoryImpl
    }

    @Provides
    @Singleton
    fun provideNotificacaoRepository(
        repositoryImpl: NotificacaoRepositoryImpl,
    ): NotificacaoRepository {
        return repositoryImpl
    }
}
