// Global Theme and Settings Manager
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentFontSize = localStorage.getItem('fontSize') || 'medium';
        this.currentLanguage = localStorage.getItem('language') || 'pt-BR';
        
        this.init();
    }

    init() {
        this.applySettings();
        this.setupThemeToggle();
        this.setupFontSizeToggle();
        this.setupLanguageSelect();
        this.setupAccessibilityFeatures();
    }

    applySettings() {
        this.applyTheme();
        this.applyFontSize();
        this.applyLanguage();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            if (this.currentTheme === 'dark') {
                metaThemeColor.setAttribute('content', '#0f172a');
            } else if (this.currentTheme === 'high-contrast') {
                metaThemeColor.setAttribute('content', '#000000');
            } else {
                metaThemeColor.setAttribute('content', '#2563eb');
            }
        }
    }

    applyFontSize() {
        document.documentElement.setAttribute('data-font-size', this.currentFontSize);
    }

    applyLanguage() {
        document.documentElement.lang = this.currentLanguage;
    }

    setupThemeToggle() {
        // Look for theme toggles in the current page
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const highContrastToggle = document.getElementById('high-contrast-toggle');
        const themeToggle = document.getElementById('theme-toggle');

        if (darkModeToggle) {
            darkModeToggle.checked = this.currentTheme === 'dark';
            darkModeToggle.addEventListener('change', (e) => {
                this.currentTheme = e.target.checked ? 'dark' : 'light';
                this.applyTheme();
                localStorage.setItem('theme', this.currentTheme);
            });
        }

        if (highContrastToggle) {
            highContrastToggle.checked = this.currentTheme === 'high-contrast';
            highContrastToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.currentTheme = 'high-contrast';
                } else {
                    this.currentTheme = darkModeToggle?.checked ? 'dark' : 'light';
                }
                this.applyTheme();
                localStorage.setItem('theme', this.currentTheme);
            });
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    setupFontSizeToggle() {
        const fontSizeButtons = document.querySelectorAll('.font-size-btn');
        
        fontSizeButtons.forEach(button => {
            const size = button.getAttribute('data-size');
            if (size === this.currentFontSize) {
                button.classList.add('active');
            }

            button.addEventListener('click', () => {
                fontSizeButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                this.currentFontSize = size;
                this.applyFontSize();
                localStorage.setItem('fontSize', this.currentFontSize);
            });
        });
    }

    setupLanguageSelect() {
        const languageSelect = document.getElementById('language-select');
        
        if (languageSelect) {
            languageSelect.value = this.currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                this.applyLanguage();
                localStorage.setItem('language', this.currentLanguage);
                this.updateLanguageText();
            });
        }
    }

    setupAccessibilityFeatures() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Alt + T for theme toggle
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }
            
            // Alt + F for font size toggle
            if (e.altKey && e.key === 'f') {
                e.preventDefault();
                this.toggleFontSize();
            }
            
            // Alt + L for language toggle
            if (e.altKey && e.key === 'l') {
                e.preventDefault();
                this.toggleLanguage();
            }
        });

        // Focus management
        this.setupFocusManagement();
        
        // Reduced motion support
        this.setupReducedMotion();
    }

    setupFocusManagement() {
        // Add focus indicators for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.setAttribute('data-reduced-motion', 'true');
        }

        prefersReducedMotion.addEventListener('change', (e) => {
            document.documentElement.setAttribute('data-reduced-motion', e.matches);
        });
    }

    toggleTheme() {
        const themes = ['light', 'dark', 'high-contrast'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        
        this.currentTheme = themes[nextIndex];
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
        
        this.showNotification(`Tema alterado para: ${this.getThemeName(this.currentTheme)}`, 'info');
    }

    toggleFontSize() {
        const sizes = ['small', 'medium', 'large'];
        const currentIndex = sizes.indexOf(this.currentFontSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        
        this.currentFontSize = sizes[nextIndex];
        this.applyFontSize();
        localStorage.setItem('fontSize', this.currentFontSize);
        
        this.showNotification(`Tamanho da fonte alterado para: ${this.getFontSizeName(this.currentFontSize)}`, 'info');
    }

    toggleLanguage() {
        const languages = ['pt-BR', 'en-US', 'es-ES'];
        const currentIndex = languages.indexOf(this.currentLanguage);
        const nextIndex = (currentIndex + 1) % languages.length;
        
        this.currentLanguage = languages[nextIndex];
        this.applyLanguage();
        localStorage.setItem('language', this.currentLanguage);
        
        this.showNotification(`Idioma alterado para: ${this.getLanguageName(this.currentLanguage)}`, 'info');
    }

    getThemeName(theme) {
        const names = {
            'light': 'Claro',
            'dark': 'Escuro',
            'high-contrast': 'Alto Contraste'
        };
        return names[theme] || theme;
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

    updateLanguageText() {
        // This would typically load language files and update all text
        // For now, we'll just show a notification
        this.showNotification('Idioma alterado com sucesso!', 'success');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="icon icon-${type}"></span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">
                    <span class="icon icon-close"></span>
                </button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }

    // Public methods for external use
    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme();
        localStorage.setItem('theme', this.currentTheme);
    }

    setFontSize(size) {
        this.currentFontSize = size;
        this.applyFontSize();
        localStorage.setItem('fontSize', this.currentFontSize);
    }

    setLanguage(language) {
        this.currentLanguage = language;
        this.applyLanguage();
        localStorage.setItem('language', this.currentLanguage);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getCurrentFontSize() {
        return this.currentFontSize;
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for use in other modules
window.ThemeManager = ThemeManager;
