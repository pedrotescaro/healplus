// Portal do Clínico - JavaScript

// Variáveis globais
let currentPatient = null;
let currentAssessment = null;
let charts = {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeClinicianPortal();
    setupEventListeners();
    loadDashboardData();
    initializeCharts();
});

// Inicializar portal do clínico
function initializeClinicianPortal() {
    console.log('Inicializando portal do clínico...');
    
    // Configurar navegação
    setupNavigation();
    
    // Carregar dados iniciais
    loadInitialData();
    
    // Configurar filtros
    setupFilters();
}

// Configurar navegação
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

// Mostrar seção específica
function showSection(sectionName) {
    // Ocultar todas as seções
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover classe active de todos os links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Adicionar classe active ao link correspondente
    const targetLink = document.querySelector(`[data-section="${sectionName}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    
    // Carregar dados específicos da seção
    loadSectionData(sectionName);
}

// Carregar dados específicos da seção
function loadSectionData(sectionName) {
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'patients':
            loadPatientsData();
            break;
        case 'assessments':
            loadAssessmentsData();
            break;
        case 'ai-analysis':
            loadAIAnalysisData();
            break;
        case 'telehealth':
            loadTelehealthData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
    }
}

// Carregar dados do dashboard
function loadDashboardData() {
    console.log('Carregando dados do dashboard...');
    
    // Simular carregamento de dados
    setTimeout(() => {
        updateDashboardStats();
        loadRecentPatients();
        loadAlerts();
    }, 500);
}

// Atualizar estatísticas do dashboard
function updateDashboardStats() {
    // Simular dados de estatísticas
    const stats = {
        activePatients: 127,
        todayAssessments: 8,
        riskAlerts: 3,
        healingRate: 87
    };
    
    // Atualizar elementos na tela
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = stats.activePatients;
        statNumbers[1].textContent = stats.todayAssessments;
        statNumbers[2].textContent = stats.riskAlerts;
        statNumbers[3].textContent = stats.healingRate + '%';
    }
}

// Carregar pacientes recentes
function loadRecentPatients() {
    // Simular dados de pacientes
    const recentPatients = [
        {
            id: 1,
            name: 'João Silva',
            diagnosis: 'Úlcera Venosa - Pé Direito',
            lastAssessment: '15/01/2024',
            progress: -15,
            risk: 'high',
            nextAppointment: '22/01/2024'
        },
        {
            id: 2,
            name: 'Ana Costa',
            diagnosis: 'Ferida Cirúrgica - Abdômen',
            lastAssessment: '14/01/2024',
            progress: 25,
            risk: 'low',
            nextAppointment: '28/01/2024'
        }
    ];
    
    // Atualizar interface (já está no HTML)
    console.log('Pacientes recentes carregados:', recentPatients);
}

// Carregar alertas
function loadAlerts() {
    // Simular dados de alertas
    const alerts = [
        {
            type: 'high',
            title: 'Alto Risco de Infecção',
            message: 'Paciente João Silva - Ferida no pé direito apresenta sinais de infecção',
            time: 'Há 2 horas'
        },
        {
            type: 'medium',
            title: 'Consulta Pendente',
            message: 'Ana Costa - Avaliação de ferida aguardando revisão',
            time: 'Há 4 horas'
        },
        {
            type: 'low',
            title: 'Nova Avaliação',
            message: 'Carlos Santos - Nova avaliação de ferida disponível',
            time: 'Há 6 horas'
        }
    ];
    
    console.log('Alertas carregados:', alerts);
}

// Carregar dados de pacientes
function loadPatientsData() {
    console.log('Carregando dados de pacientes...');
    
    // Simular carregamento
    setTimeout(() => {
        console.log('Dados de pacientes carregados');
    }, 500);
}

// Carregar dados de avaliações
function loadAssessmentsData() {
    console.log('Carregando dados de avaliações...');
    
    // Simular carregamento
    setTimeout(() => {
        console.log('Dados de avaliações carregados');
    }, 500);
}

// Carregar dados de análise de IA
function loadAIAnalysisData() {
    console.log('Carregando dados de análise de IA...');
    
    // Simular carregamento
    setTimeout(() => {
        console.log('Dados de análise de IA carregados');
    }, 500);
}

// Carregar dados de telessaúde
function loadTelehealthData() {
    console.log('Carregando dados de telessaúde...');
    
    // Simular carregamento
    setTimeout(() => {
        console.log('Dados de telessaúde carregados');
    }, 500);
}

// Carregar dados de analytics
function loadAnalyticsData() {
    console.log('Carregando dados de analytics...');
    
    // Simular carregamento
    setTimeout(() => {
        console.log('Dados de analytics carregados');
    }, 500);
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros de pacientes
    const patientSearch = document.getElementById('patientSearch');
    if (patientSearch) {
        patientSearch.addEventListener('input', filterPatients);
    }
    
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterPatients);
    }
    
    // Filtros de avaliações
    const patientFilter = document.getElementById('patientFilter');
    if (patientFilter) {
        patientFilter.addEventListener('change', filterAssessments);
    }
    
    const assessmentStatusFilter = document.getElementById('assessmentStatusFilter');
    if (assessmentStatusFilter) {
        assessmentStatusFilter.addEventListener('change', filterAssessments);
    }
    
    // Controles de métricas
    const metricControls = document.querySelectorAll('.metric-controls button');
    metricControls.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            metricControls.forEach(btn => btn.classList.remove('active'));
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            const period = this.getAttribute('data-period');
            updatePerformanceMetrics(period);
        });
    });
    
    // Controles de modelos de IA
    const modelControls = document.querySelectorAll('.model-controls button');
    modelControls.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            modelControls.forEach(btn => btn.classList.remove('active'));
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            const model = this.getAttribute('data-model');
            filterAIModels(model);
        });
    });
    
    // Controles de gráficos
    const chartControls = document.querySelectorAll('.chart-controls button');
    chartControls.forEach(button => {
        button.addEventListener('click', function() {
            // Remover classe active de todos os botões
            chartControls.forEach(btn => btn.classList.remove('active'));
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            const chartType = this.getAttribute('data-chart');
            updateChartType(chartType);
        });
    });
}

// Filtrar pacientes
function filterPatients() {
    const searchTerm = document.getElementById('patientSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    
    console.log('Filtrando pacientes:', { searchTerm, statusFilter });
    
    // Simular filtragem
    // Em uma implementação real, isso faria uma requisição para o backend
}

// Filtrar avaliações
function filterAssessments() {
    const patientFilter = document.getElementById('patientFilter')?.value || 'all';
    const statusFilter = document.getElementById('assessmentStatusFilter')?.value || 'all';
    
    console.log('Filtrando avaliações:', { patientFilter, statusFilter });
    
    // Simular filtragem
    // Em uma implementação real, isso faria uma requisição para o backend
}

// Atualizar métricas de performance
function updatePerformanceMetrics(period) {
    console.log('Atualizando métricas de performance para período:', period);
    
    // Simular atualização de dados
    // Em uma implementação real, isso faria uma requisição para o backend
}

// Filtrar modelos de IA
function filterAIModels(model) {
    console.log('Filtrando modelos de IA:', model);
    
    // Simular filtragem
    // Em uma implementação real, isso faria uma requisição para o backend
}

// Atualizar tipo de gráfico
function updateChartType(chartType) {
    console.log('Atualizando tipo de gráfico:', chartType);
    
    // Simular atualização de gráfico
    // Em uma implementação real, isso atualizaria o gráfico
}

// Inicializar gráficos
function initializeCharts() {
    // Gráfico de taxa de cicatrização
    const healingRateCanvas = document.getElementById('healingRateChart');
    if (healingRateCanvas) {
        charts.healingRate = new Chart(healingRateCanvas, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Taxa de Cicatrização (%)',
                    data: [82, 85, 87, 89, 86, 87],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
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
                        max: 100
                    }
                }
            }
        });
    }
    
    // Gráfico de tempo de cicatrização
    const healingTimeCanvas = document.getElementById('healingTimeChart');
    if (healingTimeCanvas) {
        charts.healingTime = new Chart(healingTimeCanvas, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                datasets: [{
                    label: 'Tempo Médio (dias)',
                    data: [48, 45, 42, 40, 43, 45],
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
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
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Gráfico de taxa de infecção
    const infectionRateCanvas = document.getElementById('infectionRateChart');
    if (infectionRateCanvas) {
        charts.infectionRate = new Chart(infectionRateCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Sem Infecção', 'Com Infecção'],
                datasets: [{
                    data: [92, 8],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Funções de ação
function markAllAsRead() {
    console.log('Marcando todos os alertas como lidos...');
    
    // Simular ação
    setTimeout(() => {
        const alertItems = document.querySelectorAll('.alert-item');
        alertItems.forEach(item => {
            item.style.opacity = '0.6';
        });
        
        showNotification('Todos os alertas foram marcados como lidos', 'success');
    }, 500);
}

function addNewPatient() {
    console.log('Adicionando novo paciente...');
    
    // Simular ação
    showNotification('Funcionalidade de adicionar paciente será implementada', 'info');
}

function viewPatient(patientId) {
    console.log('Visualizando paciente:', patientId);
    
    // Simular ação
    showNotification('Abrindo detalhes do paciente...', 'info');
}

function assessPatient(patientId) {
    console.log('Avaliando paciente:', patientId);
    
    // Simular ação
    showNotification('Iniciando avaliação do paciente...', 'info');
}

function editPatient(patientId) {
    console.log('Editando paciente:', patientId);
    
    // Simular ação
    showNotification('Abrindo edição do paciente...', 'info');
}

function createNewAssessment() {
    console.log('Criando nova avaliação...');
    
    // Simular ação
    showNotification('Iniciando nova avaliação...', 'info');
}

function generateNewInsights() {
    console.log('Gerando novos insights de IA...');
    
    // Simular ação
    showLoadingOverlay();
    
    setTimeout(() => {
        hideLoadingOverlay();
        showNotification('Novos insights gerados com sucesso!', 'success');
    }, 2000);
}

function generateReport() {
    console.log('Gerando relatório...');
    
    // Simular ação
    showLoadingOverlay();
    
    setTimeout(() => {
        hideLoadingOverlay();
        showNotification('Relatório gerado com sucesso!', 'success');
    }, 2000);
}

// Funções de modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Funções de notificação
function showNotification(message, type = 'info') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Funções de loading
function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// Carregar dados iniciais
function loadInitialData() {
    console.log('Carregando dados iniciais...');
    
    // Simular carregamento
    showLoadingOverlay();
    
    setTimeout(() => {
        hideLoadingOverlay();
        console.log('Dados iniciais carregados');
    }, 1000);
}

// Configurar filtros
function setupFilters() {
    console.log('Configurando filtros...');
    
    // Filtros já configurados no setupEventListeners
}

// Funções de utilidade
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Exportar funções para uso global
window.showSection = showSection;
window.markAllAsRead = markAllAsRead;
window.addNewPatient = addNewPatient;
window.viewPatient = viewPatient;
window.assessPatient = assessPatient;
window.editPatient = editPatient;
window.createNewAssessment = createNewAssessment;
window.generateNewInsights = generateNewInsights;
window.generateReport = generateReport;
window.closeModal = closeModal;
