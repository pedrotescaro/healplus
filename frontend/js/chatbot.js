// Heal+ Chatbot Functionality
class ChatbotManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Message input
        const messageInput = document.querySelector('input[placeholder*="mensagem"]');
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Send button
        const sendButton = document.querySelector('.btn[onclick*="sendMessage"]');
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }
    }

    sendMessage() {
        const messageInput = document.querySelector('input[placeholder*="mensagem"]');
        if (!messageInput) return;

        const message = messageInput.value.trim();
        if (!message) return;

        console.log('Sending message:', message);
        messageInput.value = '';
        
        // Show notification
        if (window.healPlusApp) {
            window.healPlusApp.showNotification('Mensagem enviada!', 'success');
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.chat-messages') || document.querySelector('.conversations-list')) {
        window.chatbot = new ChatbotManager();
    }
});

// Global functions
function sendMessage() {
    if (window.chatbot) {
        window.chatbot.sendMessage();
    }
}

function clearChat() {
    console.log('Clearing chat');
}

function suggestResponse() {
    console.log('Suggesting response');
}

function escalateToHuman() {
    console.log('Escalating to human');
}