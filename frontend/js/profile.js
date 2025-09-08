// Heal+ Profile Management
class ProfileManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProfileData();
        this.loadUserPreferences();
    }

    setupEventListeners() {
        // Profile form submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }

        // Avatar upload
        const avatarUpload = document.querySelector('.avatar-upload');
        if (avatarUpload) {
            avatarUpload.addEventListener('click', () => {
                this.uploadAvatar();
            });
        }

        // Toggle switches
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.updateSetting(toggle.id, e.target.checked);
            });
        });

        // Theme toggles
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                this.updateSetting('dark-mode-toggle', e.target.checked);
            });
        }

        const highContrastToggle = document.getElementById('high-contrast-toggle');
        if (highContrastToggle) {
            highContrastToggle.addEventListener('change', (e) => {
                this.updateSetting('high-contrast-toggle', e.target.checked);
            });
        }

        // Font size buttons
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFontSize(btn.getAttribute('data-size'));
            });
        });

        // Language select
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }

        // Danger zone buttons
        const deleteAccountBtn = document.getElementById('delete-account');
        if (deleteAccountBtn) {
            deleteAccountBtn.addEventListener('click', () => {
                this.deleteAccount();
            });
        }

        const exportDataBtn = document.getElementById('export-data');
        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', () => {
                this.exportData();
            });
        }
    }

    loadProfileData() {
        // Load user profile data
        const profileData = {
            fullName: 'Dr. Maria Santos',
            email: 'maria.santos@healplus.com',
            specialty: 'Dermatologia',
            woundSpecialist: true,
            crm: 'CRM 123456',
            coren: 'COREN 789012',
            phone: '+55 11 99999-9999',
            institution: 'Hospital São Paulo',
            bio: 'Especialista em dermatologia com foco em tratamento de feridas complexas.'
        };

        this.populateProfileForm(profileData);
    }

    loadUserPreferences() {
        // Load and apply current preferences
        const theme = localStorage.getItem('theme') || 'dark';
        const fontSize = localStorage.getItem('fontSize') || 'medium';
        const language = localStorage.getItem('language') || 'pt-BR';

        // Apply theme
        document.documentElement.setAttribute('data-theme', theme);

        // Apply font size
        document.documentElement.setAttribute('data-font-size', fontSize);

        // Apply language
        document.documentElement.lang = language;

        // Update UI elements
        this.updatePreferenceUI();
    }

    updatePreferenceUI() {
        // Update theme toggles
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            const theme = localStorage.getItem('theme') || 'dark';
            darkModeToggle.checked = theme === 'dark';
        }

        const highContrastToggle = document.getElementById('high-contrast-toggle');
        if (highContrastToggle) {
            const theme = localStorage.getItem('theme') || 'dark';
            highContrastToggle.checked = theme === 'high-contrast';
        }

        // Update font size buttons
        const fontSize = localStorage.getItem('fontSize') || 'medium';
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-size') === fontSize) {
                btn.classList.add('active');
            }
        });

        // Update language select
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = localStorage.getItem('language') || 'pt-BR';
        }

        // Update other toggles
        const toggleIds = ['email-notifications', 'push-notifications', 'appointment-reminders', 'two-factor-auth'];
        toggleIds.forEach(id => {
            const toggle = document.getElementById(id);
            if (toggle) {
                toggle.checked = localStorage.getItem(id) === 'true';
            }
        });
    }

    populateProfileForm(data) {
        // Populate form fields
        const fields = {
            'full-name': data.fullName,
            'email': data.email,
            'specialty': data.specialty,
            'crm': data.crm,
            'coren': data.coren,
            'phone': data.phone,
            'institution': data.institution,
            'bio': data.bio
        };

        Object.entries(fields).forEach(([id, value]) => {
            const field = document.getElementById(id);
            if (field) {
                field.value = value;
            }
        });

        // Set wound specialist toggle
        const woundSpecialistToggle = document.getElementById('wound-specialist');
        if (woundSpecialistToggle) {
            woundSpecialistToggle.checked = data.woundSpecialist;
        }
    }

    async saveProfile() {
        try {
            if (window.healPlusApp) {
                window.healPlusApp.showLoading();
            }

            const formData = new FormData(document.getElementById('profileForm'));
            const profileData = Object.fromEntries(formData.entries());

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (window.healPlusApp) {
                window.healPlusApp.showNotification('Perfil atualizado com sucesso!', 'success');
                window.healPlusApp.hideLoading();
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            if (window.healPlusApp) {
                window.healPlusApp.showNotification('Erro ao salvar perfil', 'error');
                window.healPlusApp.hideLoading();
            }
        }
    }

    uploadAvatar() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleAvatarUpload(file);
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    handleAvatarUpload(file) {
        // Validate file
        if (!file.type.startsWith('image/')) {
            if (window.healPlusApp) {
                window.healPlusApp.showNotification('Por favor, selecione uma imagem válida', 'error');
            }
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            if (window.healPlusApp) {
                window.healPlusApp.showNotification('A imagem deve ter menos de 5MB', 'error');
            }
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const avatarElements = document.querySelectorAll('.user-avatar');
            avatarElements.forEach(avatar => {
                if (avatar.tagName === 'IMG') {
                    avatar.src = e.target.result;
                } else {
                    // For text avatars, we could update the background image
                    avatar.style.backgroundImage = `url(${e.target.result})`;
                    avatar.style.backgroundSize = 'cover';
                    avatar.style.backgroundPosition = 'center';
                }
            });

            if (window.healPlusApp) {
                window.healPlusApp.showNotification('Avatar atualizado com sucesso!', 'success');
            }
        };

        reader.readAsDataURL(file);
    }

    updateSetting(settingId, value) {
        // Save setting to localStorage
        localStorage.setItem(settingId, value);

        // Apply setting immediately
        switch (settingId) {
            case 'dark-mode-toggle':
                this.setTheme(value ? 'dark' : 'light');
                break;
            case 'high-contrast-toggle':
                this.setTheme(value ? 'high-contrast' : 'dark');
                break;
            case 'email-notifications':
                this.toggleEmailNotifications(value);
                break;
            case 'push-notifications':
                this.togglePushNotifications(value);
                break;
            case 'appointment-reminders':
                this.toggleAppointmentReminders(value);
                break;
            case 'two-factor-auth':
                this.toggleTwoFactorAuth(value);
                break;
        }

        if (window.healPlusApp) {
            window.healPlusApp.showNotification('Configuração atualizada!', 'success');
        }
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme manager if available
        if (window.themeManager) {
            window.themeManager.setTheme(theme);
        }
    }

    toggleEmailNotifications(enabled) {
        console.log('Email notifications:', enabled ? 'enabled' : 'disabled');
    }

    togglePushNotifications(enabled) {
        console.log('Push notifications:', enabled ? 'enabled' : 'disabled');
        
        if (enabled && 'Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Push notifications permission granted');
                }
            });
        }
    }

    toggleAppointmentReminders(enabled) {
        console.log('Appointment reminders:', enabled ? 'enabled' : 'disabled');
    }

    toggleTwoFactorAuth(enabled) {
        console.log('Two-factor authentication:', enabled ? 'enabled' : 'disabled');
        
        if (enabled) {
            // In a real app, this would initiate 2FA setup
            if (window.healPlusApp) {
                window.healPlusApp.showNotification('Configuração de 2FA iniciada. Verifique seu email.', 'info');
            }
        }
    }

    setFontSize(size) {
        // Remove active class from all buttons
        document.querySelectorAll('.font-size-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to selected button
        const selectedBtn = document.querySelector(`[data-size="${size}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        // Apply font size immediately
        document.documentElement.setAttribute('data-font-size', size);
        localStorage.setItem('fontSize', size);

        // Update theme manager if available
        if (window.themeManager) {
            window.themeManager.setFontSize(size);
        }

        if (window.healPlusApp) {
            window.healPlusApp.showNotification(`Tamanho da fonte alterado para: ${this.getFontSizeName(size)}`, 'info');
        }
    }

    setLanguage(language) {
        document.documentElement.lang = language;
        localStorage.setItem('language', language);

        // Update theme manager if available
        if (window.themeManager) {
            window.themeManager.setLanguage(language);
        }

        if (window.healPlusApp) {
            window.healPlusApp.showNotification(`Idioma alterado para: ${this.getLanguageName(language)}`, 'info');
        }
    }

    getFontSizeName(size) {
        const names = {
            'small': 'Pequeno',
            'medium': 'Médio',
            'large': 'Grande'
        };
        return names[size] || size;
    }

    getLanguageName(language) {
        const names = {
            'pt-BR': 'Português (Brasil)',
            'en-US': 'English (US)',
            'es-ES': 'Español'
        };
        return names[language] || language;
    }

    deleteAccount() {
        if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão permanentemente removidos.')) {
            if (confirm('Esta é sua última chance. Tem certeza absoluta?')) {
                if (window.healPlusApp) {
                    window.healPlusApp.showLoading();
                }

                // Simulate account deletion
                setTimeout(() => {
                    if (window.healPlusApp) {
                        window.healPlusApp.showNotification('Conta excluída com sucesso', 'success');
                        window.healPlusApp.hideLoading();
                        
                        // Redirect to login
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 2000);
                    }
                }, 3000);
            }
        }
    }

    exportData() {
        if (window.healPlusApp) {
            window.healPlusApp.showLoading();
        }

        // Simulate data export
        setTimeout(() => {
            // Create and download data file
            const data = {
                profile: this.getProfileData(),
                settings: this.getSettingsData(),
                exportDate: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `healplus-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);

            if (window.healPlusApp) {
                window.healPlusApp.showNotification('Dados exportados com sucesso!', 'success');
                window.healPlusApp.hideLoading();
            }
        }, 2000);
    }

    getProfileData() {
        const form = document.getElementById('profileForm');
        if (!form) return {};

        const formData = new FormData(form);
        return Object.fromEntries(formData.entries());
    }

    getSettingsData() {
        return {
            emailNotifications: localStorage.getItem('email-notifications') === 'true',
            pushNotifications: localStorage.getItem('push-notifications') === 'true',
            appointmentReminders: localStorage.getItem('appointment-reminders') === 'true',
            twoFactorAuth: localStorage.getItem('two-factor-auth') === 'true',
            fontSize: localStorage.getItem('fontSize') || 'medium',
            language: localStorage.getItem('language') || 'pt-BR',
            theme: localStorage.getItem('theme') || 'dark'
        };
    }
}

// Initialize profile manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if we're on a profile page
    if (document.getElementById('profileForm') || document.querySelector('.profile-section')) {
        window.profileManager = new ProfileManager();
    }
});

// Export for use in other modules
window.ProfileManager = ProfileManager;