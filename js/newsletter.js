/* ============================================
   StyleHub - Newsletter Functionality
   Email subscription with validation
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    initNewsletterForm();
});

/* ============================================
   Newsletter Form Initialization
   ============================================ */
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('emailInput');
    const formMessage = document.getElementById('formMessage');
    
    if (!form || !emailInput || !formMessage) {
        console.warn('Newsletter form elements not found');
        return;
    }
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleNewsletterSubmit(emailInput, formMessage);
    });
    
    // Real-time validation on input
    emailInput.addEventListener('input', function() {
        // Clear error message when user starts typing
        if (formMessage.classList.contains('error')) {
            formMessage.textContent = '';
            formMessage.classList.remove('error');
        }
        
        // Remove invalid state
        this.classList.remove('invalid');
    });
    
    // Validation on blur
    emailInput.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.classList.add('invalid');
            showMessage(formMessage, 'Please enter a valid email address', 'error');
        }
    });
}

/* ============================================
   Form Submission Handler
   ============================================ */
function handleNewsletterSubmit(emailInput, formMessage) {
    const email = emailInput.value.trim();
    
    // Validate email
    if (!email) {
        showMessage(formMessage, 'Please enter your email address', 'error');
        emailInput.focus();
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage(formMessage, 'Please enter a valid email address', 'error');
        emailInput.classList.add('invalid');
        emailInput.focus();
        return;
    }
    
    // Check if already subscribed (using localStorage)
    if (isAlreadySubscribed(email)) {
        showMessage(formMessage, 'This email is already subscribed!', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = emailInput.closest('form').querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    
    // Simulate API call (replace with actual API call in production)
    setTimeout(() => {
        // Save subscription (in production, this would be an API call)
        saveSubscription(email);
        
        // Show success message
        showMessage(formMessage, '🎉 Successfully subscribed! Check your email for confirmation.', 'success');
        
        // Clear form
        emailInput.value = '';
        emailInput.classList.remove('invalid');
        
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        
        // Track subscription (analytics)
        trackSubscription(email);
        
        // Optional: Show a celebration animation
        celebrateSubscription();
        
    }, 1500); // Simulate network delay
}

/* ============================================
   Email Validation
   ============================================ */
function validateEmail(email) {
    // RFC 5322 compliant email regex (simplified)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Additional checks
    if (!emailRegex.test(email)) {
        return false;
    }
    
    // Check for common typos
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1];
    
    // Warn about potential typos (optional enhancement)
    if (domain && !commonDomains.includes(domain)) {
        // Could suggest corrections here
    }
    
    return true;
}

/* ============================================
   Subscription Management
   ============================================ */
function saveSubscription(email) {
    try {
        // Get existing subscriptions
        const subscriptions = getSubscriptions();
        
        // Add new subscription with timestamp
        subscriptions.push({
            email: email,
            subscribedAt: new Date().toISOString(),
            confirmed: false
        });
        
        // Save to localStorage
        localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
        
        return true;
    } catch (error) {
        console.error('Error saving subscription:', error);
        return false;
    }
}

function getSubscriptions() {
    try {
        const data = localStorage.getItem('newsletter_subscriptions');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting subscriptions:', error);
        return [];
    }
}

function isAlreadySubscribed(email) {
    const subscriptions = getSubscriptions();
    return subscriptions.some(sub => sub.email.toLowerCase() === email.toLowerCase());
}

/* ============================================
   UI Feedback
   ============================================ */
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = 'form-message ' + type;
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            element.textContent = '';
            element.className = 'form-message';
        }, 5000);
    }
}

/* ============================================
   Analytics & Tracking
   ============================================ */
function trackSubscription(email) {
    // In production, send to analytics service
    console.log('Newsletter subscription tracked:', {
        email: email,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    });
    
    // Example: Google Analytics event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_signup', {
            'event_category': 'engagement',
            'event_label': 'newsletter'
        });
    }
    
    // Example: Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
    }
}

/* ============================================
   Celebration Animation
   ============================================ */
function celebrateSubscription() {
    // Create confetti effect or other celebration
    const newsletter = document.querySelector('.newsletter');
    
    if (newsletter) {
        // Add a temporary celebration class
        newsletter.classList.add('celebrate');
        
        // Remove after animation
        setTimeout(() => {
            newsletter.classList.remove('celebrate');
        }, 2000);
    }
    
    // Optional: Create confetti particles
    createConfetti();
}

function createConfetti() {
    const colors = ['#6366f1', '#ec4899', '#f59e0b'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: 1;
            transform: rotate(${Math.random() * 360}deg);
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(confetti);
        
        // Animate confetti falling
        const duration = 2000 + Math.random() * 1000;
        const animation = confetti.animate([
            { 
                transform: `translateY(0) rotate(0deg)`,
                opacity: 1
            },
            { 
                transform: `translateY(${window.innerHeight + 20}px) rotate(${360 + Math.random() * 360}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        // Remove confetti after animation
        animation.onfinish = () => confetti.remove();
    }
}

/* ============================================
   Email Suggestions (Optional Enhancement)
   ============================================ */
function suggestEmailCorrection(email) {
    const commonDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
        'icloud.com', 'aol.com', 'mail.com'
    ];
    
    const parts = email.split('@');
    if (parts.length !== 2) return null;
    
    const [username, domain] = parts;
    
    // Check for similar domains
    for (const correctDomain of commonDomains) {
        if (levenshteinDistance(domain, correctDomain) <= 2) {
            return `${username}@${correctDomain}`;
        }
    }
    
    return null;
}

// Levenshtein distance algorithm for string similarity
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

/* ============================================
   Unsubscribe Functionality (for future use)
   ============================================ */
function unsubscribe(email) {
    try {
        const subscriptions = getSubscriptions();
        const filtered = subscriptions.filter(sub => sub.email.toLowerCase() !== email.toLowerCase());
        localStorage.setItem('newsletter_subscriptions', JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error unsubscribing:', error);
        return false;
    }
}

/* ============================================
   Export functions for testing
   ============================================ */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        saveSubscription,
        getSubscriptions,
        isAlreadySubscribed,
        suggestEmailCorrection
    };
}

// Made with Bob
