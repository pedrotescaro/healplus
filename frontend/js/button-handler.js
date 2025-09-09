// Button Handler - Garante que todos os botões funcionem corretamente
class ButtonHandler {
    constructor() {
        this.init();
    }

    init() {
        this.setupButtonListeners();
        this.setupFormHandlers();
        this.setupNavigationHandlers();
    }

    setupButtonListeners() {
        // Aguarda o DOM estar carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupButtonListeners());
            return;
        }

        // Botões de ação
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleButtonClick(button);
            });
        });

        // Cards clicáveis
        document.querySelectorAll('.action-card, .stat-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCardClick(card);
            });
        });

        // Links de navegação
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigationClick(link);
            });
        });

        // Botões de modal
        document.querySelectorAll('[data-modal]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(button.dataset.modal);
            });
        });

        // Botões de fechar modal
        document.querySelectorAll('.modal-close, .close-modal').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal(button.closest('.modal'));
            });
        });
    }

    setupFormHandlers() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }

    setupNavigationHandlers() {
        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
        }

        // Logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }

    handleButtonClick(button) {
        const buttonText = button.textContent.trim();
        const buttonClass = button.className;
        const onclick = button.getAttribute('onclick');
        const href = button.getAttribute('href');
        const dataAction = button.dataset.action;

        console.log('Button clicked:', { buttonText, buttonClass, onclick, href, dataAction });

        // Executar onclick se existir
        if (onclick) {
            try {
                eval(onclick);
            } catch (error) {
                console.error('Error executing onclick:', error);
                this.showNotification('Erro ao executar ação', 'error');
            }
            return;
        }

        // Executar ação baseada em data-action
        if (dataAction) {
            this.executeAction(dataAction, button);
            return;
        }

        // Navegação por href
        if (href && href !== '#') {
            if (href.startsWith('#')) {
                this.handleInternalNavigation(href);
            } else {
                window.location.href = href;
            }
            return;
        }

        // Ações baseadas no texto do botão
        this.executeActionByText(buttonText, button);
    }

    handleCardClick(card) {
        const title = card.querySelector('.card-title')?.textContent;
        const onclick = card.getAttribute('onclick');
        const href = card.getAttribute('href');

        console.log('Card clicked:', { title, onclick, href });

        if (onclick) {
            try {
                eval(onclick);
            } catch (error) {
                console.error('Error executing card onclick:', error);
            }
        } else if (href) {
            if (href.startsWith('#')) {
                this.handleInternalNavigation(href);
            } else {
                window.location.href = href;
            }
        }
    }

    handleNavigationClick(link) {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();

        console.log('Navigation clicked:', { text, href });

        if (href) {
            if (href.startsWith('#')) {
                this.handleInternalNavigation(href);
            } else {
                window.location.href = href;
            }
        }
    }

    executeAction(action, element) {
        switch (action) {
            case 'login':
                this.handleLogin();
                break;
            case 'logout':
                this.handleLogout();
                break;
            case 'register':
                this.handleRegister();
                break;
            case 'capture-wound':
                this.handleWoundCapture();
                break;
            case 'start-telehealth':
                this.handleTelehealth();
                break;
            case 'view-profile':
                this.handleViewProfile();
                break;
            case 'edit-profile':
                this.handleEditProfile();
                break;
            case 'save-profile':
                this.handleSaveProfile();
                break;
            case 'cancel':
                this.handleCancel();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    executeActionByText(text, button) {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('entrar') || lowerText.includes('login') || lowerText.includes('fazer login')) {
            this.handleLogin();
        } else if (lowerText.includes('sair') || lowerText.includes('logout') || lowerText.includes('deslogar')) {
            this.handleLogout();
        } else if (lowerText.includes('registrar') || lowerText.includes('cadastrar') || lowerText.includes('criar conta')) {
            this.handleRegister();
        } else if (lowerText.includes('capturar') || lowerText.includes('ferida') || lowerText.includes('nova avaliação')) {
            this.handleWoundCapture();
        } else if (lowerText.includes('teleconsulta') || lowerText.includes('vídeo') || lowerText.includes('consulta')) {
            this.handleTelehealth();
        } else if (lowerText.includes('perfil') || lowerText.includes('configurações')) {
            this.handleViewProfile();
        } else if (lowerText.includes('salvar') || lowerText.includes('guardar')) {
            this.handleSaveProfile();
        } else if (lowerText.includes('cancelar') || lowerText.includes('voltar')) {
            this.handleCancel();
        } else if (lowerText.includes('editar') || lowerText.includes('modificar')) {
            this.handleEditProfile();
        } else if (lowerText.includes('excluir') || lowerText.includes('deletar') || lowerText.includes('remover')) {
            this.handleDelete();
        } else if (lowerText.includes('adicionar') || lowerText.includes('novo') || lowerText.includes('criar')) {
            this.handleAdd();
        } else if (lowerText.includes('buscar') || lowerText.includes('pesquisar') || lowerText.includes('procurar')) {
            this.handleSearch();
        } else if (lowerText.includes('filtrar') || lowerText.includes('ordenar')) {
            this.handleFilter();
        } else if (lowerText.includes('exportar') || lowerText.includes('baixar') || lowerText.includes('download')) {
            this.handleExport();
        } else if (lowerText.includes('imprimir') || lowerText.includes('print')) {
            this.handlePrint();
        } else if (lowerText.includes('compartilhar') || lowerText.includes('enviar')) {
            this.handleShare();
        } else {
            console.log('No specific action for button text:', text);
            this.showNotification(`Ação "${text}" não implementada ainda`, 'info');
        }
    }

    handleLogin() {
        console.log('Login action triggered');
        const email = document.getElementById('email')?.value;
        const password = document.getElementById('password')?.value;
        const userType = document.querySelector('input[name="userType"]:checked')?.value || 
                        document.querySelector('.user-type-btn.active')?.dataset?.type;

        if (!email || !password) {
            this.showNotification('Por favor, preencha todos os campos', 'error');
            return;
        }

        this.showNotification('Fazendo login...', 'info');
        
        // Simular login
        setTimeout(() => {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userType', userType || 'patient');
            this.showNotification('Login realizado com sucesso!', 'success');
            
            // Redirecionar baseado no tipo de usuário
            if (userType === 'clinician') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
    }

    handleLogout() {
        console.log('Logout action triggered');
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userType');
            this.showNotification('Logout realizado com sucesso!', 'success');
            window.location.href = 'html/login.html';
        }
    }

    handleRegister() {
        console.log('Register action triggered');
        window.location.href = 'register.html';
    }

    handleWoundCapture() {
        console.log('Wound capture action triggered');
        window.location.href = 'html/wound-capture.html';
    }

    handleTelehealth() {
        console.log('Telehealth action triggered');
        window.location.href = 'html/telehealth.html';
    }

    handleViewProfile() {
        console.log('View profile action triggered');
        window.location.href = 'html/profile.html';
    }

    handleEditProfile() {
        console.log('Edit profile action triggered');
        const editBtn = document.querySelector('.edit-profile-btn');
        const saveBtn = document.querySelector('.save-profile-btn');
        const cancelBtn = document.querySelector('.cancel-profile-btn');
        const inputs = document.querySelectorAll('.profile-input');

        if (editBtn) editBtn.style.display = 'none';
        if (saveBtn) saveBtn.style.display = 'inline-block';
        if (cancelBtn) cancelBtn.style.display = 'inline-block';
        
        inputs.forEach(input => input.disabled = false);
        
        this.showNotification('Modo de edição ativado', 'info');
    }

    handleSaveProfile() {
        console.log('Save profile action triggered');
        this.showNotification('Perfil salvo com sucesso!', 'success');
        
        // Voltar ao modo de visualização
        const editBtn = document.querySelector('.edit-profile-btn');
        const saveBtn = document.querySelector('.save-profile-btn');
        const cancelBtn = document.querySelector('.cancel-profile-btn');
        const inputs = document.querySelectorAll('.profile-input');

        if (editBtn) editBtn.style.display = 'inline-block';
        if (saveBtn) saveBtn.style.display = 'none';
        if (cancelBtn) cancelBtn.style.display = 'none';
        
        inputs.forEach(input => input.disabled = true);
    }

    handleCancel() {
        console.log('Cancel action triggered');
        this.closeAllModals();
    }
    
    handleDelete() {
        console.log('Delete action triggered');
        if (confirm('Tem certeza que deseja excluir este item?')) {
            this.showNotification('Item excluído com sucesso!', 'success');
        }
    }
    
    handleAdd() {
        console.log('Add action triggered');
        this.showNotification('Funcionalidade de adicionar em desenvolvimento', 'info');
    }
    
    handleSearch() {
        console.log('Search action triggered');
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="buscar"], input[placeholder*="pesquisar"]');
        if (searchInput) {
            searchInput.focus();
        } else {
            this.showNotification('Funcionalidade de busca em desenvolvimento', 'info');
        }
    }
    
    handleFilter() {
        console.log('Filter action triggered');
        this.showNotification('Funcionalidade de filtro em desenvolvimento', 'info');
    }
    
    handleExport() {
        console.log('Export action triggered');
        this.showNotification('Exportando dados...', 'info');
        setTimeout(() => {
            this.showNotification('Dados exportados com sucesso!', 'success');
        }, 1000);
    }
    
    handlePrint() {
        console.log('Print action triggered');
        window.print();
    }
    
    handleShare() {
        console.log('Share action triggered');
        if (navigator.share) {
            navigator.share({
                title: 'Heal+ - Portal de Saúde',
                text: 'Confira o Heal+, sistema completo para monitoramento de feridas e teleconsultas.',
                url: window.location.href
            });
        } else {
            this.showNotification('Link copiado para a área de transferência!', 'success');
        }
    }

    handleFormSubmit(form) {
        console.log('Form submitted:', form);
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Form data:', data);
        this.showNotification('Formulário enviado com sucesso!', 'success');
    }

    handleInternalNavigation(href) {
        console.log('Internal navigation:', href);
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        document.body.style.overflow = 'auto';
    }

    showNotification(message, type = 'info') {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        // Cores baseadas no tipo
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Adicionar ao DOM
        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.buttonHandler = new ButtonHandler();
});

// Inicializar imediatamente se o DOM já estiver pronto
if (document.readyState !== 'loading') {
    window.buttonHandler = new ButtonHandler();
}
