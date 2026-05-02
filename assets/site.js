// =====================================
// SHARED JAVASCRIPT - Multilogin RU Expert
// =====================================

// Debounce utility for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Toggle FAQ accordion
function toggleFaq(element) {
    const question = element;
    const answer = element.nextElementSibling;
    
    // Close other answers
    document.querySelectorAll('.faq-answer.active').forEach(item => {
        if (item !== answer) {
            item.classList.remove('active');
            item.previousElementSibling.classList.remove('active');
        }
    });
    
    // Toggle current answer
    question.classList.toggle('active');
    answer.classList.toggle('active');
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Core Web Vitals & Performance Monitoring
document.addEventListener('DOMContentLoaded', function() {
    // Track affiliate link clicks with conversion tracking
    document.querySelectorAll('a[rel*="sponsored"]').forEach(link => {
        link.addEventListener('click', function() {
            // Google Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'engagement',
                    'event_label': 'affiliate_link',
                    'value': this.innerText
                });
            }
            
            // Send beacon for analytics (works even if page is unloading)
            if (navigator.sendBeacon) {
                navigator.sendBeacon('/track', JSON.stringify({
                    event: 'affiliate_click',
                    link: this.href,
                    text: this.innerText,
                    timestamp: new Date().toISOString()
                }));
            }
        });
    });
    
    // Lazy load images for performance
    if ('IntersectionObserver' in window) {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    if (document.createElement('link').relList.supports('preload')) {
        const head = document.head;
        const stylesheetLink = document.createElement('link');
        stylesheetLink.rel = 'preload';
        stylesheetLink.as = 'style';
        stylesheetLink.href = '/assets/styles.css';
        head.appendChild(stylesheetLink);
    }
});

// Monitor Core Web Vitals if available
if ('web-vital' in window) {
    // LCP (Largest Contentful Paint)
    try {
        const paintEntries = performance.getEntries().filter(entry => entry.name.includes('paint'));
        if (paintEntries.length > 0) {
            console.log('Paint timing detected:', paintEntries);
        }
    } catch(e) {
        // Silently fail for older browsers
    }
}

// Prefetch important links
document.addEventListener('DOMContentLoaded', function() {
    const importantLinks = document.querySelectorAll('a[href*="multilogin.com"]');
    importantLinks.forEach(link => {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = link.href;
        document.head.appendChild(prefetchLink);
    });
});
