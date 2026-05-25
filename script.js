// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return; // Guard: bare '#' is a placeholder link
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
        // Close mobile menu after clicking a nav link
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// Mobile menu toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// FAQ Accordion
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function(e) {
                e.preventDefault();
                
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(faq => {
                    faq.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
});

// Contact form — sends to Google Apps Script (Gmail SMTP)
// Paste your deployed Apps Script web app URL below:
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTTFcbKKX8SVSZnmUJCuDiyRQAjT6g6JTIvhhifeyXU0Z8bhnOrRVB8Z5DBimpAKf7/exec';

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    // Create a status message element
    const statusMsg = document.createElement('p');
    statusMsg.id = 'form-status';
    statusMsg.style.cssText = 'margin-top:1rem;font-size:0.95rem;font-weight:500;text-align:center;';
    contactForm.appendChild(statusMsg);

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Disable submit button
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        statusMsg.textContent = '';
        
        try {
            // Send to Google Apps Script (handles BOTH owner + client emails via Gmail SMTP)
            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({ name, email, phone, message })
            });
            
            const result = await response.json();
            
            if (result.success) {
                statusMsg.style.color = '#2d7a4f';
                statusMsg.textContent = `Thank you, ${name}! Check your email for a confirmation.`;
                contactForm.reset();
            } else {
                throw new Error(result.error || 'Submission failed');
            }
        } catch (error) {
            // Fallback to mailto
            const subject = encodeURIComponent('New Enquiry — D Gloaming Nest');
            const body = encodeURIComponent(
                `Name: ${name}\n\nEmail: ${email}\n\nPhone: ${phone}\n\nMessage:\n${message}`
            );
            window.location.href = `mailto:dgloamingnest@gmail.com?subject=${subject}&body=${body}`;
            statusMsg.style.color = '#b94a2c';
            statusMsg.textContent = 'Opening your email client to send the message...';
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add stagger effect to children
            const children = entry.target.querySelectorAll('.amenity-card, .location-category, .stat-item, .room-card, .feature-item');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }
    });
}, observerOptions);

// Add animation styles to elements
const animatedElements = document.querySelectorAll('.amenity-card, .location-category, .stat-item, .philosophy-text, .philosophy-image, .room-card, .feature-item');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Observe sections for pop-in animations
const sections = document.querySelectorAll('.amenities, .location, .philosophy, .testimonial, .faq, .rooms, .features, .contact, .facilities, .video-tour');
sections.forEach(section => {
    observer.observe(section);
});

// Reveal animations for new elements
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('revealed');
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

// Observe all reveal elements
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-image');
revealElements.forEach((el, index) => {
    // Add stagger delay for elements in the same group
    el.style.transitionDelay = `${index * 0.1}s`;
    revealObserver.observe(el);
});

// Parallax effect for hero section
let lastScrollPosition = 0;
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - scrolled / 600;
    }

    ticking = false;
}

window.addEventListener('scroll', () => {
    lastScrollPosition = window.pageYOffset;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateParallax();
        });
        ticking = true;
    }
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
        
        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.style.color = '';
            });
            navLink.style.color = '#c9a961';
        }
    });
});

// Prevent scroll jank
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            ticking = false;
        });
        ticking = true;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Add hover effect to cards with ripple
const cards = document.querySelectorAll('.amenity-card');
cards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        this.style.borderColor = '#c9a961';
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(201, 169, 97, 0.3)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.pointerEvents = 'none';
        
        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.style.transition = 'all 0.6s ease';
            ripple.style.width = '200px';
            ripple.style.height = '200px';
            ripple.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.borderColor = '#e5e5e5';
    });
});

// Form validation with better UX
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() === '' && this.hasAttribute('required')) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#c9a961';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = '#c9a961';
    });
});

// Add typing animation to hero title (optional enhancement)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle && window.innerWidth > 968) {
    // Disable typing animation as it conflicts with the line break fix
    // Animation is now handled by CSS keyframes
}

// Add click outside to close mobile menu
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active')) {
        if (!e.target.closest('.navbar')) {
            navLinks.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    }
});

// Responsive mobile menu styles (injected via JS for better control)
if (window.innerWidth <= 968) {
    const style = document.createElement('style');
    style.textContent = `
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: rgba(248, 247, 244, 0.98);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-bottom: 1px solid var(--border-light);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -7px);
        }
    `;
    document.head.appendChild(style);
}

// Performance optimization: Lazy load images when you add them
const lazyImages = document.querySelectorAll('img[data-src]');
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

lazyImages.forEach(img => imageObserver.observe(img));

// Console message for developers
console.log('%c Gloaming Nest ', 'background: #1a1a1a; color: #c9a961; font-size: 20px; padding: 10px;');
console.log('%c Premium Co-Living Website ', 'background: #c9a961; color: #1a1a1a; font-size: 14px; padding: 5px;');

// Counter animation for stats
const stats = document.querySelectorAll('.stat-item h3');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const text = target.textContent;
            
            if (text === '24/7') {
                animateText(target, '24/7');
            } else if (text === '100%') {
                animateCounter(target, 100, '%');
            } else if (text === '5★') {
                animateCounter(target, 5, '★');
            }
            
            statsObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => statsObserver.observe(stat));

function animateCounter(element, target, suffix) {
    let count = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(count) + suffix;
        }
    }, 16);
}

function animateText(element, text) {
    element.style.opacity = '0';
    setTimeout(() => {
        element.textContent = text;
        element.style.transition = 'opacity 0.5s';
        element.style.opacity = '1';
    }, 300);
}

// Testimonial Carousel
let currentTestimonial = 0;
const testimonialItems = document.querySelectorAll('.testimonial-item');
const testimonialDots = document.querySelector('.testimonial-dots');

// Create dots for navigation
if (testimonialDots && testimonialItems.length > 0) {
    testimonialItems.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('testimonial-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTestimonial(index));
        testimonialDots.appendChild(dot);
    });
}

function goToTestimonial(index) {
    testimonialItems.forEach(item => item.classList.remove('active'));
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentTestimonial = index;
    testimonialItems[currentTestimonial].classList.add('active');
    dots[currentTestimonial].classList.add('active');
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
    goToTestimonial(currentTestimonial);
}

// Auto-rotate testimonials every 5 seconds
if (testimonialItems.length > 0) {
    setInterval(nextTestimonial, 5000);
}

// Add mouse move parallax effect to image placeholder
const philosophyImage = document.querySelector('.philosophy-image img');
if (philosophyImage) {
    const container = philosophyImage.parentElement;
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        philosophyImage.style.transform = `scale(1.1) perspective(1000px) rotateY(${deltaX * 5}deg) rotateX(${-deltaY * 5}deg)`;
    });
    
    container.addEventListener('mouseleave', () => {
        philosophyImage.style.transform = 'scale(1) perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
}

// Legal Pages Handler
document.addEventListener('DOMContentLoaded', () => {
    const mainSections = document.querySelectorAll('section:not(.legal-section)');
    const legalSections = document.querySelectorAll('.legal-section');
    const navbar = document.querySelector('.navbar');
    const footer = document.querySelector('.footer');
    
    // Handle Privacy Policy and Terms of Service links
    document.querySelectorAll('a[href="#privacy"], a[href="#terms"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href').substring(1);
            
            // Hide all main sections and show legal section
            mainSections.forEach(section => section.style.display = 'none');
            legalSections.forEach(section => {
                section.style.display = section.id === target ? 'block' : 'none';
            });
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Add back button if not exists
            const legalSection = document.getElementById(target);
            if (legalSection && !legalSection.querySelector('.back-btn')) {
                const backBtn = document.createElement('a');
                backBtn.href = '#';
                backBtn.className = 'back-btn';
                backBtn.textContent = '← Back to Home';
                backBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    mainSections.forEach(section => section.style.display = '');
                    legalSections.forEach(section => section.style.display = 'none');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
                legalSection.querySelector('.legal-content').appendChild(backBtn);
            }
        });
    });
});

// Performance monitoring for Core Web Vitals
if ('PerformanceObserver' in window) {
    // Largest Contentful Paint (LCP)
    try {
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
        console.log('LCP monitoring not supported');
    }

    // First Input Delay (FID)
    try {
        const fidObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                console.log('FID:', entry.processingStart - entry.startTime);
            });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
        console.log('FID monitoring not supported');
    }

    // Cumulative Layout Shift (CLS)
    try {
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (!entry.hadRecentInput) {
                    clsScore += entry.value;
                    console.log('CLS:', clsScore);
                }
            });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
        console.log('CLS monitoring not supported');
    }
}

// Preload next section images on scroll for better UX
const preloadNextImages = () => {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = 0;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const nextSection = entry.target.nextElementSibling;
                if (nextSection) {
                    const images = nextSection.querySelectorAll('img[loading="lazy"]');
                    images.forEach(img => {
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                    });
                }
            }
        });
    }, { rootMargin: '50px' });
    
    sections.forEach(section => observer.observe(section));
};

// Initialize preloading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadNextImages);
} else {
    preloadNextImages();
}

// ===================================
// Gallery Lightbox
// ===================================
(function () {
    const lightbox  = document.getElementById('lightbox');
    const lbImg     = document.getElementById('lightboxImg');
    const lbCaption = document.getElementById('lightboxCaption');
    const lbCounter = document.getElementById('lightboxCounter');
    const lbClose   = document.getElementById('lightboxClose');
    const lbPrev    = document.getElementById('lightboxPrev');
    const lbNext    = document.getElementById('lightboxNext');
    if (!lightbox) return;

    const items = Array.from(document.querySelectorAll('.gallery-item'));
    let current = 0;

    function show() {
        const img     = items[current].querySelector('img');
        const title   = items[current].querySelector('.gallery-overlay h3');
        lbImg.src     = img ? img.src : '';
        lbImg.alt     = img ? img.alt : '';
        lbCaption.textContent = title ? title.textContent : '';
        lbCounter.textContent = (current + 1) + ' / ' + items.length;
    }

    function open(index) {
        current = index;
        show();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function close() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function prev() { current = (current - 1 + items.length) % items.length; show(); }
    function next() { current = (current + 1) % items.length; show(); }

    items.forEach(function (item, i) {
        item.addEventListener('click', function () { open(i); });
    });

    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', prev);
    lbNext.addEventListener('click', next);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox || e.target === lbImg.parentElement) close();
    });

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')      close();
        if (e.key === 'ArrowLeft')   prev();
        if (e.key === 'ArrowRight')  next();
    });

    // Touch swipe
    var touchStartX = 0;
    lightbox.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
        var diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
    }, { passive: true });
}());

// ===================================
// Hero Slideshow
// ===================================
(function () {
    const slides   = document.querySelectorAll('.hero-slide');
    const fill     = document.querySelector('.hero-progress-fill');
    const prevBtn  = document.querySelector('.hero-arrow-prev');
    const nextBtn  = document.querySelector('.hero-arrow-next');

    if (!slides.length) return;

    let current = 0;
    let autoPlayTimer;
    const INTERVAL = 7000;

    function resetProgressBar() {
        if (!fill) return;
        fill.classList.remove('animating');
        // Force reflow so the animation restarts cleanly
        void fill.offsetWidth;
        fill.classList.add('animating');
    }

    function goTo(index) {
        slides[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        resetProgressBar();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(next, INTERVAL);
    }

    // Touch / swipe support for mobile
    var touchStartX = 0;
    var heroEl = document.querySelector('.hero');
    if (heroEl) {
        heroEl.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        heroEl.addEventListener('touchend', function (e) {
            var diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? next() : prev();
                startAutoPlay();
            }
        }, { passive: true });
        // Pause auto-play on mouse hover; resume on leave
        heroEl.addEventListener('mouseenter', function () { clearInterval(autoPlayTimer); });
        heroEl.addEventListener('mouseleave', startAutoPlay);
    }

    // Kick off
    resetProgressBar();
    startAutoPlay();
}());
