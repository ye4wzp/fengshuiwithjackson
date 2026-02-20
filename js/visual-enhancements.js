// ==========================================
// VISUAL ENHANCEMENTS - JavaScript
// Custom cursor, particles, scroll animations
// ==========================================

(function () {
    'use strict';

    // ==========================================
    // 1. CUSTOM CURSOR (Desktop Only)
    // ==========================================
    const CustomCursor = {
        init() {
            // Only on devices with fine pointer (mouse)
            if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

            this.createCursor();
            this.bindEvents();
        },

        createCursor() {
            const cursor = document.createElement('div');
            cursor.className = 'custom-cursor';
            document.body.appendChild(cursor);

            const dot = document.createElement('div');
            dot.className = 'custom-cursor-dot';
            document.body.appendChild(dot);

            this.cursor = cursor;
            this.dot = dot;
        },

        bindEvents() {
            let mouseX = 0, mouseY = 0;
            let cursorX = 0, cursorY = 0;
            let dotX = 0, dotY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            // Smooth cursor follow
            const animate = () => {
                // Cursor follows with lag
                cursorX += (mouseX - cursorX) * 0.15;
                cursorY += (mouseY - cursorY) * 0.15;
                this.cursor.style.left = cursorX - 10 + 'px';
                this.cursor.style.top = cursorY - 10 + 'px';

                // Dot follows instantly
                dotX += (mouseX - dotX) * 0.5;
                dotY += (mouseY - dotY) * 0.5;
                this.dot.style.left = dotX - 2.5 + 'px';
                this.dot.style.top = dotY - 2.5 + 'px';

                requestAnimationFrame(animate);
            };
            animate();

            // Hover effect on interactive elements
            const interactiveElements = document.querySelectorAll('a, button, .btn, input, textarea, select, .blog-card, .service-card');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('hover');
                });
                el.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('hover');
                });
            });

            // Hide cursor when leaving window
            document.addEventListener('mouseleave', () => {
                this.cursor.style.opacity = '0';
                this.dot.style.opacity = '0';
            });
            document.addEventListener('mouseenter', () => {
                this.cursor.style.opacity = '1';
                this.dot.style.opacity = '1';
            });
        }
    };

    // ==========================================
    // 2. FLOATING PARTICLES
    // ==========================================
    const Particles = {
        count: 15, // Number of particles

        init() {
            // Don't show on mobile or if reduced motion preferred
            if (window.innerWidth < 768) return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            this.createContainer();
            this.createParticles();
        },

        createContainer() {
            const container = document.createElement('div');
            container.className = 'particles-container';
            container.id = 'particles';
            document.body.appendChild(container);
            this.container = container;
        },

        createParticles() {
            for (let i = 0; i < this.count; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';

                // Random position and animation
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDuration = (15 + Math.random() * 20) + 's';
                particle.style.animationDelay = (Math.random() * 10) + 's';
                particle.style.opacity = (0.1 + Math.random() * 0.3).toString();
                particle.style.width = (2 + Math.random() * 4) + 'px';
                particle.style.height = particle.style.width;

                this.container.appendChild(particle);
            }
        }
    };

    // ==========================================
    // 3. SCROLL-TRIGGERED ANIMATIONS
    // ==========================================
    const ScrollAnimations = {
        init() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            this.observeElements();
        },

        observeElements() {
            const options = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        // Optional: unobserve after animation
                        // observer.unobserve(entry.target);
                    }
                });
            }, options);

            // Add animation class to elements
            const elementsToAnimate = document.querySelectorAll(
                '.section-title, .problem-card, .service-card, .blog-card, ' +
                '.testimonial-card, .article-cta, .faq-section, .sidebar-card, ' +
                '.fortune-item, .compatibility-section, .fortune-2026'
            );

            elementsToAnimate.forEach(el => {
                el.classList.add('animate-on-scroll');
                observer.observe(el);
            });
        }
    };

    // ==========================================
    // 4. PARALLAX EFFECTS
    // ==========================================
    const Parallax = {
        init() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
            if (window.innerWidth < 768) return; // Disable on mobile

            this.bindEvents();
        },

        bindEvents() {
            let ticking = false;

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.updateParallax();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        },

        updateParallax() {
            const scrolled = window.pageYOffset;

            // Hero decoration parallax
            const heroDecoration = document.querySelector('.hero-decoration');
            if (heroDecoration) {
                heroDecoration.style.transform = `translateY(${scrolled * 0.3}px)`;
            }

            // Hero image subtle parallax
            const heroImage = document.querySelector('.image-placeholder');
            if (heroImage && scrolled < 800) {
                heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
        }
    };

    // ==========================================
    // 5. MAGNETIC BUTTONS
    // ==========================================
    const MagneticButtons = {
        init() {
            if (window.innerWidth < 1024) return; // Desktop only

            const buttons = document.querySelectorAll('.btn-primary, .btn-gold');
            buttons.forEach(btn => this.addMagneticEffect(btn));
        },

        addMagneticEffect(btn) {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        }
    };

    // ==========================================
    // 6. TEXT REVEAL ANIMATION
    // ==========================================
    const TextReveal = {
        init() {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            this.revealHeroText();
        },

        revealHeroText() {
            const heroTitle = document.querySelector('.hero-title');
            if (!heroTitle) return;

            // Add reveal class after a short delay
            setTimeout(() => {
                heroTitle.classList.add('revealed');
            }, 300);
        }
    };

    // ==========================================
    // 7. SMOOTH IMAGE LOADING
    // ==========================================
    const SmoothImageLoad = {
        init() {
            const images = document.querySelectorAll('img[loading="lazy"]');

            images.forEach(img => {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.5s ease';

                if (img.complete) {
                    img.style.opacity = '1';
                } else {
                    img.addEventListener('load', () => {
                        img.style.opacity = '1';
                    });
                }
            });
        }
    };

    // ==========================================
    // 8. TILT EFFECT ON CARDS
    // ==========================================
    const TiltCards = {
        init() {
            if (window.innerWidth < 1024) return; // Desktop only
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            const cards = document.querySelectorAll('.blog-card, .service-card');
            cards.forEach(card => this.addTiltEffect(card));
        },

        addTiltEffect(card) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        }
    };

    // ==========================================
    // 9. TYPING EFFECT FOR HEADINGS (Optional)
    // ==========================================
    const TypingEffect = {
        init() {
            // Only on homepage
            if (!document.querySelector('.hero-title')) return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            // This is optional - uncomment to enable
            // this.typeText();
        },

        typeText() {
            const title = document.querySelector('.hero-title');
            if (!title) return;

            const text = title.textContent;
            title.textContent = '';
            title.style.opacity = '1';

            let i = 0;
            const type = () => {
                if (i < text.length) {
                    title.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, 50);
                }
            };

            setTimeout(type, 500);
        }
    };

    // ==========================================
    // 10. CONFETTI ON SUCCESS (for calculator)
    // ==========================================
    const Confetti = {
        create(x, y) {
            const colors = ['#d4af37', '#0d4d3d', '#e8c96f', '#1a6b54'];

            for (let i = 0; i < 30; i++) {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    z-index: 10000;
                    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                `;
                document.body.appendChild(confetti);

                const angle = Math.random() * Math.PI * 2;
                const velocity = 5 + Math.random() * 10;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity - 10;
                let opacity = 1;
                let posX = x;
                let posY = y;
                let velY = vy;

                const animate = () => {
                    posX += vx;
                    velY += 0.5; // gravity
                    posY += velY;
                    opacity -= 0.02;

                    confetti.style.left = posX + 'px';
                    confetti.style.top = posY + 'px';
                    confetti.style.opacity = opacity;
                    confetti.style.transform = `rotate(${posX}deg)`;

                    if (opacity > 0) {
                        requestAnimationFrame(animate);
                    } else {
                        confetti.remove();
                    }
                };

                requestAnimationFrame(animate);
            }
        }
    };

    // Make confetti globally available
    window.Confetti = Confetti;

    // ==========================================
    // 11. CLICKABLE BLOG CARDS
    // ==========================================
    const ClickableCards = {
        init() {
            this.makeCardsClickable();
            this.addHoverStyles();
        },

        makeCardsClickable() {
            const blogCards = document.querySelectorAll('.blog-card');

            blogCards.forEach(card => {
                const link = card.querySelector('.blog-link, .read-more, a[href*="article"]');
                if (!link) return;

                const href = link.getAttribute('href');

                // Make the entire card clickable
                card.style.cursor = 'pointer';

                // Make image clickable
                const image = card.querySelector('.blog-image');
                if (image) {
                    image.style.cursor = 'pointer';
                    image.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = href;
                    });
                }

                // Make title clickable
                const title = card.querySelector('h3');
                if (title) {
                    title.style.cursor = 'pointer';
                    title.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.location.href = href;
                    });
                }

                // Make card background clickable (but not the link itself to avoid double navigation)
                card.addEventListener('click', (e) => {
                    // Don't navigate if clicking on the actual link
                    if (e.target.classList.contains('blog-link') || e.target.closest('.blog-link')) {
                        return;
                    }
                    // Don't navigate if clicking on category tag
                    if (e.target.classList.contains('blog-category')) {
                        return;
                    }
                    e.preventDefault();
                    window.location.href = href;
                });
            });

            // Also make index page blog cards clickable
            const indexBlogCards = document.querySelectorAll('.blog .blog-card');
            indexBlogCards.forEach(card => {
                const link = card.querySelector('a[href*="article"]');
                if (!link) return;

                const href = link.getAttribute('href');
                card.style.cursor = 'pointer';

                card.addEventListener('click', (e) => {
                    if (e.target.tagName === 'A') return;
                    window.location.href = href;
                });
            });
        },

        addHoverStyles() {
            // Add visual feedback that cards are clickable
            const style = document.createElement('style');
            style.textContent = `
                .blog-card {
                    cursor: pointer;
                }
                
                .blog-card .blog-image {
                    cursor: pointer;
                }
                
                .blog-card h3 {
                    cursor: pointer;
                    transition: color 0.3s ease;
                }
                
                .blog-card:hover h3 {
                    color: var(--champagne-gold, #d4af37);
                }
                
                /* Read Article overlay removed — user found it ugly */
            `;
            document.head.appendChild(style);
        }
    };

    // ==========================================
    // INITIALIZE ALL EFFECTS
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        // Custom cursor and particles disabled — user found them distracting
        // CustomCursor.init();
        // Particles.init();
        ScrollAnimations.init();
        Parallax.init();
        MagneticButtons.init();
        TextReveal.init();
        SmoothImageLoad.init();
        TiltCards.init();
        TypingEffect.init();
        ClickableCards.init();

        console.log('%c✨ Visual Enhancements Loaded', 'color: #d4af37; font-weight: bold; font-size: 14px;');
    });

})();
