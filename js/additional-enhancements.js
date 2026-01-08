// ==========================================
// ADDITIONAL ENHANCEMENTS
// Back to Top, Exit Intent, Floating TOC, Print Styles
// ==========================================

(function () {
    'use strict';

    // ==========================================
    // 1. BACK TO TOP BUTTON
    // ==========================================
    const BackToTop = {
        init() {
            this.createButton();
            this.bindEvents();
        },

        createButton() {
            const btn = document.createElement('button');
            btn.id = 'back-to-top';
            btn.innerHTML = '↑';
            btn.setAttribute('aria-label', 'Back to top');
            btn.style.cssText = `
                position: fixed;
                bottom: 30px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: none;
                background: var(--champagne-gold, #d4af37);
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 998;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            `;
            btn.addEventListener('click', () => this.scrollToTop());
            document.body.appendChild(btn);
        },

        bindEvents() {
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.toggleVisibility();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        },

        toggleVisibility() {
            const btn = document.getElementById('back-to-top');
            if (window.pageYOffset > 300) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
            } else {
                btn.style.opacity = '0';
                btn.style.visibility = 'hidden';
            }
        },

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    // ==========================================
    // 2. SMART POPUP (Multiple Trigger Conditions)
    // ==========================================
    const SmartPopup = {
        shown: false,
        scrollThreshold: 0.5, // 50% scroll depth
        timeThreshold: 30000, // 30 seconds on page
        lastScrollTop: 0,
        scrollUpCount: 0,

        init() {
            // Don't show if closed recently
            if (localStorage.getItem('exitPopupClosed')) {
                const closedTime = parseInt(localStorage.getItem('exitPopupClosed'));
                if (Date.now() - closedTime < 3 * 24 * 60 * 60 * 1000) return; // 3 days
            }

            this.createPopup();
            this.bindEvents();
        },

        createPopup() {
            const popup = document.createElement('div');
            popup.id = 'exit-popup';
            popup.innerHTML = `
                <div class="exit-popup-overlay"></div>
                <div class="exit-popup-content">
                    <button class="exit-popup-close">&times;</button>
                    <div class="exit-popup-icon">🎁</div>
                    <h2>Wait! Before You Go...</h2>
                    <p>Get your <strong>FREE 2026 Fire Horse Feng Shui Guide</strong> with room-by-room tips!</p>
                    <div class="exit-popup-features">
                        <span>✓ Lucky Directions</span>
                        <span>✓ Color Guide</span>
                        <span>✓ Zodiac Forecast</span>
                    </div>
                    <a href="guide.html" class="exit-popup-btn">Get Free Guide →</a>
                    <p class="exit-popup-secondary">Or check out our <a href="product-2026-guide.html">Premium 2026 Guide ($9.99)</a></p>
                    <button class="exit-popup-dismiss">No thanks, I'll figure it out myself</button>
                </div>
            `;
            document.body.appendChild(popup);
        },

        bindEvents() {
            // TRIGGER 1: Exit Intent (Desktop - mouse leaving top of page)
            document.addEventListener('mouseout', (e) => {
                if (e.clientY < 10 && !this.shown) {
                    this.show('exit_intent');
                }
            });

            // TRIGGER 2: Scroll-Up Intent (User scrolling back up quickly)
            let lastScrollTime = Date.now();
            window.addEventListener('scroll', () => {
                const currentScrollTop = window.pageYOffset;
                const scrollDirection = currentScrollTop < this.lastScrollTop ? 'up' : 'down';

                if (scrollDirection === 'up' && this.lastScrollTop - currentScrollTop > 200) {
                    this.scrollUpCount++;
                    if (this.scrollUpCount >= 2 && !this.shown) {
                        // User has scrolled up significantly multiple times
                        const scrollPercent = currentScrollTop / (document.body.scrollHeight - window.innerHeight);
                        if (scrollPercent > 0.3) { // Only if they've read 30%+ of page
                            this.show('scroll_up');
                        }
                    }
                }

                this.lastScrollTop = currentScrollTop;
            });

            // TRIGGER 3: Time on Page (30 seconds + 50% scroll)
            setTimeout(() => {
                const scrollPercent = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
                if (scrollPercent > this.scrollThreshold && !this.shown) {
                    this.show('time_scroll');
                }
            }, this.timeThreshold);

            // TRIGGER 4: Back Button Detection (using History API)
            history.pushState(null, null, location.href);
            window.addEventListener('popstate', () => {
                if (!this.shown) {
                    history.pushState(null, null, location.href);
                    this.show('back_button');
                }
            });

            // TRIGGER 5: Mobile - Page Visibility (switching tabs/apps)
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden' && !this.shown) {
                    // User is leaving - show popup when they return
                    this.pendingShow = true;
                }
                if (document.visibilityState === 'visible' && this.pendingShow && !this.shown) {
                    const scrollPercent = window.pageYOffset / (document.body.scrollHeight - window.innerHeight);
                    if (scrollPercent > 0.2) { // Only if engaged somewhat
                        setTimeout(() => this.show('visibility_return'), 1000);
                    }
                    this.pendingShow = false;
                }
            });

            // TRIGGER 6: Before Page Unload (last resort)
            window.addEventListener('beforeunload', (e) => {
                // Note: Can't show popup here, but can track
                if (!this.shown) {
                    // Track missed opportunity
                    console.log('User left without seeing popup');
                }
            });

            // Close buttons
            document.querySelector('.exit-popup-close')?.addEventListener('click', () => this.close());
            document.querySelector('.exit-popup-overlay')?.addEventListener('click', () => this.close());
            document.querySelector('.exit-popup-dismiss')?.addEventListener('click', () => this.close());

            // Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.close();
            });
        },

        show(trigger = 'unknown') {
            if (this.shown) return;
            this.shown = true;
            const popup = document.getElementById('exit-popup');
            if (popup) {
                popup.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Track which trigger worked
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'popup_shown', { 'trigger': trigger });
                }
                console.log('Popup triggered by:', trigger);
            }
        },

        close() {
            const popup = document.getElementById('exit-popup');
            if (popup) {
                popup.classList.remove('active');
                document.body.style.overflow = '';
                localStorage.setItem('exitPopupClosed', Date.now().toString());
            }
        }
    };

    // ==========================================
    // 3. FLOATING TABLE OF CONTENTS
    // ==========================================
    const FloatingTOC = {
        init() {
            const articleBody = document.querySelector('.article-body');
            const existingTOC = document.querySelector('.table-of-contents');
            if (!articleBody || !existingTOC) return;

            this.createFloatingTOC();
            this.bindEvents();
        },

        createFloatingTOC() {
            const headings = document.querySelectorAll('.article-body h2');
            if (headings.length < 3) return; // Only show for longer articles

            const toc = document.createElement('nav');
            toc.id = 'floating-toc';
            toc.innerHTML = `
                <div class="floating-toc-header">
                    <span>📖 Contents</span>
                    <button class="floating-toc-toggle">−</button>
                </div>
                <ul class="floating-toc-list">
                    ${Array.from(headings).map((h, i) => {
                const id = h.querySelector('span[id]')?.id || `section-${i}`;
                if (!h.querySelector('span[id]')) {
                    const span = document.createElement('span');
                    span.id = `section-${i}`;
                    h.prepend(span);
                }
                return `<li><a href="#${id}" data-index="${i}">${h.textContent.replace(/^\d+\.\s*/, '').substring(0, 30)}${h.textContent.length > 30 ? '...' : ''}</a></li>`;
            }).join('')}
                </ul>
            `;
            document.body.appendChild(toc);

            // Toggle functionality
            toc.querySelector('.floating-toc-toggle').addEventListener('click', () => {
                toc.classList.toggle('collapsed');
                toc.querySelector('.floating-toc-toggle').textContent =
                    toc.classList.contains('collapsed') ? '+' : '−';
            });
        },

        bindEvents() {
            const headings = document.querySelectorAll('.article-body h2');
            const links = document.querySelectorAll('.floating-toc-list a');

            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.updateActiveLink(headings, links);
                        this.toggleVisibility();
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            // Smooth scroll for TOC links
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },

        updateActiveLink(headings, links) {
            const scrollPos = window.pageYOffset + 150;
            let activeIndex = 0;

            headings.forEach((heading, i) => {
                if (heading.offsetTop <= scrollPos) {
                    activeIndex = i;
                }
            });

            links.forEach((link, i) => {
                link.classList.toggle('active', i === activeIndex);
            });
        },

        toggleVisibility() {
            const toc = document.getElementById('floating-toc');
            const articleBody = document.querySelector('.article-body');
            if (!toc || !articleBody) return;

            const articleTop = articleBody.offsetTop;
            const articleBottom = articleTop + articleBody.offsetHeight - 300;
            const scrollPos = window.pageYOffset;

            if (scrollPos > articleTop && scrollPos < articleBottom) {
                toc.classList.add('visible');
            } else {
                toc.classList.remove('visible');
            }
        }
    };

    // ==========================================
    // ADD STYLES
    // ==========================================
    const Styles = {
        init() {
            const style = document.createElement('style');
            style.textContent = `
                /* Back to Top Button Hover */
                #back-to-top:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                }

                /* Exit Intent Popup */
                #exit-popup {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                }

                #exit-popup.active {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .exit-popup-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.7);
                    backdrop-filter: blur(3px);
                }

                .exit-popup-content {
                    position: relative;
                    background: white;
                    padding: 50px;
                    border-radius: 20px;
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                    animation: popupSlide 0.4s ease;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }

                @keyframes popupSlide {
                    from { opacity: 0; transform: scale(0.9) translateY(-20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }

                .exit-popup-close {
                    position: absolute;
                    top: 15px;
                    right: 20px;
                    background: none;
                    border: none;
                    font-size: 30px;
                    cursor: pointer;
                    color: #999;
                }

                .exit-popup-icon {
                    font-size: 60px;
                    margin-bottom: 20px;
                }

                .exit-popup-content h2 {
                    color: #0d4d3d;
                    margin-bottom: 15px;
                }

                .exit-popup-content p {
                    color: #666;
                    margin-bottom: 20px;
                }

                .exit-popup-features {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 25px;
                    flex-wrap: wrap;
                }

                .exit-popup-features span {
                    background: #f0f7ff;
                    padding: 8px 15px;
                    border-radius: 20px;
                    font-size: 14px;
                    color: #0d4d3d;
                }

                .exit-popup-btn {
                    display: inline-block;
                    background: linear-gradient(135deg, #d4af37 0%, #e8c96f 100%);
                    color: white;
                    padding: 15px 40px;
                    border-radius: 30px;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 18px;
                    transition: all 0.3s ease;
                    margin-bottom: 15px;
                }

                .exit-popup-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
                }

                .exit-popup-secondary {
                    font-size: 14px;
                    color: #888;
                }

                .exit-popup-secondary a {
                    color: #d4af37;
                }

                .exit-popup-dismiss {
                    display: block;
                    margin: 15px auto 0;
                    background: none;
                    border: none;
                    color: #999;
                    font-size: 13px;
                    cursor: pointer;
                    text-decoration: underline;
                }

                /* Floating TOC */
                #floating-toc {
                    position: fixed;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 5px 30px rgba(0,0,0,0.15);
                    padding: 15px;
                    max-width: 200px;
                    z-index: 100;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                #floating-toc.visible {
                    opacity: 1;
                    visibility: visible;
                }

                #floating-toc.collapsed .floating-toc-list {
                    display: none;
                }

                .floating-toc-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 600;
                    color: #0d4d3d;
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }

                .floating-toc-toggle {
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #0d4d3d;
                }

                .floating-toc-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .floating-toc-list li {
                    margin: 8px 0;
                }

                .floating-toc-list a {
                    color: #666;
                    text-decoration: none;
                    font-size: 13px;
                    display: block;
                    padding: 5px 10px;
                    border-radius: 5px;
                    transition: all 0.2s ease;
                }

                .floating-toc-list a:hover,
                .floating-toc-list a.active {
                    background: #f0f7ff;
                    color: #0d4d3d;
                }

                .floating-toc-list a.active {
                    border-left: 3px solid #d4af37;
                }

                /* Print Styles */
                @media print {
                    .navbar, .footer, #dark-mode-toggle, #back-to-top,
                    #floating-toc, #exit-popup, .share-bar, .cta-box,
                    .article-cta, .affiliate-product, .sidebar-card,
                    .related-articles-section, .blog-newsletter,
                    .promo-banner, .pagination, .category-filter,
                    #reading-progress {
                        display: none !important;
                    }

                    body {
                        background: white !important;
                        color: black !important;
                        font-size: 12pt;
                        line-height: 1.5;
                    }

                    .article-body {
                        max-width: 100%;
                        padding: 0;
                    }

                    h1, h2, h3 {
                        color: black !important;
                        page-break-after: avoid;
                    }

                    img {
                        max-width: 100%;
                        page-break-inside: avoid;
                    }

                    a {
                        color: black !important;
                        text-decoration: underline;
                    }

                    a[href^="http"]::after {
                        content: " (" attr(href) ")";
                        font-size: 10pt;
                        color: #666;
                    }

                    .faq-section {
                        page-break-inside: avoid;
                    }

                    .faq-answer {
                        display: block !important;
                        max-height: none !important;
                    }

                    @page {
                        margin: 2cm;
                    }
                }

                /* Dark mode adjustments */
                body.dark-mode #floating-toc {
                    background: #2d2d2d;
                }

                body.dark-mode .floating-toc-header {
                    color: #4CAF50;
                    border-color: #444;
                }

                body.dark-mode .floating-toc-list a {
                    color: #ccc;
                }

                body.dark-mode .floating-toc-list a:hover,
                body.dark-mode .floating-toc-list a.active {
                    background: #333;
                    color: #4CAF50;
                }

                body.dark-mode .exit-popup-content {
                    background: #2d2d2d;
                }

                body.dark-mode .exit-popup-content h2 {
                    color: #4CAF50;
                }

                body.dark-mode .exit-popup-features span {
                    background: #333;
                    color: #ccc;
                }

                /* Responsive */
                @media (max-width: 1200px) {
                    #floating-toc {
                        display: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    };

    // ==========================================
    // INITIALIZE
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        Styles.init();
        BackToTop.init();
        SmartPopup.init();
        FloatingTOC.init();

        console.log('%c🚀 Additional Enhancements Loaded', 'color: #d4af37; font-weight: bold;');
    });

})();
