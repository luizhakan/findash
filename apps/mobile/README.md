# FinDash Mobile - Kotlin + Jetpack Compose

Aplicação mobile Android nativa desenvolvida em **Kotlin** com **Jetpack Compose** para gerenciamento financeiro pessoal.

## 📋 Stack Tecnológico

- **Linguagem:** Kotlin
- **UI Framework:** Jetpack Compose
- **Arquitetura:** MVVM (Model-View-ViewModel)
- **Injeção de Dependência:** Dagger Hilt
- **Networking:** Retrofit + OkHttp
- **Banco Local:** Room
- **State Management:** Coroutines + StateFlow
- **Imagens:** Coil
- **Autenticação:** Biometria (SDK 23+)

## 🎯 Funcionalidades (US-013/014)

### MVP - Dashboard Inicial

- ✅ Splash Screen
- ✅ Tela de Login
- ✅ Dashboard com saldo total
- ✅ Visualização de Receita/Despesa do mês
- ⬜ Integração com API NestJS

### Funcionalidades Futuras

- Tela de Transações (criar, editar, excluir)
- Tela de Contas
- Tela de Cartões de Crédito
- Importação de CSV
- Autenticação com Biometria
- Notificações Push

## 📁 Estrutura de Pastas

```
src/main/
├── kotlin/com/findash/
│   ├── FinDashApplication.kt          # App class com Hilt
│   ├── MainActivity.kt                 # Atividade principal
│   ├── data/
│   │   ├── models/
│   │   │   └── Responses.kt           # DTOs da API
│   │   ├── repositories/
│   │   │   └── Repositories.kt        # Interfaces de repositórios
│   │   ├── remote/                    # Retrofit clients (TODO)
│   │   └── local/                     # Room DAOs (TODO)
│   ├── domain/
│   │   ├── usecases/                  # Lógica de negócio (TODO)
│   │   └── repositories/              # Interfaces de contrato
│   └── presentation/
│       ├── navigation/
│       │   ├── NavigationRoute.kt     # Rotas do app
│       │   └── FinDashNavigation.kt   # NavHost
│       ├── screens/
│       │   ├── splash/
│       │   ├── login/
│       │   └── dashboard/
│       ├── viewmodels/
│       │   ├── LoginViewModel.kt
│       │   └── DashboardViewModel.kt
│       ├── components/                # Widgets reutilizáveis (TODO)
│       └── theme/
│           ├── Theme.kt
│           └── Typography.kt
├── AndroidManifest.xml
└── res/                               # Resources (strings, colors, etc)
```

## 🚀 Como Executar

### Pré-requisitos

- Android Studio Hedgehog +
- Android SDK 24+
- Kotlin 1.9.0+

### Setup

1. Abrir o projeto em Android Studio
2. Sincronizar Gradle: `File > Sync Now`
3. Conectar um dispositivo ou emulador Android
4. Executar: `Run > Run 'mobile'`

## 🔗 Integração com API

A aplicação se conecta com o backend NestJS rodando em:

- **Base URL:** `http://localhost:3000` (ajustar conforme environment)

### Próximas Etapas

- [ ] Criar Retrofit ApiService
- [ ] Implementar repositórios com injeção de Hilt
- [ ] Conectar ViewModels aos repositórios
- [ ] Adicionar testes unitários
- [ ] Implementar login real com biometria

## 📝 Boas Práticas

Seguir as [boas práticas do projeto](../../docs/boas_praticas.md):

- Separação clara de camadas (Data, Domain, Presentation)
- Nomes em Português para domínio, Inglês para padrões
- ViewModel para toda lógica de UI
- Coroutines para operações assíncronas
- StateFlow para reatividade

## 📄 Licença

Proprietary - FinDash 2025
