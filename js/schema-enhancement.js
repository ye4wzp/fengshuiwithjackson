// Enhanced Schema Markup Generator
// Automatically adds BreadcrumbList, WebSite, Organization, and improves Article schemas
(function () {
    'use strict';

    const SITE_CONFIG = {
        name: 'Feng Shui With Jackson',
        url: 'https://fengshuiwithjackson.com',
        description: 'Authentic Eastern Feng Shui guidance for modern homes. Transform your space, transform your life.',
        author: {
            name: 'Jackson Chen',
            url: 'https://fengshuiwithjackson.com'
        },
        logo: 'https://fengshuiwithjackson.com/images/logo.png',
        socialProfiles: [
            'https://www.facebook.com/fengshuiwithjackson',
            'https://www.pinterest.com/fengshuiwithjackson',
            'https://twitter.com/fengshui_jackson'
        ]
    };

    // Generate WebSite Schema (for homepage)
    function generateWebSiteSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": SITE_CONFIG.name,
            "url": SITE_CONFIG.url,
            "description": SITE_CONFIG.description,
            "potentialAction": {
                "@type": "SearchAction",
                "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": `${SITE_CONFIG.url}/blog.html?search={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            }
        };
    }

    // Generate Organization Schema
    function generateOrganizationSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": SITE_CONFIG.name,
            "url": SITE_CONFIG.url,
            "logo": SITE_CONFIG.logo,
            "description": SITE_CONFIG.description,
            "sameAs": SITE_CONFIG.socialProfiles,
            "founder": {
                "@type": "Person",
                "name": SITE_CONFIG.author.name
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "Chinese"]
            }
        };
    }

    // Generate BreadcrumbList Schema
    function generateBreadcrumbSchema() {
        const path = window.location.pathname;
        const breadcrumbs = [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": SITE_CONFIG.url
            }
        ];

        // Determine page type and add appropriate breadcrumbs
        if (path.includes('article-')) {
            // Article page
            breadcrumbs.push({
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": `${SITE_CONFIG.url}/blog.html`
            });

            // Get article title
            const title = document.querySelector('h1')?.textContent ||
                document.title.split('|')[0].trim();
            breadcrumbs.push({
                "@type": "ListItem",
                "position": 3,
                "name": title,
                "item": window.location.href
            });
        } else if (path.includes('blog')) {
            breadcrumbs.push({
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": window.location.href
            });
        } else if (path.includes('shop')) {
            breadcrumbs.push({
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": window.location.href
            });
        } else if (path.includes('guide')) {
            breadcrumbs.push({
                "@type": "ListItem",
                "position": 2,
                "name": "Free Guide",
                "item": window.location.href
            });
        } else if (path.includes('daily-fortune') || path.includes('fortune-calculator')) {
            breadcrumbs.push({
                "@type": "ListItem",
                "position": 2,
                "name": "Fortune Tools",
                "item": window.location.href
            });
        }

        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs
        };
    }

    // Generate enhanced Article Schema
    function generateEnhancedArticleSchema() {
        const path = window.location.pathname;
        if (!path.includes('article-')) return null;

        // Check if article already has schema
        const existingSchema = document.querySelector('script[type="application/ld+json"]');
        if (existingSchema) {
            try {
                const data = JSON.parse(existingSchema.textContent);
                if (data['@type'] === 'Article') {
                    // Already has article schema, skip
                    return null;
                }
            } catch (e) { }
        }

        const title = document.querySelector('h1')?.textContent || document.title;
        const description = document.querySelector('meta[name="description"]')?.content || '';
        const image = document.querySelector('meta[property="og:image"]')?.content || '';
        const datePublished = document.querySelector('meta[property="article:published_time"]')?.content ||
            new Date().toISOString().split('T')[0];

        // Extract reading time from page
        const readingTimeMatch = document.body.textContent.match(/(\d+)\s*min\s*read/i);
        const wordCount = document.querySelector('.article-content')?.textContent.split(/\s+/).length || 2000;

        return {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "image": image,
            "author": {
                "@type": "Person",
                "name": SITE_CONFIG.author.name,
                "url": SITE_CONFIG.author.url
            },
            "publisher": {
                "@type": "Organization",
                "name": SITE_CONFIG.name,
                "logo": {
                    "@type": "ImageObject",
                    "url": SITE_CONFIG.logo
                }
            },
            "datePublished": datePublished,
            "dateModified": datePublished,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": window.location.href
            },
            "wordCount": wordCount,
            "articleSection": "Feng Shui",
            "inLanguage": "en-US"
        };
    }

    // Generate ItemList Schema for blog page
    function generateBlogListSchema() {
        const path = window.location.pathname;
        if (!path.includes('blog')) return null;

        const articles = document.querySelectorAll('.blog-card');
        if (!articles.length) return null;

        const items = [];
        articles.forEach((card, index) => {
            const link = card.querySelector('a[href*="article-"]');
            const title = card.querySelector('h3')?.textContent || '';

            if (link && title) {
                items.push({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Article",
                        "name": title,
                        "url": new URL(link.href, window.location.origin).href
                    }
                });
            }
        });

        if (!items.length) return null;

        return {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Feng Shui Articles",
            "description": "In-depth feng shui guides for every room and topic",
            "numberOfItems": items.length,
            "itemListElement": items
        };
    }

    // Generate Product Schema for shop page
    function generateShopSchema() {
        const path = window.location.pathname;
        if (!path.includes('shop')) return null;

        const products = document.querySelectorAll('.product-card');
        if (!products.length) return null;

        const items = [];
        products.forEach((card, index) => {
            const name = card.querySelector('h4')?.textContent || '';
            const link = card.querySelector('a[href*="amazon"]') || card.querySelector('a[href*="amzn"]');

            if (name && link) {
                items.push({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Product",
                        "name": name,
                        "url": link.href
                    }
                });
            }
        });

        if (!items.length) return null;

        return {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Feng Shui Products",
            "description": "Curated feng shui products for wealth, health, and harmony",
            "numberOfItems": items.length,
            "itemListElement": items
        };
    }

    // Inject schema into page
    function injectSchema(schema) {
        if (!schema) return;

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    }

    // Check if schema already exists
    function schemaExists(type) {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of scripts) {
            try {
                const data = JSON.parse(script.textContent);
                if (data['@type'] === type) return true;
                if (Array.isArray(data['@graph'])) {
                    if (data['@graph'].some(item => item['@type'] === type)) return true;
                }
            } catch (e) { }
        }
        return false;
    }

    // Initialize all schemas
    function init() {
        const path = window.location.pathname;
        const isHomepage = path === '/' || path === '/index.html' || path.endsWith('/');

        // Always add BreadcrumbList (if not on homepage)
        if (!isHomepage && !schemaExists('BreadcrumbList')) {
            injectSchema(generateBreadcrumbSchema());
        }

        // Add WebSite schema on homepage
        if (isHomepage && !schemaExists('WebSite')) {
            injectSchema(generateWebSiteSchema());
        }

        // Add Organization schema on homepage
        if (isHomepage && !schemaExists('Organization')) {
            injectSchema(generateOrganizationSchema());
        }

        // Add enhanced Article schema if missing
        if (path.includes('article-')) {
            const articleSchema = generateEnhancedArticleSchema();
            if (articleSchema) {
                injectSchema(articleSchema);
            }
        }

        // Add ItemList schema for blog
        if (path.includes('blog') && !schemaExists('ItemList')) {
            injectSchema(generateBlogListSchema());
        }

        // Add ItemList schema for shop
        if (path.includes('shop') && !schemaExists('ItemList')) {
            injectSchema(generateShopSchema());
        }

        console.log('Schema markup enhanced');
    }

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
