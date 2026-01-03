// Social Share Functionality
(function() {
    'use strict';
    
    function createShareButtons() {
        // Only add on article pages
        if (!document.querySelector('.blog-article')) return;
        
        const shareContainer = document.createElement('div');
        shareContainer.className = 'social-share';
        
        const pageUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title);
        
        // Facebook
        const facebook = createShareButton(
            'share-facebook',
            '📘',
            `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`
        );
        
        // Pinterest
        const pinterest = createShareButton(
            'share-pinterest',
            '📌',
            `https://pinterest.com/pin/create/button/?url=${pageUrl}&description=${pageTitle}`
        );
        
        // Twitter
        const twitter = createShareButton(
            'share-twitter',
            '🐦',
            `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`
        );
        
        // WhatsApp
        const whatsapp = createShareButton(
            'share-whatsapp',
            '💬',
            `https://wa.me/?text=${pageTitle}%20${pageUrl}`
        );
        
        // Copy Link
        const copy = document.createElement('button');
        copy.className = 'share-btn share-copy';
        copy.innerHTML = '🔗';
        copy.title = 'Copy Link';
        copy.onclick = copyLink;
        
        shareContainer.appendChild(facebook);
        shareContainer.appendChild(pinterest);
        shareContainer.appendChild(twitter);
        shareContainer.appendChild(whatsapp);
        shareContainer.appendChild(copy);
        
        document.body.appendChild(shareContainer);
    }
    
    function createShareButton(className, emoji, url) {
        const btn = document.createElement('a');
        btn.className = `share-btn ${className}`;
        btn.href = url;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.innerHTML = emoji;
        btn.title = className.replace('share-', '').replace('-', ' ');
        return btn;
    }
    
    function copyLink() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createShareButtons);
    } else {
        createShareButtons();
    }
})();
