// Landing Page JavaScript
class LandingPage {
    constructor() {
        this.init();
    }

    init() {
        this.initializeThemeToggle();
        this.initializeSmoothScrolling();
        this.initializeAnimations();
        this.initializeFAQ();
    }

    initializeThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;

        // Check for saved theme preference or default to light
        const currentTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(currentTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeToggle = document.querySelector('.theme-toggle i');
        if (themeToggle) {
            themeToggle.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    initializeSmoothScrolling() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initializeAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature-card, .result-card, .faq-item, .pricing-card').forEach(el => {
            observer.observe(el);
        });

        // Animate stats on scroll
        this.animateStats();
    }

    animateStats() {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumbers(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-number').forEach(stat => {
            statsObserver.observe(stat);
        });
    }

    animateNumbers(element) {
        const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
        const duration = 2000; // 2 seconds
        const start = performance.now();
        const startValue = 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            // Update the element with the current value
            const originalText = element.textContent;
            const suffix = originalText.replace(/[\d,]/g, '');
            element.textContent = currentValue.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    initializeFAQ() {
        // Simple FAQ functionality
        console.log('Initializing FAQ...');
        
        // Wait a bit for DOM to be ready
        setTimeout(() => {
            this.setupSimpleFAQ();
        }, 500);
    }

    setupSimpleFAQ() {
        console.log('Setting up simple FAQ...');
        
        // Find all FAQ containers
        const containers = document.querySelectorAll('.faq-question-container');
        console.log('Found containers:', containers.length);
        
        // Set up click handlers
        containers.forEach((container, index) => {
            // Remove any existing handlers
            container.onclick = null;
            
            // Add new handler
            container.onclick = (e) => {
                e.preventDefault();
                console.log('FAQ clicked:', index);
                this.toggleSimpleFAQ(index);
            };
        });
        
        // Open first FAQ
        this.openFirstSimpleFAQ();
    }

    openFirstSimpleFAQ() {
        console.log('Opening first FAQ...');
        const firstAnswer = document.getElementById('faq-answer-0');
        const firstIcon = document.getElementById('faq-icon-0');
        const firstCard = firstAnswer ? firstAnswer.closest('.faq-card') : null;
        
        if (firstAnswer && firstIcon && firstCard) {
            firstAnswer.style.display = 'block';
            firstIcon.className = 'fas fa-chevron-up faq-icon';
            firstCard.classList.add('active');
            console.log('First FAQ opened');
        }
    }

    toggleSimpleFAQ(index) {
        console.log('Toggling FAQ:', index);
        
        const answer = document.getElementById(`faq-answer-${index}`);
        const icon = document.getElementById(`faq-icon-${index}`);
        const card = answer ? answer.closest('.faq-card') : null;
        
        if (!answer || !icon || !card) {
            console.error('Elements not found for index:', index);
            return;
        }
        
        // Check if currently open
        const isOpen = answer.style.display === 'block';
        
        if (isOpen) {
            // Close it
            answer.style.display = 'none';
            icon.className = 'fas fa-chevron-down faq-icon';
            card.classList.remove('active');
            console.log('FAQ closed:', index);
        } else {
            // Close all others first
            document.querySelectorAll('.faq-answer').forEach((ans, i) => {
                ans.style.display = 'none';
                const faqIcon = document.getElementById(`faq-icon-${i}`);
                const faqCard = ans.closest('.faq-card');
                if (faqIcon) faqIcon.className = 'fas fa-chevron-down faq-icon';
                if (faqCard) faqCard.classList.remove('active');
            });
            
            // Open this one
            answer.style.display = 'block';
            icon.className = 'fas fa-chevron-up faq-icon';
            card.classList.add('active');
            console.log('FAQ opened:', index);
        }
    }
}

// Global FAQ toggle function for onclick handlers
let landingPageInstance = null;

function toggleFAQ(index) {
    console.log('Global toggleFAQ called with index:', index);
    if (landingPageInstance && landingPageInstance.toggleSimpleFAQ) {
        landingPageInstance.toggleSimpleFAQ(index);
    } else {
        console.error('LandingPage instance not found or method not available');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing LandingPage...');
    landingPageInstance = new LandingPage();
});

// Initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('DOM already loaded, initializing LandingPage immediately...');
    landingPageInstance = new LandingPage();
}

// Additional fallback for FAQ
window.addEventListener('load', () => {
    console.log('Window loaded, checking FAQ...');
    if (landingPageInstance && landingPageInstance.setupFAQ) {
        setTimeout(() => {
            landingPageInstance.setupFAQ();
        }, 500);
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .feature-card,
    .result-card,
    .faq-item,
    .pricing-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .feature-card.animate-in,
    .result-card.animate-in,
    .faq-item.animate-in,
    .pricing-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .faq-item.active .faq-question {
        color: var(--primary-blue);
    }
    
    .faq-question {
        cursor: pointer;
        transition: color 0.3s ease;
    }
    
    .faq-question:hover {
        color: var(--primary-blue);
    }
`;
document.head.appendChild(style);

