// Módulo de Telessaúde - JavaScript

// Variáveis globais
let currentSession = null;
let isVideoEnabled = true;
let isAudioEnabled = true;
let isScreenSharing = false;
let currentWeek = new Date();
let telehealthCharts = {};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeTelehealthModule();
    setupEventListeners();
    loadTelehealthData();
    initializeCharts();
});

// Inicializar módulo de telessaúde
function initializeTelehealthModule() {
    console.log('Inicializando módulo de telessaúde...');
    
    // Configurar navegação
    setupNavigation();
    
    // Carregar dados iniciais
    loadInitialData();
    
    // Configurar filtros
    setupFilters();
    
    // Configurar agenda
    setupSchedule();
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
        case 'sessions':
            loadSessionsData();
            break;
        case 'schedule':
            loadScheduleData();
            break;
        case 'patients':
            loadPatientsData();
            break;
        case 'reports':
            loadReportsData();
            break;
    }
}

// Carregar dados do dashboard
function loadDashboardData() {
    console.log('Carregando dados do dashboard...');
    
    // Simular carregamento de dados
    setTimeout(() => {
        updateDashboardStats();
        loadActiveSessions();
        loadUpcomingSessions();
        loadRecentSessions();
    }, 500);
}

// Atualizar estatísticas do dashboard
function updateDashboardStats() {
    // Simular dados de estatísticas
    const stats = {
        todaySessions: 5,
        averageDuration: 28,
        averageRating: 4.7,
        activePatients: 127
    };
    
    // Atualizar elementos na tela
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 4) {
        statNumbers[0].textContent = stats.todaySessions;
        statNumbers[1].textContent = stats.averageDuration + 'min';
        statNumbers[2].textContent = stats.averageRating;
        statNumbers[3].textContent = stats.activePatients;
    }
}

// Carregar sessões ativas
function loadActiveSessions() {
    // Simular dados de sessões ativas
    const activeSessions = [
        {
            id: '550e8400-e29b-41d4-a716-446655440006',
            patientName: 'Carlos Santos',
            type: 'Consulta de Acompanhamento',
            duration: '25 min',
            status: 'active'
        }
    ];
    
    console.log('Sessões ativas carregadas:', activeSessions);
}

// Carregar próximas sessões
function loadUpcomingSessions() {
    // Simular dados de próximas sessões
    const upcomingSessions = [
        {
            id: '550e8400-e29b-41d4-a716-446655440007',
            patientName: 'Maria Oliveira',
            type: 'Primeira Consulta',
            scheduled: '14:30 - Hoje',
            status: 'scheduled'
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440008',
            patientName: 'João Silva',
            type: 'Avaliação de Ferida',
            scheduled: '16:00 - Hoje',
            status: 'scheduled'
        }
    ];
    
    console.log('Próximas sessões carregadas:', upcomingSessions);
}

// Carregar sessões recentes
function loadRecentSessions() {
    // Simular dados de sessões recentes
    const recentSessions = [
        {
            id: '550e8400-e29b-41d4-a716-446655440009',
            patientName: 'Ana Costa',
            type: 'Acompanhamento',
            date: '15/01/2024 - 10:30',
            duration: '32 min',
            status: 'completed',
            rating: 5.0
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440010',
            patientName: 'Pedro Lima',
            type: 'Primeira Consulta',
            date: '14/01/2024 - 15:45',
            duration: '45 min',
            status: 'completed',
            rating: 4.0
        }
    ];
    
    console.log('Sessões recentes carregadas:', recentSessions);
}

// Carregar dados de sessões
function loadSessionsData() {
    console.log('Carregando dados de sessões...');
    
    // Simular carregamento
    setTimeout(() => {
        console.log('Dados de sessões carregados');
    }, 500);
}

// Carregar dados de agenda
function loadScheduleData() {
    console.log('Carregando dados de agenda...');
    
    // Simular carregamento
    setTimeout(() => {
        console.log('Dados de agenda carregados');
    }, 500);
}

// Carregar dados de pacientes
function loadPatientsData() {
    console.log('Carregando dados de pacientes...');
    
    // Simular carregamento
    setTimeout(() => {
        console.log('Dados de pacientes carregados');
    }, 500);
}

// Carregar dados de relatórios
function loadReportsData() {
    console.log('Carregando dados de relatórios...');
    
    // Simular carregamento
    setTimeout(() => {
        console.log('Dados de relatórios carregados');
    }, 500);
}

// Configurar event listeners
function setupEventListeners() {
    // Filtros de sessões
    const sessionSearch = document.getElementById('sessionSearch');
    if (sessionSearch) {
        sessionSearch.addEventListener('input', filterSessions);
    }
    
    const sessionStatusFilter = document.getElementById('sessionStatusFilter');
    if (sessionStatusFilter) {
        sessionStatusFilter.addEventListener('change', filterSessions);
    }
    
    const sessionPeriodFilter = document.getElementById('sessionPeriodFilter');
    if (sessionPeriodFilter) {
        sessionPeriodFilter.addEventListener('change', filterSessions);
    }
    
    // Filtros de pacientes
    const patientSearch = document.getElementById('patientSearch');
    if (patientSearch) {
        patientSearch.addEventListener('input', filterPatients);
    }
    
    const patientStatusFilter = document.getElementById('patientStatusFilter');
    if (patientStatusFilter) {
        patientStatusFilter.addEventListener('change', filterPatients);
    }
    
    // Filtros de relatórios
    const reportPeriod = document.getElementById('reportPeriod');
    if (reportPeriod) {
        reportPeriod.addEventListener('change', updateReportData);
    }
    
    const reportMetric = document.getElementById('reportMetric');
    if (reportMetric) {
        reportMetric.addEventListener('change', updateReportData);
    }
    
    // Controles de gráfico
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

// Filtrar sessões
function filterSessions() {
    const searchTerm = document.getElementById('sessionSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('sessionStatusFilter')?.value || 'all';
    const periodFilter = document.getElementById('sessionPeriodFilter')?.value || 'all';
    
    console.log('Filtrando sessões:', { searchTerm, statusFilter, periodFilter });
    
    // Simular filtragem
    // Em uma implementação real, isso faria uma requisição para o backend
}

// Filtrar pacientes
function filterPatients() {
    const searchTerm = document.getElementById('patientSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('patientStatusFilter')?.value || 'all';
    
    console.log('Filtrando pacientes:', { searchTerm, statusFilter });
    
    // Simular filtragem
    // Em uma implementação real, isso faria uma requisição para o backend
}

// Atualizar dados de relatório
function updateReportData() {
    const period = document.getElementById('reportPeriod')?.value || '30';
    const metric = document.getElementById('reportMetric')?.value || 'sessions';
    
    console.log('Atualizando dados de relatório:', { period, metric });
    
    // Simular atualização
    // Em uma implementação real, isso faria uma requisição para o backend
}

// Atualizar tipo de gráfico
function updateChartType(chartType) {
    console.log('Atualizando tipo de gráfico:', chartType);
    
    if (telehealthCharts.main) {
        telehealthCharts.main.config.type = chartType;
        telehealthCharts.main.update();
    }
}

// Configurar agenda
function setupSchedule() {
    console.log('Configurando agenda...');
    
    // Configurar navegação de semanas
    updateWeekDisplay();
}

// Atualizar exibição da semana
function updateWeekDisplay() {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const weekDisplay = document.querySelector('.current-week');
    if (weekDisplay) {
        weekDisplay.textContent = `Semana de ${startOfWeek.getDate()}-${endOfWeek.getDate()} ${startOfWeek.toLocaleDateString('pt-BR', { month: 'short' })} ${startOfWeek.getFullYear()}`;
    }
}

// Navegar para semana anterior
function previousWeek() {
    currentWeek.setDate(currentWeek.getDate() - 7);
    updateWeekDisplay();
    loadScheduleData();
}

// Navegar para próxima semana
function nextWeek() {
    currentWeek.setDate(currentWeek.getDate() + 7);
    updateWeekDisplay();
    loadScheduleData();
}

// Inicializar gráficos
function initializeCharts() {
    // Gráfico principal de telessaúde
    const telehealthCanvas = document.getElementById('telehealthChart');
    if (telehealthCanvas) {
        telehealthCharts.main = new Chart(telehealthCanvas, {
            type: 'line',
            data: {
                labels: generateDateLabels(30),
                datasets: [{
                    label: 'Número de Sessões',
                    data: generateSessionData(30),
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Data'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Número de Sessões'
                        },
                        beginAtZero: true
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
}

// Gerar labels de data
function generateDateLabels(days) {
    const labels = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    }
    
    return labels;
}

// Gerar dados de sessões
function generateSessionData(days) {
    const data = [];
    const baseValue = 5;
    
    for (let i = 0; i < days; i++) {
        data.push(baseValue + Math.random() * 8 - 4);
    }
    
    return data.map(value => Math.round(value));
}

// Funções de ação
function startNewSession() {
    console.log('Iniciando nova sessão...');
    
    // Simular ação
    showNotification('Iniciando nova sessão...', 'info');
}

function joinSession(sessionId) {
    console.log('Entrando na sessão:', sessionId);
    
    // Simular ação
    showNotification('Entrando na sessão...', 'info');
    
    // Abrir modal de vídeo
    openModal('videoCallModal');
}

function openChat(sessionId) {
    console.log('Abrindo chat da sessão:', sessionId);
    
    // Simular ação
    showNotification('Abrindo chat...', 'info');
}

function viewSessionDetails(sessionId) {
    console.log('Visualizando detalhes da sessão:', sessionId);
    
    // Simular ação
    showNotification('Carregando detalhes da sessão...', 'info');
    
    // Abrir modal de detalhes
    openModal('sessionDetailsModal');
}

function prepareSession(sessionId) {
    console.log('Preparando sessão:', sessionId);
    
    // Simular ação
    showNotification('Preparando sessão...', 'info');
}

function viewSessionRecord(sessionId) {
    console.log('Visualizando gravação da sessão:', sessionId);
    
    // Simular ação
    showNotification('Carregando gravação da sessão...', 'info');
}

function downloadSessionReport(sessionId) {
    console.log('Baixando relatório da sessão:', sessionId);
    
    // Simular ação
    showNotification('Gerando relatório da sessão...', 'info');
    
    // Simular download
    setTimeout(() => {
        showNotification('Relatório baixado com sucesso!', 'success');
    }, 2000);
}

function scheduleNewSession() {
    console.log('Agendando nova sessão...');
    
    // Simular ação
    showNotification('Abrindo formulário de agendamento...', 'info');
}

function toggleAvailability() {
    console.log('Alternando disponibilidade...');
    
    // Simular ação
    showNotification('Atualizando disponibilidade...', 'info');
}

function addNewPatient() {
    console.log('Adicionando novo paciente...');
    
    // Simular ação
    showNotification('Abrindo formulário de novo paciente...', 'info');
}

function viewPatient(patientId) {
    console.log('Visualizando paciente:', patientId);
    
    // Simular ação
    showNotification('Carregando detalhes do paciente...', 'info');
}

function scheduleConsultation(patientId) {
    console.log('Agendando consulta para paciente:', patientId);
    
    // Simular ação
    showNotification('Abrindo formulário de agendamento...', 'info');
}

function viewPatientHistory(patientId) {
    console.log('Visualizando histórico do paciente:', patientId);
    
    // Simular ação
    showNotification('Carregando histórico do paciente...', 'info');
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

// Funções de controle de vídeo
function toggleMute() {
    isAudioEnabled = !isAudioEnabled;
    const button = document.querySelector('.control-btn i.fa-microphone');
    if (button) {
        button.className = isAudioEnabled ? 'fas fa-microphone' : 'fas fa-microphone-slash';
    }
    console.log('Áudio:', isAudioEnabled ? 'Ligado' : 'Desligado');
}

function toggleVideo() {
    isVideoEnabled = !isVideoEnabled;
    const button = document.querySelector('.control-btn i.fa-video');
    if (button) {
        button.className = isVideoEnabled ? 'fas fa-video' : 'fas fa-video-slash';
    }
    console.log('Vídeo:', isVideoEnabled ? 'Ligado' : 'Desligado');
}

function toggleScreenShare() {
    isScreenSharing = !isScreenSharing;
    const button = document.querySelector('.control-btn i.fa-desktop');
    if (button) {
        button.parentElement.classList.toggle('active', isScreenSharing);
    }
    console.log('Compartilhamento de tela:', isScreenSharing ? 'Ativo' : 'Inativo');
}

function endCall() {
    console.log('Encerrando chamada...');
    
    // Simular ação
    showNotification('Chamada encerrada', 'info');
    
    // Fechar modal
    closeModal('videoCallModal');
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

// Carregar dados de telessaúde
function loadTelehealthData() {
    console.log('Carregando dados de telessaúde...');
    
    // Simular carregamento
    showLoadingOverlay();
    
    setTimeout(() => {
        hideLoadingOverlay();
        console.log('Dados de telessaúde carregados');
    }, 1000);
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

function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
}

// Exportar funções para uso global
window.showSection = showSection;
window.startNewSession = startNewSession;
window.joinSession = joinSession;
window.openChat = openChat;
window.viewSessionDetails = viewSessionDetails;
window.prepareSession = prepareSession;
window.viewSessionRecord = viewSessionRecord;
window.downloadSessionReport = downloadSessionReport;
window.scheduleNewSession = scheduleNewSession;
window.toggleAvailability = toggleAvailability;
window.addNewPatient = addNewPatient;
window.viewPatient = viewPatient;
window.scheduleConsultation = scheduleConsultation;
window.viewPatientHistory = viewPatientHistory;
window.generateReport = generateReport;
window.toggleMute = toggleMute;
window.toggleVideo = toggleVideo;
window.toggleScreenShare = toggleScreenShare;
window.endCall = endCall;
window.closeModal = closeModal;
window.previousWeek = previousWeek;
window.nextWeek = nextWeek;
