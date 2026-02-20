/**
 * Pinterest Save Button
 * Adds a "Save to Pinterest" button on hover for all article images.
 * Uses Pinterest's official widget builder URL format.
 */

(function () {
    'use strict';

    function init() {
        const articleImages = document.querySelectorAll('.article-body img, .article-content img, .blog-image img, .articles-grid img');

        articleImages.forEach(img => {
            // Skip if already wrapped
            if (img.closest('.pin-wrapper')) return;

            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'pin-wrapper';
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
            wrapper.style.width = '100%';

            // Create save button
            const pinBtn = document.createElement('a');
            pinBtn.className = 'pin-save-btn';
            pinBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg> Save`;
            pinBtn.target = '_blank';
            pinBtn.rel = 'noopener noreferrer';

            // Set Pinterest save URL dynamically
            const pageUrl = encodeURIComponent(window.location.href);
            const imgSrc = encodeURIComponent(img.src);
            const desc = encodeURIComponent(document.title + ' | Feng Shui With Jackson');
            pinBtn.href = `https://www.pinterest.com/pin/create/button/?url=${pageUrl}&media=${imgSrc}&description=${desc}`;

            // Style the button
            const btnStyle = pinBtn.style;
            btnStyle.position = 'absolute';
            btnStyle.top = '10px';
            btnStyle.left = '10px';
            btnStyle.background = '#E60023';
            btnStyle.color = 'white';
            btnStyle.border = 'none';
            btnStyle.borderRadius = '24px';
            btnStyle.padding = '8px 16px';
            btnStyle.fontSize = '14px';
            btnStyle.fontWeight = '600';
            btnStyle.fontFamily = 'var(--font-body, Inter, sans-serif)';
            btnStyle.cursor = 'pointer';
            btnStyle.display = 'none';
            btnStyle.alignItems = 'center';
            btnStyle.gap = '6px';
            btnStyle.zIndex = '10';
            btnStyle.textDecoration = 'none';
            btnStyle.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
            btnStyle.transition = 'transform 0.2s ease';

            // Show/hide on hover
            wrapper.addEventListener('mouseenter', () => {
                btnStyle.display = 'flex';
            });
            wrapper.addEventListener('mouseleave', () => {
                btnStyle.display = 'none';
            });

            // Wrap the image
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            wrapper.appendChild(pinBtn);
        });
    }

    // Initialize after images are loaded
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
