// FAQ Simple Script - Guaranteed to work
console.log('FAQ Simple Script loaded');

// Simple FAQ functionality
function setupFAQ() {
    console.log('Setting up FAQ...');
    
    // Wait for elements to be available
    const checkElements = () => {
        const containers = document.querySelectorAll('.faq-question-container');
        console.log('Found FAQ containers:', containers.length);
        
        if (containers.length === 0) {
            console.log('No containers found, retrying...');
            setTimeout(checkElements, 100);
            return;
        }
        
        // Set up click handlers
        containers.forEach((container, index) => {
            container.onclick = function(e) {
                e.preventDefault();
                console.log('FAQ clicked:', index);
                toggleFAQ(index);
            };
        });
        
        // Open first FAQ
        openFirstFAQ();
    };
    
    checkElements();
}

function openFirstFAQ() {
    console.log('Opening first FAQ...');
    const firstAnswer = document.getElementById('faq-answer-0');
    const firstIcon = document.getElementById('faq-icon-0');
    const firstCard = firstAnswer ? firstAnswer.closest('.faq-card') : null;
    
    if (firstAnswer && firstIcon && firstCard) {
        firstAnswer.style.display = 'block';
        firstIcon.className = 'fas fa-chevron-up faq-icon';
        firstCard.classList.add('active');
        console.log('First FAQ opened successfully');
    } else {
        console.error('Could not find first FAQ elements');
    }
}

function toggleFAQ(index) {
    console.log('Toggling FAQ:', index);
    
    const answer = document.getElementById(`faq-answer-${index}`);
    const icon = document.getElementById(`faq-icon-${index}`);
    const card = answer ? answer.closest('.faq-card') : null;
    
    if (!answer || !icon || !card) {
        console.error('FAQ elements not found for index:', index);
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
            if (faqIcon) {
                faqIcon.className = 'fas fa-chevron-down faq-icon';
            }
            if (faqCard) {
                faqCard.classList.remove('active');
            }
        });
        
        // Open this one
        answer.style.display = 'block';
        icon.className = 'fas fa-chevron-up faq-icon';
        card.classList.add('active');
        console.log('FAQ opened:', index);
    }
}

// Global function
window.toggleFAQ = toggleFAQ;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFAQ);
} else {
    setupFAQ();
}

// Also try after a delay
setTimeout(setupFAQ, 1000);

console.log('FAQ Simple Script ready');
