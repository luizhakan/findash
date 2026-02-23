# Próximas Etapas - Mobile MVP (US-013/014)

## Status Atual

✅ **Estrutura MVVM completa**
- Arquitetura de pastas criada (data/domain/presentation)
- Telas iniciais: Splash, Login, Dashboard
- ViewModels com StateFlow
- Tema Material Design 3
- Navegação com Compose Navigation

🟡 **Próximos passos imediatos:**

## 1. Implementar Retrofit ApiService

```kotlin
// src/main/kotlin/com/findash/data/remote/ApiService.kt
@Serializable
data class LoginRequest(val email: String, val senha: String)

@Serializable
data class LoginResponse(val token: String, val usuarioId: String)

interface ApiService {
    @POST("/autenticacao/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse
    
    @GET("/dashboard/resumo-mensal")
    suspend fun obterDashboard(
        @Header("Authorization") token: String
    ): DashboardResponse
}
```

## 2. Implementar Repositórios Concretos

```kotlin
// src/main/kotlin/com/findash/data/repositories/AutenticacaoRepositoryImpl.kt
@Inject
class AutenticacaoRepositoryImpl(
    private val apiService: ApiService,
    private val dataStore: DataStore<Preferences>
) : AutenticacaoRepository {
    override suspend fun fazerLogin(email: String, senha: String): String {
        val response = apiService.login(LoginRequest(email, senha))
        // Salvar token em DataStore
        return response.token
    }
}
```

## 3. Conectar ViewModels aos Repositórios

```kotlin
// Adicionar ao LoginViewModel
@Inject
constructor(
    private val autenticacaoRepository: AutenticacaoRepository
)

fun login() {
    viewModelScope.launch {
        try {
            val token = autenticacaoRepository.fazerLogin(
                _uiState.value.email,
                _uiState.value.senha
            )
            _uiState.value = _uiState.value.copy(isLoginSuccess = true)
        } catch (e: Exception) {
            _uiState.value = _uiState.value.copy(
                errorMessage = e.message
            )
        }
    }
}
```

## 4. Adicionar Módulo Hilt para Injeção

```kotlin
// src/main/kotlin/com/findash/di/NetworkModule.kt
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideApiService(): ApiService {
        return Retrofit.Builder()
            .baseUrl("http://localhost:3000/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {
    
    @Provides
    @Singleton
    fun provideAutenticacaoRepository(
        apiService: ApiService
    ): AutenticacaoRepository {
        return AutenticacaoRepositoryImpl(apiService)
    }
}
```

## 5. Testes Unitários

```kotlin
// src/test/kotlin/com/findash/LoginViewModelTest.kt
@RunWith(RobolectricTestRunner::class)
class LoginViewModelTest {
    
    @Rule
    val instantExecutorRule = InstantTaskExecutorRule()
    
    private lateinit var viewModel: LoginViewModel
    private val testDispatcher = StandardTestDispatcher()
    
    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        viewModel = LoginViewModel(/* mock repository */)
    }
    
    @Test
    fun testLoginSuccess() = runTest {
        // Arrange
        // Act
        // Assert
    }
}
```

## 6. Environment Configuration

Criar arquivo para gerenciar URLs conforme ambiente:

```kotlin
// src/main/kotlin/com/findash/config/AppConfig.kt
object AppConfig {
    val API_BASE_URL = when (BuildConfig.FLAVOR) {
        "development" -> "http://localhost:3000/"
        "staging" -> "https://staging-api.findash.com/"
        "production" -> "https://api.findash.com/"
        else -> "http://localhost:3000/"
    }
}
```

## Checklist de Conclusão US-013/014

- [ ] Implementar LoginRepositoryImpl
- [ ] Conectar ApiService ao Retrofit
- [ ] Integrar DataStore para persistência de token
- [ ] Adicionar módulos Hilt (Network, Repository, Database)
- [ ] Testes unitários dos ViewModels
- [ ] Testes de integração com mock de API
- [ ] Implementar TransacoesScreen e ContasScreen
- [ ] Validação de token expirado e logout
- [ ] Build release sem erros
- [ ] APK gerado com sucesso

## Recursos

- [Documentação Jetpack Compose](https://developer.android.com/codelabs/jetpack-compose-intro)
- [Documentação Hilt](https://dagger.dev/hilt/)
- [Documentação Room Database](https://developer.android.com/training/data-storage/room)
- [Retrofit Documentation](https://square.github.io/retrofit/)

