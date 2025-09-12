# 🚀 Guia de Endpoints - Heal+ API

## 📋 **API RODANDO COM SUCESSO!**

**URL Base**: `http://localhost:8080`

---

## 🔐 **Endpoints de Autenticação**

### **1. Registro de Usuário**
```
POST /api/auth/register
Content-Type: application/json

{
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@email.com",
    "password": "123456",
    "role": "PATIENT"
}
```

### **2. Login**
```
POST /api/auth/login
Content-Type: application/json

{
    "email": "joao@email.com",
    "password": "123456"
}
```

### **3. Refresh Token**
```
POST /api/auth/refresh
Content-Type: application/json

{
    "refreshToken": "seu_refresh_token_aqui"
}
```

---

## 👤 **Endpoints de Paciente**

### **4. Listar Pacientes**
```
GET /api/patients
Authorization: Bearer {seu_jwt_token}
```

### **5. Buscar Paciente por ID**
```
GET /api/patients/{id}
Authorization: Bearer {seu_jwt_token}
```

### **6. Criar Paciente**
```
POST /api/patients
Authorization: Bearer {seu_jwt_token}
Content-Type: application/json

{
    "name": "Maria Santos",
    "email": "maria@email.com",
    "phone": "11999999999",
    "birthDate": "1990-01-01",
    "address": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
}
```

### **7. Atualizar Paciente**
```
PUT /api/patients/{id}
Authorization: Bearer {seu_jwt_token}
Content-Type: application/json

{
    "name": "Maria Santos Silva",
    "email": "maria.silva@email.com",
    "phone": "11988888888"
}
```

### **8. Deletar Paciente**
```
DELETE /api/patients/{id}
Authorization: Bearer {seu_jwt_token}
```

---

## 🩹 **Endpoints de Avaliação de Feridas**

### **9. Listar Avaliações**
```
GET /api/wound-assessments
Authorization: Bearer {seu_jwt_token}
```

### **10. Criar Avaliação**
```
POST /api/wound-assessments
Authorization: Bearer {seu_jwt_token}
Content-Type: application/json

{
    "patientId": "uuid-do-paciente",
    "woundType": "DIABETIC_ULCER",
    "location": "Pé direito",
    "size": "2.5cm x 1.8cm",
    "depth": "0.5cm",
    "description": "Úlcera diabética no pé direito",
    "severity": "MODERATE",
    "assessmentDate": "2025-09-12T10:00:00Z"
}
```

### **11. Buscar Avaliação por ID**
```
GET /api/wound-assessments/{id}
Authorization: Bearer {seu_jwt_token}
```

### **12. Atualizar Avaliação**
```
PUT /api/wound-assessments/{id}
Authorization: Bearer {seu_jwt_token}
Content-Type: application/json

{
    "woundType": "PRESSURE_ULCER",
    "severity": "SEVERE",
    "description": "Úlcera por pressão - piora observada"
}
```

---

## 📱 **Endpoints de Monitoramento Remoto**

### **13. Listar Check-ins**
```
GET /api/remote-monitoring/checkins
Authorization: Bearer {seu_jwt_token}
```

### **14. Criar Check-in**
```
POST /api/remote-monitoring/checkins
Authorization: Bearer {seu_jwt_token}
Content-Type: application/json

{
    "patientId": "uuid-do-paciente",
    "painLevel": 7,
    "mobilityLevel": 3,
    "woundCondition": "Piorou",
    "medicationAdherence": true,
    "notes": "Dor aumentou durante a noite"
}
```

### **15. Listar Sessões de Teleconsulta**
```
GET /api/remote-monitoring/telehealth-sessions
Authorization: Bearer {seu_jwt_token}
```

### **16. Criar Sessão de Teleconsulta**
```
POST /api/remote-monitoring/telehealth-sessions
Authorization: Bearer {seu_jwt_token}
Content-Type: application/json

{
    "patientId": "uuid-do-paciente",
    "professionalId": "uuid-do-profissional",
    "scheduledDate": "2025-09-15T14:00:00Z",
    "duration": 30,
    "meetingUrl": "https://meet.google.com/abc-defg-hij"
}
```

---

## 🔒 **Endpoints de Segurança e Compliance**

### **17. Verificar Integridade dos Dados**
```
GET /api/security/integrity-check
Authorization: Bearer {seu_jwt_token}
```

### **18. Listar Assinaturas Digitais**
```
GET /api/security/digital-signatures
Authorization: Bearer {seu_jwt_token}
```

### **19. Criar Assinatura Digital**
```
POST /api/security/digital-signatures
Authorization: Bearer {seu_jwt_token}
Content-Type: application/json

{
    "documentId": "uuid-do-documento",
    "signatureData": "dados_da_assinatura",
    "certificate": "certificado_digital"
}
```

---

## 📊 **Endpoints de Relatórios**

### **20. Gerar Relatório de Paciente**
```
GET /api/reports/patient/{patientId}
Authorization: Bearer {seu_jwt_token}
```

### **21. Relatório de Avaliações**
```
GET /api/reports/wound-assessments?startDate=2025-09-01&endDate=2025-09-30
Authorization: Bearer {seu_jwt_token}
```

---

## 🧪 **Como Testar no Postman**

### **Passo 1: Configurar Environment**
1. Crie um novo Environment no Postman
2. Adicione a variável `base_url` = `http://localhost:8080`
3. Adicione a variável `jwt_token` (será preenchida após login)

### **Passo 2: Fluxo de Teste**
1. **Registrar usuário** (endpoint #1)
2. **Fazer login** (endpoint #2) - copie o token retornado
3. **Configurar Authorization** - Bearer Token com o JWT
4. **Testar outros endpoints** conforme necessário

### **Passo 3: Headers Obrigatórios**
```
Content-Type: application/json
Authorization: Bearer {seu_jwt_token}
```

---

## ⚠️ **Observações Importantes**

1. **Autenticação**: A maioria dos endpoints requer JWT token
2. **UUIDs**: Use UUIDs válidos para IDs (ex: `550e8400-e29b-41d4-a716-446655440000`)
3. **Datas**: Use formato ISO 8601 (ex: `2025-09-12T10:00:00Z`)
4. **Rate Limiting**: API tem rate limiting ativo
5. **CORS**: Configurado para permitir requisições do frontend

---

## 🎯 **Endpoints de Teste Rápido**

### **Teste Básico (sem autenticação)**
```
GET http://localhost:8080/
```

### **Teste de Health (se configurado)**
```
GET http://localhost:8080/actuator/health
```

---

## 📝 **Exemplo de Resposta de Sucesso**

```json
{
    "success": true,
    "message": "Operação realizada com sucesso",
    "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "João Silva",
        "email": "joao@email.com"
    },
    "timestamp": "2025-09-12T10:00:00Z"
}
```

---

## 🚨 **Códigos de Status HTTP**

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autorizado (token inválido/expirado)
- **403**: Acesso negado (sem permissão)
- **404**: Recurso não encontrado
- **429**: Rate limit excedido
- **500**: Erro interno do servidor

---

## 🎉 **API PRONTA PARA TESTES!**

A API Heal+ está rodando em `http://localhost:8080` e pronta para ser testada no Postman!
