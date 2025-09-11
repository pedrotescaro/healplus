// FAQ Test Script - Simple and Direct
console.log('FAQ Test Script loaded');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM ready, setting up FAQ...');
    setupFAQ();
});

// Also try immediately
if (document.readyState !== 'loading') {
    console.log('DOM already ready, setting up FAQ immediately...');
    setupFAQ();
}

function setupFAQ() {
    console.log('Setting up FAQ...');
    
    // Find all FAQ question containers
    const faqContainers = document.querySelectorAll('.faq-question-container');
    console.log('Found FAQ containers:', faqContainers.length);
    
    if (faqContainers.length === 0) {
        console.error('No FAQ containers found!');
        return;
    }
    
    // Set up click handlers
    faqContainers.forEach((container, index) => {
        console.log('Setting up FAQ container', index);
        
        // Remove any existing event listeners
        container.onclick = null;
        
        // Add new click handler
        container.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('FAQ clicked:', index);
            toggleFAQ(index);
        };
    });
    
    // Open first FAQ by default
    openFirstFAQ();
}

function openFirstFAQ() {
    console.log('Opening first FAQ...');
    
    const firstAnswer = document.getElementById('faq-answer-0');
    const firstIcon = document.getElementById('faq-icon-0');
    const firstCard = firstAnswer ? firstAnswer.closest('.faq-card') : null;
    
    console.log('First FAQ elements:', { firstAnswer, firstIcon, firstCard });
    
    if (firstAnswer && firstIcon && firstCard) {
        firstCard.classList.add('active');
        firstAnswer.style.display = 'block';
        firstIcon.className = 'fas fa-chevron-up faq-icon';
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
    
    console.log('FAQ elements:', { answer, icon, card });
    
    if (!answer || !icon || !card) {
        console.error('FAQ elements not found for index:', index);
        return;
    }
    
    // Check if this FAQ is currently open
    const isOpen = answer.style.display === 'block';
    
    if (isOpen) {
        // Close this FAQ
        console.log('Closing FAQ:', index);
        answer.style.display = 'none';
        icon.className = 'fas fa-chevron-down faq-icon';
        card.classList.remove('active');
    } else {
        // Close all FAQs first
        console.log('Closing all FAQs and opening:', index);
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
        
        // Open selected FAQ
        answer.style.display = 'block';
        icon.className = 'fas fa-chevron-up faq-icon';
        card.classList.add('active');
        console.log('FAQ opened:', index);
    }
}

// Global function for onclick handlers
window.toggleFAQ = toggleFAQ;

console.log('FAQ Test Script ready');
