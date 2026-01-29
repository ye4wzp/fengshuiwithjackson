/**
 * Luxury Visual Effects & Micro-interactions
 * Feng Shui With Jackson
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        createCustomCursor();
        initParticles();
        setupAuraCards();
        initSmoothReveal();
    }

    /**
     * 1. Custom Mouse Follower (Cursor)
     */
    function createCustomCursor() {
        if (window.innerWidth < 768) return; // Desktop only

        const cursor = document.createElement('div');
        const dot = document.createElement('div');
        cursor.className = 'custom-cursor';
        dot.className = 'custom-cursor-dot';
        document.body.appendChild(cursor);
        document.body.appendChild(dot);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let dotX = 0;
        let dotY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animate = () => {
            // Smoothler (lerp) for cursor
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            cursor.style.transform = `translate(-50%, -50%)`;

            // Instant for dot
            dotX += (mouseX - dotX) * 1;
            dotY += (mouseY - dotY) * 1;
            dot.style.left = `${dotX}px`;
            dot.style.top = `${dotY}px`;
            dot.style.transform = `translate(-50%, -50%)`;

            requestAnimationFrame(animate);
        };
        animate();

        // Hover effect
        const links = document.querySelectorAll('a, button, .btn, .category-btn, .blog-card');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            link.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            dot.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            dot.style.opacity = '1';
        });
    }

    /**
     * 2. Sublte Floating Particles
     */
    function initParticles() {
        const container = document.createElement('div');
        container.className = 'particles-container';
        document.body.appendChild(container);

        const particleCount = 20;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random position and delay
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 15}s`;

            container.appendChild(particle);
        }
    }

    /**
     * 3. Aura Card Mouse Effects
     */
    function setupAuraCards() {
        const cards = document.querySelectorAll('.blog-card, .service-card, .calculator-box');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // Tilt effect (subtle)
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /**
     * 4. Smooth Intersection Reveal
     */
    function initSmoothReveal() {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('premium-reveal-active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('h1, h2, .blog-card, .service-card, .problem-card, .section-title');
        revealElements.forEach(el => {
            el.classList.add('premium-reveal');
            observer.observe(el);
        });
    }

})();
