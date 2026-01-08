// ==========================================
// FINAL ENHANCEMENTS
// Reading Time, Mobile Nav, Recently Viewed, Giscus
// ==========================================

(function () {
    'use strict';

    // ==========================================
    // 1. AUTO READING TIME CALCULATION
    // ==========================================
    const ReadingTime = {
        wordsPerMinute: 200, // Average reading speed

        init() {
            this.calculateAndDisplay();
        },

        calculateAndDisplay() {
            const articleBody = document.querySelector('.article-body');
            if (!articleBody) return;

            const text = articleBody.textContent || articleBody.innerText;
            const wordCount = text.trim().split(/\s+/).length;
            const readingTime = Math.ceil(wordCount / this.wordsPerMinute);

            // Find and update reading time display
            const metaElements = document.querySelectorAll('.article-meta span');
            metaElements.forEach(el => {
                if (el.textContent.includes('⏱️') || el.textContent.includes('min read')) {
                    el.textContent = `⏱️ ${readingTime} min read`;
                    el.setAttribute('data-calculated', 'true');
                }
            });

            // Also update blog cards if on blog page
            const blogCards = document.querySelectorAll('.blog-card');
            blogCards.forEach(card => {
                const excerpt = card.querySelector('.blog-excerpt');
                if (excerpt) {
                    const cardText = excerpt.textContent;
                    const cardWords = cardText.trim().split(/\s+/).length;
                    // Estimate full article length (excerpt is ~10% of article)
                    const estimatedTime = Math.ceil((cardWords * 10) / this.wordsPerMinute);
                }
            });

            console.log(`Reading time: ${readingTime} minutes (${wordCount} words)`);
        }
    };

    // ==========================================
    // 2. MOBILE BOTTOM NAVIGATION BAR
    // ==========================================
    const MobileNav = {
        init() {
            if (window.innerWidth > 768) return; // Only on mobile
            this.createNav();
            this.bindEvents();
        },

        createNav() {
            const nav = document.createElement('nav');
            nav.id = 'mobile-bottom-nav';
            nav.innerHTML = `
                <a href="index.html" class="mobile-nav-item" data-page="home">
                    <span class="mobile-nav-icon">🏠</span>
                    <span class="mobile-nav-label">Home</span>
                </a>
                <a href="blog.html" class="mobile-nav-item" data-page="blog">
                    <span class="mobile-nav-icon">📚</span>
                    <span class="mobile-nav-label">Blog</span>
                </a>
                <a href="fortune-calculator.html" class="mobile-nav-item" data-page="calculator">
                    <span class="mobile-nav-icon">🔮</span>
                    <span class="mobile-nav-label">Fortune</span>
                </a>
                <a href="daily-fortune.html" class="mobile-nav-item" data-page="daily">
                    <span class="mobile-nav-icon">✨</span>
                    <span class="mobile-nav-label">Daily</span>
                </a>
                <a href="shop.html" class="mobile-nav-item" data-page="shop">
                    <span class="mobile-nav-icon">🛍️</span>
                    <span class="mobile-nav-label">Shop</span>
                </a>
            `;
            document.body.appendChild(nav);

            // Highlight current page
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const pageMap = {
                'index.html': 'home',
                'blog.html': 'blog',
                'fortune-calculator.html': 'calculator',
                'daily-fortune.html': 'daily',
                'shop.html': 'shop'
            };
            const activeItem = nav.querySelector(`[data-page="${pageMap[currentPage]}"]`);
            if (activeItem) activeItem.classList.add('active');

            // Add padding to body to prevent content being hidden
            document.body.style.paddingBottom = '70px';
        },

        bindEvents() {
            // Hide on scroll down, show on scroll up
            let lastScroll = 0;
            const nav = document.getElementById('mobile-bottom-nav');

            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                if (currentScroll > lastScroll && currentScroll > 200) {
                    nav.classList.add('hidden');
                } else {
                    nav.classList.remove('hidden');
                }
                lastScroll = currentScroll;
            });
        }
    };

    // ==========================================
    // 3. RECENTLY VIEWED ARTICLES
    // ==========================================
    const RecentlyViewed = {
        storageKey: 'recentlyViewedArticles',
        maxItems: 5,

        init() {
            this.trackCurrentArticle();
            this.displayWidget();
        },

        trackCurrentArticle() {
            // Only track article pages
            if (!document.querySelector('.blog-article')) return;

            const article = {
                url: window.location.pathname.split('/').pop(),
                title: document.querySelector('h1')?.textContent || document.title,
                category: document.querySelector('.article-category')?.textContent || 'General',
                timestamp: Date.now()
            };

            let viewed = this.getViewed();

            // Remove if already exists (will re-add at front)
            viewed = viewed.filter(a => a.url !== article.url);

            // Add to front
            viewed.unshift(article);

            // Keep only max items
            viewed = viewed.slice(0, this.maxItems);

            localStorage.setItem(this.storageKey, JSON.stringify(viewed));
        },

        getViewed() {
            try {
                return JSON.parse(localStorage.getItem(this.storageKey)) || [];
            } catch {
                return [];
            }
        },

        displayWidget() {
            const viewed = this.getViewed();
            const currentUrl = window.location.pathname.split('/').pop();

            // Filter out current page
            const others = viewed.filter(a => a.url !== currentUrl);

            if (others.length === 0) return;

            // Find sidebar to add widget
            const sidebar = document.querySelector('.article-sidebar');
            if (!sidebar) {
                // Create floating widget for non-article pages
                if (viewed.length > 1) {
                    this.createFloatingWidget(others);
                }
                return;
            }

            const widget = document.createElement('div');
            widget.className = 'sidebar-card recently-viewed-card';
            widget.innerHTML = `
                <h3>📖 Recently Viewed</h3>
                <ul class="recently-viewed-list">
                    ${others.slice(0, 3).map(article => `
                        <li>
                            <a href="${article.url}">
                                <span class="rv-category">${article.category}</span>
                                <span class="rv-title">${article.title.substring(0, 40)}${article.title.length > 40 ? '...' : ''}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            `;
            sidebar.appendChild(widget);
        },

        createFloatingWidget(articles) {
            // Mini floating widget for blog listing page etc
            if (!document.querySelector('.blog-page')) return;

            const widget = document.createElement('div');
            widget.id = 'recently-viewed-float';
            widget.innerHTML = `
                <div class="rv-float-header">
                    <span>📖 Continue Reading</span>
                    <button class="rv-float-close">×</button>
                </div>
                <a href="${articles[0].url}" class="rv-float-item">
                    ${articles[0].title.substring(0, 35)}...
                </a>
            `;
            document.body.appendChild(widget);

            // Show after 2 seconds
            setTimeout(() => widget.classList.add('show'), 2000);

            // Close button
            widget.querySelector('.rv-float-close').addEventListener('click', () => {
                widget.remove();
            });
        }
    };

    // ==========================================
    // 4. GISCUS COMMENTS SETUP
    // ==========================================
    const GiscusComments = {
        init() {
            // Only add to article pages
            if (!document.querySelector('.blog-article')) return;
            this.createCommentsSection();
        },

        createCommentsSection() {
            const articleBody = document.querySelector('.article-body');
            if (!articleBody) return;

            const commentsSection = document.createElement('section');
            commentsSection.className = 'comments-section';
            commentsSection.innerHTML = `
                <h2>💬 Comments & Discussion</h2>
                <p class="comments-intro">Share your feng shui experiences or ask questions below!</p>
                <div id="giscus-container">
                    <div class="giscus-placeholder">
                        <p>💡 <strong>Comments powered by GitHub Discussions</strong></p>
                        <p>To enable comments, the site owner needs to:</p>
                        <ol>
                            <li>Create a GitHub repository with Discussions enabled</li>
                            <li>Install the <a href="https://giscus.app" target="_blank">Giscus app</a></li>
                            <li>Update the configuration below</li>
                        </ol>
                        <button class="btn btn-outline" onclick="GiscusComments.loadGiscus()">Load Comments</button>
                    </div>
                </div>
            `;

            // Insert after article content, before sidebar
            const parentContainer = articleBody.parentElement;
            parentContainer.insertBefore(commentsSection, articleBody.nextSibling);
        },

        loadGiscus() {
            const container = document.getElementById('giscus-container');
            if (!container) return;

            // Note: User needs to configure these values
            const script = document.createElement('script');
            script.src = 'https://giscus.app/client.js';
            script.setAttribute('data-repo', 'OWNER/REPO'); // TODO: Update this
            script.setAttribute('data-repo-id', 'R_xxxxx'); // TODO: Update this
            script.setAttribute('data-category', 'Comments');
            script.setAttribute('data-category-id', 'DIC_xxxxx'); // TODO: Update this
            script.setAttribute('data-mapping', 'pathname');
            script.setAttribute('data-strict', '0');
            script.setAttribute('data-reactions-enabled', '1');
            script.setAttribute('data-emit-metadata', '0');
            script.setAttribute('data-input-position', 'top');
            script.setAttribute('data-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
            script.setAttribute('data-lang', 'en');
            script.setAttribute('crossorigin', 'anonymous');
            script.async = true;

            container.innerHTML = '';
            container.appendChild(script);
        }
    };

    // Make loadGiscus accessible globally
    window.GiscusComments = GiscusComments;

    // ==========================================
    // ADD STYLES
    // ==========================================
    const Styles = {
        init() {
            const style = document.createElement('style');
            style.textContent = `
                /* Mobile Bottom Navigation */
                #mobile-bottom-nav {
                    display: none;
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: white;
                    box-shadow: 0 -2px 20px rgba(0,0,0,0.1);
                    z-index: 1000;
                    padding: 8px 0;
                    transition: transform 0.3s ease;
                }

                #mobile-bottom-nav.hidden {
                    transform: translateY(100%);
                }

                @media (max-width: 768px) {
                    #mobile-bottom-nav {
                        display: flex;
                        justify-content: space-around;
                    }
                }

                .mobile-nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-decoration: none;
                    color: #666;
                    padding: 5px 10px;
                    transition: all 0.2s ease;
                }

                .mobile-nav-item.active {
                    color: #0d4d3d;
                }

                .mobile-nav-item.active .mobile-nav-icon {
                    transform: scale(1.2);
                }

                .mobile-nav-icon {
                    font-size: 22px;
                    margin-bottom: 2px;
                    transition: transform 0.2s ease;
                }

                .mobile-nav-label {
                    font-size: 10px;
                    font-weight: 500;
                }

                /* Recently Viewed Widget */
                .recently-viewed-card {
                    background: #fff8e1 !important;
                    border: 1px solid #ffe082;
                }

                .recently-viewed-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .recently-viewed-list li {
                    margin-bottom: 12px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #ffe082;
                }

                .recently-viewed-list li:last-child {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    border-bottom: none;
                }

                .recently-viewed-list a {
                    text-decoration: none;
                    display: block;
                }

                .rv-category {
                    display: block;
                    font-size: 11px;
                    color: #d4af37;
                    font-weight: 600;
                    text-transform: uppercase;
                    margin-bottom: 3px;
                }

                .rv-title {
                    color: #333;
                    font-size: 14px;
                    line-height: 1.4;
                }

                .recently-viewed-list a:hover .rv-title {
                    color: #0d4d3d;
                }

                /* Floating Recently Viewed */
                #recently-viewed-float {
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 5px 25px rgba(0,0,0,0.15);
                    padding: 15px;
                    max-width: 250px;
                    z-index: 999;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.3s ease;
                }

                #recently-viewed-float.show {
                    opacity: 1;
                    transform: translateY(0);
                }

                .rv-float-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    font-weight: 600;
                    color: #0d4d3d;
                }

                .rv-float-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #999;
                }

                .rv-float-item {
                    display: block;
                    color: #666;
                    text-decoration: none;
                    font-size: 14px;
                    padding: 8px 12px;
                    background: #f5f5f5;
                    border-radius: 8px;
                }

                .rv-float-item:hover {
                    background: #e8f5e9;
                    color: #0d4d3d;
                }

                /* Comments Section - Fixed Layout */
                .comments-section {
                    margin-top: 50px;
                    padding: 40px;
                    border-top: 2px solid #e0e0e0;
                    max-width: 100%;
                    width: 100%;
                    box-sizing: border-box;
                    background: #f8f9fa;
                    border-radius: 20px;
                    margin-left: 0;
                    margin-right: 0;
                }

                .comments-section h2 {
                    color: #0d4d3d;
                    margin-bottom: 10px;
                    font-size: 1.5rem;
                }

                .comments-intro {
                    color: #666;
                    margin-bottom: 25px;
                }

                #giscus-container {
                    max-width: 100%;
                    overflow: hidden;
                }

                .giscus-placeholder {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }

                .giscus-placeholder ol {
                    text-align: left;
                    max-width: 400px;
                    margin: 20px auto;
                    padding-left: 20px;
                }

                .giscus-placeholder li {
                    margin-bottom: 10px;
                    color: #666;
                }

                .giscus-placeholder .btn {
                    margin-top: 15px;
                }

                /* Dark Mode */
                body.dark-mode #mobile-bottom-nav {
                    background: #1a1a1a;
                }

                body.dark-mode .mobile-nav-item {
                    color: #aaa;
                }

                body.dark-mode .mobile-nav-item.active {
                    color: #4CAF50;
                }

                body.dark-mode .recently-viewed-card {
                    background: #3d3d3d !important;
                    border-color: #555;
                }

                body.dark-mode .rv-title {
                    color: #eee;
                }

                body.dark-mode #recently-viewed-float {
                    background: #2d2d2d;
                }

                body.dark-mode .rv-float-item {
                    background: #3d3d3d;
                    color: #ccc;
                }

                body.dark-mode .giscus-placeholder {
                    background: #2d2d2d;
                }

                /* Hide mobile nav on desktop */
                @media (min-width: 769px) {
                    #mobile-bottom-nav {
                        display: none !important;
                    }
                    
                    body {
                        padding-bottom: 0 !important;
                    }
                }

                @media (max-width: 768px) {
                    #recently-viewed-float {
                        bottom: 90px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
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
        ReadingTime.init();
        MobileNav.init();
        RecentlyViewed.init();
        GiscusComments.init();

        console.log('%c📖 Final Enhancements Loaded', 'color: #0d4d3d; font-weight: bold;');
    });

})();
