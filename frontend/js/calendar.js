// Heal+ Calendar Implementation
class HealPlusCalendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = null;
        this.appointments = [];
        this.init();
    }

    init() {
        this.loadAppointments();
        this.generateCalendar();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Chart period controls
        document.querySelectorAll('.chart-controls .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-controls .btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChart(e.target.getAttribute('data-period'));
            });
        });
    }

    loadAppointments() {
        // Simulate loading appointments from API
        this.appointments = [
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
            },
            {
                id: 3,
                date: '2024-02-05',
                time: '09:00',
                type: 'Presencial',
                doctor: 'Dr. Ana Costa',
                specialty: 'Cuidados com Feridas',
                status: 'scheduled'
            }
        ];
    }

    generateCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month display
        const monthDisplay = document.getElementById('currentMonth');
        if (monthDisplay) {
            monthDisplay.textContent = this.getMonthName(month) + ' ' + year;
        }

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Clear calendar
        calendarGrid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayElement.setAttribute('data-date', dateString);

            // Check if today
            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayElement.classList.add('today');
            }

            // Check if has appointment
            if (this.hasAppointmentOnDate(dateString)) {
                dayElement.classList.add('has-appointment');
                dayElement.title = this.getAppointmentsOnDate(dateString).map(apt => 
                    `${apt.time} - ${apt.doctor}`
                ).join('\n');
            }

            // Add click event
            dayElement.addEventListener('click', () => {
                this.selectDate(dateString, dayElement);
            });

            calendarGrid.appendChild(dayElement);
        }

        // Add empty cells for days after month ends
        const totalCells = calendarGrid.children.length - 7; // Subtract day headers
        const remainingCells = 42 - totalCells; // 6 rows * 7 days
        for (let i = 0; i < remainingCells; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            calendarGrid.appendChild(emptyDay);
        }
    }

    selectDate(dateString, dayElement) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        // Add selection to clicked day
        dayElement.classList.add('selected');
        this.selectedDate = dateString;

        // Show appointments for selected date
        this.showAppointmentsForDate(dateString);
    }

    showAppointmentsForDate(dateString) {
        const appointments = this.getAppointmentsOnDate(dateString);
        
        // Create or update appointments modal
        let modal = document.getElementById('appointmentsModal');
        if (!modal) {
            modal = this.createAppointmentsModal();
            document.body.appendChild(modal);
        }

        const modalBody = modal.querySelector('.modal-body');
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });

        modal.querySelector('.modal-header h2').textContent = `Consultas - ${formattedDate}`;

        if (appointments.length === 0) {
            modalBody.innerHTML = `
                <div class="no-appointments">
                    <i class="fas fa-calendar-times"></i>
                    <h3>Nenhuma consulta agendada</h3>
                    <p>Não há consultas agendadas para esta data.</p>
                    <button class="btn btn-primary" onclick="openAppointmentModal('in-person')">
                        <i class="fas fa-plus"></i>
                        Agendar Consulta
                    </button>
                </div>
            `;
        } else {
            modalBody.innerHTML = appointments.map(appointment => `
                <div class="appointment-detail">
                    <div class="appointment-time">
                        <i class="fas fa-clock"></i>
                        <span>${appointment.time}</span>
                    </div>
                    <div class="appointment-info">
                        <h3>${appointment.type === 'Presencial' ? 'Consulta Presencial' : 'Teleconsulta'}</h3>
                        <p><strong>Médico:</strong> ${appointment.doctor}</p>
                        <p><strong>Especialidade:</strong> ${appointment.specialty}</p>
                        ${appointment.location ? `<p><strong>Local:</strong> ${appointment.location}</p>` : ''}
                        <p><strong>Status:</strong> <span class="status-badge status-${appointment.status}">${this.getStatusLabel(appointment.status)}</span></p>
                    </div>
                    <div class="appointment-actions">
                        <button class="btn btn-outline btn-sm" onclick="showAppointmentDetails(${appointment.id})">
                            <i class="fas fa-info-circle"></i>
                            Detalhes
                        </button>
                        ${appointment.status === 'scheduled' ? `
                            <button class="btn btn-primary btn-sm" onclick="confirmAppointment(${appointment.id})">
                                <i class="fas fa-check"></i>
                                Confirmar
                            </button>
                        ` : ''}
                        ${appointment.type === 'Teleconsulta' && appointment.status === 'confirmed' ? `
                            <button class="btn btn-success btn-sm" onclick="joinTelehealthSession(${appointment.id})">
                                <i class="fas fa-video"></i>
                                Entrar
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('');
        }

        this.openModal('appointmentsModal');
    }

    createAppointmentsModal() {
        const modal = document.createElement('div');
        modal.id = 'appointmentsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Consultas</h2>
                    <button class="modal-close" onclick="closeModal('appointmentsModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Content will be populated dynamically -->
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal('appointmentsModal')">Fechar</button>
                </div>
            </div>
        `;
        return modal;
    }

    hasAppointmentOnDate(dateString) {
        return this.appointments.some(appointment => appointment.date === dateString);
    }

    getAppointmentsOnDate(dateString) {
        return this.appointments.filter(appointment => appointment.date === dateString);
    }

    getMonthName(monthIndex) {
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return months[monthIndex];
    }

    getStatusLabel(status) {
        const labels = {
            scheduled: 'Agendada',
            confirmed: 'Confirmada',
            completed: 'Concluída',
            cancelled: 'Cancelada',
            no_show: 'Não Compareceu'
        };
        return labels[status] || status;
    }

    previousMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.generateCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.generateCalendar();
    }

    updateChart(period) {
        // Update the healing progress chart based on selected period
        const ctx = document.getElementById('healingChart');
        if (!ctx) return;

        let labels, data;
        
        switch (period) {
            case '30':
                labels = ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29'];
                data = [20, 18, 15.2, 12.5, 10];
                break;
            case '90':
                labels = ['Nov 1', 'Nov 15', 'Dez 1', 'Dez 15', 'Jan 1', 'Jan 15', 'Jan 29'];
                data = [25, 23, 21, 19, 20, 15.2, 10];
                break;
            case '180':
                labels = ['Ago 1', 'Set 1', 'Out 1', 'Nov 1', 'Dez 1', 'Jan 1', 'Jan 29'];
                data = [30, 28, 26, 25, 20, 15.2, 10];
                break;
            default:
                return;
        }

        // Update chart data
        const chart = Chart.getChart(ctx);
        if (chart) {
            chart.data.labels = labels;
            chart.data.datasets[0].data = data;
            chart.update();
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Appointment management methods
    async confirmAppointment(appointmentId) {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update appointment status
            const appointment = this.appointments.find(apt => apt.id === appointmentId);
            if (appointment) {
                appointment.status = 'confirmed';
            }
            
            // Show success message
            if (window.healPlusApp) {
                window.healPlusApp.showNotification('Consulta confirmada com sucesso!', 'success');
            }
            
            // Refresh calendar
            this.generateCalendar();
            
            // Close modal
            this.closeModal('appointmentsModal');
            
        } catch (error) {
            console.error('Error confirming appointment:', error);
            if (window.healPlusApp) {
                window.healPlusApp.showNotification('Erro ao confirmar consulta', 'error');
            }
        }
    }

    async joinTelehealthSession(appointmentId) {
        try {
            // Simulate joining telehealth session
            if (window.healPlusApp) {
                window.healPlusApp.showNotification('Conectando à teleconsulta...', 'info');
            }
            
            // In a real app, this would open the video call interface
            setTimeout(() => {
                if (window.healPlusApp) {
                    window.healPlusApp.showNotification('Sessão de teleconsulta iniciada!', 'success');
                }
            }, 2000);
            
        } catch (error) {
            console.error('Error joining telehealth session:', error);
            if (window.healPlusApp) {
                window.healPlusApp.showNotification('Erro ao conectar à teleconsulta', 'error');
            }
        }
    }

    showAppointmentDetails(appointmentId) {
        const appointment = this.appointments.find(apt => apt.id === appointmentId);
        if (!appointment) return;

        // Create details modal
        let modal = document.getElementById('appointmentDetailsModal');
        if (!modal) {
            modal = this.createAppointmentDetailsModal();
            document.body.appendChild(modal);
        }

        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="appointment-details">
                <div class="detail-section">
                    <h3>Informações da Consulta</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Data:</label>
                            <span>${new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div class="detail-item">
                            <label>Horário:</label>
                            <span>${appointment.time}</span>
                        </div>
                        <div class="detail-item">
                            <label>Tipo:</label>
                            <span>${appointment.type}</span>
                        </div>
                        <div class="detail-item">
                            <label>Médico:</label>
                            <span>${appointment.doctor}</span>
                        </div>
                        <div class="detail-item">
                            <label>Especialidade:</label>
                            <span>${appointment.specialty}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status:</label>
                            <span class="status-badge status-${appointment.status}">${this.getStatusLabel(appointment.status)}</span>
                        </div>
                    </div>
                </div>
                
                ${appointment.type === 'Teleconsulta' ? `
                    <div class="detail-section">
                        <h3>Informações da Teleconsulta</h3>
                        <div class="telehealth-info">
                            <p><strong>Link da reunião:</strong> <a href="#" onclick="copyMeetingLink()">Clique para copiar</a></p>
                            <p><strong>ID da reunião:</strong> 123-456-789</p>
                            <p><strong>Senha:</strong> 123456</p>
                            <div class="telehealth-instructions">
                                <h4>Instruções:</h4>
                                <ul>
                                    <li>Teste sua câmera e microfone antes da consulta</li>
                                    <li>Certifique-se de ter uma boa conexão com a internet</li>
                                    <li>Entre na sala 5 minutos antes do horário agendado</li>
                                    <li>Tenha seus exames e medicamentos em mãos</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ` : `
                    <div class="detail-section">
                        <h3>Informações do Local</h3>
                        <div class="location-info">
                            <p><strong>Endereço:</strong> Rua das Flores, 123 - São Paulo, SP</p>
                            <p><strong>Sala:</strong> 205</p>
                            <p><strong>Telefone:</strong> (11) 99999-9999</p>
                            <div class="location-instructions">
                                <h4>Instruções:</h4>
                                <ul>
                                    <li>Chegue 15 minutos antes do horário agendado</li>
                                    <li>Traga um documento de identificação</li>
                                    <li>Use máscara durante toda a consulta</li>
                                    <li>Tenha seus exames e medicamentos em mãos</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `}
                
                <div class="detail-section">
                    <h3>Ações</h3>
                    <div class="action-buttons">
                        ${appointment.status === 'scheduled' ? `
                            <button class="btn btn-primary" onclick="confirmAppointment(${appointment.id})">
                                <i class="fas fa-check"></i>
                                Confirmar Consulta
                            </button>
                        ` : ''}
                        <button class="btn btn-outline" onclick="rescheduleAppointment(${appointment.id})">
                            <i class="fas fa-calendar-alt"></i>
                            Reagendar
                        </button>
                        <button class="btn btn-outline" onclick="cancelAppointment(${appointment.id})">
                            <i class="fas fa-times"></i>
                            Cancelar
                        </button>
                        ${appointment.type === 'Teleconsulta' && appointment.status === 'confirmed' ? `
                            <button class="btn btn-success" onclick="joinTelehealthSession(${appointment.id})">
                                <i class="fas fa-video"></i>
                                Entrar na Consulta
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        this.openModal('appointmentDetailsModal');
    }

    createAppointmentDetailsModal() {
        const modal = document.createElement('div');
        modal.id = 'appointmentDetailsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2>Detalhes da Consulta</h2>
                    <button class="modal-close" onclick="closeModal('appointmentDetailsModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Content will be populated dynamically -->
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" onclick="closeModal('appointmentDetailsModal')">Fechar</button>
                </div>
            </div>
        `;
        return modal;
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calendar = new HealPlusCalendar();
});

// Global functions for HTML onclick handlers
function closeModal(modalId) {
    if (window.calendar) {
        window.calendar.closeModal(modalId);
    }
}

function confirmAppointment(appointmentId) {
    if (window.calendar) {
        window.calendar.confirmAppointment(appointmentId);
    }
}

function joinTelehealthSession(appointmentId) {
    if (window.calendar) {
        window.calendar.joinTelehealthSession(appointmentId);
    }
}

function showAppointmentDetails(appointmentId) {
    if (window.calendar) {
        window.calendar.showAppointmentDetails(appointmentId);
    }
}

function copyMeetingLink() {
    const meetingLink = 'https://meet.healplus.com/123-456-789';
    navigator.clipboard.writeText(meetingLink).then(() => {
        if (window.healPlusApp) {
            window.healPlusApp.showNotification('Link copiado para a área de transferência!', 'success');
        }
    });
}

// Add CSS for calendar styling
const calendarStyles = `
<style>
.calendar-day-header {
    text-align: center;
    font-weight: 600;
    color: #64748b;
    padding: 8px;
    font-size: 14px;
}

.calendar-day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
}

.calendar-day:hover {
    background-color: #f1f5f9;
}

.calendar-day.other-month {
    color: #cbd5e1;
    cursor: default;
}

.calendar-day.other-month:hover {
    background-color: transparent;
}

.calendar-day.today {
    background-color: #2563eb;
    color: white;
    font-weight: 600;
}

.calendar-day.has-appointment::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background-color: #10b981;
    border-radius: 50%;
}

.calendar-day.today.has-appointment::after {
    background-color: white;
}

.calendar-day.selected {
    background-color: #3b82f6;
    color: white;
}

.appointment-detail {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 12px;
}

.appointment-time {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 80px;
    font-weight: 600;
    color: #2563eb;
}

.appointment-info {
    flex: 1;
}

.appointment-info h3 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
}

.appointment-info p {
    margin: 0 0 2px 0;
    font-size: 14px;
    color: #64748b;
}

.appointment-actions {
    display: flex;
    gap: 8px;
}

.no-appointments {
    text-align: center;
    padding: 40px 20px;
    color: #64748b;
}

.no-appointments i {
    font-size: 48px;
    color: #cbd5e1;
    margin-bottom: 16px;
}

.no-appointments h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: #475569;
}

.no-appointments p {
    margin: 0 0 24px 0;
    font-size: 14px;
}

.detail-section {
    margin-bottom: 24px;
}

.detail-section h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detail-item label {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.detail-item span {
    font-size: 14px;
    color: #1e293b;
}

.telehealth-info,
.location-info {
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.telehealth-info p,
.location-info p {
    margin: 0 0 8px 0;
    font-size: 14px;
    color: #475569;
}

.telehealth-info a {
    color: #2563eb;
    text-decoration: none;
}

.telehealth-info a:hover {
    text-decoration: underline;
}

.telehealth-instructions,
.location-instructions {
    margin-top: 16px;
}

.telehealth-instructions h4,
.location-instructions h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
}

.telehealth-instructions ul,
.location-instructions ul {
    margin: 0;
    padding-left: 20px;
    color: #64748b;
}

.telehealth-instructions li,
.location-instructions li {
    margin-bottom: 4px;
    font-size: 14px;
}

.action-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.modal-content.large {
    max-width: 700px;
}

@media (max-width: 768px) {
    .appointment-detail {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .appointment-actions {
        width: 100%;
        justify-content: center;
    }
    
    .detail-grid {
        grid-template-columns: 1fr;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    .action-buttons .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>
`;

// Add styles to document
document.head.insertAdjacentHTML('beforeend', calendarStyles);
