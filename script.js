// Enhanced Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const body = document.body;

// Toggle mobile menu
hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        body.style.overflow = '';
    }
});

// Handle navigation clicks for multi-page navigation
// No need for smooth scrolling since we're navigating between pages
// The browser will handle page navigation naturally

// Enhanced navbar background and active link highlighting
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

function updateNavbar() {
    const currentScrollY = window.scrollY;
    
    // Update navbar background
    if (currentScrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.borderBottomColor = 'rgba(226, 232, 240, 0.8)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.borderBottomColor = 'rgba(226, 232, 240, 0.6)';
    }
    
    // Hide/show navbar on scroll (optional)
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
    
    // Update active navigation link
    updateActiveNavLink();
}

function updateActiveNavLink() {
    // For multi-page navigation, active link is determined by current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        
        // Check if this link corresponds to the current page
        if ((currentPage === 'index.html' || currentPage === '') && linkHref === 'index.html') {
            link.classList.add('active');
        } else if (linkHref === currentPage) {
            link.classList.add('active');
        }
    });
}

// Throttled scroll event
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateNavbar();
            ticking = false;
        });
        ticking = true;
    }
});

// Enhanced form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            company: formData.get('company')?.trim(),
            subject: formData.get('subject'),
            message: formData.get('message')?.trim()
        };
        
        // Enhanced validation
        const errors = validateForm(data);
        if (errors.length > 0) {
            showFormErrors(errors);
            return;
        }
        
        // Submit form
        await submitForm(data);
    });
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
    }
    
    if (!data.email) {
        errors.push('Email address is required');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            errors.push('Please enter a valid email address');
        }
    }
    
    if (!data.message || data.message.length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
    }
    
    return errors;
}

function showFormErrors(errors) {
    // Remove existing error messages
    document.querySelectorAll('.form-error').forEach(el => el.remove());
    
    // Create and show error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.cssText = `
        background: #fee2e2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 0.875rem;
    `;
    errorDiv.innerHTML = `
        <strong>Please fix the following errors:</strong>
        <ul style="margin: 8px 0 0 20px;">
            ${errors.map(error => `<li>${error}</li>`).join('')}
        </ul>
    `;
    
    contactForm.insertBefore(errorDiv, contactForm.firstChild);
    
    // Scroll to error message
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showFormSuccess() {
    // Remove existing messages
    document.querySelectorAll('.form-error, .form-success').forEach(el => el.remove());
    
    // Create and show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.style.cssText = `
        background: #dcfce7;
        border: 1px solid #bbf7d0;
        color: #166534;
        padding: 12px 16px;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 0.875rem;
    `;
    successDiv.innerHTML = `
        <strong>✓ Message sent successfully!</strong><br>
        Thank you for reaching out. We'll get back to you within 24 hours.
    `;
    
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function submitForm(data) {
    const submitButton = contactForm.querySelector('.submit-button');
    const originalContent = submitButton.innerHTML;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-opacity="0.3"/>
            <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
        </svg>
        <span>Sending...</span>
    `;
    
    try {
        // Simulate API call (replace with actual endpoint)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success message
        showFormSuccess();
        
        // Reset form
        contactForm.reset();
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormErrors(['An error occurred while sending your message. Please try again.']);
    } finally {
        // Restore button
        submitButton.disabled = false;
        submitButton.innerHTML = originalContent;
    }
}

// Page initialization
document.addEventListener('DOMContentLoaded', () => {
    // Elements are now visible by default
    const animateElements = document.querySelectorAll(`
        .service-card,
        .partner-slot,
        .stat-item,
        .team-highlight,
        .blog-preview,
        .contact-card
    `);
    
    animateElements.forEach((el, index) => {
        // Set elements to visible state
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
    
    // Set hero content to visible
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'none';
    }
    
    // Set floating cards to visible
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.opacity = '1';
        card.style.transform = 'none';
    });
});

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
        body.style.overflow = '';
    }
    
    // Navigate sections with arrow keys (when focused on nav)
    if (document.activeElement?.classList.contains('nav-link')) {
        const currentIndex = Array.from(navLinks).indexOf(document.activeElement);
        let nextIndex;
        
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            nextIndex = (currentIndex + 1) % navLinks.length;
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
        }
        
        if (nextIndex !== undefined) {
            navLinks[nextIndex].focus();
        }
    }
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add resize handler for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            body.style.overflow = '';
        }
        
        // Recalculate scroll positions
        updateActiveNavLink();
    }, 250);
});

// Initialize on page load
window.addEventListener('load', () => {
    updateNavbar();
    updateActiveNavLink();
});