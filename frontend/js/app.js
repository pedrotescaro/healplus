// Heal+ Modern Application - Updated for New Design
class HealPlusApp {
    constructor() {
        this.currentUser = null;
        this.apiBaseUrl = 'http://localhost:8080/api';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.initializeComponents();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                const sidebar = document.getElementById('sidebar');
                if (sidebar) {
                    sidebar.classList.toggle('open');
                }
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (event) => {
            const sidebar = document.getElementById('sidebar');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            
            if (window.innerWidth <= 1024 && 
                sidebar && 
                !sidebar.contains(event.target) && 
                !mobileToggle.contains(event.target)) {
                sidebar.classList.remove('open');
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const sidebar = document.getElementById('sidebar');
            if (window.innerWidth > 1024 && sidebar) {
                sidebar.classList.remove('open');
            }
        });

        // Logout functionality
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }

        // Navigation links
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    this.handleNavigation(href.substring(1));
                } else if (href && !href.startsWith('#')) {
                    // External link
                    window.location.href = href;
                }
            });
        });

        // Action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', () => {
                const onclick = card.getAttribute('onclick');
                if (onclick) {
                    eval(onclick);
                }
            });
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(e.target);
        });

        // Button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn') || e.target.closest('.btn')) {
                const button = e.target.matches('.btn') ? e.target : e.target.closest('.btn');
                this.handleButtonClick(button);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    handleNavigation(section) {
        console.log('Navigating to:', section);
        // Handle internal navigation
        switch (section) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'assessments':
                this.loadAssessmentsData();
                break;
            case 'appointments':
                this.loadAppointmentsData();
                break;
            case 'telehealth':
                this.loadTelehealthData();
                break;
            case 'chatbot':
                this.initializeChatbot();
                break;
        }
    }

    handleFormSubmission(form) {
        const formId = form.id;
        console.log('Form submitted:', formId);
        
        switch (formId) {
            case 'profileForm':
                this.submitProfile(form);
                break;
            case 'appointmentForm':
                this.submitAppointment(form);
                break;
            default:
                this.showNotification('Formulário enviado com sucesso!', 'success');
        }
    }

    handleButtonClick(button) {
        const buttonText = button.textContent.trim();
        const buttonClass = button.className;
        
        console.log('Button clicked:', buttonText, buttonClass);
        
        // Handle specific button actions
        if (buttonText.includes('Salvar')) {
            this.showNotification('Dados salvos com sucesso!', 'success');
        } else if (buttonText.includes('Excluir')) {
            this.handleDeleteAction(button);
        } else if (buttonText.includes('Entrar')) {
            this.handleJoinAction(button);
        } else if (buttonText.includes('Capturar')) {
            this.handleCaptureAction(button);
        }
    }

    handleDeleteAction(button) {
        if (confirm('Tem certeza que deseja excluir? Esta ação não pode ser desfeita.')) {
            this.showNotification('Item excluído com sucesso!', 'success');
        }
    }

    handleJoinAction(button) {
        this.showNotification('Entrando na sessão...', 'info');
        // Simulate joining session
        setTimeout(() => {
            this.showNotification('Conectado com sucesso!', 'success');
        }, 2000);
    }

    handleCaptureAction(button) {
        this.showNotification('Iniciando captura...', 'info');
        // Simulate capture process
        setTimeout(() => {
            this.showNotification('Captura realizada com sucesso!', 'success');
        }, 3000);
    }

    async loadUserData() {
        try {
            // Simulate API call
            this.currentUser = {
                id: 1,
                name: 'João Silva',
                email: 'joao.silva@email.com',
                role: 'patient',
                avatar: 'JS'
            };

            // Update UI elements
            const userNameElements = document.querySelectorAll('.user-name');
            userNameElements.forEach(element => {
                element.textContent = this.currentUser.name;
            });

            const userEmailElements = document.querySelectorAll('.user-email');
            userEmailElements.forEach(element => {
                element.textContent = this.currentUser.email;
            });

            const userAvatarElements = document.querySelectorAll('.user-avatar');
            userAvatarElements.forEach(element => {
                element.textContent = this.currentUser.avatar;
            });

        } catch (error) {
            console.error('Error loading user data:', error);
            this.showNotification('Erro ao carregar dados do usuário', 'error');
        }
    }

    initializeComponents() {
        this.initializeCharts();
        this.initializeProgressBars();
        this.initializeTooltips();
    }

    initializeCharts() {
        // Initialize any charts on the page
        const chartElements = document.querySelectorAll('[data-chart]');
        chartElements.forEach(element => {
            this.createSimpleChart(element);
        });
    }

    createSimpleChart(element) {
        const chartType = element.getAttribute('data-chart');
        const data = element.getAttribute('data-data');
        
        if (chartType === 'progress') {
            const progressBar = element.querySelector('.progress-fill');
            if (progressBar && data) {
                progressBar.style.width = data + '%';
            }
        }
    }

    initializeProgressBars() {
        // Animate progress bars
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width || bar.getAttribute('data-width') || '0%';
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 500);
        });
    }

    initializeTooltips() {
        // Add tooltip functionality
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.getAttribute('data-tooltip'));
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
        
        setTimeout(() => tooltip.classList.add('show'), 10);
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Data loading methods
    async loadDashboardData() {
        try {
            this.showLoading();
            
            // Simulate API calls
            const stats = await this.fetchDashboardStats();
            this.updateDashboardStats(stats);
            
            this.hideLoading();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showNotification('Erro ao carregar dados do dashboard', 'error');
            this.hideLoading();
        }
    }

    async loadAssessmentsData() {
        try {
            this.showLoading();
            
            const assessments = await this.fetchAssessments();
            this.updateAssessmentsList(assessments);
            
            this.hideLoading();
        } catch (error) {
            console.error('Error loading assessments data:', error);
            this.showNotification('Erro ao carregar avaliações', 'error');
            this.hideLoading();
        }
    }

    async loadAppointmentsData() {
        try {
            this.showLoading();
            
            const appointments = await this.fetchAppointments();
            this.updateAppointmentsList(appointments);
            
            this.hideLoading();
        } catch (error) {
            console.error('Error loading appointments data:', error);
            this.showNotification('Erro ao carregar consultas', 'error');
            this.hideLoading();
        }
    }

    async loadTelehealthData() {
        try {
            this.showLoading();
            
            const sessions = await this.fetchTelehealthSessions();
            this.updateTelehealthSessions(sessions);
            
            this.hideLoading();
        } catch (error) {
            console.error('Error loading telehealth data:', error);
            this.showNotification('Erro ao carregar dados de telessaúde', 'error');
            this.hideLoading();
        }
    }

    initializeChatbot() {
        console.log('Initializing chatbot...');
        this.showNotification('Chatbot inicializado', 'info');
    }

    // API simulation methods
    async fetchDashboardStats() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    activeWounds: 1,
                    progress: 75,
                    nextAppointment: 15,
                    infectionRisk: 'low'
                });
            }, 1000);
        });
    }

    async fetchAssessments() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        location: 'Pé Direito',
                        date: '2024-01-15',
                        area: 12.5,
                        tissue: '75% Granulação',
                        risk: 'low',
                        aiAnalysis: 'Melhorando'
                    }
                ]);
            }, 800);
        });
    }

    async fetchAppointments() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        date: '2024-01-22',
                        time: '14:30',
                        type: 'Presencial',
                        doctor: 'Dr. Maria Santos',
                        specialty: 'Dermatologia',
                        status: 'confirmed'
                    }
                ]);
            }, 600);
        });
    }

    async fetchTelehealthSessions() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    active: [],
                    upcoming: [],
                    recent: []
                });
            }, 500);
        });
    }

    // UI update methods
    updateDashboardStats(stats) {
        console.log('Updating dashboard stats:', stats);
        // Update stats cards if they exist
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards.length > 0) {
            // Update stat values
            const statValues = document.querySelectorAll('.stat-value');
            if (statValues[0]) statValues[0].textContent = stats.activeWounds;
            if (statValues[1]) statValues[1].textContent = stats.progress + '%';
            if (statValues[2]) statValues[2].textContent = stats.nextAppointment;
        }
    }

    updateAssessmentsList(assessments) {
        console.log('Updating assessments list:', assessments);
        // Update assessments table if it exists
        const tableBody = document.querySelector('.table tbody');
        if (tableBody && assessments.length > 0) {
            tableBody.innerHTML = assessments.map(assessment => `
                <tr>
                    <td>${assessment.location}</td>
                    <td><span class="badge badge-gray">${assessment.tissue}</span></td>
                    <td>${this.formatDate(assessment.date)}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary">
                            <span class="icon icon-eye"></span>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
    }

    updateAppointmentsList(appointments) {
        console.log('Updating appointments list:', appointments);
        // Update appointments list if it exists
    }

    updateTelehealthSessions(sessions) {
        console.log('Updating telehealth sessions:', sessions);
        // Update telehealth sessions if they exist
    }

    // Form submission methods
    async submitProfile(form) {
        try {
            this.showLoading();
            
            const formData = new FormData(form);
            const profileData = Object.fromEntries(formData.entries());
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Perfil atualizado com sucesso!', 'success');
            this.hideLoading();
        } catch (error) {
            console.error('Error updating profile:', error);
            this.showNotification('Erro ao atualizar perfil', 'error');
            this.hideLoading();
        }
    }

    async submitAppointment(form) {
        try {
            this.showLoading();
            
            const formData = new FormData(form);
            const appointmentData = Object.fromEntries(formData.entries());
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Consulta agendada com sucesso!', 'success');
            this.hideLoading();
        } catch (error) {
            console.error('Error submitting appointment:', error);
            this.showNotification('Erro ao agendar consulta', 'error');
            this.hideLoading();
        }
    }

    // Utility methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    showLoading() {
        // Create loading overlay if it doesn't exist
        let loadingOverlay = document.getElementById('loadingOverlay');
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loadingOverlay';
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>Carregando...</p>
                </div>
            `;
            document.body.appendChild(loadingOverlay);
        }
        loadingOverlay.classList.add('active');
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
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
                <span class="icon icon-${this.getNotificationIcon(type)}"></span>
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

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check',
            error: 'x',
            warning: 'alert-triangle',
            info: 'info'
        };
        return icons[type] || 'info';
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }

    logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            // Clear user data
            this.currentUser = null;
            
            // Show logout message
            this.showNotification('Logout realizado com sucesso!', 'success');
            
            // Redirect to login (in a real app)
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.healPlusApp = new HealPlusApp();
});

// Global functions for HTML onclick handlers
function showSection(sectionName) {
    if (window.healPlusApp) {
        window.healPlusApp.handleNavigation(sectionName);
    }
}

function openAppointmentModal(type) {
    console.log('Opening appointment modal for type:', type);
    // Implementation for appointment modal
}

function closeAppointmentModal() {
    console.log('Closing appointment modal');
    // Implementation for closing appointment modal
}

function submitAppointment() {
    if (window.healPlusApp) {
        const form = document.getElementById('appointmentForm');
        if (form) {
            window.healPlusApp.submitAppointment(form);
        }
    }
}

function clearChat() {
    console.log('Clearing chat');
    // Implementation for clearing chat
}

function sendMessage() {
    console.log('Sending message');
    // Implementation for sending message
}

function sendQuickMessage(message) {
    console.log('Sending quick message:', message);
    // Implementation for sending quick message
}

function previousMonth() {
    console.log('Previous month');
    // Implementation for previous month
}

function nextMonth() {
    console.log('Next month');
    // Implementation for next month
}

// Export for use in other modules
window.HealPlusApp = HealPlusApp;