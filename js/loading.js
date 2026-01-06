// Loading Animation and Progress Bar
(function() {
    'use strict';
    
    // Page Loader
    function showPageLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-text">Loading...</div>
            </div>
        `;
        document.body.prepend(loader);
        
        // Hide loader when page is fully loaded
        window.addEventListener('load', function() {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 500);
            }, 300);
        });
    }
    
    // Progress Bar
    function createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        document.body.prepend(progressBar);
        
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 90) {
                clearInterval(interval);
            } else {
                width += Math.random() * 10;
                progressBar.style.width = Math.min(width, 90) + '%';
            }
        }, 200);
        
        window.addEventListener('load', function() {
            progressBar.style.width = '100%';
            setTimeout(() => {
                progressBar.style.opacity = '0';
                setTimeout(() => progressBar.remove(), 300);
            }, 200);
        });
    }
    
    // Image Lazy Loading Enhancement
    function enhanceLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        images.forEach(img => {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        });
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        createProgressBar();
        document.addEventListener('DOMContentLoaded', function() {
            enhanceLazyLoading();
        });
    } else {
        createProgressBar();
        enhanceLazyLoading();
    }
})();
