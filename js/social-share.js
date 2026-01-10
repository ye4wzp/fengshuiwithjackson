// Enhanced Social Share Functionality
// Works on all article pages with floating sidebar and inline share options
(function () {
    'use strict';

    const SITE_NAME = 'Feng Shui With Jackson';

    function isArticlePage() {
        // Check if this is an article page by URL or content
        const url = window.location.pathname;
        return url.includes('article-') ||
            document.querySelector('.article-content') ||
            document.querySelector('.blog-article') ||
            document.querySelector('article');
    }

    function createFloatingShareBar() {
        // Only add on article pages
        if (!isArticlePage()) return;

        const shareContainer = document.createElement('div');
        shareContainer.className = 'social-share-floating';
        shareContainer.id = 'social-share-bar';

        const pageUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title);
        const pageDescription = encodeURIComponent(
            document.querySelector('meta[name="description"]')?.content || document.title
        );

        // Get article image for Pinterest
        const ogImage = document.querySelector('meta[property="og:image"]')?.content || '';
        const pageImage = encodeURIComponent(ogImage);

        const shareButtons = [
            {
                name: 'Facebook',
                icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
                url: `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
                color: '#1877f2'
            },
            {
                name: 'Twitter',
                icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
                url: `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`,
                color: '#000000'
            },
            {
                name: 'Pinterest',
                icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 0a12 12 0 0 0-4.373 23.178c-.07-.633-.134-1.606.028-2.298.146-.625.938-3.977.938-3.977s-.239-.479-.239-1.187c0-1.113.645-1.943 1.448-1.943.683 0 1.012.512 1.012 1.127 0 .687-.437 1.713-.663 2.664-.189.796.4 1.446 1.185 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.612 1.707-3.612 3.471 0 .688.265 1.425.595 1.826a.24.24 0 0 1 .056.23c-.061.252-.196.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.286-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.919l-.498 1.902c-.181.695-.669 1.566-.995 2.097A12 12 0 1 0 12 0z"/></svg>',
                url: `https://pinterest.com/pin/create/button/?url=${pageUrl}&media=${pageImage}&description=${pageTitle}`,
                color: '#e60023'
            },
            {
                name: 'LinkedIn',
                icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
                url: `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`,
                color: '#0a66c2'
            },
            {
                name: 'WhatsApp',
                icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>',
                url: `https://wa.me/?text=${pageTitle}%20${pageUrl}`,
                color: '#25d366'
            },
            {
                name: 'Email',
                icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
                url: `mailto:?subject=${pageTitle}&body=I thought you might find this interesting: ${pageUrl}`,
                color: '#666666'
            },
            {
                name: 'Copy Link',
                icon: '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>',
                url: '#copy',
                color: '#888888',
                isCopy: true
            }
        ];

        // Create label
        const label = document.createElement('div');
        label.className = 'share-label';
        label.textContent = 'SHARE';
        shareContainer.appendChild(label);

        // Create buttons
        shareButtons.forEach(btn => {
            const button = document.createElement('a');
            button.className = 'share-btn';
            button.style.setProperty('--btn-color', btn.color);
            button.innerHTML = btn.icon;
            button.title = btn.name;
            button.setAttribute('aria-label', `Share on ${btn.name}`);

            if (btn.isCopy) {
                button.href = '#';
                button.onclick = (e) => {
                    e.preventDefault();
                    copyLink(button);
                };
            } else {
                button.href = btn.url;
                button.target = '_blank';
                button.rel = 'noopener noreferrer';
            }

            shareContainer.appendChild(button);
        });

        document.body.appendChild(shareContainer);

        // Add scroll behavior
        handleScrollVisibility(shareContainer);
    }

    function createInlineShareButtons() {
        // Find article content area
        const articleContent = document.querySelector('.article-content') ||
            document.querySelector('.blog-article') ||
            document.querySelector('article');

        if (!articleContent) return;

        const pageUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title);

        // Create inline share section at bottom of article
        const inlineShare = document.createElement('div');
        inlineShare.className = 'inline-share-section';
        inlineShare.innerHTML = `
            <div class="inline-share-header">
                <span class="share-icon">📤</span>
                <span>Found this helpful? Share it!</span>
            </div>
            <div class="inline-share-buttons">
                <a href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" target="_blank" rel="noopener" class="inline-share-btn facebook">
                    <span>Facebook</span>
                </a>
                <a href="https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}" target="_blank" rel="noopener" class="inline-share-btn twitter">
                    <span>Twitter</span>
                </a>
                <a href="https://pinterest.com/pin/create/button/?url=${pageUrl}&description=${pageTitle}" target="_blank" rel="noopener" class="inline-share-btn pinterest">
                    <span>Pinterest</span>
                </a>
                <a href="https://wa.me/?text=${pageTitle}%20${pageUrl}" target="_blank" rel="noopener" class="inline-share-btn whatsapp">
                    <span>WhatsApp</span>
                </a>
            </div>
        `;

        // Insert before FAQ or at end of article
        const faqSection = articleContent.querySelector('.faq-section');
        if (faqSection) {
            faqSection.parentNode.insertBefore(inlineShare, faqSection);
        } else {
            articleContent.appendChild(inlineShare);
        }
    }

    function handleScrollVisibility(container) {
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const viewHeight = window.innerHeight;

            // Show after scrolling 300px
            if (scrollY > 300) {
                container.classList.add('visible');
            } else {
                container.classList.remove('visible');
            }

            // Hide near footer
            if (scrollY + viewHeight > docHeight - 200) {
                container.classList.add('near-footer');
            } else {
                container.classList.remove('near-footer');
            }

            lastScrollY = scrollY;
        });
    }

    function copyLink(button) {
        navigator.clipboard.writeText(window.location.href).then(() => {
            const originalIcon = button.innerHTML;
            button.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
            button.style.background = '#27ae60';

            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Floating Social Share Bar */
            .social-share-floating {
                position: fixed;
                left: 20px;
                top: 50%;
                transform: translateY(-50%);
                display: flex;
                flex-direction: column;
                gap: 8px;
                background: white;
                padding: 15px 10px;
                border-radius: 30px;
                box-shadow: 0 5px 30px rgba(0,0,0,0.15);
                z-index: 1000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .social-share-floating.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .social-share-floating.near-footer {
                opacity: 0.3;
            }
            
            .social-share-floating .share-label {
                font-size: 10px;
                font-weight: 600;
                color: #999;
                text-align: center;
                letter-spacing: 1px;
                margin-bottom: 5px;
            }
            
            .social-share-floating .share-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f5f5f5;
                color: #666;
                text-decoration: none;
                transition: all 0.3s ease;
            }
            
            .social-share-floating .share-btn:hover {
                background: var(--btn-color, #666);
                color: white;
                transform: scale(1.1);
            }
            
            .social-share-floating .share-btn svg {
                width: 18px;
                height: 18px;
            }
            
            /* Inline Share Section */
            .inline-share-section {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-radius: 20px;
                padding: 30px;
                margin: 40px 0;
                text-align: center;
            }
            
            .inline-share-header {
                font-size: 1.2rem;
                font-weight: 600;
                color: #333;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .inline-share-header .share-icon {
                font-size: 1.5rem;
            }
            
            .inline-share-buttons {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 12px;
            }
            
            .inline-share-btn {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 12px 24px;
                border-radius: 30px;
                text-decoration: none;
                font-weight: 600;
                color: white;
                transition: all 0.3s ease;
            }
            
            .inline-share-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .inline-share-btn.facebook { background: #1877f2; }
            .inline-share-btn.twitter { background: #000000; }
            .inline-share-btn.pinterest { background: #e60023; }
            .inline-share-btn.whatsapp { background: #25d366; }
            
            /* Hide floating bar on mobile, keep inline */
            @media (max-width: 1200px) {
                .social-share-floating {
                    left: 10px;
                    padding: 10px 8px;
                }
                
                .social-share-floating .share-btn {
                    width: 36px;
                    height: 36px;
                }
                
                .social-share-floating .share-label {
                    display: none;
                }
            }
            
            @media (max-width: 768px) {
                .social-share-floating {
                    display: none;
                }
                
                .inline-share-btn {
                    padding: 10px 18px;
                    font-size: 0.9rem;
                }
            }
            
            /* Remove old social share styles if exist */
            .social-share:not(.social-share-floating) {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize
    function init() {
        injectStyles();
        createFloatingShareBar();
        createInlineShareButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
