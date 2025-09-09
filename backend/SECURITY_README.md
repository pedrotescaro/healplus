# Sistema de Segurança Avançado - HealPlus

## Visão Geral

Este documento descreve o sistema de segurança avançado implementado no projeto HealPlus, seguindo o padrão MVP (Model-View-Presenter) e incluindo recursos robustos de segurança.

## Estrutura de Packages

### Security Package (`com.healplus.backend.security`)

```
security/
├── annotation/          # Anotações de segurança
│   ├── RequireRole.java
│   └── RateLimited.java
├── config/             # Configurações de segurança
│   ├── AdvancedSecurityConfig.java
│   └── SecurityWebConfig.java
├── exception/          # Exceções de segurança
│   ├── SecurityException.java
│   ├── InvalidTokenException.java
│   ├── AccessDeniedException.java
│   └── GlobalSecurityExceptionHandler.java
├── filter/             # Filtros de segurança
│   ├── SecurityAuditFilter.java
│   ├── RateLimitFilter.java
│   └── SecurityAnnotationInterceptor.java
└── service/            # Serviços de segurança
    ├── SecurityService.java
    ├── RateLimitService.java
    ├── AuditService.java
    └── JwtAuthenticationFilter.java
```

### MVP Package (`com.healplus.backend.mvp`)

```
mvp/
├── model/              # Modelos MVP (reutiliza os existentes)
├── view/               # Interfaces de View
│   ├── View.java
│   ├── PatientView.java
│   ├── WoundAssessmentView.java
│   └── PatientControllerView.java
└── presenter/          # Presenters
    ├── Presenter.java
    ├── BasePresenter.java
    ├── PatientPresenter.java
    └── WoundAssessmentPresenter.java
```

## Recursos de Segurança

### 1. Autenticação e Autorização

- **JWT Authentication**: Tokens seguros com validação robusta
- **Role-based Access Control**: Controle de acesso baseado em roles
- **Method-level Security**: Segurança em nível de método com anotações

### 2. Rate Limiting

- **Anotação @RateLimited**: Controle de taxa de requisições
- **Configuração flexível**: Diferentes limites por endpoint
- **Cache em memória**: Armazenamento eficiente de contadores

### 3. Auditoria

- **Log de eventos**: Registro de todas as operações sensíveis
- **Rastreamento de acesso**: Monitoramento de recursos acessados
- **Detecção de anomalias**: Identificação de comportamentos suspeitos

### 4. Filtros de Segurança

- **SecurityAuditFilter**: Auditoria automática de requisições
- **RateLimitFilter**: Controle de taxa global
- **SecurityAnnotationInterceptor**: Processamento de anotações

## Padrão MVP

### Arquitetura

```
Controller (View) → Presenter → Service → Repository → Model
```

### Benefícios

1. **Separação de responsabilidades**: Lógica de negócio isolada
2. **Testabilidade**: Fácil criação de testes unitários
3. **Manutenibilidade**: Código mais organizado e legível
4. **Reutilização**: Presenters podem ser reutilizados em diferentes views

### Exemplo de Uso

```java
@RestController
@RequestMapping("/api/mvp/patients")
@RequireRole({"CLINICIAN", "ADMIN"})
@RateLimited(requests = 200, windowMinutes = 60)
public class MvpPatientController {
    
    @Autowired
    private PatientPresenter patientPresenter;
    
    @GetMapping
    public ResponseEntity<?> getAllPatients() {
        PatientControllerView view = new PatientControllerView();
        patientPresenter.attachView(view);
        patientPresenter.loadPatients();
        return view.getResponse();
    }
}
```

## Configuração de Segurança

### Headers de Segurança

- **HSTS**: HTTP Strict Transport Security
- **Content Type Options**: Prevenção de MIME sniffing
- **Frame Options**: Prevenção de clickjacking
- **Referrer Policy**: Controle de informações de referência

### CORS

- **Configuração flexível**: Suporte a múltiplas origens
- **Credenciais**: Suporte a cookies e autenticação
- **Métodos permitidos**: GET, POST, PUT, DELETE, OPTIONS

## Monitoramento e Logs

### Eventos Auditados

- **Autenticação**: Login/logout, falhas de autenticação
- **Autorização**: Tentativas de acesso negado
- **Operações sensíveis**: Criação, edição, exclusão de dados
- **Recursos**: Acesso a endpoints protegidos

### Estrutura de Logs

```json
{
  "userId": "user-id",
  "action": "CREATE_PATIENT",
  "resource": "PATIENT",
  "details": "Patient created: uuid",
  "timestamp": "2024-01-15T10:30:00"
}
```

## Endpoints de Segurança

### Públicos
- `/api/auth/**` - Autenticação
- `/api/public/**` - Recursos públicos
- `/actuator/health` - Health check

### Protegidos por Role
- `/api/patients/**` - PATIENT, CLINICIAN, ADMIN
- `/api/assessments/**` - PATIENT, CLINICIAN, ADMIN
- `/api/appointments/**` - PATIENT, CLINICIAN, ADMIN
- `/api/telehealth/**` - PATIENT, CLINICIAN, ADMIN
- `/api/remote-monitoring/**` - CLINICIAN, ADMIN
- `/api/admin/**` - ADMIN

## Rate Limiting

### Configurações Padrão

- **Global**: 100 requests/hora
- **Autenticação**: 50 requests/hora
- **Operações sensíveis**: 20 requests/hora
- **IA Analysis**: 50 requests/hora

### Configuração Customizada

```java
@RateLimited(requests = 200, windowMinutes = 60)
public ResponseEntity<?> customEndpoint() {
    // Implementação
}
```

## Tratamento de Exceções

### Exceções de Segurança

- **SecurityException**: Erro geral de segurança
- **InvalidTokenException**: Token JWT inválido
- **AccessDeniedException**: Acesso negado

### Resposta Padrão

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 403,
  "error": "Access Denied",
  "message": "Você não tem permissão para acessar este recurso",
  "path": "/api/patients"
}
```

## Melhores Práticas

### Desenvolvimento

1. **Sempre use anotações de segurança** em endpoints sensíveis
2. **Implemente auditoria** para operações críticas
3. **Configure rate limiting** apropriado para cada endpoint
4. **Use o padrão MVP** para melhor organização

### Segurança

1. **Valide todas as entradas** do usuário
2. **Use HTTPS** em produção
3. **Monitore logs** regularmente
4. **Atualize dependências** de segurança

### Performance

1. **Configure cache** para operações frequentes
2. **Otimize queries** de banco de dados
3. **Use paginação** para listas grandes
4. **Monitore métricas** de performance

## Troubleshooting

### Problemas Comuns

1. **Token inválido**: Verificar expiração e assinatura
2. **Rate limit exceeded**: Aumentar limites ou otimizar requisições
3. **Access denied**: Verificar roles do usuário
4. **Audit logs**: Verificar configuração de logging

### Logs de Debug

```properties
logging.level.com.healplus.backend.security=DEBUG
logging.level.org.springframework.security=DEBUG
```

## Conclusão

O sistema de segurança implementado fornece uma base sólida para aplicações médicas, com foco em:

- **Segurança robusta** com múltiplas camadas de proteção
- **Auditoria completa** para compliance médico
- **Arquitetura limpa** com padrão MVP
- **Monitoramento proativo** de ameaças
- **Configuração flexível** para diferentes ambientes

Para mais informações, consulte a documentação específica de cada componente.
