package com.findash.di

import com.findash.BuildConfig
import com.findash.data.remote.FinDashApiService
import com.findash.data.repositories.AutenticacaoRepository
import com.findash.data.repositories.AutenticacaoRepositoryImpl
import com.findash.data.repositories.DashboardRepository
import com.findash.data.repositories.DashboardRepositoryImpl
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
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
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
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
}

