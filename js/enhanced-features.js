// ==========================================
// ENHANCED FEATURES FOR FENGSHUIWITHJACKSON
// Dark Mode, Reading Progress, Share Buttons, 
// Related Articles, and More
// ==========================================

(function() {
    'use strict';

    // ==========================================
    // 1. DARK MODE
    // ==========================================
    const DarkMode = {
        init() {
            this.createToggle();
            this.loadPreference();
            this.watchSystemPreference();
        },

        createToggle() {
            const toggle = document.createElement('button');
            toggle.id = 'dark-mode-toggle';
            toggle.innerHTML = '🌙';
            toggle.setAttribute('aria-label', 'Toggle dark mode');
            toggle.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: none;
                background: var(--emerald-deep, #0d4d3d);
                color: white;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                z-index: 999;
                transition: all 0.3s ease;
            `;
            toggle.addEventListener('click', () => this.toggle());
            toggle.addEventListener('mouseenter', () => {
                toggle.style.transform = 'scale(1.1)';
            });
            toggle.addEventListener('mouseleave', () => {
                toggle.style.transform = 'scale(1)';
            });
            document.body.appendChild(toggle);
        },

        toggle() {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark ? 'true' : 'false');
            this.updateIcon(isDark);
        },

        loadPreference() {
            const saved = localStorage.getItem('darkMode');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const isDark = saved === 'true' || (saved === null && prefersDark);
            
            if (isDark) {
                document.body.classList.add('dark-mode');
            }
            this.updateIcon(isDark);
        },

        updateIcon(isDark) {
            const toggle = document.getElementById('dark-mode-toggle');
            if (toggle) {
                toggle.innerHTML = isDark ? '☀️' : '🌙';
            }
        },

        watchSystemPreference() {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                if (localStorage.getItem('darkMode') === null) {
                    if (e.matches) {
                        document.body.classList.add('dark-mode');
                    } else {
                        document.body.classList.remove('dark-mode');
                    }
                    this.updateIcon(e.matches);
                }
            });
        }
    };

    // ==========================================
    // 2. READING PROGRESS BAR
    // ==========================================
    const ReadingProgress = {
        init() {
            if (!document.querySelector('.article-body, .article-content')) return;
            
            this.createProgressBar();
            this.bindEvents();
        },

        createProgressBar() {
            const bar = document.createElement('div');
            bar.id = 'reading-progress';
            bar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 4px;
                background: linear-gradient(90deg, #d4af37, #e8c96f);
                z-index: 1001;
                transition: width 0.1s ease;
                box-shadow: 0 1px 5px rgba(212, 175, 55, 0.5);
            `;
            document.body.appendChild(bar);
        },

        bindEvents() {
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.updateProgress();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        },

        updateProgress() {
            const bar = document.getElementById('reading-progress');
            const article = document.querySelector('.article-body, .article-content');
            if (!bar || !article) return;

            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;

            const start = articleTop - windowHeight;
            const end = articleTop + articleHeight;
            const progress = ((scrollTop - start) / (end - start)) * 100;
            
            bar.style.width = Math.min(Math.max(progress, 0), 100) + '%';
        }
    };

    // ==========================================
    // 3. ENHANCED SHARE BUTTONS
    // ==========================================
    const ShareButtons = {
        init() {
            this.createShareBar();
        },

        createShareBar() {
            const article = document.querySelector('.article-header');
            if (!article) return;

            const shareBar = document.createElement('div');
            shareBar.className = 'share-bar';
            shareBar.innerHTML = `
                <span class="share-label">Share:</span>
                <button class="share-btn share-facebook" data-platform="facebook" title="Share on Facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                    </svg>
                </button>
                <button class="share-btn share-twitter" data-platform="twitter" title="Share on Twitter/X">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                </button>
                <button class="share-btn share-pinterest" data-platform="pinterest" title="Pin on Pinterest">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                    </svg>
                </button>
                <button class="share-btn share-linkedin" data-platform="linkedin" title="Share on LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </button>
                <button class="share-btn share-whatsapp" data-platform="whatsapp" title="Share on WhatsApp">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                </button>
                <button class="share-btn share-copy" data-platform="copy" title="Copy Link">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                </button>
            `;
            
            // Insert after article header
            article.parentNode.insertBefore(shareBar, article.nextSibling);
            
            // Bind click events
            shareBar.querySelectorAll('.share-btn').forEach(btn => {
                btn.addEventListener('click', () => this.share(btn.dataset.platform));
            });
        },

        share(platform) {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            const text = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');
            
            const urls = {
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
                pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`,
                linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
                whatsapp: `https://wa.me/?text=${title}%20${url}`,
                copy: null
            };

            if (platform === 'copy') {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    this.showToast('Link copied to clipboard!');
                });
            } else if (urls[platform]) {
                window.open(urls[platform], '_blank', 'width=600,height=400');
            }
        },

        showToast(message) {
            const toast = document.createElement('div');
            toast.className = 'share-toast';
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background: #0d4d3d;
                color: white;
                padding: 15px 30px;
                border-radius: 30px;
                font-size: 14px;
                z-index: 9999;
                animation: toastIn 0.3s ease;
            `;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        }
    };

    // ==========================================
    // 4. RELATED ARTICLES ALGORITHM
    // ==========================================
    const RelatedArticles = {
        articles: [
            { url: 'article-2026-forecast.html', title: '2026 Feng Shui Forecast', category: '2026', tags: ['forecast', 'fire-horse', 'zodiac'] },
            { url: 'article-bedroom-fengshui.html', title: 'Bedroom Feng Shui Guide', category: 'bedroom', tags: ['bedroom', 'sleep', 'relationships'] },
            { url: 'article-bedroom-mistakes.html', title: '7 Bedroom Mistakes', category: 'bedroom', tags: ['bedroom', 'mistakes', 'tips'] },
            { url: 'article-kitchen-fengshui.html', title: 'Kitchen Feng Shui', category: 'kitchen', tags: ['kitchen', 'wealth', 'health'] },
            { url: 'article-office-fengshui.html', title: 'Office Feng Shui', category: 'office', tags: ['office', 'career', 'success'] },
            { url: 'article-home-office.html', title: 'Home Office Guide', category: 'office', tags: ['office', 'work-from-home', 'desk'] },
            { url: 'article-living-room-fengshui.html', title: 'Living Room Feng Shui', category: 'living-room', tags: ['living-room', 'family', 'gathering'] },
            { url: 'article-entryway-fengshui.html', title: 'Entryway Feng Shui', category: 'entryway', tags: ['entryway', 'chi', 'welcome'] },
            { url: 'article-mirror-fengshui.html', title: 'Mirror Feng Shui Guide', category: 'mirrors', tags: ['mirrors', 'placement', 'taboos'] },
            { url: 'article-plants-guide.html', title: '15 Best Feng Shui Plants', category: 'plants', tags: ['plants', 'nature', 'energy'] },
            { url: 'article-money-plants.html', title: 'Top 5 Money Plants', category: 'plants', tags: ['plants', 'money', 'wealth'] },
            { url: 'article-wealth-corner.html', title: 'Find Your Wealth Corner', category: 'wealth', tags: ['wealth', 'money', 'bagua'] },
            { url: 'article-decluttering.html', title: 'Decluttering Guide', category: 'decluttering', tags: ['decluttering', 'organization', 'chi'] },
            { url: 'article-fire-horse-2026.html', title: 'Fire Horse 2026', category: '2026', tags: ['fire-horse', '2026', 'energy'] }
        ],

        init() {
            this.enhanceRelatedSection();
        },

        getCurrentArticle() {
            const currentPath = window.location.pathname.split('/').pop();
            return this.articles.find(a => a.url === currentPath);
        },

        getRecommendations(current, limit = 3) {
            if (!current) return this.articles.slice(0, limit);

            const scores = this.articles
                .filter(a => a.url !== current.url)
                .map(article => {
                    let score = 0;
                    // Same category = high score
                    if (article.category === current.category) score += 10;
                    // Shared tags
                    const sharedTags = article.tags.filter(t => current.tags.includes(t));
                    score += sharedTags.length * 3;
                    return { ...article, score };
                })
                .sort((a, b) => b.score - a.score);

            return scores.slice(0, limit);
        },

        enhanceRelatedSection() {
            const relatedSection = document.querySelector('.related-articles-section .articles-grid');
            if (!relatedSection) return;

            const current = this.getCurrentArticle();
            const recommendations = this.getRecommendations(current);

            // Update with smart recommendations
            relatedSection.innerHTML = recommendations.map(article => `
                <article class="article-card" data-score="${article.score || 0}">
                    <div class="article-content">
                        <span class="article-tag">${article.category}</span>
                        <h3>${article.title}</h3>
                        <a href="${article.url}" class="read-more">Read More →</a>
                    </div>
                </article>
            `).join('');
        }
    };

    // ==========================================
    // 5. ENHANCED BREADCRUMBS
    // ==========================================
    const Breadcrumbs = {
        init() {
            this.addSchema();
        },

        addSchema() {
            const breadcrumb = document.querySelector('.breadcrumb ol');
            if (!breadcrumb) return;

            const items = breadcrumb.querySelectorAll('li');
            const schemaData = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": []
            };

            items.forEach((item, index) => {
                const link = item.querySelector('a');
                const name = link ? link.textContent : item.textContent;
                const url = link ? link.href : window.location.href;
                
                schemaData.itemListElement.push({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": name.trim(),
                    "item": url
                });
            });

            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schemaData);
            document.head.appendChild(script);
        }
    };

    // ==========================================
    // 6. ARTICLE SCHEMA MARKUP
    // ==========================================
    const ArticleSchema = {
        init() {
            if (!document.querySelector('.blog-article')) return;
            this.addSchema();
        },

        addSchema() {
            const article = document.querySelector('.blog-article');
            const title = document.querySelector('h1')?.textContent || document.title;
            const description = document.querySelector('meta[name="description"]')?.content || '';
            const datePublished = document.querySelector('.article-meta span')?.textContent?.replace('📅 ', '') || '';
            const author = 'Jackson';
            
            const schemaData = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": title,
                "description": description,
                "author": {
                    "@type": "Person",
                    "name": author,
                    "url": "https://fengshuiwithjackson.com"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Feng Shui With Jackson",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://fengshuiwithjackson.com/images/logo.png"
                    }
                },
                "datePublished": this.parseDate(datePublished),
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": window.location.href
                }
            };

            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(schemaData);
            document.head.appendChild(script);
        },

        parseDate(dateStr) {
            // Convert "January 2, 2026" to "2026-01-02"
            try {
                const date = new Date(dateStr);
                return date.toISOString().split('T')[0];
            } catch {
                return new Date().toISOString().split('T')[0];
            }
        }
    };

    // ==========================================
    // CSS STYLES FOR NEW FEATURES
    // ==========================================
    const Styles = {
        init() {
            const style = document.createElement('style');
            style.textContent = `
                /* Dark Mode */
                body.dark-mode {
                    --cream: #1a1a1a;
                    --cream-dark: #121212;
                    --white: #2d2d2d;
                    --black: #f0f0f0;
                    --gray-dark: #c0c0c0;
                    --gray-medium: #888;
                    --gray-light: #444;
                }
                
                body.dark-mode .navbar {
                    background: #1a1a1a;
                }
                
                body.dark-mode .service-card,
                body.dark-mode .blog-card,
                body.dark-mode .testimonial-card,
                body.dark-mode .article-body,
                body.dark-mode .sidebar-card {
                    background: #2d2d2d;
                }
                
                body.dark-mode h1, body.dark-mode h2, body.dark-mode h3,
                body.dark-mode h4, body.dark-mode h5, body.dark-mode h6 {
                    color: #4CAF50;
                }
                
                body.dark-mode .logo,
                body.dark-mode .nav-menu a {
                    color: #f0f0f0;
                }
                
                body.dark-mode img {
                    filter: brightness(0.9);
                }
                
                /* Share Bar */
                .share-bar {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 15px 0;
                    margin: 20px 0;
                    border-top: 1px solid var(--gray-light);
                    border-bottom: 1px solid var(--gray-light);
                    flex-wrap: wrap;
                }
                
                .share-label {
                    font-weight: 600;
                    color: var(--gray-dark);
                    margin-right: 10px;
                }
                
                .share-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    color: white;
                }
                
                .share-facebook { background: #1877f2; }
                .share-twitter { background: #000; }
                .share-pinterest { background: #e60023; }
                .share-linkedin { background: #0a66c2; }
                .share-whatsapp { background: #25d366; }
                .share-copy { background: #0d4d3d; }
                
                .share-btn:hover {
                    transform: scale(1.15);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                
                /* Reading Progress Animation */
                @keyframes toastIn {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                
                /* Related Article Tag */
                .article-tag {
                    display: inline-block;
                    padding: 4px 12px;
                    background: var(--champagne-gold);
                    color: white;
                    font-size: 12px;
                    border-radius: 20px;
                    margin-bottom: 10px;
                    text-transform: capitalize;
                }
                
                /* Breadcrumb Enhancements */
                .breadcrumb ol {
                    display: flex;
                    flex-wrap: wrap;
                    list-style: none;
                    padding: 15px 0;
                    margin: 0;
                    font-size: 14px;
                }
                
                .breadcrumb li::after {
                    content: '›';
                    margin: 0 10px;
                    color: var(--gray-medium);
                }
                
                .breadcrumb li:last-child::after {
                    display: none;
                }
                
                .breadcrumb a {
                    color: var(--emerald-deep);
                    text-decoration: none;
                }
                
                .breadcrumb a:hover {
                    text-decoration: underline;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // ==========================================
    // INITIALIZE ALL FEATURES
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        Styles.init();
        DarkMode.init();
        ReadingProgress.init();
        ShareButtons.init();
        RelatedArticles.init();
        Breadcrumbs.init();
        ArticleSchema.init();
        
        console.log('%c✨ Enhanced Features Loaded', 'color: #d4af37; font-weight: bold;');
    });

})();
