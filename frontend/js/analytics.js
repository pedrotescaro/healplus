// Analytics - JavaScript para gráficos e relatórios

// Variáveis globais
let analyticsCharts = {};
let currentPeriod = '30';
let currentMetric = 'healing';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
});

// Inicializar analytics
function initializeAnalytics() {
    console.log('Inicializando analytics...');
    
    // Configurar event listeners
    setupAnalyticsEventListeners();
    
    // Inicializar gráficos
    initializeAnalyticsCharts();
    
    // Carregar dados iniciais
    loadAnalyticsData();
}

// Configurar event listeners
function setupAnalyticsEventListeners() {
    // Filtro de período
    const periodFilter = document.getElementById('analyticsPeriod');
    if (periodFilter) {
        periodFilter.addEventListener('change', function() {
            currentPeriod = this.value;
            updateAnalyticsData();
        });
    }
    
    // Filtro de métrica
    const metricFilter = document.getElementById('analyticsMetric');
    if (metricFilter) {
        metricFilter.addEventListener('change', function() {
            currentMetric = this.value;
            updateAnalyticsData();
        });
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

// Inicializar gráficos de analytics
function initializeAnalyticsCharts() {
    // Gráfico principal de analytics
    const analyticsCanvas = document.getElementById('analyticsChart');
    if (analyticsCanvas) {
        analyticsCharts.main = new Chart(analyticsCanvas, {
            type: 'line',
            data: {
                labels: generateDateLabels(currentPeriod),
                datasets: [{
                    label: 'Taxa de Cicatrização (%)',
                    data: generateHealingData(currentPeriod),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
                            text: 'Período'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Taxa (%)'
                        },
                        beginAtZero: true,
                        max: 100
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
    
    // Gráfico de comparação
    const comparisonCanvas = document.getElementById('comparisonChart');
    if (comparisonCanvas) {
        analyticsCharts.comparison = new Chart(comparisonCanvas, {
            type: 'bar',
            data: {
                labels: ['Taxa de Cicatrização', 'Tempo Médio', 'Taxa de Infecção', 'Satisfação'],
                datasets: [
                    {
                        label: 'Período Atual',
                        data: [87.3, 42, 7.8, 4.6],
                        backgroundColor: '#3b82f6',
                        borderColor: '#2563eb',
                        borderWidth: 1
                    },
                    {
                        label: 'Período Anterior',
                        data: [82.1, 45, 9.3, 4.4],
                        backgroundColor: '#6b7280',
                        borderColor: '#4b5563',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
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
}

// Gerar labels de data baseado no período
function generateDateLabels(period) {
    const labels = [];
    const now = new Date();
    
    switch(period) {
        case '30':
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
            }
            break;
        case '90':
            for (let i = 89; i >= 0; i -= 3) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
            }
            break;
        case '180':
            for (let i = 179; i >= 0; i -= 7) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
            }
            break;
        case '365':
            for (let i = 364; i >= 0; i -= 30) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                labels.push(date.toLocaleDateString('pt-BR', { month: 'short' }));
            }
            break;
    }
    
    return labels;
}

// Gerar dados de cicatrização
function generateHealingData(period) {
    const data = [];
    const baseValue = 85;
    
    switch(period) {
        case '30':
            for (let i = 0; i < 30; i++) {
                data.push(baseValue + Math.random() * 10 - 5);
            }
            break;
        case '90':
            for (let i = 0; i < 30; i++) {
                data.push(baseValue + Math.random() * 10 - 5);
            }
            break;
        case '180':
            for (let i = 0; i < 26; i++) {
                data.push(baseValue + Math.random() * 10 - 5);
            }
            break;
        case '365':
            for (let i = 0; i < 12; i++) {
                data.push(baseValue + Math.random() * 10 - 5);
            }
            break;
    }
    
    return data.map(value => Math.round(value * 10) / 10);
}

// Gerar dados de tempo de cicatrização
function generateHealingTimeData(period) {
    const data = [];
    const baseValue = 45;
    
    switch(period) {
        case '30':
            for (let i = 0; i < 30; i++) {
                data.push(baseValue + Math.random() * 10 - 5);
            }
            break;
        case '90':
            for (let i = 0; i < 30; i++) {
                data.push(baseValue + Math.random() * 10 - 5);
            }
            break;
        case '180':
            for (let i = 0; i < 26; i++) {
                data.push(baseValue + Math.random() * 10 - 5);
            }
            break;
        case '365':
            for (let i = 0; i < 12; i++) {
                data.push(baseValue + Math.random() * 10 - 5);
            }
            break;
    }
    
    return data.map(value => Math.round(value));
}

// Gerar dados de taxa de infecção
function generateInfectionRateData(period) {
    const data = [];
    const baseValue = 8;
    
    switch(period) {
        case '30':
            for (let i = 0; i < 30; i++) {
                data.push(baseValue + Math.random() * 4 - 2);
            }
            break;
        case '90':
            for (let i = 0; i < 30; i++) {
                data.push(baseValue + Math.random() * 4 - 2);
            }
            break;
        case '180':
            for (let i = 0; i < 26; i++) {
                data.push(baseValue + Math.random() * 4 - 2);
            }
            break;
        case '365':
            for (let i = 0; i < 12; i++) {
                data.push(baseValue + Math.random() * 4 - 2);
            }
            break;
    }
    
    return data.map(value => Math.round(value * 10) / 10);
}

// Atualizar dados de analytics
function updateAnalyticsData() {
    console.log('Atualizando dados de analytics...', { currentPeriod, currentMetric });
    
    // Mostrar loading
    showLoadingOverlay();
    
    // Simular carregamento de dados
    setTimeout(() => {
        // Atualizar gráfico principal
        if (analyticsCharts.main) {
            const newData = getDataForMetric(currentMetric, currentPeriod);
            const newLabels = generateDateLabels(currentPeriod);
            
            analyticsCharts.main.data.labels = newLabels;
            analyticsCharts.main.data.datasets[0].data = newData;
            analyticsCharts.main.data.datasets[0].label = getMetricLabel(currentMetric);
            analyticsCharts.main.update();
        }
        
        // Atualizar métricas principais
        updateKeyMetrics(currentPeriod);
        
        // Esconder loading
        hideLoadingOverlay();
    }, 1000);
}

// Obter dados para métrica específica
function getDataForMetric(metric, period) {
    switch(metric) {
        case 'healing':
            return generateHealingData(period);
        case 'infection':
            return generateInfectionRateData(period);
        case 'time':
            return generateHealingTimeData(period);
        case 'satisfaction':
            return generateSatisfactionData(period);
        default:
            return generateHealingData(period);
    }
}

// Gerar dados de satisfação
function generateSatisfactionData(period) {
    const data = [];
    const baseValue = 4.5;
    
    switch(period) {
        case '30':
            for (let i = 0; i < 30; i++) {
                data.push(baseValue + Math.random() * 0.5 - 0.25);
            }
            break;
        case '90':
            for (let i = 0; i < 30; i++) {
                data.push(baseValue + Math.random() * 0.5 - 0.25);
            }
            break;
        case '180':
            for (let i = 0; i < 26; i++) {
                data.push(baseValue + Math.random() * 0.5 - 0.25);
            }
            break;
        case '365':
            for (let i = 0; i < 12; i++) {
                data.push(baseValue + Math.random() * 0.5 - 0.25);
            }
            break;
    }
    
    return data.map(value => Math.round(value * 10) / 10);
}

// Obter label da métrica
function getMetricLabel(metric) {
    switch(metric) {
        case 'healing':
            return 'Taxa de Cicatrização (%)';
        case 'infection':
            return 'Taxa de Infecção (%)';
        case 'time':
            return 'Tempo Médio (dias)';
        case 'satisfaction':
            return 'Satisfação (1-5)';
        default:
            return 'Taxa de Cicatrização (%)';
    }
}

// Atualizar métricas principais
function updateKeyMetrics(period) {
    // Simular dados atualizados
    const metrics = {
        healing: {
            value: 87.3 + Math.random() * 5 - 2.5,
            change: 5.2 + Math.random() * 2 - 1
        },
        time: {
            value: 42 + Math.random() * 5 - 2.5,
            change: -3 + Math.random() * 2 - 1
        },
        infection: {
            value: 7.8 + Math.random() * 2 - 1,
            change: -1.5 + Math.random() * 1 - 0.5
        },
        satisfaction: {
            value: 4.6 + Math.random() * 0.2 - 0.1,
            change: 0.2 + Math.random() * 0.1 - 0.05
        }
    };
    
    // Atualizar elementos na tela
    const metricValues = document.querySelectorAll('.metric-value-large');
    const metricTrends = document.querySelectorAll('.metric-trend');
    
    if (metricValues.length >= 4) {
        metricValues[0].textContent = Math.round(metrics.healing.value * 10) / 10 + '%';
        metricValues[1].textContent = Math.round(metrics.time.value) + ' dias';
        metricValues[2].textContent = Math.round(metrics.infection.value * 10) / 10 + '%';
        metricValues[3].textContent = Math.round(metrics.satisfaction.value * 10) / 10 + '/5';
    }
    
    if (metricTrends.length >= 4) {
        const healingTrend = metricTrends[0].querySelector('span');
        const timeTrend = metricTrends[1].querySelector('span');
        const infectionTrend = metricTrends[2].querySelector('span');
        const satisfactionTrend = metricTrends[3].querySelector('span');
        
        if (healingTrend) healingTrend.textContent = `+${Math.round(metrics.healing.change * 10) / 10}% vs período anterior`;
        if (timeTrend) timeTrend.textContent = `${metrics.time.change > 0 ? '+' : ''}${Math.round(metrics.time.change)} dias vs período anterior`;
        if (infectionTrend) infectionTrend.textContent = `${metrics.infection.change > 0 ? '+' : ''}${Math.round(metrics.infection.change * 10) / 10}% vs período anterior`;
        if (satisfactionTrend) satisfactionTrend.textContent = `+${Math.round(metrics.satisfaction.change * 10) / 10} vs período anterior`;
    }
}

// Atualizar tipo de gráfico
function updateChartType(chartType) {
    console.log('Atualizando tipo de gráfico:', chartType);
    
    if (analyticsCharts.main) {
        analyticsCharts.main.config.type = chartType;
        analyticsCharts.main.update();
    }
}

// Carregar dados de analytics
function loadAnalyticsData() {
    console.log('Carregando dados de analytics...');
    
    // Simular carregamento
    showLoadingOverlay();
    
    setTimeout(() => {
        // Dados já carregados na inicialização
        hideLoadingOverlay();
        console.log('Dados de analytics carregados');
    }, 1000);
}

// Gerar relatório
function generateReport() {
    console.log('Gerando relatório de analytics...');
    
    // Mostrar loading
    showLoadingOverlay();
    
    // Simular geração de relatório
    setTimeout(() => {
        hideLoadingOverlay();
        
        // Simular download
        const reportData = {
            period: currentPeriod,
            metric: currentMetric,
            data: getDataForMetric(currentMetric, currentPeriod),
            generatedAt: new Date().toISOString()
        };
        
        // Criar e baixar arquivo
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio-analytics-${currentPeriod}dias-${currentMetric}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Relatório gerado e baixado com sucesso!', 'success');
    }, 2000);
}

// Funções de utilidade
function formatNumber(value, decimals = 1) {
    return Number(value).toFixed(decimals);
}

function formatPercentage(value) {
    return formatNumber(value) + '%';
}

function formatDays(value) {
    return Math.round(value) + ' dias';
}

function formatRating(value) {
    return formatNumber(value, 1) + '/5';
}

// Exportar funções para uso global
window.generateReport = generateReport;
