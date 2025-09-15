// Wound Evaluation JavaScript
class WoundEvaluation {
    constructor() {
        this.init();
    }

    init() {
        this.initializeFormSections();
        this.initializeFormValidation();
        this.initializeFormSubmission();
    }

    initializeFormSections() {
        // Toggle sections on click
        const sectionHeaders = document.querySelectorAll('.section-header');
        sectionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const section = header.closest('.form-section');
                this.toggleSection(section);
            });
        });

        // Open first section by default
        const firstSection = document.querySelector('.form-section');
        if (firstSection) {
            this.toggleSection(firstSection, true);
        }
    }

    toggleSection(section, forceOpen = false) {
        const isActive = section.classList.contains('active');
        
        if (forceOpen || !isActive) {
            // Close all other sections
            document.querySelectorAll('.form-section').forEach(s => {
                s.classList.remove('active');
            });
            
            // Open current section
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    }

    initializeFormValidation() {
        const form = document.getElementById('evaluationForm');
        if (!form) return;

        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        if (isRequired && !value) {
            this.showFieldError(field, 'Este campo é obrigatório');
            return false;
        }

        // Specific validations
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Email inválido');
                return false;
            }
        }

        if (field.type === 'number' && value) {
            const num = parseFloat(value);
            if (isNaN(num) || num < 0) {
                this.showFieldError(field, 'Número inválido');
                return false;
            }
        }

        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#ef4444';
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        field.style.borderColor = '';
    }

    initializeFormSubmission() {
        const form = document.getElementById('evaluationForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    handleFormSubmission() {
        // Validate all fields
        const form = document.getElementById('evaluationForm');
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Por favor, corrija os erros no formulário', 'error');
            return;
        }

        // Collect form data
        const formData = this.collectFormData();
        
        // Show loading state
        const saveBtn = document.querySelector('.save-btn');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
        saveBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Save to localStorage
            const evaluations = JSON.parse(localStorage.getItem('woundEvaluations') || '[]');
            evaluations.push({
                id: Date.now(),
                ...formData,
                createdAt: new Date().toISOString(),
                status: 'draft'
            });
            localStorage.setItem('woundEvaluations', JSON.stringify(evaluations));

            // Reset form
            this.resetForm();

            // Show success message
            this.showNotification('Avaliação salva com sucesso!', 'success');

            // Reset button
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'professional-dashboard.html';
            }, 2000);

        }, 2000);
    }

    collectFormData() {
        const form = document.getElementById('evaluationForm');
        const formData = new FormData(form);
        const data = {};

        // Collect text inputs
        formData.forEach((value, key) => {
            if (data[key]) {
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        });

        // Collect radio buttons
        const radioGroups = form.querySelectorAll('input[type="radio"]:checked');
        radioGroups.forEach(radio => {
            data[radio.name] = radio.value;
        });

        // Collect checkboxes
        const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            if (data[checkbox.name]) {
                if (Array.isArray(data[checkbox.name])) {
                    data[checkbox.name].push(checkbox.value);
                } else {
                    data[checkbox.name] = [data[checkbox.name], checkbox.value];
                }
            } else {
                data[checkbox.name] = [checkbox.value];
            }
        });

        return data;
    }

    resetForm() {
        const form = document.getElementById('evaluationForm');
        form.reset();
        
        // Close all sections
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Open first section
        const firstSection = document.querySelector('.form-section');
        if (firstSection) {
            this.toggleSection(firstSection, true);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WoundEvaluation();
});

// Initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    new WoundEvaluation();
}


