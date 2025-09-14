// Remote Monitoring JavaScript
class RemoteMonitoring {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8080/api';
        this.cameraStream = null;
        this.currentCheckIn = null;
        this.patientData = this.loadPatientData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupNotifications();
    }

    setupEventListeners() {
        // Pain scale selection
        document.querySelectorAll('.scale-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectPainLevel(item);
            });
        });

        // Medication checkboxes
        document.querySelectorAll('input[name="medication"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateMedicationStatus(checkbox);
            });
        });

        // Alert actions
        document.querySelectorAll('.alert-action').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleAlertAction(e.target);
            });
        });
    }

    loadPatientData() {
        // Load patient data from localStorage or API
        return {
            id: 'patient_001',
            name: 'João Silva',
            streak: 7,
            lastCheckIn: new Date().toISOString(),
            medications: [
                { id: 'amoxicillin', name: 'Amoxicilina', dosage: '500mg', frequency: '3x ao dia' },
                { id: 'paracetamol', name: 'Paracetamol', dosage: '500mg', frequency: '2x ao dia' },
                { id: 'vitamin-c', name: 'Vitamina C', dosage: '1000mg', frequency: '1x ao dia' }
            ]
        };
    }

    async loadDashboardData() {
        try {
            // Load dashboard data from API
            const response = await fetch(`${this.apiBaseUrl}/monitoring/dashboard`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.updateDashboard(data);
            } else {
                // Use mock data if API is not available
                this.updateDashboard(this.getMockDashboardData());
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.updateDashboard(this.getMockDashboardData());
        }
    }

    getMockDashboardData() {
        return {
            streak: 7,
            weeklyProgress: {
                photos: { completed: 5, total: 7 },
                checkIns: { completed: 6, total: 7 },
                medications: { completed: 7, total: 7 }
            },
            recentActivity: [
                {
                    type: 'photo',
                    title: 'Foto enviada',
                    time: 'Hoje, 14:30',
                    status: 'success',
                    message: 'Análise concluída'
                },
                {
                    type: 'checkin',
                    title: 'Check-in de sintomas',
                    time: 'Hoje, 09:15',
                    status: 'success',
                    message: 'Completado'
                },
                {
                    type: 'medication',
                    title: 'Medicação registrada',
                    time: 'Ontem, 20:00',
                    status: 'success',
                    message: 'Em dia'
                },
                {
                    type: 'warning',
                    title: 'Alerta de risco',
                    time: 'Ontem, 16:45',
                    status: 'warning',
                    message: 'Monitorar'
                }
            ],
            alerts: [
                {
                    type: 'medication',
                    title: 'Lembrete de Medicação',
                    message: 'Hora de tomar o antibiótico',
                    time: 'Há 15 minutos',
                    action: 'Marcar como lido'
                },
                {
                    type: 'info',
                    title: 'Dica de Cuidado',
                    message: 'Mantenha a ferida seca após o banho',
                    time: 'Há 2 horas',
                    action: 'Marcar como lido'
                }
            ]
        };
    }

    updateDashboard(data) {
        // Update streak counter
        document.getElementById('streak-count').textContent = data.streak;

        // Update progress bars
        this.updateProgressBars(data.weeklyProgress);

        // Update recent activity
        this.updateRecentActivity(data.recentActivity);

        // Update alerts
        this.updateAlerts(data.alerts);
    }

    updateProgressBars(progress) {
        const progressItems = document.querySelectorAll('.progress-item');
        
        // Photos progress
        const photosProgress = (progress.photos.completed / progress.photos.total) * 100;
        progressItems[0].querySelector('.progress-value').textContent = 
            `${progress.photos.completed}/${progress.photos.total}`;
        progressItems[0].querySelector('.progress-fill').style.width = `${photosProgress}%`;

        // Check-ins progress
        const checkInsProgress = (progress.checkIns.completed / progress.checkIns.total) * 100;
        progressItems[1].querySelector('.progress-value').textContent = 
            `${progress.checkIns.completed}/${progress.checkIns.total}`;
        progressItems[1].querySelector('.progress-fill').style.width = `${checkInsProgress}%`;

        // Medications progress
        const medicationsProgress = (progress.medications.completed / progress.medications.total) * 100;
        progressItems[2].querySelector('.progress-value').textContent = 
            `${progress.medications.completed}/${progress.medications.total}`;
        progressItems[2].querySelector('.progress-fill').style.width = `${medicationsProgress}%`;
    }

    updateRecentActivity(activities) {
        const timeline = document.querySelector('.activity-timeline');
        timeline.innerHTML = '';

        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon ${activity.type}">
                    <i class="${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}
                        <span class="activity-time">${activity.time}</span>
                    </h4>
                    <p>${activity.message}</p>
                </div>
            `;
            timeline.appendChild(activityItem);
        });
    }

    updateAlerts(alerts) {
        const alertsList = document.querySelector('.alerts-list');
        alertsList.innerHTML = '';

        alerts.forEach(alert => {
            const alertItem = document.createElement('div');
            alertItem.className = `alert-item ${alert.type}`;
            alertItem.innerHTML = `
                <div class="alert-icon">
                    <i class="${this.getAlertIcon(alert.type)}"></i>
                </div>
                <div class="alert-content">
                    <h4>${alert.title}</h4>
                    <p>${alert.message}</p>
                    <span class="alert-time">${alert.time}</span>
                </div>
                <button class="alert-action" onclick="handleAlertAction(this)">${alert.action}</button>
            `;
            alertsList.appendChild(alertItem);
        });
    }

    getActivityIcon(type) {
        const icons = {
            photo: 'fas fa-camera',
            symptoms: 'fas fa-clipboard-check',
            checkin: 'fas fa-clipboard-check',
            medication: 'fas fa-pills',
            alert: 'fas fa-exclamation-triangle',
            warning: 'fas fa-exclamation-triangle'
        };
        return icons[type] || 'fas fa-clipboard-check';
    }

    getAlertIcon(type) {
        const icons = {
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
            success: 'fas fa-check-circle',
            error: 'fas fa-times-circle',
            medication: 'fas fa-pills'
        };
        return icons[type] || 'fas fa-info-circle';
    }

    // Check-in Functions
    startPhotoCheckIn() {
        this.currentCheckIn = 'photo';
        this.showCheckInForm('photo-checkin');
        this.initCamera();
    }

    startSymptomCheckIn() {
        this.currentCheckIn = 'symptoms';
        this.showCheckInForm('symptom-checkin');
    }

    startPainAssessment() {
        this.currentCheckIn = 'pain';
        this.showCheckInForm('symptom-checkin');
    }

    showCheckInForm(formId) {
        const forms = document.getElementById('checkin-forms');
        const form = document.getElementById(formId);
        
        // Hide all forms
        document.querySelectorAll('.checkin-form').forEach(f => f.style.display = 'none');
        
        // Show selected form
        form.style.display = 'block';
        forms.classList.add('active');
    }

    closeCheckIn() {
        const forms = document.getElementById('checkin-forms');
        forms.classList.remove('active');
        
        // Stop camera if active
        if (this.cameraStream) {
            this.stopCamera();
        }
        
        this.currentCheckIn = null;
    }

    // Camera Functions
    async initCamera() {
        try {
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'environment'
                }
            };

            this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
            const video = document.getElementById('photo-video');
            video.srcObject = this.cameraStream;

        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Erro ao acessar a câmera. Verifique as permissões.');
        }
    }

    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
    }

    async capturePhoto() {
        const video = document.getElementById('photo-video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            try {
                await this.submitPhotoCheckIn(blob);
                this.closeCheckIn();
                this.showSuccessMessage('Foto enviada com sucesso!');
                this.loadDashboardData(); // Refresh dashboard
            } catch (error) {
                console.error('Error submitting photo:', error);
                this.showErrorMessage('Erro ao enviar foto. Tente novamente.');
            }
        }, 'image/jpeg', 0.9);
    }

    async submitPhotoCheckIn(imageBlob) {
        const formData = new FormData();
        formData.append('image', imageBlob);
        formData.append('notes', document.getElementById('photo-notes').value);
        formData.append('timestamp', new Date().toISOString());

        const response = await fetch(`${this.apiBaseUrl}/monitoring/photo-checkin`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to submit photo check-in');
        }

        return response.json();
    }

    async submitSymptomCheckIn() {
        const formData = {
            appearance: document.querySelector('input[name="appearance"]:checked')?.value,
            symptoms: Array.from(document.querySelectorAll('input[name="symptoms"]:checked')).map(cb => cb.value),
            painLevel: document.querySelector('.scale-item.selected')?.dataset.level,
            notes: document.getElementById('symptom-notes').value,
            timestamp: new Date().toISOString()
        };

        const response = await fetch(`${this.apiBaseUrl}/monitoring/symptom-checkin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to submit symptom check-in');
        }

        return response.json();
    }

    async submitMedicationCheckIn() {
        const medications = Array.from(document.querySelectorAll('input[name="medication"]:checked')).map(cb => cb.value);
        const notes = document.getElementById('med-notes').value;

        const formData = {
            medications,
            notes,
            timestamp: new Date().toISOString()
        };

        const response = await fetch(`${this.apiBaseUrl}/monitoring/medication-checkin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to submit medication check-in');
        }

        return response.json();
    }

    // Pain Scale Selection
    selectPainLevel(item) {
        // Remove previous selection
        document.querySelectorAll('.scale-item').forEach(i => i.classList.remove('selected'));
        
        // Add selection to clicked item
        item.classList.add('selected');
    }

    // Medication Status
    updateMedicationStatus(checkbox) {
        const medicationItem = checkbox.closest('.medication-item');
        if (checkbox.checked) {
            medicationItem.style.background = '#e8f5e8';
            medicationItem.style.borderLeftColor = '#4CAF50';
        } else {
            medicationItem.style.background = '#f8f9fa';
            medicationItem.style.borderLeftColor = '#4CAF50';
        }
    }

    // Alert Actions
    handleAlertAction(button) {
        const alertItem = button.closest('.alert-item');
        alertItem.style.opacity = '0.5';
        button.textContent = 'Lido';
        button.disabled = true;
        
        // Remove alert after animation
        setTimeout(() => {
            alertItem.remove();
        }, 500);
    }

    // Notifications
    setupNotifications() {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Setup periodic notifications
        this.setupPeriodicNotifications();
    }

    setupPeriodicNotifications() {
        // Check for medication reminders every minute
        setInterval(() => {
            this.checkMedicationReminders();
        }, 60000);

        // Check for check-in reminders every hour
        setInterval(() => {
            this.checkCheckInReminders();
        }, 3600000);
    }

    checkMedicationReminders() {
        const now = new Date();
        const currentHour = now.getHours();
        
        // Check if it's medication time (8:00, 14:00, 20:00)
        if ([8, 14, 20].includes(currentHour)) {
            this.showMedicationReminder();
        }
    }

    checkCheckInReminders() {
        const lastCheckIn = new Date(this.patientData.lastCheckIn);
        const hoursSinceLastCheckIn = (new Date() - lastCheckIn) / (1000 * 60 * 60);
        
        if (hoursSinceLastCheckIn > 12) {
            this.showCheckInReminder();
        }
    }

    showMedicationReminder() {
        if (Notification.permission === 'granted') {
            new Notification('Heal+ - Lembrete de Medicação', {
                body: 'Hora de tomar sua medicação!',
                icon: '/favicon.ico',
                tag: 'medication-reminder'
            });
        }
    }

    showCheckInReminder() {
        if (Notification.permission === 'granted') {
            new Notification('Heal+ - Check-in Diário', {
                body: 'Que tal fazer um check-in sobre sua ferida?',
                icon: '/favicon.ico',
                tag: 'checkin-reminder'
            });
        }
    }

    // Utility Functions
    showSuccessMessage(message) {
        this.showToast(message, 'success');
    }

    showErrorMessage(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Style the toast
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#4CAF50',
            error: '#F44336',
            info: '#2196F3'
        };
        toast.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Global functions for HTML onclick events
function startPhotoCheckIn() {
    window.remoteMonitoring.startPhotoCheckIn();
}

function startSymptomCheckIn() {
    window.remoteMonitoring.startSymptomCheckIn();
}

function startPainAssessment() {
    window.remoteMonitoring.startPainAssessment();
}

function closeCheckIn() {
    window.remoteMonitoring.closeCheckIn();
}

function capturePhoto() {
    window.remoteMonitoring.capturePhoto();
}

function switchCamera() {
    console.log('Switching camera');
    // Implementation would depend on device capabilities
}

function handleAlertAction(button) {
    window.remoteMonitoring.handleAlertAction(button);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.remoteMonitoring = new RemoteMonitoring();
});
