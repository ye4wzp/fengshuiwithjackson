/**
 * Global Lazy Loading & Performance Optimization
 * Feng Shui With Jackson
 * 
 * Features:
 * - Native lazy loading for all images
 * - Intersection Observer for background images
 * - Preload critical resources
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        applyNativeLazyLoading();
        setupBackgroundLazyLoading();
        setupImageFadeIn();
    }

    /**
     * Apply native lazy loading to all images
     */
    function applyNativeLazyLoading() {
        const images = document.querySelectorAll('img:not([loading])');

        images.forEach(img => {
            // Skip images that are already in viewport or above fold
            const rect = img.getBoundingClientRect();
            const isAboveFold = rect.top < window.innerHeight;

            if (!isAboveFold) {
                img.setAttribute('loading', 'lazy');
                img.setAttribute('decoding', 'async');
            }
        });

        console.log(`[LazyLoad] Applied lazy loading to ${images.length} images`);
    }

    /**
     * Lazy load background images using Intersection Observer
     */
    function setupBackgroundLazyLoading() {
        // Elements that commonly have background images
        const selectors = [
            '.blog-image',
            '.article-hero',
            '.page-header',
            '.hero-section',
            '[data-bg]',
            '.service-card',
            '.testimonial-bg'
        ];

        const elements = document.querySelectorAll(selectors.join(', '));

        if (!elements.length) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const el = entry.target;

                        // Handle data-bg attribute
                        if (el.dataset.bg) {
                            el.style.backgroundImage = `url('${el.dataset.bg}')`;
                        }

                        // Add loaded class for fade-in effect
                        el.classList.add('bg-loaded');
                        observer.unobserve(el);
                    }
                });
            }, {
                rootMargin: '200px 0px',
                threshold: 0.01
            });

            elements.forEach(el => {
                // Only observe if has background or data-bg
                const hasBg = el.style.backgroundImage || el.dataset.bg;
                if (hasBg) {
                    el.classList.add('bg-lazy');
                    observer.observe(el);
                }
            });
        } else {
            // Fallback: just show all backgrounds
            elements.forEach(el => {
                if (el.dataset.bg) {
                    el.style.backgroundImage = `url('${el.dataset.bg}')`;
                }
                el.classList.add('bg-loaded');
            });
        }
    }

    /**
     * Add fade-in effect to lazy loaded images
     */
    function setupImageFadeIn() {
        // Add styles for fade-in effect
        const style = document.createElement('style');
        style.textContent = `
            /* Lazy loading fade-in */
            img[loading="lazy"] {
                opacity: 0;
                transition: opacity 0.4s ease-in-out;
            }

            img[loading="lazy"].loaded,
            img.loaded {
                opacity: 1;
            }

            /* Background lazy loading */
            .bg-lazy {
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
            }

            .bg-lazy.bg-loaded {
                opacity: 1;
            }

            /* Placeholder while loading */
            .bg-lazy:not(.bg-loaded) {
                background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
            }
        `;
        document.head.appendChild(style);

        // Listen for image load events
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }

})();
