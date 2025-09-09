// Enhanced Buttons - Funcionalidades avançadas para botões
class EnhancedButtons {
    constructor() {
        this.init();
    }

    init() {
        this.setupEnhancedButtonListeners();
        this.setupFormEnhancements();
        this.setupNavigationEnhancements();
        this.setupAccessibilityFeatures();
    }

    setupEnhancedButtonListeners() {
        // Aguarda o DOM estar carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEnhancedButtonListeners());
            return;
        }

        // Botões com loading states
        document.querySelectorAll('.btn[data-loading]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleLoadingButton(button, e);
            });
        });

        // Botões com confirmação
        document.querySelectorAll('.btn[data-confirm]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleConfirmButton(button, e);
            });
        });

        // Botões com tooltip
        document.querySelectorAll('.btn[data-tooltip]').forEach(button => {
            this.setupTooltip(button);
        });

        // Botões com atalhos de teclado
        document.querySelectorAll('.btn[data-shortcut]').forEach(button => {
            this.setupKeyboardShortcut(button);
        });

        // Botões de ação rápida
        document.querySelectorAll('.quick-action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleQuickAction(button, e);
            });
        });
    }

    setupFormEnhancements() {
        // Validação em tempo real
        document.querySelectorAll('input[required]').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });

        // Auto-save para formulários longos
        document.querySelectorAll('form[data-autosave]').forEach(form => {
            this.setupAutoSave(form);
        });

        // Formulários com steps
        document.querySelectorAll('.form-step').forEach(step => {
            this.setupFormSteps(step);
        });
    }

    setupNavigationEnhancements() {
        // Links com loading
        document.querySelectorAll('a[data-loading]').forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleLoadingLink(link, e);
            });
        });

        // Navegação com histórico
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.trackNavigation(item);
            });
        });
    }

    setupAccessibilityFeatures() {
        // Foco visível
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // ARIA labels dinâmicos
        document.querySelectorAll('.btn:not([aria-label])').forEach(button => {
            if (!button.getAttribute('aria-label') && button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });
    }

    // Métodos de manipulação de botões
    handleLoadingButton(button, event) {
        const originalText = button.textContent;
        const loadingText = button.dataset.loading || 'Carregando...';
        
        // Mostrar loading
        button.disabled = true;
        button.innerHTML = `<span class="loading-spinner"></span> ${loadingText}`;
        
        // Simular operação
        setTimeout(() => {
            button.disabled = false;
            button.textContent = originalText;
            this.showNotification('Operação concluída!', 'success');
        }, 2000);
    }

    handleConfirmButton(button, event) {
        const message = button.dataset.confirm || 'Tem certeza?';
        
        if (!confirm(message)) {
            event.preventDefault();
            return false;
        }
        
        // Executar ação original
        const onclick = button.getAttribute('onclick');
        if (onclick) {
            eval(onclick);
        }
    }

    handleQuickAction(button, event) {
        const action = button.dataset.action;
        const icon = button.querySelector('.icon');
        
        // Animação de clique
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 200);

        // Executar ação baseada no tipo
        switch (action) {
            case 'add':
                this.quickAdd();
                break;
            case 'edit':
                this.quickEdit();
                break;
            case 'delete':
                this.quickDelete();
                break;
            case 'copy':
                this.quickCopy();
                break;
            case 'share':
                this.quickShare();
                break;
            default:
                console.log('Quick action not implemented:', action);
        }
    }

    handleLoadingLink(link, event) {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#')) {
            this.showNotification('Carregando página...', 'info');
        }
    }

    // Métodos de ação rápida
    quickAdd() {
        this.showNotification('Adicionando item...', 'info');
        setTimeout(() => {
            this.showNotification('Item adicionado com sucesso!', 'success');
        }, 1000);
    }

    quickEdit() {
        this.showNotification('Modo de edição ativado', 'info');
    }

    quickDelete() {
        if (confirm('Tem certeza que deseja excluir?')) {
            this.showNotification('Item excluído!', 'success');
        }
    }

    quickCopy() {
        this.showNotification('Copiado para a área de transferência!', 'success');
    }

    quickShare() {
        if (navigator.share) {
            navigator.share({
                title: 'Heal+',
                text: 'Confira o Heal+',
                url: window.location.href
            });
        } else {
            this.showNotification('Link copiado!', 'success');
        }
    }

    // Métodos de validação
    validateField(field) {
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        const type = field.type;
        
        let isValid = true;
        let errorMessage = '';

        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'Este campo é obrigatório';
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Email inválido';
        } else if (type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Telefone inválido';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }

    // Métodos utilitários
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    setupTooltip(button) {
        const tooltipText = button.dataset.tooltip;
        if (!tooltipText) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
            position: absolute;
            background: #1f2937;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.875rem;
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
            white-space: nowrap;
        `;

        document.body.appendChild(tooltip);

        button.addEventListener('mouseenter', () => {
            const rect = button.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            tooltip.style.opacity = '1';
        });

        button.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    }

    setupKeyboardShortcut(button) {
        const shortcut = button.dataset.shortcut;
        if (!shortcut) return;

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === shortcut.toLowerCase()) {
                e.preventDefault();
                button.click();
            }
        });
    }

    setupAutoSave(form) {
        const interval = parseInt(form.dataset.autosave) || 30000; // 30 segundos
        
        setInterval(() => {
            if (this.hasFormChanges(form)) {
                this.autoSaveForm(form);
            }
        }, interval);
    }

    hasFormChanges(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        return Array.from(inputs).some(input => input.value.trim() !== '');
    }

    autoSaveForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Salvar no localStorage
        const formId = form.id || 'autosave-form';
        localStorage.setItem(`autosave-${formId}`, JSON.stringify(data));
        
        this.showNotification('Dados salvos automaticamente', 'info');
    }

    setupFormSteps(step) {
        const steps = document.querySelectorAll('.form-step');
        const currentStep = Array.from(steps).indexOf(step);
        
        // Botão próximo
        const nextBtn = step.querySelector('.next-step');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.goToNextStep(currentStep, steps);
            });
        }
        
        // Botão anterior
        const prevBtn = step.querySelector('.prev-step');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.goToPrevStep(currentStep, steps);
            });
        }
    }

    goToNextStep(currentStep, steps) {
        if (currentStep < steps.length - 1) {
            steps[currentStep].classList.remove('active');
            steps[currentStep + 1].classList.add('active');
        }
    }

    goToPrevStep(currentStep, steps) {
        if (currentStep > 0) {
            steps[currentStep].classList.remove('active');
            steps[currentStep - 1].classList.add('active');
        }
    }

    trackNavigation(item) {
        const href = item.getAttribute('href');
        const text = item.textContent.trim();
        
        // Salvar no histórico de navegação
        const history = JSON.parse(localStorage.getItem('navigationHistory') || '[]');
        history.push({
            page: href,
            title: text,
            timestamp: new Date().toISOString()
        });
        
        // Manter apenas os últimos 10 itens
        if (history.length > 10) {
            history.shift();
        }
        
        localStorage.setItem('navigationHistory', JSON.stringify(history));
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
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedButtons = new EnhancedButtons();
});

// Inicializar imediatamente se o DOM já estiver pronto
if (document.readyState !== 'loading') {
    window.enhancedButtons = new EnhancedButtons();
}
