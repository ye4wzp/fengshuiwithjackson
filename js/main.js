// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    }

    lastScroll = currentScroll;
});

// Removed email form handler - now using direct CTA buttons

// Booking Modal
const modal = document.getElementById('bookingModal');
const bookServiceButtons = document.querySelectorAll('.book-service');
const modalClose = document.querySelector('.modal-close');
const bookingForm = document.getElementById('bookingForm');
const serviceNameInput = document.getElementById('serviceName');

// Open modal when clicking service buttons
bookServiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        const serviceName = button.getAttribute('data-service');
        serviceNameInput.value = serviceName;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
});

// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Handle form submission
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const service = formData.get('service');
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone') || '';
    const message = formData.get('message');

    // Build Google Form URL with pre-filled data
    const baseURL = 'https://docs.google.com/forms/d/e/1FAIpQLSfbQOaSpdjNBvB_UzOL3Tm03vmTPaFDdJlsfk2M0D9-jqreqQ/viewform';

    const params = new URLSearchParams({
        'usp': 'pp_url',
        'entry.501105211': service,
        'entry.2005620554': name,
        'entry.1045781291': email,
        'entry.1166974658': phone,
        'entry.839337160': message
    });

    const googleFormURL = `${baseURL}?${params.toString()}`;

    // Open Google Form in new tab with pre-filled data
    window.open(googleFormURL, '_blank');

    // Show message
    alert(`Thank you, ${name}! Please click "Submit" on the Google Form to complete your booking.`);

    // Close modal and reset form
    closeModal();
    bookingForm.reset();
});


// Testimonials Slider
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
        card.classList.remove('active');
        dots[i].classList.remove('active');
    });

    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentTestimonial = index;
        showTestimonial(index);
    });
});

// Auto-rotate testimonials every 5 seconds
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(currentTestimonial);
}, 5000);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections for animation
const animatedElements = document.querySelectorAll('.problem-card, .service-card, .blog-card');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Add parallax effect to hero decoration
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroDecoration = document.querySelector('.hero-decoration');
    if (heroDecoration) {
        heroDecoration.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Console message for developers
console.log('%c🏡 FengShuiWithJackson', 'color: #0d4d3d; font-size: 24px; font-weight: bold;');
console.log('%cAlign Your Space, Attract Your Wealth', 'color: #d4af37; font-size: 14px;');
console.log('%cWebsite by Modern Zen Design', 'color: #8a8a8a; font-size: 12px;');
