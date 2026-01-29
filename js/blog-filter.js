/**
 * Blog Filter, Search & Lazy Loading System
 * Feng Shui With Jackson
 * Features:
 * - Category filtering
 * - Full-text search
 * - Image lazy loading
 * - URL hash navigation
 */

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        // Only run on blog page
        if (!document.querySelector('.blog-grid')) return;

        setupCategoryFilter();
        setupBlogSearch();
        setupLazyLoading();
        handleHashNavigation();
    }

    // ============================================
    // CATEGORY DEFINITIONS
    // ============================================
    const CATEGORIES = {
        all: { label: 'All Articles', icon: '📚', color: '#0d4d3d' },
        rooms: { label: 'By Room', icon: '🏠', color: '#2C3E50' },
        wealth: { label: 'Wealth', icon: '💰', color: '#d4af37' },
        beginners: { label: 'Beginners', icon: '🌱', color: '#27ae60' },
        advanced: { label: 'Advanced', icon: '🎓', color: '#8e44ad' },
        '2026': { label: '2026 Guides', icon: '🐴', color: '#e74c3c' },
        tips: { label: 'Quick Tips', icon: '⚡', color: '#f39c12' }
    };

    // Article category mappings (based on content analysis)
    const ARTICLE_CATEGORIES = {
        // Rooms
        'article-bedroom-fengshui.html': ['rooms', 'beginners'],
        'article-bathroom-fengshui.html': ['rooms'],
        'article-kitchen-fengshui.html': ['rooms', 'wealth'],
        'article-living-room-fengshui.html': ['rooms', 'wealth'],
        'article-dining-room-fengshui.html': ['rooms'],
        'article-home-office.html': ['rooms', 'wealth'],
        'article-office-fengshui.html': ['rooms', 'wealth'],
        'article-entryway-fengshui.html': ['rooms', 'wealth'],
        'article-children-room.html': ['rooms'],
        // Wealth
        'article-wealth-corner.html': ['wealth', 'beginners'],
        'article-money-corner-45-rule.html': ['wealth', 'tips'],
        'article-money-plants.html': ['wealth', 'tips'],
        'article-career-business.html': ['wealth', 'advanced'],
        // Beginners
        'article-beginners-guide.html': ['beginners'],
        'article-decluttering.html': ['beginners', 'tips'],
        'article-color-guide.html': ['beginners'],
        'article-plants-guide.html': ['beginners', 'tips'],
        'article-renters-fengshui.html': ['beginners'],
        // Advanced
        'article-flying-stars-2026.html': ['advanced', '2026'],
        'article-sleep-direction.html': ['advanced', 'rooms'],
        'article-numerology-guide.html': ['advanced'],
        'article-zodiac-compatibility.html': ['advanced'],
        'article-cures-remedies.html': ['advanced'],
        // 2026
        'article-2026-forecast.html': ['2026', 'beginners'],
        'article-fire-horse-2026.html': ['2026'],
        // Tips
        'article-bedroom-mistakes.html': ['tips', 'rooms'],
        'article-door-colors.html': ['tips'],
        'article-doormat-coins.html': ['tips', 'wealth'],
        'article-dust-plants-thursday.html': ['tips'],
        'article-mirror-door-warning.html': ['tips'],
        'article-mirror-fengshui.html': ['tips'],
        'article-jupiter-manifestation.html': ['tips', 'wealth'],
        'article-reading-wood-element.html': ['tips'],
        // Other specialized
        'article-crystals-guide.html': ['advanced', 'wealth'],
        'article-water-element.html': ['advanced'],
        'article-health-longevity.html': ['advanced'],
        'article-love-fengshui.html': ['beginners'],
        'article-lucky-numbers.html': ['tips', 'wealth'],
        'article-small-apartment.html': ['rooms', 'beginners'],
        'article-seasonal-fengshui.html': ['tips'],
        'article-pets-fengshui.html': ['tips', 'beginners'],
        'article-house-hunting.html': ['beginners', 'wealth'],
        'article-new-home-movein.html': ['tips', 'beginners']
    };

    // ============================================
    // CATEGORY FILTER UI
    // ============================================
    function setupCategoryFilter() {
        const blogPage = document.querySelector('.blog-page .container');
        if (!blogPage) return;

        // Create filter container
        const filterContainer = document.createElement('div');
        filterContainer.className = 'blog-filter-container';
        filterContainer.innerHTML = `
            <div class="blog-search-box">
                <input type="text" id="blogSearchInput" placeholder="🔍 Search articles..." autocomplete="off">
                <span class="search-clear" id="searchClear">✕</span>
            </div>
            <div class="category-filters" id="categoryFilters">
                ${Object.entries(CATEGORIES).map(([key, cat]) => `
                    <button class="category-btn ${key === 'all' ? 'active' : ''}" 
                            data-category="${key}"
                            style="--cat-color: ${cat.color}">
                        <span class="cat-icon">${cat.icon}</span>
                        <span class="cat-label">${cat.label}</span>
                        <span class="cat-count" data-count="${key}">0</span>
                    </button>
                `).join('')}
            </div>
            <div class="filter-status" id="filterStatus"></div>
        `;

        // Insert before blog grid
        const blogGrid = blogPage.querySelector('.blog-grid');
        blogPage.insertBefore(filterContainer, blogGrid);

        // Add styles
        addFilterStyles();

        // Setup event listeners
        setupFilterListeners();

        // Calculate counts
        updateCategoryCounts();
    }

    function setupFilterListeners() {
        // Category button clicks
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const category = btn.dataset.category;
                filterArticles(category);
                
                // Update URL hash
                if (category !== 'all') {
                    window.location.hash = `category-${category}`;
                } else {
                    history.pushState('', document.title, window.location.pathname);
                }
            });
        });
    }

    function filterArticles(category) {
        const cards = document.querySelectorAll('.blog-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const link = card.querySelector('a[href^="article-"]');
            if (!link) {
                card.style.display = category === 'all' ? '' : 'none';
                return;
            }

            const articleUrl = link.getAttribute('href');
            const articleCategories = ARTICLE_CATEGORIES[articleUrl] || [];

            if (category === 'all' || articleCategories.includes(category)) {
                card.style.display = '';
                card.style.animation = 'fadeIn 0.3s ease-out';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Update status
        const status = document.getElementById('filterStatus');
        if (category !== 'all') {
            const catInfo = CATEGORIES[category];
            status.innerHTML = `Showing <strong>${visibleCount}</strong> articles in <strong>${catInfo.icon} ${catInfo.label}</strong>`;
            status.style.display = 'block';
        } else {
            status.style.display = 'none';
        }
    }

    function updateCategoryCounts() {
        const cards = document.querySelectorAll('.blog-card');
        const counts = { all: 0 };

        Object.keys(CATEGORIES).forEach(key => {
            if (key !== 'all') counts[key] = 0;
        });

        cards.forEach(card => {
            const link = card.querySelector('a[href^="article-"]');
            if (!link) return;

            counts.all++;
            const articleUrl = link.getAttribute('href');
            const articleCategories = ARTICLE_CATEGORIES[articleUrl] || [];

            articleCategories.forEach(cat => {
                if (counts[cat] !== undefined) counts[cat]++;
            });
        });

        // Update UI
        Object.entries(counts).forEach(([key, count]) => {
            const countEl = document.querySelector(`.cat-count[data-count="${key}"]`);
            if (countEl) countEl.textContent = count;
        });
    }

    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================
    function setupBlogSearch() {
        const searchInput = document.getElementById('blogSearchInput');
        const clearBtn = document.getElementById('searchClear');
        if (!searchInput) return;

        let debounceTimer;

        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const query = searchInput.value.trim().toLowerCase();
                searchArticles(query);
                clearBtn.style.display = query ? 'block' : 'none';
            }, 200);
        });

        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            searchArticles('');
            // Reset to all
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.category-btn[data-category="all"]').classList.add('active');
        });
    }

    function searchArticles(query) {
        const cards = document.querySelectorAll('.blog-card');
        const status = document.getElementById('filterStatus');
        let visibleCount = 0;

        if (!query) {
            cards.forEach(card => {
                card.style.display = '';
            });
            status.style.display = 'none';
            return;
        }

        // Reset category filter
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));

        cards.forEach(card => {
            const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
            const excerpt = card.querySelector('.blog-excerpt')?.textContent?.toLowerCase() || '';
            const category = card.querySelector('.blog-category')?.textContent?.toLowerCase() || '';

            const searchText = `${title} ${excerpt} ${category}`;

            if (searchText.includes(query)) {
                card.style.display = '';
                card.style.animation = 'fadeIn 0.3s ease-out';
                visibleCount++;
                // Highlight matching text
                highlightText(card, query);
            } else {
                card.style.display = 'none';
            }
        });

        status.innerHTML = `Found <strong>${visibleCount}</strong> articles matching "<strong>${query}</strong>"`;
        status.style.display = 'block';
    }

    function highlightText(card, query) {
        // Simple highlight - reset first
        const title = card.querySelector('h3');
        const excerpt = card.querySelector('.blog-excerpt');
        
        // Reset highlights
        if (title) title.innerHTML = title.textContent;
        if (excerpt) excerpt.innerHTML = excerpt.textContent;

        // Apply new highlights
        if (query.length >= 2) {
            const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
            if (title) title.innerHTML = title.textContent.replace(regex, '<mark>$1</mark>');
            if (excerpt) excerpt.innerHTML = excerpt.textContent.replace(regex, '<mark>$1</mark>');
        }
    }

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // ============================================
    // LAZY LOADING
    // ============================================
    function setupLazyLoading() {
        // Find all blog card images (background images)
        const blogImages = document.querySelectorAll('.blog-card .blog-image');
        
        // Find all regular images
        const images = document.querySelectorAll('img:not([loading])');
        
        // Add loading="lazy" to all images
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });

        // For background images, use Intersection Observer
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const bgImage = el.style.backgroundImage;
                        
                        if (bgImage && bgImage.includes('url')) {
                            // Already has image, just reveal it
                            el.classList.add('loaded');
                        }
                        
                        observer.unobserve(el);
                    }
                });
            }, {
                rootMargin: '100px 0px',
                threshold: 0.1
            });

            blogImages.forEach(img => {
                img.classList.add('lazy-bg');
                imageObserver.observe(img);
            });
        }
    }

    // ============================================
    // URL HASH NAVIGATION
    // ============================================
    function handleHashNavigation() {
        const hash = window.location.hash;
        if (hash.startsWith('#category-')) {
            const category = hash.replace('#category-', '');
            if (CATEGORIES[category]) {
                setTimeout(() => {
                    const btn = document.querySelector(`.category-btn[data-category="${category}"]`);
                    if (btn) btn.click();
                }, 100);
            }
        }
    }

    // ============================================
    // STYLES
    // ============================================
    function addFilterStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Blog Filter Container */
            .blog-filter-container {
                margin-bottom: 30px;
                padding: 25px;
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-radius: 20px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            }

            /* Search Box */
            .blog-search-box {
                position: relative;
                margin-bottom: 20px;
            }

            #blogSearchInput {
                width: 100%;
                padding: 15px 45px 15px 20px;
                font-size: 1rem;
                border: 2px solid #ddd;
                border-radius: 50px;
                outline: none;
                transition: all 0.3s ease;
                font-family: inherit;
            }

            #blogSearchInput:focus {
                border-color: #0d4d3d;
                box-shadow: 0 0 0 3px rgba(13, 77, 61, 0.1);
            }

            .search-clear {
                position: absolute;
                right: 18px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                color: #999;
                display: none;
                font-size: 1.2rem;
            }

            .search-clear:hover {
                color: #e74c3c;
            }

            /* Category Filters */
            .category-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }

            .category-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 10px 18px;
                background: white;
                border: 2px solid #eee;
                border-radius: 30px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: inherit;
                font-size: 0.9rem;
            }

            .category-btn:hover {
                border-color: var(--cat-color);
                transform: translateY(-2px);
            }

            .category-btn.active {
                background: var(--cat-color);
                border-color: var(--cat-color);
                color: white;
            }

            .cat-icon {
                font-size: 1.1rem;
            }

            .cat-count {
                background: rgba(0,0,0,0.1);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 600;
            }

            .category-btn.active .cat-count {
                background: rgba(255,255,255,0.3);
            }

            /* Filter Status */
            .filter-status {
                margin-top: 15px;
                padding: 10px 15px;
                background: #fff3cd;
                border-radius: 8px;
                font-size: 0.9rem;
                display: none;
            }

            /* Animations */
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Lazy loading background images */
            .lazy-bg {
                opacity: 0;
                transition: opacity 0.5s ease;
            }

            .lazy-bg.loaded {
                opacity: 1;
            }

            /* Search highlight */
            mark {
                background: #fff3cd;
                padding: 0 2px;
                border-radius: 2px;
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .blog-filter-container {
                    padding: 15px;
                }

                .category-filters {
                    gap: 8px;
                }

                .category-btn {
                    padding: 8px 12px;
                    font-size: 0.85rem;
                }

                .cat-label {
                    display: none;
                }

                .category-btn.active .cat-label {
                    display: inline;
                }
            }
        `;
        document.head.appendChild(style);
    }

})();
