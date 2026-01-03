// Site Search Functionality
(function() {
    'use strict';
    
    const articles = [
        {
            title: "2026 Feng Shui Forecast: Year of the Fire Horse",
            url: "article-2026-forecast.html",
            excerpt: "Discover your 2026 feng shui forecast with lucky directions, colors, and zodiac predictions for the Year of the Fire Horse.",
            keywords: "2026 forecast fire horse zodiac predictions lucky colors directions"
        },
        {
            title: "Office Feng Shui: Complete Guide to Workplace Success",
            url: "article-office-fengshui.html",
            excerpt: "Optimize your office with feng shui for career success. Learn desk placement, plants, and productivity tips.",
            keywords: "office desk workplace career success productivity plants"
        },
        {
            title: "Bedroom Feng Shui: Complete Guide for Better Sleep",
            url: "article-bedroom-fengshui.html",
            excerpt: "Transform your bedroom with feng shui for better sleep and romance. Bed placement, colors, and decor tips.",
            keywords: "bedroom sleep romance bed placement colors decor"
        },
        {
            title: "Kitchen Feng Shui: Complete Guide for Wealth & Health",
            url: "article-kitchen-fengshui.html",
            excerpt: "Create abundance in your kitchen with feng shui. Stove placement, colors, and organization for wealth and health.",
            keywords: "kitchen wealth health stove placement organization"
        },
        {
            title: "Living Room Feng Shui: Complete Guide for Wealth & Harmony",
            url: "article-living-room-fengshui.html",
            excerpt: "Transform your living room with feng shui. Sofa placement, coffee table, TV wall, and wealth corner activation.",
            keywords: "living room sofa coffee table tv wealth harmony"
        },
        {
            title: "Feng Shui Plants Guide: 15 Best Plants for Every Room",
            url: "article-plants-guide.html",
            excerpt: "Discover the 15 best feng shui plants. Money tree, lucky bamboo, jade plant, and complete care guide.",
            keywords: "plants money tree lucky bamboo jade plant care guide"
        },
        {
            title: "Daily Feng Shui Fortune",
            url: "daily-fortune.html",
            excerpt: "Check your daily feng shui fortune based on your Chinese zodiac. Get lucky colors, directions, and personalized tips.",
            keywords: "daily fortune zodiac luck predictions"
        }
    ];
    
    function createSearchBox() {
        const nav = document.querySelector('.nav-menu');
        if (!nav) return;
        
        const searchLi = document.createElement('li');
        searchLi.innerHTML = `
            <div class="search-container">
                <input type="text" class="search-box" placeholder="Search articles..." id="siteSearch">
                <span class="search-icon">🔍</span>
                <div class="search-results" id="searchResults"></div>
            </div>
        `;
        
        nav.insertBefore(searchLi, nav.firstChild);
        
        const searchBox = document.getElementById('siteSearch');
        const searchResults = document.getElementById('searchResults');
        
        searchBox.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            
            if (query.length < 2) {
                searchResults.classList.remove('active');
                return;
            }
            
            const results = searchArticles(query);
            displayResults(results, query);
        });
        
        // Close results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchBox.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.remove('active');
            }
        });
    }
    
    function searchArticles(query) {
        return articles.filter(article => {
            const searchText = `${article.title} ${article.excerpt} ${article.keywords}`.toLowerCase();
            return searchText.includes(query);
        }).slice(0, 5); // Limit to 5 results
    }
    
    function displayResults(results, query) {
        const searchResults = document.getElementById('searchResults');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
            searchResults.classList.add('active');
            return;
        }
        
        searchResults.innerHTML = results.map(article => {
            const highlightedTitle = highlightText(article.title, query);
            const highlightedExcerpt = highlightText(article.excerpt, query);
            
            return `
                <a href="${article.url}" class="search-result-item">
                    <div class="search-result-title">${highlightedTitle}</div>
                    <div class="search-result-excerpt">${highlightedExcerpt}</div>
                </a>
            `;
        }).join('');
        
        searchResults.classList.add('active');
    }
    
    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createSearchBox);
    } else {
        createSearchBox();
    }
})();
