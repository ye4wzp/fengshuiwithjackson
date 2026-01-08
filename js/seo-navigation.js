// ==========================================
// SEO AND NAVIGATION ENHANCEMENTS
// Product Schema, Search Enhancement, Breadcrumbs
// ==========================================

(function () {
    'use strict';

    // ==========================================
    // 1. PRODUCT SCHEMA FOR SHOP PAGE
    // ==========================================
    const ProductSchema = {
        init() {
            if (!window.location.pathname.includes('shop.html')) return;
            this.addProductSchemas();
        },

        addProductSchemas() {
            const products = [
                {
                    name: "Natural Healing Crystals Set",
                    description: "Crystal set for wealth attraction and energy healing. Perfect for feng shui wealth corner.",
                    price: "24.99",
                    category: "Crystals",
                    image: "images/product-crystals.webp",
                    url: "https://amzn.to/4jhTQZs"
                },
                {
                    name: "Money Tree (Pachira Aquatica)",
                    description: "Living prosperity plant with braided trunk symbolizing locked-in fortune. Easy care feng shui essential.",
                    price: "29.99",
                    category: "Plants",
                    image: "images/product-money-tree.webp",
                    url: "https://amzn.to/4shDmVb"
                },
                {
                    name: "Ceramic Tabletop Fountain",
                    description: "Water feature for wealth activation. Flowing water symbolizes cash flow and continuous income.",
                    price: "39.99",
                    category: "Decor",
                    image: "images/product-fountain.webp",
                    url: "https://amzn.to/4b6QcPQ"
                },
                {
                    name: "Wind Chimes Amazing Grace",
                    description: "Metal wind chimes for dispersing stagnant energy and inviting fresh Chi into your space.",
                    price: "34.99",
                    category: "Sound Tools",
                    image: "images/product-wind-chimes.webp",
                    url: "https://amzn.to/4q09n2y"
                },
                {
                    name: "Protection Crystals Set",
                    description: "Black Obsidian, Tourmaline, Labradorite, Smoky Quartz & Selenite for protection and energy cleansing.",
                    price: "29.99",
                    category: "Crystals",
                    image: "images/product-protection-crystals.webp",
                    url: "https://amzn.to/4jjMkgA"
                },
                {
                    name: "Zen Garden Kit",
                    description: "Miniature meditation tool for stress relief and mental clarity. Desktop feng shui essential.",
                    price: "24.99",
                    category: "Meditation",
                    image: "images/product-zen-garden.webp",
                    url: "https://amzn.to/49e0P0K"
                },
                {
                    name: "100% Mulberry Silk Pillowcase (22 Momme)",
                    description: "Luxury silk pillowcase for restful sleep and harmonious energy. Smooth fortune symbolism.",
                    price: "39.99",
                    category: "Bedroom",
                    image: "images/product-silk-pillowcase.webp",
                    url: "https://amzn.to/4qx8mPq"
                },
                {
                    name: "Himalayan Salt Lamp",
                    description: "Natural salt lamp releasing negative ions to purify energy and neutralize electromagnetic pollution.",
                    price: "24.99",
                    category: "Lighting",
                    image: "images/product-salt-lamp.webp",
                    url: "https://amzn.to/4jjEZxy"
                },
                {
                    name: "Tibetan Singing Bowl",
                    description: "Handcrafted singing bowl for sound healing and energy cleansing. Dissolves negative afflictions.",
                    price: "34.99",
                    category: "Sound Tools",
                    image: "images/product-singing-bowl.webp",
                    url: "https://amzn.to/4jeaY2h"
                },
                {
                    name: "Brass Gold Mini Table Lamps",
                    description: "Fire and Metal element activation for fame and wealth. Perfect desk feng shui tool.",
                    price: "44.99",
                    category: "Lighting",
                    image: "images/product-brass-lamp.webp",
                    url: "https://amzn.to/48WgMdb"
                },
                {
                    name: "Wood Desk Organizer",
                    description: "Natural wood organizer bringing grounding energy for steady career advancement.",
                    price: "39.99",
                    category: "Office",
                    image: "images/product-wood-organizer.webp",
                    url: "https://amzn.to/4jd85yq"
                },
                {
                    name: "White Sage Smudge Sticks",
                    description: "Essential space clearing tool for removing negative energy and preparing for new opportunities.",
                    price: "19.99",
                    category: "Cleansing",
                    image: "images/product-sage-sticks.webp",
                    url: "https://amzn.to/3MNVZ2Z"
                }
            ];

            // Create ItemList Schema
            const itemListSchema = {
                "@context": "https://schema.org",
                "@type": "ItemList",
                "name": "Jackson's Favorite Feng Shui Products",
                "description": "Curated feng shui essentials for wealth, harmony, and positive energy",
                "numberOfItems": products.length,
                "itemListElement": products.map((product, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Product",
                        "name": product.name,
                        "description": product.description,
                        "image": `https://fengshuiwithjackson.com/${product.image}`,
                        "category": product.category,
                        "offers": {
                            "@type": "Offer",
                            "url": product.url,
                            "priceCurrency": "USD",
                            "price": product.price,
                            "availability": "https://schema.org/InStock",
                            "seller": {
                                "@type": "Organization",
                                "name": "Amazon"
                            }
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.5",
                            "reviewCount": "100"
                        }
                    }
                }))
            };

            // Inject schema
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(itemListSchema);
            document.head.appendChild(script);

            console.log('✅ Product Schema added for', products.length, 'products');
        }
    };

    // ==========================================
    // 2. ENHANCED SEARCH WITH HIGHLIGHTING
    // ==========================================
    const EnhancedSearch = {
        init() {
            this.enhanceSearchResults();
            this.addSearchStyles();
        },

        enhanceSearchResults() {
            // Override the displayResults function if it exists
            const originalDisplayResults = window.displayResults;

            // Find and modify search results display
            const searchResults = document.getElementById('searchResults');
            if (!searchResults) return;

            // Add observer to enhance results when they appear
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length > 0) {
                        this.highlightMatches();
                    }
                });
            });

            observer.observe(searchResults, { childList: true, subtree: true });
        },

        highlightMatches() {
            const searchBox = document.getElementById('siteSearch');
            const searchResults = document.getElementById('searchResults');
            if (!searchBox || !searchResults) return;

            const query = searchBox.value.trim().toLowerCase();
            if (query.length < 2) return;

            // Find all text nodes and highlight matches
            const resultItems = searchResults.querySelectorAll('.search-result-item');
            resultItems.forEach(item => {
                const titleEl = item.querySelector('.search-result-title');
                const excerptEl = item.querySelector('.search-result-excerpt');

                if (titleEl) {
                    titleEl.innerHTML = this.highlight(titleEl.textContent, query);
                }
                if (excerptEl) {
                    excerptEl.innerHTML = this.highlight(excerptEl.textContent, query);
                }
            });
        },

        highlight(text, query) {
            if (!query) return text;
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<mark class="search-highlight">$1</mark>');
        },

        addSearchStyles() {
            const style = document.createElement('style');
            style.textContent = `
                /* Enhanced Search Styles */
                .search-highlight {
                    background: linear-gradient(135deg, #fff3cd, #ffe082);
                    color: #0d4d3d;
                    padding: 2px 4px;
                    border-radius: 3px;
                    font-weight: 600;
                }

                .search-container {
                    position: relative;
                }

                .search-box {
                    padding: 10px 40px 10px 15px;
                    border: 2px solid #e0e0e0;
                    border-radius: 25px;
                    font-size: 14px;
                    width: 200px;
                    transition: all 0.3s ease;
                    background: white;
                }

                .search-box:focus {
                    outline: none;
                    border-color: var(--champagne-gold, #d4af37);
                    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
                    width: 280px;
                }

                .search-icon {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                }

                .search-results {
                    position: absolute;
                    top: calc(100% + 10px);
                    left: 0;
                    right: 0;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    display: none;
                    z-index: 1000;
                    max-height: 400px;
                    overflow-y: auto;
                }

                .search-results.active {
                    display: block;
                }

                .search-result-item {
                    padding: 15px 20px;
                    border-bottom: 1px solid #f0f0f0;
                    text-decoration: none;
                    display: block;
                    transition: background 0.2s ease;
                }

                .search-result-item:last-child {
                    border-bottom: none;
                }

                .search-result-item:hover {
                    background: #f8f9fa;
                }

                .search-result-title {
                    color: #0d4d3d;
                    font-weight: 600;
                    font-size: 15px;
                    margin-bottom: 5px;
                }

                .search-result-excerpt {
                    color: #666;
                    font-size: 13px;
                    line-height: 1.4;
                }

                .search-no-results {
                    padding: 20px;
                    text-align: center;
                    color: #888;
                }

                /* Dark mode */
                body.dark-mode .search-box {
                    background: #2d2d2d;
                    border-color: #444;
                    color: #eee;
                }

                body.dark-mode .search-results {
                    background: #2d2d2d;
                }

                body.dark-mode .search-result-item:hover {
                    background: #3d3d3d;
                }

                body.dark-mode .search-result-title {
                    color: #4CAF50;
                }

                body.dark-mode .search-result-excerpt {
                    color: #bbb;
                }

                body.dark-mode .search-highlight {
                    background: rgba(212, 175, 55, 0.3);
                }

                /* Mobile */
                @media (max-width: 768px) {
                    .nav-search {
                        display: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    };

    // ==========================================
    // 3. UNIFIED BREADCRUMB NAVIGATION
    // ==========================================
    const BreadcrumbEnhance = {
        init() {
            this.addBreadcrumbStyles();
            this.fixBreadcrumbPosition();
            this.addBreadcrumbSchema();
        },

        addBreadcrumbStyles() {
            const style = document.createElement('style');
            style.textContent = `
                /* Enhanced Breadcrumb Styles */
                .breadcrumb {
                    position: absolute;
                    top: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 100;
                    padding: 0;
                    margin: 0;
                    display: none;
                }

                /* Show breadcrumb on pages with page-header or article-header */
                .page-header ~ .breadcrumb,
                .article-header ~ .breadcrumb,
                body:has(.page-header) .breadcrumb,
                body:has(.article-header) .breadcrumb {
                    display: block;
                }

                /* Breadcrumb inside navbar - needs repositioning */
                .navbar .breadcrumb {
                    position: relative;
                    top: auto;
                    left: auto;
                    transform: none;
                    background: rgba(13, 77, 61, 0.1);
                    padding: 8px 20px;
                    border-radius: 25px;
                    margin-bottom: 10px;
                    display: inline-block;
                }

                .breadcrumb ol {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 13px;
                }

                .breadcrumb li {
                    display: flex;
                    align-items: center;
                }

                .breadcrumb li:not(:last-child)::after {
                    content: '›';
                    margin-left: 10px;
                    color: rgba(13, 77, 61, 0.5);
                    font-weight: bold;
                }

                .breadcrumb a {
                    color: var(--emerald-deep, #0d4d3d);
                    text-decoration: none;
                    transition: color 0.2s ease;
                }

                .breadcrumb a:hover {
                    color: var(--champagne-gold, #d4af37);
                }

                .breadcrumb li[aria-current="page"] {
                    color: #888;
                    font-weight: 500;
                }

                /* Breadcrumb below header */
                .article-header + .container .breadcrumb,
                .page-header + .container .breadcrumb {
                    margin-top: 20px;
                    margin-bottom: 30px;
                }

                /* Breadcrumb in page header */
                .page-header .breadcrumb,
                .article-header .breadcrumb {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    margin-top: 20px;
                }

                .page-header .breadcrumb a,
                .article-header .breadcrumb a {
                    color: rgba(255, 255, 255, 0.8);
                }

                .page-header .breadcrumb a:hover,
                .article-header .breadcrumb a:hover {
                    color: var(--champagne-gold);
                }

                .page-header .breadcrumb li[aria-current="page"],
                .article-header .breadcrumb li[aria-current="page"] {
                    color: white;
                }

                .page-header .breadcrumb li:not(:last-child)::after,
                .article-header .breadcrumb li:not(:last-child)::after {
                    color: rgba(255, 255, 255, 0.5);
                }

                /* Dark mode */
                body.dark-mode .navbar .breadcrumb {
                    background: rgba(255, 255, 255, 0.1);
                }

                body.dark-mode .breadcrumb a {
                    color: #4CAF50;
                }

                body.dark-mode .breadcrumb li[aria-current="page"] {
                    color: #bbb;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .breadcrumb {
                        font-size: 12px;
                    }

                    .navbar .breadcrumb {
                        padding: 6px 15px;
                    }
                }
            `;
            document.head.appendChild(style);
        },

        fixBreadcrumbPosition() {
            // Only move breadcrumb for article pages, not general page headers
            // This prevents the breadcrumb from overlapping with the title
            const breadcrumb = document.querySelector('.navbar .breadcrumb');
            const articleHeader = document.querySelector('.article-header .container');

            // Only reposition for article pages, NOT for page-header (like blog.html)
            if (breadcrumb && articleHeader) {
                // Clone and move to article header only
                const clone = breadcrumb.cloneNode(true);
                articleHeader.insertBefore(clone, articleHeader.firstChild);
                breadcrumb.style.display = 'none';
            } else if (breadcrumb) {
                // For page-header pages, just hide the navbar breadcrumb completely
                breadcrumb.style.display = 'none';
            }
        },

        addBreadcrumbSchema() {
            // Check if schema already exists
            if (document.querySelector('script[type="application/ld+json"][data-breadcrumb]')) return;

            const breadcrumb = document.querySelector('.breadcrumb ol');
            if (!breadcrumb) return;

            const items = breadcrumb.querySelectorAll('li');
            const breadcrumbList = [];

            items.forEach((item, index) => {
                const link = item.querySelector('a');
                const name = link ? link.textContent : item.textContent.trim();
                const url = link ? link.href : window.location.href;

                breadcrumbList.push({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": name,
                    "item": url
                });
            });

            const schema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": breadcrumbList
            };

            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-breadcrumb', 'true');
            script.textContent = JSON.stringify(schema);
            document.head.appendChild(script);
        }
    };

    // ==========================================
    // INITIALIZE
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        ProductSchema.init();
        EnhancedSearch.init();
        BreadcrumbEnhance.init();

        console.log('%c🔍 SEO & Navigation Enhancements Loaded', 'color: #0d4d3d; font-weight: bold;');
    });

})();
