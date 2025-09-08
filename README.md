# Heal+ - Sistema de Gestão de Feridas com IA

## Visão Geral

O Heal+ é um sistema completo de gestão de feridas baseado no framework clínico TIMERS (Tissue, Infection/Inflammation, Moisture, Wound Edge, Repair/Regeneration, Social), integrado com Inteligência Artificial para análise de imagens, predições de cicatrização e suporte à decisão clínica.

## Arquitetura do Sistema

### Backend (Spring Boot)

#### Modelos de Dados
- **User**: Gerenciamento de usuários com conformidade LGPD
- **Patient**: Dados do paciente incluindo fatores sociais (TIMERS 'S')
- **Clinician**: Informações do profissional de saúde
- **WoundAssessment**: Avaliações baseadas no framework TIMERS
- **WoundImage**: Imagens de feridas para análise por IA
- **AIAnalysis**: Resultados de análises de IA
- **Appointment**: Sistema de agendamento
- **TelehealthSession**: Sessões de telessaúde
- **ChatSession/ChatMessage**: Assistente conversacional de IA

#### Serviços de IA
- **AIService**: Orquestração principal de análises de IA
- **ImageProcessingService**: Processamento de imagens e segmentação
- **MachineLearningService**: Modelos preditivos e recomendações

#### Segurança e Conformidade
- **JWT Authentication**: Autenticação segura
- **LGPD Compliance**: Conformidade com a Lei Geral de Proteção de Dados
- **ANVISA Compliance**: Preparação para regulamentação de SaMD
- **Email Service**: Notificações e verificação de email

### Frontend

#### Portal do Paciente
- Dashboard com progresso de cicatrização
- Agendamento de consultas
- Acesso ao histórico médico
- Interação com assistente de IA

#### Portal do Clínico
- Visualização de pacientes
- Análises de IA com explicações (XAI)
- Sistema de alertas e notificações
- Analytics e relatórios

#### Módulo de Telessaúde
- Consultas por vídeo
- Compartilhamento de análises de IA
- Chat integrado
- Gravação de sessões

#### Assistente de IA Conversacional
- Suporte 24/7
- Triagem de sintomas
- Lembretes de medicação
- Educação em saúde

## Framework TIMERS

O sistema implementa o framework TIMERS para avaliação holística de feridas:

- **T - Tissue**: Análise de tecidos por IA (granulação, esfacelo, necrose)
- **I - Infection**: Detecção de sinais de infecção
- **M - Moisture**: Avaliação do equilíbrio de umidade
- **E - Edge**: Análise das bordas da ferida
- **R - Repair**: Recomendações de tratamento
- **S - Social**: Fatores sociais do paciente

## Tecnologias Utilizadas

### Backend
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- MySQL
- JWT
- Lombok
- Apache Commons Lang3
- Jackson
- Caffeine Cache
- Spring Mail

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Responsive Design

### IA e Machine Learning
- Segmentação de imagens (U-Net)
- Classificação de tecidos (CNNs)
- Análise preditiva
- IA Explicável (XAI - Grad-CAM, LIME)
- GANs para aumento de dados

## Funcionalidades Principais

### 1. Análise de Feridas por IA
- Segmentação automática de feridas
- Classificação de tipos de tecido
- Medição precisa de área e perímetro
- Detecção de sinais de infecção
- Predição de trajetória de cicatrização

### 2. Telessaúde Integrada
- Consultas por vídeo
- Análise pré-consulta por IA
- Compartilhamento de resultados
- Documentação automática

### 3. Gestão de Pacientes
- Portal personalizado
- Acompanhamento de progresso
- Lembretes automáticos
- Educação em saúde

### 4. Suporte à Decisão Clínica
- Recomendações baseadas em evidências
- Alertas de risco
- Explicabilidade das decisões de IA
- Integração com PEPs (HL7 FHIR)

### 5. Conformidade Regulatória
- LGPD (Lei Geral de Proteção de Dados)
- ANVISA (Software as Medical Device)
- Auditoria e rastreabilidade
- Gestão de consentimento

## Instalação e Configuração

### Pré-requisitos
- Java 17+
- MySQL 8.0+
- Node.js (para desenvolvimento frontend)

### Backend
1. Clone o repositório
2. Configure o banco de dados MySQL
3. Atualize as configurações em `application.properties`
4. Execute: `./gradlew bootRun`

### Frontend
1. Navegue para a pasta `frontend`
2. Abra os arquivos HTML em um navegador
3. Configure a URL da API no JavaScript

### Configurações Importantes

#### Email (application.properties)
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
```

#### JWT
```properties
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000
app.jwt.refresh-expiration=604800000
```

## Uso do Sistema

### Para Pacientes
1. Registre-se no portal
2. Complete o questionário de fatores sociais
3. Agende consultas
4. Use o assistente de IA para dúvidas
5. Acompanhe seu progresso

### Para Clínicos
1. Acesse o portal do clínico
2. Visualize pacientes e alertas
3. Realize avaliações TIMERS
4. Analise resultados de IA
5. Agende teleconsultas

## Conformidade e Segurança

### LGPD
- Consentimento granular
- Direito ao esquecimento
- Portabilidade de dados
- Auditoria de acesso

### ANVISA
- Classificação como SaMD Classe II/III
- Documentação técnica
- Validação clínica
- Rastreabilidade

### Segurança
- Criptografia end-to-end
- Autenticação multifator
- Controle de acesso baseado em função
- Auditoria de segurança

## Roadmap

### Fase 1 (Atual)
- ✅ Implementação do framework TIMERS
- ✅ Serviços de IA básicos
- ✅ Portais de paciente e clínico
- ✅ Sistema de autenticação

### Fase 2
- [ ] Integração com PEPs (HL7 FHIR)
- [ ] Modelos de IA avançados
- [ ] Aplicativo móvel
- [ ] Integração com dispositivos IoT

### Fase 3
- [ ] IA generativa para relatórios
- [ ] Análise preditiva avançada
- [ ] Integração com laboratórios
- [ ] Marketplace de especialistas

## Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

Para mais informações sobre o Heal+, entre em contato:

- Email: contato@healplus.com
- Website: https://healplus.com
- Documentação: https://docs.healplus.com

## Agradecimentos

- Framework TIMERS para estruturação clínica
- Comunidade Spring Boot
- Pesquisadores em IA médica
- Profissionais de saúde que contribuíram com feedback
