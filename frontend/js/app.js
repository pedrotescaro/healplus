// Heal+ Patient Portal - Main Application
class HealPlusApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentUser = null;
        this.apiBaseUrl = 'http://localhost:8080/api';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserData();
        this.initializeCharts();
        this.setupNavigation();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });

        // Logout
        document.querySelector('.logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // Modal close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            if (e.target.id === 'appointmentForm') {
                this.submitAppointment();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    setupNavigation() {
        // Update active nav link based on current section
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === this.currentSection) {
                link.classList.add('active');
            }
        });
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
            this.setupNavigation();

            // Load section-specific data
            this.loadSectionData(sectionName);
        }
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
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

    async loadUserData() {
        try {
            // Simulate API call
            this.currentUser = {
                id: 1,
                name: 'João Silva',
                email: 'joao.silva@email.com',
                avatar: 'https://via.placeholder.com/40'
            };

            // Update UI
            document.querySelector('.user-name').textContent = this.currentUser.name;
            document.querySelector('.user-avatar').src = this.currentUser.avatar;
        } catch (error) {
            console.error('Error loading user data:', error);
            this.showNotification('Erro ao carregar dados do usuário', 'error');
        }
    }

    async loadDashboardData() {
        try {
            this.showLoading();
            
            // Simulate API calls
            const stats = await this.fetchDashboardStats();
            const assessments = await this.fetchRecentAssessments();
            const appointments = await this.fetchUpcomingAppointments();

            this.updateDashboardStats(stats);
            this.updateRecentAssessments(assessments);
            this.updateUpcomingAppointments(appointments);
            
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
            
            const assessments = await this.fetchAllAssessments();
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
            
            const appointments = await this.fetchAllAppointments();
            this.updateAppointmentsList(appointments);
            this.generateCalendar();
            
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

    // API Methods
    async fetchDashboardStats() {
        // Simulate API call
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

    async fetchRecentAssessments() {
        // Simulate API call
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
                    },
                    {
                        id: 2,
                        location: 'Pé Direito',
                        date: '2024-01-08',
                        area: 15.2,
                        tissue: '65% Granulação',
                        risk: 'medium',
                        aiAnalysis: 'Estável'
                    }
                ]);
            }, 800);
        });
    }

    async fetchUpcomingAppointments() {
        // Simulate API call
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
                    },
                    {
                        id: 2,
                        date: '2024-01-29',
                        time: '10:00',
                        type: 'Teleconsulta',
                        doctor: 'Dr. João Oliveira',
                        specialty: 'Cirurgia Vascular',
                        status: 'scheduled'
                    }
                ]);
            }, 600);
        });
    }

    async fetchAllAssessments() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        location: 'Pé Direito - Úlcera Venosa',
                        date: '2024-01-15',
                        time: '14:30',
                        status: 'improving',
                        metrics: {
                            tissue: {
                                granulation: 75,
                                slough: 20,
                                necrosis: 5
                            },
                            infection: {
                                risk: 'low',
                                description: 'Sem sinais de infecção ativa'
                            },
                            moisture: {
                                level: 'balanced',
                                description: 'Exsudato moderado, sem maceração'
                            },
                            edge: {
                                progress: 'advancing',
                                description: 'Contração de 5% desde última avaliação'
                            }
                        },
                        aiAnalysis: {
                            trajectory: 'Melhorando',
                            estimatedDays: 45,
                            recommendation: 'Continuar tratamento atual',
                            confidence: 87
                        }
                    }
                ]);
            }, 1000);
        });
    }

    async fetchAllAppointments() {
        // Simulate API call
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
                        location: 'Clínica São Paulo - Sala 205',
                        status: 'confirmed'
                    }
                ]);
            }, 800);
        });
    }

    async fetchTelehealthSessions() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    active: [
                        {
                            id: 1,
                            doctor: 'Dr. João Oliveira',
                            specialty: 'Cirurgia Vascular',
                            time: '10:00',
                            status: 'active'
                        }
                    ],
                    history: [
                        {
                            id: 1,
                            date: '2024-01-15',
                            doctor: 'Dr. Maria Santos',
                            time: '14:30',
                            duration: 25
                        }
                    ]
                });
            }, 600);
        });
    }

    // UI Update Methods
    updateDashboardStats(stats) {
        // Update stats cards
        const statCards = document.querySelectorAll('.stat-card');
        if (statCards[0]) {
            statCards[0].querySelector('.stat-number').textContent = stats.activeWounds;
        }
        if (statCards[1]) {
            statCards[1].querySelector('.stat-number').textContent = stats.progress + '%';
        }
        if (statCards[2]) {
            statCards[2].querySelector('.stat-number').textContent = stats.nextAppointment;
        }
        if (statCards[3]) {
            const riskElement = statCards[3].querySelector('.stat-number');
            riskElement.textContent = this.getRiskLabel(stats.infectionRisk);
            riskElement.className = `stat-number risk-${stats.infectionRisk}`;
        }
    }

    updateRecentAssessments(assessments) {
        const assessmentsGrid = document.querySelector('.assessments-grid');
        if (!assessmentsGrid) return;

        assessmentsGrid.innerHTML = assessments.map(assessment => `
            <div class="assessment-card">
                <div class="assessment-header">
                    <h3>${assessment.location}</h3>
                    <span class="assessment-date">${this.formatDate(assessment.date)}</span>
                </div>
                <div class="assessment-metrics">
                    <div class="metric">
                        <span class="metric-label">Área:</span>
                        <span class="metric-value">${assessment.area} cm²</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Tecido:</span>
                        <span class="metric-value">${assessment.tissue}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Risco:</span>
                        <span class="metric-value risk-${assessment.risk}">${this.getRiskLabel(assessment.risk)}</span>
                    </div>
                </div>
                <div class="assessment-ai">
                    <i class="fas fa-robot"></i>
                    <span>Análise IA: ${assessment.aiAnalysis}</span>
                </div>
            </div>
        `).join('');
    }

    updateUpcomingAppointments(appointments) {
        const appointmentsList = document.querySelector('.appointments-list');
        if (!appointmentsList) return;

        appointmentsList.innerHTML = appointments.map(appointment => `
            <div class="appointment-item">
                <div class="appointment-date">
                    <span class="day">${new Date(appointment.date).getDate()}</span>
                    <span class="month">${this.getMonthName(new Date(appointment.date).getMonth())}</span>
                </div>
                <div class="appointment-details">
                    <h3>${appointment.type === 'Presencial' ? 'Consulta de Acompanhamento' : 'Teleconsulta'}</h3>
                    <p>${appointment.doctor} - ${appointment.specialty}</p>
                    <p>${appointment.time} - ${appointment.type}</p>
                    ${appointment.location ? `<p>${appointment.location}</p>` : ''}
                </div>
                <div class="appointment-actions">
                    <button class="btn btn-outline btn-sm">Detalhes</button>
                    <button class="btn btn-primary btn-sm">${appointment.type === 'Presencial' ? 'Confirmar' : 'Entrar'}</button>
                </div>
            </div>
        `).join('');
    }

    updateAssessmentsList(assessments) {
        const assessmentsList = document.querySelector('.assessments-list');
        if (!assessmentsList) return;

        assessmentsList.innerHTML = assessments.map(assessment => `
            <div class="assessment-item">
                <div class="assessment-header">
                    <div class="assessment-info">
                        <h3>${assessment.location}</h3>
                        <span class="assessment-date">${this.formatDate(assessment.date)} - ${assessment.time}</span>
                    </div>
                    <div class="assessment-status">
                        <span class="status-badge status-${assessment.status}">${this.getStatusLabel(assessment.status)}</span>
                    </div>
                </div>
                <div class="assessment-content">
                    <div class="assessment-metrics">
                        <div class="metric-card">
                            <h4>T - Tecido</h4>
                            <div class="tissue-composition">
                                <div class="tissue-item">
                                    <span class="tissue-color granulation"></span>
                                    <span>Granulação: ${assessment.metrics.tissue.granulation}%</span>
                                </div>
                                <div class="tissue-item">
                                    <span class="tissue-color slough"></span>
                                    <span>Esfacelo: ${assessment.metrics.tissue.slough}%</span>
                                </div>
                                <div class="tissue-item">
                                    <span class="tissue-color necrosis"></span>
                                    <span>Necrose: ${assessment.metrics.tissue.necrosis}%</span>
                                </div>
                            </div>
                        </div>
                        <div class="metric-card">
                            <h4>I - Infecção</h4>
                            <div class="infection-status">
                                <span class="risk-indicator risk-${assessment.metrics.infection.risk}">${this.getRiskLabel(assessment.metrics.infection.risk)}</span>
                                <p>${assessment.metrics.infection.description}</p>
                            </div>
                        </div>
                        <div class="metric-card">
                            <h4>M - Umidade</h4>
                            <div class="moisture-status">
                                <span class="moisture-level ${assessment.metrics.moisture.level}">${this.getMoistureLabel(assessment.metrics.moisture.level)}</span>
                                <p>${assessment.metrics.moisture.description}</p>
                            </div>
                        </div>
                        <div class="metric-card">
                            <h4>E - Borda</h4>
                            <div class="edge-status">
                                <span class="edge-progress ${assessment.metrics.edge.progress}">${this.getEdgeLabel(assessment.metrics.edge.progress)}</span>
                                <p>${assessment.metrics.edge.description}</p>
                            </div>
                        </div>
                    </div>
                    <div class="assessment-ai-analysis">
                        <h4>Análise de IA</h4>
                        <div class="ai-insights">
                            <div class="ai-insight">
                                <i class="fas fa-check-circle"></i>
                                <span>Trajetória de cicatrização: ${assessment.aiAnalysis.trajectory}</span>
                            </div>
                            <div class="ai-insight">
                                <i class="fas fa-clock"></i>
                                <span>Tempo estimado para cicatrização: ${assessment.aiAnalysis.estimatedDays} dias</span>
                            </div>
                            <div class="ai-insight">
                                <i class="fas fa-lightbulb"></i>
                                <span>Recomendação: ${assessment.aiAnalysis.recommendation}</span>
                            </div>
                        </div>
                        <div class="ai-confidence">
                            <span>Confiança da IA: ${assessment.aiAnalysis.confidence}%</span>
                            <div class="confidence-bar">
                                <div class="confidence-fill" style="width: ${assessment.aiAnalysis.confidence}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="assessment-actions">
                        <button class="btn btn-outline">
                            <i class="fas fa-image"></i>
                            Ver Imagens
                        </button>
                        <button class="btn btn-outline">
                            <i class="fas fa-download"></i>
                            Relatório
                        </button>
                        <button class="btn btn-primary">
                            <i class="fas fa-comments"></i>
                            Comentar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateAppointmentsList(appointments) {
        // Implementation for appointments list update
        console.log('Updating appointments list:', appointments);
    }

    updateTelehealthSessions(sessions) {
        // Implementation for telehealth sessions update
        console.log('Updating telehealth sessions:', sessions);
    }

    // Chart Methods
    initializeCharts() {
        this.initializeHealingChart();
    }

    initializeHealingChart() {
        const ctx = document.getElementById('healingChart');
        if (!ctx) return;

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29'],
                datasets: [{
                    label: 'Área da Ferida (cm²)',
                    data: [20, 18, 15.2, 12.5, 10],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Área (cm²)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Data'
                        }
                    }
                }
            }
        });
    }

    // Modal Methods
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }

    // Appointment Methods
    openAppointmentModal(type) {
        const modal = document.getElementById('appointmentModal');
        const typeSelect = document.getElementById('appointmentType');
        
        if (typeSelect) {
            typeSelect.value = type;
        }
        
        this.openModal('appointmentModal');
    }

    closeAppointmentModal() {
        this.closeModal(document.getElementById('appointmentModal'));
        document.getElementById('appointmentForm').reset();
    }

    async submitAppointment() {
        try {
            this.showLoading();
            
            const formData = new FormData(document.getElementById('appointmentForm'));
            const appointmentData = Object.fromEntries(formData.entries());
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Consulta agendada com sucesso!', 'success');
            this.closeAppointmentModal();
            this.loadAppointmentsData();
            
            this.hideLoading();
        } catch (error) {
            console.error('Error submitting appointment:', error);
            this.showNotification('Erro ao agendar consulta', 'error');
            this.hideLoading();
        }
    }

    // Utility Methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    getMonthName(monthIndex) {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 
                       'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return months[monthIndex];
    }

    getRiskLabel(risk) {
        const labels = {
            low: 'Baixo',
            medium: 'Médio',
            high: 'Alto',
            critical: 'Crítico'
        };
        return labels[risk] || risk;
    }

    getStatusLabel(status) {
        const labels = {
            improving: 'Melhorando',
            stable: 'Estável',
            declining: 'Declinando',
            stagnant: 'Estagnado'
        };
        return labels[status] || status;
    }

    getMoistureLabel(level) {
        const labels = {
            dry: 'Seco',
            balanced: 'Equilibrado',
            moist: 'Úmido',
            wet: 'Molhado',
            'very-wet': 'Muito Molhado'
        };
        return labels[level] || level;
    }

    getEdgeLabel(progress) {
        const labels = {
            advancing: 'Avançando',
            stable: 'Estável',
            stagnant: 'Estagnado'
        };
        return labels[progress] || progress;
    }

    // Loading and Notification Methods
    showLoading() {
        document.getElementById('loadingOverlay').classList.add('active');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('active');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Logout
    logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            // Clear user data
            this.currentUser = null;
            
            // Redirect to login (in a real app)
            window.location.href = '/login';
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.healPlusApp = new HealPlusApp();
});

// Global functions for HTML onclick handlers
function showSection(sectionName) {
    window.healPlusApp.showSection(sectionName);
}

function openAppointmentModal(type) {
    window.healPlusApp.openAppointmentModal(type);
}

function closeAppointmentModal() {
    window.healPlusApp.closeAppointmentModal();
}

function submitAppointment() {
    window.healPlusApp.submitAppointment();
}

function clearChat() {
    if (window.chatbot) {
        window.chatbot.clearChat();
    }
}

function sendMessage() {
    if (window.chatbot) {
        window.chatbot.sendMessage();
    }
}

function sendQuickMessage(message) {
    if (window.chatbot) {
        window.chatbot.sendQuickMessage(message);
    }
}

function previousMonth() {
    if (window.calendar) {
        window.calendar.previousMonth();
    }
}

function nextMonth() {
    if (window.calendar) {
        window.calendar.nextMonth();
    }
}
