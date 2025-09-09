# Heal+ Frontend - Estrutura Organizada

## 📁 Estrutura de Arquivos

```
frontend/
├── index.html                 # Página principal de entrada
├── html/                      # Páginas HTML organizadas
│   ├── login.html            # Página de login
│   ├── index.html            # Portal do paciente
│   ├── dashboard.html        # Dashboard do clínico
│   ├── profile.html          # Perfil do usuário
│   ├── telehealth.html       # Teleconsultas
│   ├── wound-capture.html    # Captura de feridas
│   ├── remote-monitoring.html # Monitoramento remoto
│   ├── clinician.html        # Portal do clínico
│   ├── chatbot.html          # Assistente de IA
│   └── test.html             # Página de testes
├── css/                       # Estilos CSS organizados
│   ├── modern-design.css     # Estilos principais
│   ├── icons.css             # Ícones
│   ├── animations.css        # Animações
│   ├── forms.css             # Formulários
│   ├── dashboard.css         # Dashboard específico
│   ├── profile.css           # Perfil específico
│   ├── telehealth.css        # Teleconsulta específico
│   ├── wound-capture.css     # Captura específico
│   ├── remote-monitoring.css # Monitoramento específico
│   ├── clinician.css         # Clínico específico
│   ├── chatbot.css           # Chatbot específico
│   ├── header.css            # Cabeçalho
│   ├── design-system.css     # Sistema de design
│   └── styles.css            # Estilos gerais
└── js/                        # JavaScript organizado
    ├── main.js               # Script principal
    ├── button-handler.js     # Gerenciador de botões
    ├── theme-manager.js      # Gerenciador de temas
    ├── app.js                # Aplicação principal
    ├── dashboard.js          # Dashboard específico
    ├── profile.js            # Perfil específico
    ├── telehealth.js         # Teleconsulta específico
    ├── wound-capture.js      # Captura específico
    ├── remote-monitoring.js  # Monitoramento específico
    ├── clinician.js          # Clínico específico
    ├── chatbot.js            # Chatbot específico
    ├── ai-analysis.js        # Análise de IA
    ├── analytics.js          # Analytics
    ├── calendar.js           # Calendário
    └── theme-manager.js      # Gerenciador de temas
```

## 🚀 Funcionalidades Implementadas

### ✅ Sistema de Botões Funcional
- **ButtonHandler**: Classe que gerencia todos os cliques de botões
- **Detecção automática**: Identifica ações baseadas em texto, classes e atributos
- **Fallback inteligente**: Múltiplas formas de executar ações
- **Notificações**: Sistema de notificações integrado

### ✅ Navegação Inteligente
- **Menu mobile**: Toggle automático da sidebar
- **Navegação por roles**: Diferentes interfaces para paciente/clínico
- **Redirecionamento automático**: Baseado no tipo de usuário
- **Links funcionais**: Todos os links de navegação funcionando

### ✅ Sistema de Autenticação
- **Login funcional**: Formulário de login com validação
- **Persistência**: Dados salvos no localStorage
- **Redirecionamento**: Baseado no tipo de usuário
- **Logout**: Funcionalidade de logout com confirmação

### ✅ Gerenciamento de Estado
- **UserData**: Carregamento automático de dados do usuário
- **Theme**: Sistema de temas claro/escuro
- **Notifications**: Sistema de notificações global
- **LocalStorage**: Persistência de dados do usuário

## 🎯 Como Usar

### 1. Acessar o Sistema
```
http://localhost:3000/frontend/
```

### 2. Fazer Login
- **Paciente**: Use qualquer email/senha, selecione "Paciente"
- **Clínico**: Use qualquer email/senha, selecione "Clínico"

### 3. Navegar
- **Paciente**: Portal com dashboard, avaliações, consultas
- **Clínico**: Dashboard com pacientes, relatórios, teleconsultas

## 🔧 Funcionalidades dos Botões

### Botões de Ação
- **Entrar/Login**: Executa login e redireciona
- **Sair/Logout**: Confirma e executa logout
- **Capturar Ferida**: Navega para captura
- **Teleconsulta**: Inicia sessão de vídeo
- **Editar Perfil**: Ativa modo de edição
- **Salvar**: Salva alterações
- **Cancelar**: Cancela operações

### Cards Clicáveis
- **Action Cards**: Executam ações específicas
- **Stat Cards**: Mostram detalhes
- **Navigation Cards**: Navegam para páginas

### Formulários
- **Validação automática**: Campos obrigatórios
- **Submissão**: Dados processados e salvos
- **Feedback**: Notificações de sucesso/erro

## 📱 Responsividade

### Mobile First
- **Sidebar**: Toggle automático em mobile
- **Botões**: Tamanhos adequados para touch
- **Formulários**: Inputs otimizados para mobile
- **Navegação**: Menu hambúrguer funcional

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Sistema de Temas

### Tema Claro
- **Cores**: Tons de azul e branco
- **Contraste**: Alto contraste para acessibilidade
- **Ícones**: Ícones escuros em fundo claro

### Tema Escuro
- **Cores**: Tons escuros com acentos coloridos
- **Contraste**: Mantém legibilidade
- **Ícones**: Ícones claros em fundo escuro

### Toggle
- **Botão**: Disponível no header
- **Persistência**: Salvo no localStorage
- **Aplicação**: Imediata em toda a aplicação

## 🔔 Sistema de Notificações

### Tipos
- **Success**: Verde - Operações bem-sucedidas
- **Error**: Vermelho - Erros e falhas
- **Warning**: Amarelo - Avisos importantes
- **Info**: Azul - Informações gerais

### Características
- **Posição**: Canto superior direito
- **Duração**: 3 segundos automático
- **Animação**: Slide in/out suave
- **Stack**: Múltiplas notificações

## 🧪 Página de Testes

### Funcionalidades Testáveis
- **Notificações**: Teste todos os tipos
- **Temas**: Alternar entre claro/escuro
- **Botões**: Teste de todos os botões
- **Navegação**: Teste de links
- **Formulários**: Validação e submissão

### Acesso
```
http://localhost:3000/frontend/html/test.html
```

## 🐛 Debugging

### Console Logs
- **ButtonHandler**: Logs de cliques e ações
- **Main**: Logs de inicialização
- **Navigation**: Logs de navegação
- **Authentication**: Logs de login/logout

### LocalStorage
- **userEmail**: Email do usuário logado
- **userType**: Tipo de usuário (patient/clinician)
- **theme**: Tema atual (light/dark)

## 📋 Checklist de Funcionalidades

### ✅ Implementado
- [x] Estrutura organizada (HTML/CSS/JS)
- [x] Sistema de botões funcional
- [x] Navegação inteligente
- [x] Autenticação básica
- [x] Sistema de temas
- [x] Notificações
- [x] Responsividade
- [x] Menu mobile
- [x] Formulários funcionais
- [x] Página de testes

### 🔄 Em Desenvolvimento
- [ ] Integração com backend
- [ ] Upload de imagens
- [ ] WebRTC para teleconsultas
- [ ] Gráficos interativos
- [ ] PWA (Progressive Web App)

### 📝 Próximos Passos
- [ ] Testes automatizados
- [ ] Otimização de performance
- [ ] Acessibilidade (WCAG)
- [ ] Internacionalização
- [ ] Documentação de API

## 🚀 Como Executar

### 1. Servidor Local
```bash
# Usando Python
python -m http.server 3000

# Usando Node.js
npx serve -p 3000

# Usando PHP
php -S localhost:3000
```

### 2. Acessar
```
http://localhost:3000/frontend/
```

### 3. Testar
- Fazer login como paciente ou clínico
- Navegar pelas páginas
- Testar botões e funcionalidades
- Alternar temas
- Testar responsividade

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar console do navegador
2. Testar na página de testes
3. Verificar localStorage
4. Consultar este README

---

**Heal+ Frontend** - Sistema de saúde inteligente com interface moderna e funcional.
