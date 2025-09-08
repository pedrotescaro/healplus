// Heal+ Chatbot Implementation
class HealPlusChatbot {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.sessionId = this.generateSessionId();
        this.apiBaseUrl = 'http://localhost:8080/api';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadChatHistory();
        this.sendWelcomeMessage();
    }

    setupEventListeners() {
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.querySelector('.chat-input .btn');

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            chatInput.addEventListener('input', () => {
                this.adjustTextareaHeight(chatInput);
            });
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }
    }

    generateSessionId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    loadChatHistory() {
        // Load chat history from localStorage
        const savedMessages = localStorage.getItem(`healplus_chat_${this.sessionId}`);
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
            this.renderMessages();
        }
    }

    saveChatHistory() {
        localStorage.setItem(`healplus_chat_${this.sessionId}`, JSON.stringify(this.messages));
    }

    sendWelcomeMessage() {
        if (this.messages.length === 0) {
            this.addBotMessage('Olá! Sou seu assistente virtual Heal+. Como posso ajudá-lo hoje?');
        }
    }

    async sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();

        if (!message || this.isTyping) return;

        // Add user message
        this.addUserMessage(message);
        chatInput.value = '';
        this.adjustTextareaHeight(chatInput);

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Process message
            const response = await this.processMessage(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response
            this.addBotMessage(response.text, response.type, response.actions);
            
        } catch (error) {
            console.error('Error processing message:', error);
            this.hideTypingIndicator();
            this.addBotMessage('Desculpe, ocorreu um erro. Tente novamente em alguns instantes.', 'error');
        }
    }

    async processMessage(message) {
        // Simulate API call to chatbot service
        return new Promise((resolve) => {
            setTimeout(() => {
                const response = this.generateResponse(message);
                resolve(response);
            }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
        });
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Intent detection
        if (lowerMessage.includes('progresso') || lowerMessage.includes('evolução')) {
            return {
                text: 'Seu progresso está excelente! A área da ferida diminuiu de 20cm² para 12.5cm² nas últimas 4 semanas. A análise de IA indica que você está no caminho certo para a cicatrização completa em aproximadamente 45 dias.',
                type: 'success',
                actions: [
                    { text: 'Ver Gráfico Detalhado', action: 'showProgressChart' },
                    { text: 'Próximos Passos', action: 'showNextSteps' }
                ]
            };
        }
        
        if (lowerMessage.includes('consulta') || lowerMessage.includes('agendamento')) {
            return {
                text: 'Sua próxima consulta está agendada para 22 de janeiro às 14:30 com Dr. Maria Santos. É uma consulta presencial na Clínica São Paulo, Sala 205. Deseja confirmar ou reagendar?',
                type: 'info',
                actions: [
                    { text: 'Confirmar Consulta', action: 'confirmAppointment' },
                    { text: 'Reagendar', action: 'rescheduleAppointment' },
                    { text: 'Ver Detalhes', action: 'showAppointmentDetails' }
                ]
            };
        }
        
        if (lowerMessage.includes('medicação') || lowerMessage.includes('medicamento') || lowerMessage.includes('remédio')) {
            return {
                text: 'Você tem 2 medicamentos prescritos:\n\n• Antibiótico: 1 comprimido a cada 8 horas\n• Analgésico: 1 comprimido a cada 6 horas (se necessário)\n\nPróxima dose do antibiótico: em 2 horas (16:00)',
                type: 'info',
                actions: [
                    { text: 'Definir Lembrete', action: 'setMedicationReminder' },
                    { text: 'Registrar Dose', action: 'logMedication' },
                    { text: 'Efeitos Colaterais', action: 'showSideEffects' }
                ]
            };
        }
        
        if (lowerMessage.includes('dor') || lowerMessage.includes('dolorido')) {
            return {
                text: 'Entendo que você está sentindo dor. Em uma escala de 0 a 10, como você classificaria sua dor atual? Isso me ajudará a orientá-lo melhor.',
                type: 'warning',
                actions: [
                    { text: 'Dor Leve (1-3)', action: 'mildPain' },
                    { text: 'Dor Moderada (4-6)', action: 'moderatePain' },
                    { text: 'Dor Intensa (7-10)', action: 'severePain' }
                ]
            };
        }
        
        if (lowerMessage.includes('cuidados') || lowerMessage.includes('curativo') || lowerMessage.includes('limpeza')) {
            return {
                text: 'Para os cuidados com sua ferida, siga estas orientações:\n\n1. Lave as mãos antes de tocar na ferida\n2. Limpe com soro fisiológico\n3. Aplique o curativo conforme orientado\n4. Mantenha a área seca e limpa\n\nAlguma dúvida específica sobre os cuidados?',
                type: 'info',
                actions: [
                    { text: 'Vídeo Tutorial', action: 'showTutorial' },
                    { text: 'Lista de Materiais', action: 'showMaterials' },
                    { text: 'Contato Enfermeiro', action: 'contactNurse' }
                ]
            };
        }
        
        if (lowerMessage.includes('urgência') || lowerMessage.includes('emergência') || lowerMessage.includes('problema')) {
            return {
                text: 'Se você está enfrentando uma situação de urgência, recomendo:\n\n• Se a dor for intensa (8-10): Procure o pronto-socorro\n• Se houver sinais de infecção (vermelhidão, calor, pus): Contate seu médico imediatamente\n• Se houver sangramento excessivo: Aplique pressão e procure ajuda médica\n\nPosso ajudá-lo a avaliar melhor a situação?',
                type: 'error',
                actions: [
                    { text: 'Avaliar Sintomas', action: 'symptomAssessment' },
                    { text: 'Contatar Médico', action: 'contactDoctor' },
                    { text: 'Pronto-Socorro', action: 'emergencyContact' }
                ]
            };
        }
        
        if (lowerMessage.includes('obrigado') || lowerMessage.includes('obrigada') || lowerMessage.includes('valeu')) {
            return {
                text: 'De nada! Estou aqui para ajudá-lo sempre que precisar. Continue seguindo o tratamento e não hesite em me chamar se tiver qualquer dúvida. Desejo uma rápida recuperação! 😊',
                type: 'success'
            };
        }
        
        // Default response
        return {
            text: 'Entendo sua pergunta. Posso ajudá-lo com informações sobre seu progresso, consultas, medicação, cuidados com a ferida ou qualquer outra dúvida relacionada ao seu tratamento. O que gostaria de saber?',
            type: 'info',
            actions: [
                { text: 'Meu Progresso', action: 'showProgress' },
                { text: 'Próxima Consulta', action: 'showAppointment' },
                { text: 'Medicação', action: 'showMedication' },
                { text: 'Cuidados', action: 'showCare' }
            ]
        };
    }

    addUserMessage(message) {
        const messageObj = {
            id: Date.now(),
            type: 'user',
            text: message,
            timestamp: new Date()
        };
        
        this.messages.push(messageObj);
        this.renderMessage(messageObj);
        this.saveChatHistory();
    }

    addBotMessage(text, type = 'info', actions = []) {
        const messageObj = {
            id: Date.now(),
            type: 'bot',
            text: text,
            messageType: type,
            actions: actions,
            timestamp: new Date()
        };
        
        this.messages.push(messageObj);
        this.renderMessage(messageObj);
        this.saveChatHistory();
    }

    renderMessages() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        chatMessages.innerHTML = '';
        this.messages.forEach(message => {
            this.renderMessage(message);
        });
        
        this.scrollToBottom();
    }

    renderMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}-message`;
        
        const avatar = message.type === 'bot' 
            ? '<i class="fas fa-robot"></i>'
            : '<i class="fas fa-user"></i>';
        
        const messageTypeClass = message.messageType ? `message-${message.messageType}` : '';
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                ${avatar}
            </div>
            <div class="message-content ${messageTypeClass}">
                <p>${this.formatMessage(message.text)}</p>
                ${message.actions && message.actions.length > 0 ? this.renderActions(message.actions) : ''}
                <span class="message-time">${this.formatTime(message.timestamp)}</span>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        this.scrollToBottom();
    }

    renderActions(actions) {
        return `
            <div class="message-actions">
                ${actions.map(action => `
                    <button class="action-btn" onclick="handleChatAction('${action.action}')">
                        ${action.text}
                    </button>
                `).join('')}
            </div>
        `;
    }

    formatMessage(text) {
        // Convert line breaks to HTML
        return text.replace(/\n/g, '<br>');
    }

    formatTime(timestamp) {
        const now = new Date();
        const messageTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Agora';
        if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
        return messageTime.toLocaleDateString('pt-BR');
    }

    showTypingIndicator() {
        this.isTyping = true;
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const typingElement = document.createElement('div');
        typingElement.className = 'message bot-message typing-indicator';
        typingElement.id = 'typingIndicator';
        typingElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    clearChat() {
        if (confirm('Tem certeza que deseja limpar o histórico do chat?')) {
            this.messages = [];
            localStorage.removeItem(`healplus_chat_${this.sessionId}`);
            this.sendWelcomeMessage();
        }
    }

    sendQuickMessage(message) {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.value = message;
            this.sendMessage();
        }
    }

    // Action handlers
    handleAction(action) {
        switch (action) {
            case 'showProgressChart':
                this.addBotMessage('Aqui está seu gráfico de progresso detalhado:', 'info');
                // In a real app, this would show a chart or redirect to dashboard
                break;
                
            case 'showNextSteps':
                this.addBotMessage('Próximos passos recomendados:\n\n1. Continue com o tratamento atual\n2. Mantenha a ferida limpa e seca\n3. Compareça à consulta agendada\n4. Monitore sinais de infecção', 'info');
                break;
                
            case 'confirmAppointment':
                this.addBotMessage('Consulta confirmada! Você receberá um lembrete 24h antes do horário agendado.', 'success');
                break;
                
            case 'rescheduleAppointment':
                this.addBotMessage('Para reagendar sua consulta, acesse a seção "Consultas" no menu principal ou entre em contato com a clínica pelo telefone (11) 99999-9999.', 'info');
                break;
                
            case 'showAppointmentDetails':
                this.addBotMessage('Detalhes da consulta:\n\n📅 Data: 22/01/2024\n🕐 Horário: 14:30\n👩‍⚕️ Médico: Dr. Maria Santos\n🏥 Local: Clínica São Paulo - Sala 205\n📞 Telefone: (11) 99999-9999', 'info');
                break;
                
            case 'setMedicationReminder':
                this.addBotMessage('Lembrete de medicação configurado! Você receberá notificações nos horários corretos. Posso ajudá-lo com mais alguma coisa?', 'success');
                break;
                
            case 'logMedication':
                this.addBotMessage('Medicação registrada com sucesso! Próxima dose do antibiótico: 16:00 (em 2 horas).', 'success');
                break;
                
            case 'showSideEffects':
                this.addBotMessage('Efeitos colaterais possíveis:\n\n• Antibiótico: Náusea, diarreia leve\n• Analgésico: Sonolência\n\nSe os efeitos forem intensos ou persistentes, contate seu médico.', 'warning');
                break;
                
            case 'mildPain':
                this.addBotMessage('Dor leve é normal durante o processo de cicatrização. Continue com o tratamento e use o analgésico se necessário. Se a dor piorar, me avise.', 'info');
                break;
                
            case 'moderatePain':
                this.addBotMessage('Dor moderada pode indicar inflamação. Recomendo:\n\n1. Aplicar gelo por 15 minutos\n2. Tomar o analgésico prescrito\n3. Elevar a perna se possível\n\nSe não melhorar em 2 horas, contate seu médico.', 'warning');
                break;
                
            case 'severePain':
                this.addBotMessage('Dor intensa requer atenção médica imediata. Recomendo:\n\n🚨 Procure o pronto-socorro mais próximo\n📞 Ou contate seu médico urgentemente\n\nIsso pode indicar uma complicação que precisa de avaliação médica.', 'error');
                break;
                
            case 'showTutorial':
                this.addBotMessage('Aqui está o vídeo tutorial para cuidados com a ferida: [Link para vídeo]. Siga as instruções passo a passo.', 'info');
                break;
                
            case 'showMaterials':
                this.addBotMessage('Materiais necessários:\n\n• Soro fisiológico\n• Gaze estéril\n• Curativo adesivo\n• Luvas descartáveis\n• Antisséptico (se prescrito)', 'info');
                break;
                
            case 'contactNurse':
                this.addBotMessage('Para contatar a enfermeira:\n\n📞 Telefone: (11) 99999-8888\n📧 Email: enfermagem@clinica.com\n🕐 Horário: 8h às 18h (seg-sex)', 'info');
                break;
                
            case 'symptomAssessment':
                this.addBotMessage('Vamos avaliar seus sintomas. Responda as perguntas:\n\n1. A ferida está mais vermelha que o normal?\n2. Há aumento de dor?\n3. Há secreção com odor?\n4. A área está mais quente?', 'info');
                break;
                
            case 'contactDoctor':
                this.addBotMessage('Para contatar seu médico:\n\n📞 Dr. Maria Santos: (11) 99999-7777\n📧 Email: maria.santos@clinica.com\n🕐 Urgências: 24h', 'info');
                break;
                
            case 'emergencyContact':
                this.addBotMessage('Em caso de emergência:\n\n🚨 SAMU: 192\n🏥 Pronto-Socorro: (11) 99999-0000\n🚑 Ambulância: 193\n\nMantenha a calma e procure ajuda imediatamente.', 'error');
                break;
                
            default:
                this.addBotMessage('Ação não reconhecida. Como posso ajudá-lo?', 'info');
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new HealPlusChatbot();
});

// Global function for handling chat actions
function handleChatAction(action) {
    if (window.chatbot) {
        window.chatbot.handleAction(action);
    }
}

// Add CSS for chatbot styling
const chatbotStyles = `
<style>
.message {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    animation: slideIn 0.3s ease-out;
}

.message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f5f9;
    color: #64748b;
    flex-shrink: 0;
}

.bot-message .message-avatar {
    background: #2563eb;
    color: white;
}

.message-content {
    flex: 1;
    background: #f8fafc;
    padding: 12px 16px;
    border-radius: 18px;
    max-width: 70%;
    position: relative;
}

.user-message .message-content {
    background: #2563eb;
    color: white;
    margin-left: auto;
    max-width: 70%;
}

.message-content p {
    margin: 0 0 8px 0;
    line-height: 1.5;
}

.message-content p:last-child {
    margin-bottom: 0;
}

.message-time {
    font-size: 11px;
    color: #94a3b8;
    margin-top: 4px;
    display: block;
}

.user-message .message-time {
    color: rgba(255, 255, 255, 0.7);
}

.message-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
}

.action-btn {
    background: #e2e8f0;
    border: none;
    padding: 6px 12px;
    border-radius: 16px;
    font-size: 12px;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: #cbd5e1;
    color: #334155;
}

.user-message .action-btn {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

.user-message .action-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.typing-indicator {
    opacity: 0.7;
}

.typing-dots {
    display: flex;
    gap: 4px;
    align-items: center;
}

.typing-dots span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #94a3b8;
    animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
    animation-delay: -0.32s;
}

.typing-dots span:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes typing {
    0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.5;
    }
    40% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message-success {
    border-left: 4px solid #10b981;
}

.message-warning {
    border-left: 4px solid #f59e0b;
}

.message-error {
    border-left: 4px solid #ef4444;
}

.message-info {
    border-left: 4px solid #06b6d4;
}

.quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
}

.quick-btn {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    padding: 8px 12px;
    border-radius: 20px;
    font-size: 12px;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s ease;
}

.quick-btn:hover {
    background: #e2e8f0;
    border-color: #cbd5e1;
}

.chat-input {
    border-top: 1px solid #e2e8f0;
    padding: 16px;
    background: white;
}

.input-group {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}

.input-group input {
    flex: 1;
    border: 1px solid #e2e8f0;
    border-radius: 24px;
    padding: 12px 16px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s ease;
}

.input-group input:focus {
    border-color: #2563eb;
}

.input-group button {
    background: #2563eb;
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.input-group button:hover {
    background: #1d4ed8;
}

.chatbot-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    overflow: hidden;
    height: 600px;
    display: flex;
    flex-direction: column;
}

.chatbot-header {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f8fafc;
}

.bot-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.bot-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #2563eb;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.bot-details h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
}

.bot-status {
    font-size: 12px;
    color: #10b981;
    font-weight: 500;
}

.chat-messages {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background: #f8fafc;
}

.chatbot-features {
    margin-top: 32px;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-top: 24px;
}

.feature-item {
    text-align: center;
    padding: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 4px -1px rgb(0 0 0 / 0.1);
    transition: transform 0.2s ease;
}

.feature-item:hover {
    transform: translateY(-2px);
}

.feature-item i {
    font-size: 32px;
    color: #2563eb;
    margin-bottom: 16px;
}

.feature-item h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
}

.feature-item p {
    margin: 0;
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
}
</style>
`;

// Add styles to document
document.head.insertAdjacentHTML('beforeend', chatbotStyles);
