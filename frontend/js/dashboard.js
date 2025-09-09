// Heal+ Dashboard Functionality
class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.initializeCharts();
    }

    setupEventListeners() {
        // Action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', () => {
                this.handleActionCardClick(card);
            });
        });

        // Stats cards
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', () => {
                this.handleStatCardClick(card);
            });
        });

        // Table rows
        document.querySelectorAll('.table tbody tr').forEach(row => {
            row.addEventListener('click', () => {
                this.handleTableRowClick(row);
            });
        });

        // Quick action buttons
        document.querySelectorAll('.btn[onclick]').forEach(btn => {
            const onclick = btn.getAttribute('onclick');
            if (onclick && onclick.includes('(')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.executeQuickAction(onclick);
                });
            }
        });
    }

    handleActionCardClick(card) {
        const title = card.querySelector('.card-title')?.textContent;
        const description = card.querySelector('.card-subtitle')?.textContent;
        
        console.log('Action card clicked:', title, description);
        
        if (window.healPlusApp) {
            window.healPlusApp.showNotification(`Abrindo: ${title}`, 'info');
        }

        // Handle specific actions
        if (title?.includes('Nova Avaliação')) {
            this.openWoundCapture();
        } else if (title?.includes('Relatório')) {
            this.generateReport();
        } else if (title?.includes('Comparar')) {
            this.openComparison();
        } else if (title?.includes('Teleconsulta')) {
            this.openTelehealth();
        }
    }

    handleStatCardClick(card) {
        const label = card.querySelector('.stat-label')?.textContent;
        const value = card.querySelector('.stat-value')?.textContent;
        
        console.log('Stat card clicked:', label, value);
        
        if (window.healPlusApp) {
            window.healPlusApp.showNotification(`Visualizando detalhes: ${label}`, 'info');
        }
    }

    handleTableRowClick(row) {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
            const firstCell = cells[0].textContent;
            console.log('Table row clicked:', firstCell);
            
            if (window.healPlusApp) {
                window.healPlusApp.showNotification(`Visualizando: ${firstCell}`, 'info');
            }
        }
    }

    executeQuickAction(onclick) {
        // Extract function name and parameters from onclick string
        const match = onclick.match(/(\w+)\((.*)\)/);
        if (match) {
            const functionName = match[1];
            const params = match[2] ? match[2].split(',').map(p => p.trim().replace(/['"]/g, '')) : [];
            
            console.log('Executing quick action:', functionName, params);
            
            // Execute the function
            switch (functionName) {
                case 'openWoundCapture':
                    this.openWoundCapture();
                    break;
                case 'generateReport':
                    this.generateReport();
                    break;
                case 'openComparison':
                    this.openComparison();
                    break;
                case 'openTelehealth':
                    this.openTelehealth();
                    break;
                case 'viewAssessment':
                    this.viewAssessment(params[0]);
                    break;
                case 'editAssessment':
                    this.editAssessment(params[0]);
                    break;
                case 'deleteAssessment':
                    this.deleteAssessment(params[0]);
                    break;
                default:
                    console.log('Unknown function:', functionName);
            }
        }
    }

    async loadDashboardData() {
        try {
            if (window.healPlusApp) {
                window.healPlusApp.showLoading();
            }

            // Simulate API calls
            const stats = await this.fetchStats();
            const assessments = await this.fetchRecentAssessments();
            const appointments = await this.fetchUpcomingAppointments();

            this.updateStats(stats);
            this.updateRecentAssessments(assessments);
            this.updateUpcomingAppointments(appointments);

            if (window.healPlusApp) {
                window.healPlusApp.hideLoading();
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            if (window.healPlusApp) {
                window.healPlusApp.showNotification('Erro ao carregar dados do dashboard', 'error');
                window.healPlusApp.hideLoading();
            }
        }
    }

    async fetchStats() {
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
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '550e8400-e29b-41d4-a716-446655440002',
                        location: 'Pé Direito',
                        date: '2024-01-15',
                        area: 12.5,
                        tissue: '75% Granulação',
                        risk: 'low',
                        aiAnalysis: 'Melhorando'
                    },
                    {
                        id: '550e8400-e29b-41d4-a716-446655440004',
                        location: 'Pé Esquerdo',
                        date: '2024-01-10',
                        area: 8.3,
                        tissue: '85% Granulação',
                        risk: 'low',
                        aiAnalysis: 'Excelente'
                    }
                ]);
            }, 800);
        });
    }

    async fetchUpcomingAppointments() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '550e8400-e29b-41d4-a716-446655440003',
                        date: '2024-01-22',
                        time: '14:30',
                        type: 'Presencial',
                        doctor: 'Dr. Maria Santos',
                        specialty: 'Dermatologia',
                        status: 'confirmed'
                    },
                    {
                        id: '550e8400-e29b-41d4-a716-446655440005',
                        date: '2024-01-25',
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

    updateStats(stats) {
        const statValues = document.querySelectorAll('.stat-value');
        if (statValues.length >= 4) {
            statValues[0].textContent = stats.activeWounds;
            statValues[1].textContent = stats.progress + '%';
            statValues[2].textContent = stats.nextAppointment;
            statValues[3].textContent = this.getRiskLabel(stats.infectionRisk);
        }

        // Update progress bars
        const progressBars = document.querySelectorAll('.progress-fill');
        if (progressBars.length > 0) {
            progressBars[0].style.width = stats.progress + '%';
        }
    }

    updateRecentAssessments(assessments) {
        const tableBody = document.querySelector('.table tbody');
        if (!tableBody) return;

        tableBody.innerHTML = assessments.map(assessment => `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--success), #34D399); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.75rem;">${assessment.id}</div>
                        <div>
                            <div style="font-weight: 500; color: var(--text-primary);">${assessment.location}</div>
                            <div style="font-size: 0.75rem; color: var(--text-muted);">${this.formatDate(assessment.date)}</div>
                        </div>
                    </div>
                </td>
                <td><span class="badge badge-gray">${assessment.tissue}</span></td>
                <td>${assessment.area} cm²</td>
                <td><span class="badge badge-${this.getRiskClass(assessment.risk)}">${this.getRiskLabel(assessment.risk)}</span></td>
                <td>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-sm btn-secondary" onclick="viewAssessment(${assessment.id})">
                            <span class="icon icon-eye"></span>
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="editAssessment(${assessment.id})">
                            <span class="icon icon-edit"></span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Re-attach event listeners
        document.querySelectorAll('.table tbody tr').forEach(row => {
            row.addEventListener('click', () => {
                this.handleTableRowClick(row);
            });
        });
    }

    updateUpcomingAppointments(appointments) {
        // Update appointments list if it exists
        const appointmentsList = document.querySelector('.appointments-list');
        if (!appointmentsList) return;

        appointmentsList.innerHTML = appointments.map(appointment => `
            <div style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: var(--radius-lg); border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-blue), var(--accent-blue-light)); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.875rem;">${appointment.id}</div>
                        <div>
                            <h4 style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">${appointment.type === 'Presencial' ? 'Consulta de Acompanhamento' : 'Teleconsulta'}</h4>
                            <p style="font-size: 0.875rem; color: var(--text-muted);">${appointment.doctor} - ${appointment.specialty}</p>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 0.875rem; color: var(--text-primary); font-weight: 500;">${appointment.time}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">${this.formatDate(appointment.date)}</div>
                    </div>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-sm btn-secondary">
                        <span class="icon icon-eye"></span>
                        Detalhes
                    </button>
                    <button class="btn btn-sm btn-primary">
                        <span class="icon icon-calendar"></span>
                        ${appointment.type === 'Presencial' ? 'Confirmar' : 'Entrar'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    initializeCharts() {
        // Initialize any charts on the dashboard
        const chartElements = document.querySelectorAll('[data-chart]');
        chartElements.forEach(element => {
            this.createChart(element);
        });
    }

    createChart(element) {
        const chartType = element.getAttribute('data-chart');
        const data = element.getAttribute('data-data');
        
        if (chartType === 'progress') {
            const progressBar = element.querySelector('.progress-fill');
            if (progressBar && data) {
                // Animate progress bar
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = data + '%';
                }, 500);
            }
        }
    }

    // Action methods
    openWoundCapture() {
        if (window.healPlusApp) {
            window.healPlusApp.showNotification('Abrindo captura de ferida...', 'info');
        }
        // Navigate to wound capture page
        setTimeout(() => {
            window.location.href = 'wound-capture.html';
        }, 1000);
    }

    generateReport() {
        if (window.healPlusApp) {
            window.healPlusApp.showLoading();
        }

        // Simulate report generation
        setTimeout(() => {
            if (window.healPlusApp) {
                window.healPlusApp.showNotification('Relatório gerado com sucesso!', 'success');
                window.healPlusApp.hideLoading();
            }
        }, 2000);
    }

    openComparison() {
        if (window.healPlusApp) {
            window.healPlusApp.showNotification('Abrindo comparação de avaliações...', 'info');
        }
    }

    openTelehealth() {
        if (window.healPlusApp) {
            window.healPlusApp.showNotification('Abrindo teleconsulta...', 'info');
        }
        // Navigate to telehealth page
        setTimeout(() => {
            window.location.href = 'telehealth.html';
        }, 1000);
    }

    viewAssessment(id) {
        if (window.healPlusApp) {
            window.healPlusApp.showNotification(`Visualizando avaliação ${id}...`, 'info');
        }
    }

    editAssessment(id) {
        if (window.healPlusApp) {
            window.healPlusApp.showNotification(`Editando avaliação ${id}...`, 'info');
        }
    }

    deleteAssessment(id) {
        if (confirm(`Tem certeza que deseja excluir a avaliação ${id}?`)) {
            if (window.healPlusApp) {
                window.healPlusApp.showNotification(`Avaliação ${id} excluída com sucesso!`, 'success');
            }
        }
    }

    // Utility methods
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
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

    getRiskClass(risk) {
        const classes = {
            low: 'success',
            medium: 'warning',
            high: 'error',
            critical: 'error'
        };
        return classes[risk] || 'primary';
    }
}

// Initialize dashboard manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on a dashboard page
    if (document.querySelector('.dashboard') || document.querySelector('.action-card')) {
        window.dashboardManager = new DashboardManager();
    }
});

// Global functions for HTML onclick handlers
function openWoundCapture() {
    if (window.dashboardManager) {
        window.dashboardManager.openWoundCapture();
    }
}

function generateReport() {
    if (window.dashboardManager) {
        window.dashboardManager.generateReport();
    }
}

function openComparison() {
    if (window.dashboardManager) {
        window.dashboardManager.openComparison();
    }
}

function openTelehealth() {
    if (window.dashboardManager) {
        window.dashboardManager.openTelehealth();
    }
}

function viewAssessment(id) {
    if (window.dashboardManager) {
        window.dashboardManager.viewAssessment(id);
    }
}

function editAssessment(id) {
    if (window.dashboardManager) {
        window.dashboardManager.editAssessment(id);
    }
}

function deleteAssessment(id) {
    if (window.dashboardManager) {
        window.dashboardManager.deleteAssessment(id);
    }
}

// Export for use in other modules
window.DashboardManager = DashboardManager;
