// Profile and Settings Management
class ProfileManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentFontSize = localStorage.getItem('fontSize') || 'medium';
        this.currentLanguage = localStorage.getItem('language') || 'pt-BR';
        
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupThemeToggle();
        this.setupFontSizeToggle();
        this.setupLanguageSelect();
        this.setupPasswordToggle();
        this.setupFormHandlers();
        this.applySettings();
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked button and corresponding panel
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    setupThemeToggle() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const highContrastToggle = document.getElementById('high-contrast-toggle');

        if (darkModeToggle) {
            darkModeToggle.checked = this.currentTheme === 'dark';
            darkModeToggle.addEventListener('change', (e) => {
                this.currentTheme = e.target.checked ? 'dark' : 'light';
                this.applyTheme();
                localStorage.setItem('theme', this.currentTheme);
            });
        }

        if (highContrastToggle) {
            highContrastToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.currentTheme = 'high-contrast';
                } else {
                    this.currentTheme = darkModeToggle.checked ? 'dark' : 'light';
                }
                this.applyTheme();
                localStorage.setItem('theme', this.currentTheme);
            });
        }
    }

    setupFontSizeToggle() {
        const fontSizeButtons = document.querySelectorAll('.font-size-btn');
        
        fontSizeButtons.forEach(button => {
            const size = button.getAttribute('data-size');
            if (size === this.currentFontSize) {
                button.classList.add('active');
            }

            button.addEventListener('click', () => {
                fontSizeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                this.currentFontSize = size;
                this.applyFontSize();
                localStorage.setItem('fontSize', this.currentFontSize);
            });
        });
    }

    setupLanguageSelect() {
        const languageSelect = document.getElementById('language-select');
        
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                this.applyLanguage();
                localStorage.setItem('language', this.currentLanguage);
            });
        }
    }

    setupPasswordToggle() {
        const passwordToggles = document.querySelectorAll('.password-toggle');
        
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const icon = toggle.querySelector('.icon');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('icon-eye');
                    icon.classList.add('icon-eye-off');
                } else {
                    input.type = 'password';
                    icon.classList.remove('icon-eye-off');
                    icon.classList.add('icon-eye');
                }
            });
        });
    }

    setupFormHandlers() {
        // Personal Information Form
        const personalForm = document.querySelector('#personal .profile-form');
        if (personalForm) {
            personalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePersonalInfo(personalForm);
            });
        }

        // Professional Information Form
        const professionalForm = document.querySelector('#professional .profile-form');
        if (professionalForm) {
            professionalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfessionalInfo(professionalForm);
            });
        }

        // Security Form
        const securityForm = document.querySelector('.security-form');
        if (securityForm) {
            securityForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.changePassword(securityForm);
            });
        }

        // Notification Settings
        this.setupNotificationSettings();
    }

    setupNotificationSettings() {
        const emailNotifications = document.getElementById('email-notifications');
        const pushNotifications = document.getElementById('push-notifications');
        const appointmentReminders = document.getElementById('appointment-reminders');

        // Load saved settings
        emailNotifications.checked = localStorage.getItem('emailNotifications') !== 'false';
        pushNotifications.checked = localStorage.getItem('pushNotifications') !== 'false';
        appointmentReminders.checked = localStorage.getItem('appointmentReminders') !== 'false';

        // Save settings on change
        emailNotifications.addEventListener('change', (e) => {
            localStorage.setItem('emailNotifications', e.target.checked);
        });

        pushNotifications.addEventListener('change', (e) => {
            localStorage.setItem('pushNotifications', e.target.checked);
            if (e.target.checked) {
                this.requestNotificationPermission();
            }
        });

        appointmentReminders.addEventListener('change', (e) => {
            localStorage.setItem('appointmentReminders', e.target.checked);
        });
    }

    applySettings() {
        this.applyTheme();
        this.applyFontSize();
        this.applyLanguage();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update toggle states
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const highContrastToggle = document.getElementById('high-contrast-toggle');
        
        if (darkModeToggle) {
            darkModeToggle.checked = this.currentTheme === 'dark';
        }
        
        if (highContrastToggle) {
            highContrastToggle.checked = this.currentTheme === 'high-contrast';
        }
    }

    applyFontSize() {
        document.documentElement.setAttribute('data-font-size', this.currentFontSize);
    }

    applyLanguage() {
        document.documentElement.lang = this.currentLanguage;
        // Here you would typically load language files and update all text
        this.updateLanguageText();
    }

    updateLanguageText() {
        const translations = {
            'pt-BR': {
                'dashboard': 'Dashboard',
                'clinical-portal': 'Portal Clínico',
                'capture': 'Captura',
                'monitoring': 'Monitoramento',
                'personal-data': 'Dados Pessoais',
                'professional-data': 'Dados Profissionais',
                'settings': 'Configurações',
                'security': 'Segurança'
            },
            'en-US': {
                'dashboard': 'Dashboard',
                'clinical-portal': 'Clinical Portal',
                'capture': 'Capture',
                'monitoring': 'Monitoring',
                'personal-data': 'Personal Data',
                'professional-data': 'Professional Data',
                'settings': 'Settings',
                'security': 'Security'
            },
            'es-ES': {
                'dashboard': 'Panel',
                'clinical-portal': 'Portal Clínico',
                'capture': 'Captura',
                'monitoring': 'Monitoreo',
                'personal-data': 'Datos Personales',
                'professional-data': 'Datos Profesionales',
                'settings': 'Configuración',
                'security': 'Seguridad'
            }
        };

        const currentTranslations = translations[this.currentLanguage] || translations['pt-BR'];
        
        // Update navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const text = link.textContent.trim();
            const key = Object.keys(currentTranslations).find(k => 
                translations['pt-BR'][k] === text
            );
            if (key) {
                link.textContent = currentTranslations[key];
            }
        });
    }

    async savePersonalInfo(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            // Simulate API call
            await this.simulateApiCall();
            this.showNotification('Informações pessoais salvas com sucesso!', 'success');
        } catch (error) {
            this.showNotification('Erro ao salvar informações pessoais', 'error');
        }
    }

    async saveProfessionalInfo(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            // Simulate API call
            await this.simulateApiCall();
            this.showNotification('Informações profissionais salvas com sucesso!', 'success');
        } catch (error) {
            this.showNotification('Erro ao salvar informações profissionais', 'error');
        }
    }

    async changePassword(form) {
        const formData = new FormData(form);
        const currentPassword = formData.get('current-password');
        const newPassword = formData.get('new-password');
        const confirmPassword = formData.get('confirm-password');

        // Validation
        if (newPassword !== confirmPassword) {
            this.showNotification('As senhas não coincidem', 'error');
            return;
        }

        if (newPassword.length < 8) {
            this.showNotification('A senha deve ter pelo menos 8 caracteres', 'error');
            return;
        }

        try {
            // Simulate API call
            await this.simulateApiCall();
            this.showNotification('Senha alterada com sucesso!', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Erro ao alterar senha', 'error');
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.showNotification('Notificações ativadas com sucesso!', 'success');
            } else {
                this.showNotification('Permissão para notificações negada', 'warning');
            }
        }
    }

    simulateApiCall() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('API Error'));
                }
            }, 1000);
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="icon icon-${type}"></span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">
                    <span class="icon icon-close"></span>
                </button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
}

// Notification Styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        max-width: 400px;
        background: var(--white);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        border-left: 4px solid var(--info-color);
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left-color: var(--success-color);
    }

    .notification-error {
        border-left-color: var(--error-color);
    }

    .notification-warning {
        border-left-color: var(--warning-color);
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4);
    }

    .notification-message {
        flex: 1;
        font-size: var(--font-size-sm);
        color: var(--gray-900);
    }

    .notification-close {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--gray-500);
        padding: var(--space-1);
    }

    .notification-close:hover {
        color: var(--gray-700);
    }

    .notification .icon {
        width: 1.25rem;
        height: 1.25rem;
    }

    .notification-success .icon {
        color: var(--success-color);
    }

    .notification-error .icon {
        color: var(--error-color);
    }

    .notification-warning .icon {
        color: var(--warning-color);
    }

    .notification-info .icon {
        color: var(--info-color);
    }
`;

// Add notification styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialize Profile Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});

// Export for use in other modules
window.ProfileManager = ProfileManager;
