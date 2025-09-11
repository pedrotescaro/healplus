// Main JavaScript - Inicializa todas as funcionalidades do Heal+
// NOTA: Verificações de autenticação foram comentadas para funcionar com Live Server
// Para produção, descomente as verificações de login necessárias
class HealPlusMain {
    constructor() {
        this.init();
    }

    init() {
        this.initializeApp();
        this.setupGlobalEventListeners();
        this.loadUserData();
        this.initializeComponents();
    }

    initializeApp() {
        // Verificar se estamos na página de login
        if (window.location.pathname.includes('login.html')) {
            this.initializeLogin();
        } else {
            this.initializeDashboard();
        }
        
        // Verificar se é acesso como visitante
        this.checkGuestAccess();
    }

    initializeLogin() {
        console.log('Initializing login page');
        
        // COMENTADO PARA FUNCIONAR COM LIVE SERVER - Verificar se já está logado
        // const userEmail = localStorage.getItem('userEmail');
        // if (userEmail) {
        //     const userType = localStorage.getItem('userType') || 'patient';
        //     if (userType === 'clinician') {
        //         window.location.href = 'professional-dashboard.html';
        //     } else {
        //         window.location.href = 'patient-dashboard.html';
        //     }
        // }

        // Configurar formulário de login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Configurar seleção de tipo de usuário
        document.querySelectorAll('input[name="userType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.updateUserTypeUI(e.target.value);
            });
        });
    }

    initializeDashboard() {
        console.log('Initializing dashboard');
        
        // COMENTADO PARA FUNCIONAR COM LIVE SERVER - Verificar autenticação
        // const userEmail = localStorage.getItem('userEmail');
        // if (!userEmail) {
        //     window.location.href = 'login.html';
        //     return;
        // }

        // Carregar dados do usuário
        this.loadUserProfile();
        
        // Inicializar componentes específicos da página
        this.initializePageComponents();
    }

    setupGlobalEventListeners() {
        // Fechar modais com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Fechar sidebar ao clicar fora (mobile)
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            
            if (window.innerWidth <= 1024 && 
                sidebar && 
                !sidebar.contains(e.target) && 
                mobileToggle &&
                !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });

        // Redimensionamento da janela
        window.addEventListener('resize', () => {
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth > 1024 && sidebar) {
                sidebar.classList.remove('open');
            }
        });
    }

    loadUserData() {
        const userEmail = localStorage.getItem('userEmail');
        const userType = localStorage.getItem('userType') || 'patient';
        
        // COMENTADO PARA FUNCIONAR COM LIVE SERVER - Verificação de email
        // if (userEmail) {
            // Atualizar elementos da interface com dados do usuário
            document.querySelectorAll('.user-email').forEach(element => {
                element.textContent = userEmail || 'usuario@exemplo.com';
            });
            
            document.querySelectorAll('.user-type').forEach(element => {
                element.textContent = userType === 'clinician' ? 'Clínico' : 'Paciente';
            });
        // }
    }

    loadUserProfile() {
        const userEmail = localStorage.getItem('userEmail');
        const userType = localStorage.getItem('userType') || 'patient';
        
        // Simular carregamento de perfil
        const profileData = {
            name: userType === 'clinician' ? 'Dr. Maria Santos' : 'João Silva',
            email: userEmail || 'usuario@exemplo.com',
            role: userType,
            avatar: userType === 'clinician' ? 'MS' : 'JS'
        };

        // Atualizar elementos do perfil
        document.querySelectorAll('.user-name').forEach(element => {
            element.textContent = profileData.name;
        });

        document.querySelectorAll('.user-avatar').forEach(element => {
            element.textContent = profileData.avatar;
        });
    }

    initializeComponents() {
        // Inicializar tema
        this.initializeTheme();
        
        // Inicializar notificações
        this.initializeNotifications();
        
        // Inicializar componentes específicos da página
        this.initializePageSpecificComponents();
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    initializeNotifications() {
        // Sistema de notificações já está no ButtonHandler
        console.log('Notifications system initialized');
    }

    initializePageComponents() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'dashboard':
                this.initializeDashboardComponents();
                break;
            case 'profile':
                this.initializeProfileComponents();
                break;
            case 'telehealth':
                this.initializeTelehealthComponents();
                break;
            case 'wound-capture':
                this.initializeWoundCaptureComponents();
                break;
            case 'remote-monitoring':
                this.initializeRemoteMonitoringComponents();
                break;
            case 'clinician':
                this.initializeClinicianComponents();
                break;
        }
    }

    initializePageSpecificComponents() {
        // Componentes que podem estar em qualquer página
        this.initializeCharts();
        this.initializeTables();
        this.initializeForms();
    }

    initializeDashboardComponents() {
        console.log('Initializing dashboard components');
        
        // Carregar dados do dashboard
        this.loadDashboardData();
        
        // Inicializar gráficos
        this.initializeCharts();
    }

    initializeProfileComponents() {
        console.log('Initializing profile components');
        
        // Configurar botões de edição
        const editBtn = document.querySelector('.edit-profile-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                this.toggleProfileEdit();
            });
        }
    }

    initializeTelehealthComponents() {
        console.log('Initializing telehealth components');
        
        // Configurar botões de teleconsulta
        document.querySelectorAll('.start-session-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.startTelehealthSession();
            });
        });
    }

    initializeWoundCaptureComponents() {
        console.log('Initializing wound capture components');
        
        // Configurar câmera
        const captureBtn = document.getElementById('captureBtn');
        if (captureBtn) {
            captureBtn.addEventListener('click', () => {
                this.captureWoundImage();
            });
        }
    }

    initializeRemoteMonitoringComponents() {
        console.log('Initializing remote monitoring components');
        
        // Configurar check-in diário
        const checkinBtn = document.getElementById('checkinBtn');
        if (checkinBtn) {
            checkinBtn.addEventListener('click', () => {
                this.submitDailyCheckin();
            });
        }
    }

    initializeClinicianComponents() {
        console.log('Initializing clinician components');
        
        // Carregar lista de pacientes
        this.loadPatientsList();
    }

    initializeCharts() {
        // Inicializar gráficos se Chart.js estiver disponível
        if (typeof Chart !== 'undefined') {
            this.createCharts();
        }
    }

    initializeTables() {
        // Configurar tabelas interativas
        document.querySelectorAll('.data-table tbody tr').forEach(row => {
            row.addEventListener('click', () => {
                this.handleTableRowClick(row);
            });
        });
    }

    initializeForms() {
        // Configurar validação de formulários
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });
    }

    // Métodos de ação
    handleLogin() {
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        const userType = document.querySelector('input[name="userType"]:checked')?.value;

        if (!email || !password) {
            this.showNotification('Por favor, preencha todos os campos', 'error');
            return;
        }

        this.showNotification('Fazendo login...', 'info');
        
        // Simular login
        setTimeout(() => {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userType', userType || 'patient');
            this.showNotification('Login realizado com sucesso!', 'success');
            
            // Redirecionar baseado no tipo de usuário
            if (userType === 'clinician') {
                window.location.href = 'professional-dashboard.html';
            } else {
                window.location.href = 'patient-dashboard.html';
            }
        }, 1000);
    }

    updateUserTypeUI(userType) {
        const loginCard = document.querySelector('.login-card');
        if (loginCard) {
            loginCard.setAttribute('data-user-type', userType);
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        this.showNotification(`Tema alterado para ${newTheme === 'light' ? 'claro' : 'escuro'}`, 'info');
    }

    toggleProfileEdit() {
        const inputs = document.querySelectorAll('.profile-input');
        const editBtn = document.querySelector('.edit-profile-btn');
        const saveBtn = document.querySelector('.save-profile-btn');
        const cancelBtn = document.querySelector('.cancel-profile-btn');

        const isEditing = inputs[0]?.disabled === false;
        
        inputs.forEach(input => {
            input.disabled = isEditing;
        });

        if (editBtn) editBtn.style.display = isEditing ? 'inline-block' : 'none';
        if (saveBtn) saveBtn.style.display = isEditing ? 'none' : 'inline-block';
        if (cancelBtn) cancelBtn.style.display = isEditing ? 'none' : 'inline-block';
    }

    startTelehealthSession() {
        this.showNotification('Iniciando sessão de teleconsulta...', 'info');
        // Implementar lógica de teleconsulta
    }

    captureWoundImage() {
        this.showNotification('Capturando imagem da ferida...', 'info');
        // Implementar lógica de captura
    }

    submitDailyCheckin() {
        this.showNotification('Check-in diário enviado!', 'success');
        // Implementar lógica de check-in
    }

    loadPatientsList() {
        // Simular carregamento de pacientes
        console.log('Loading patients list...');
    }

    loadDashboardData() {
        // Simular carregamento de dados do dashboard
        console.log('Loading dashboard data...');
    }

    createCharts() {
        // Criar gráficos se necessário
        console.log('Creating charts...');
    }

    handleTableRowClick(row) {
        console.log('Table row clicked:', row);
        // Implementar ação de clique na linha
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        if (!isValid) {
            this.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
        }

        return isValid;
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('dashboard.html')) return 'dashboard';
        if (path.includes('profile.html')) return 'profile';
        if (path.includes('telehealth.html')) return 'telehealth';
        if (path.includes('wound-capture.html')) return 'wound-capture';
        if (path.includes('remote-monitoring.html')) return 'remote-monitoring';
        if (path.includes('clinician.html')) return 'clinician';
        if (path.includes('login.html')) return 'login';
        return 'index';
    }

    showNotification(message, type = 'info') {
        // Usar o sistema de notificações do ButtonHandler se disponível
        if (window.buttonHandler && window.buttonHandler.showNotification) {
            window.buttonHandler.showNotification(message, type);
        } else {
            // Fallback simples
            alert(message);
        }
    }

    checkGuestAccess() {
        // Não mostrar banner na página de login
        if (window.location.pathname.includes('login.html')) {
            return;
        }
        
        const isGuest = localStorage.getItem('isGuest') === 'true';
        const guestAccess = localStorage.getItem('guestAccess');
        
        if (isGuest && guestAccess) {
            // Aguardar o DOM estar pronto
            setTimeout(() => {
                this.showGuestBanner(guestAccess);
                this.limitGuestFeatures();
            }, 100);
        }
    }

    showGuestBanner(accessType) {
        // Verificar se o banner já existe
        if (document.querySelector('.guest-banner')) {
            return;
        }

        // Criar banner de visitante
        const banner = document.createElement('div');
        banner.className = 'guest-banner';
        banner.innerHTML = `
            <div class="guest-banner-content">
                <div class="guest-banner-info">
                    <i class="fas fa-user-circle"></i>
                    <span>Acesso como Visitante (${accessType === 'patient' ? 'Paciente' : accessType === 'clinician' ? 'Profissional' : 'Demonstração'})</span>
                </div>
                <div class="guest-banner-actions">
                    <button class="guest-login-btn">Fazer Login</button>
                    <button class="guest-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Adicionar estilos apenas uma vez
        if (!document.querySelector('#guest-banner-styles')) {
            const style = document.createElement('style');
            style.id = 'guest-banner-styles';
            style.textContent = `
                .guest-banner {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                    border-bottom: 1px solid #f59e0b;
                    z-index: 1000;
                    padding: 0.75rem 1rem;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .guest-banner-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .guest-banner-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #92400e;
                    font-weight: 500;
                }
                .guest-banner-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .guest-login-btn {
                    background: #f59e0b;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 0.375rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .guest-login-btn:hover {
                    background: #d97706;
                }
                .guest-close-btn {
                    background: none;
                    border: none;
                    color: #92400e;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 0.25rem;
                    transition: background-color 0.2s;
                }
                .guest-close-btn:hover {
                    background: rgba(146, 64, 14, 0.1);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.insertBefore(banner, document.body.firstChild);
        
        // Ajustar padding do body para o banner
        document.body.style.paddingTop = '60px';
        
        // Adicionar event listeners
        const self = this;
        banner.querySelector('.guest-login-btn').addEventListener('click', () => {
            window.location.href = 'login.html';
        });
        
        banner.querySelector('.guest-close-btn').addEventListener('click', () => {
            self.hideGuestBanner();
        });
    }

    hideGuestBanner() {
        const banner = document.querySelector('.guest-banner');
        if (banner) {
            banner.remove();
            document.body.style.paddingTop = '0';
            // Limpar o status de visitante quando fechar o banner
            localStorage.removeItem('isGuest');
            localStorage.removeItem('guestAccess');
        }
    }

    limitGuestFeatures() {
        // Limitar funcionalidades para visitantes
        console.log('Limiting features for guest access');
        
        // Exemplo: desabilitar botões de ação específicos
        const actionButtons = document.querySelectorAll('.action-btn, .save-btn, .delete-btn');
        actionButtons.forEach(btn => {
            btn.disabled = true;
            btn.title = 'Login necessário para esta ação';
            btn.style.opacity = '0.5';
        });
    }
}

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
    window.healPlusMain = new HealPlusMain();
});

// Inicializar imediatamente se o DOM já estiver pronto
if (document.readyState !== 'loading') {
    window.healPlusMain = new HealPlusMain();
}
