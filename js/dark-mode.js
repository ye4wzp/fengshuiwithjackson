/**
 * Dark Mode Toggle
 * Binds to the moon icon button (🌙) in the bottom-right corner.
 * 
 * Features:
 * - CSS custom properties theme switching
 * - localStorage persistence
 * - prefers-color-scheme auto-detection
 * - Smooth transition animation
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'fswj_dark_mode';

    function init() {
        // Check saved preference or system preference
        const saved = localStorage.getItem(STORAGE_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (saved === 'true' || (saved === null && prefersDark)) {
            enableDarkMode(false);
        }

        // Find or create the toggle button
        let toggleBtn = document.querySelector('.dark-mode-toggle, .moon-toggle');

        // If no dedicated button exists, look for the moon icon button
        if (!toggleBtn) {
            const allButtons = document.querySelectorAll('button, .btn, a');
            allButtons.forEach(btn => {
                if (btn.textContent.includes('🌙') || btn.innerHTML.includes('🌙')) {
                    toggleBtn = btn;
                }
            });
        }

        // Create one if none exists
        if (!toggleBtn) {
            toggleBtn = document.createElement('button');
            toggleBtn.className = 'dark-mode-toggle';
            toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
            toggleBtn.innerHTML = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
            toggleBtn.style.cssText = `
                position: fixed; bottom: 20px; right: 20px; z-index: 999;
                width: 48px; height: 48px; border-radius: 50%;
                background: var(--emerald-deep); border: 2px solid var(--champagne-gold);
                font-size: 1.3rem; cursor: pointer; display: flex;
                align-items: center; justify-content: center;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(toggleBtn);
        }

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            if (isDark) {
                disableDarkMode();
            } else {
                enableDarkMode(true);
            }
            toggleBtn.innerHTML = isDark ? '🌙' : '☀️';
        });
    }

    function enableDarkMode(animate) {
        if (animate) {
            document.documentElement.style.transition = 'background-color 0.4s ease, color 0.4s ease';
        }
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(STORAGE_KEY, 'true');
    }

    function disableDarkMode() {
        document.documentElement.style.transition = 'background-color 0.4s ease, color 0.4s ease';
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(STORAGE_KEY, 'false');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
