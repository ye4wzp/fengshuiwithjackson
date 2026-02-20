/**
 * Email Subscribe Component
 * Handles inline email subscription forms across the site.
 * 
 * Supports two modes:
 * 1. ConvertKit API mode (when CONVERTKIT_FORM_ID is set)
 * 2. Google Form fallback mode (stores locally + opens Google Form)
 * 
 * Features:
 * - Zodiac tag selection for fortune-specific subscriptions
 * - LocalStorage to prevent duplicate signups
 * - Success animation
 * - GA4 event tracking
 */

(function () {
    'use strict';

    // ===== CONFIGURATION =====
    // Replace these when you set up ConvertKit
    const CONFIG = {
        // ConvertKit (set these when ready)
        CONVERTKIT_FORM_ID: '',  // e.g., '1234567'
        CONVERTKIT_API_URL: 'https://api.convertkit.com/v3/forms',

        // Google Form fallback
        GOOGLE_FORM_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSfbQOaSpdjNBvB_UzOL3Tm03vmTPaFDdJlsfk2M0D9-jqreqQ/viewform',

        // LocalStorage key
        STORAGE_KEY: 'fswj_subscribed',
        SUBSCRIBERS_KEY: 'fswj_subscribers'
    };

    // ===== INITIALIZATION =====
    function init() {
        const forms = document.querySelectorAll('.subscribe-form, .lead-email-form');
        forms.forEach(form => {
            form.addEventListener('submit', handleSubmit);
        });

        // Check if already subscribed and show subtle indicator
        if (isSubscribed()) {
            document.querySelectorAll('.subscribe-inline').forEach(el => {
                const note = el.querySelector('.subscribe-note');
                if (note) {
                    note.innerHTML = '✅ You\'re already subscribed! Check your inbox for daily fortunes.';
                }
            });
        }
    }

    // ===== FORM SUBMISSION =====
    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput ? emailInput.value.trim() : '';

        if (!email || !isValidEmail(email)) {
            shakeElement(emailInput);
            return;
        }

        // Get zodiac tag if present
        const zodiacSelect = form.closest('.subscribe-inline')?.querySelector('.zodiac-select-wrapper select');
        const zodiac = zodiacSelect ? zodiacSelect.value : '';

        // Get the source context
        const source = form.closest('[data-subscribe-source]')?.dataset.subscribeSource || 'general';

        // Disable button and show loading
        const submitBtn = form.querySelector('.btn-subscribe');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;

        try {
            if (CONFIG.CONVERTKIT_FORM_ID) {
                await submitToConvertKit(email, zodiac, source);
            } else {
                // Mock / local mode - save locally
                saveLocally(email, zodiac, source);
            }

            // Mark as subscribed
            markSubscribed(email, zodiac);

            // Show success
            showSuccess(form);

            // Track in GA4
            trackEvent('subscribe', { source, zodiac });

        } catch (error) {
            console.error('Subscribe error:', error);
            submitBtn.textContent = 'Try Again';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    }

    // ===== CONVERTKIT API =====
    async function submitToConvertKit(email, zodiac, source) {
        const url = `${CONFIG.CONVERTKIT_API_URL}/${CONFIG.CONVERTKIT_FORM_ID}/subscribe`;
        const tags = [];
        if (zodiac) tags.push(`zodiac_${zodiac}`);
        tags.push(`source_${source}`);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                tags: tags,
                fields: {
                    zodiac: zodiac,
                    source: source
                }
            })
        });

        if (!response.ok) throw new Error('ConvertKit API failed');
        return response.json();
    }

    // ===== LOCAL STORAGE (Mock Mode) =====
    function saveLocally(email, zodiac, source) {
        const subscribers = JSON.parse(localStorage.getItem(CONFIG.SUBSCRIBERS_KEY) || '[]');
        subscribers.push({
            email,
            zodiac,
            source,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(CONFIG.SUBSCRIBERS_KEY, JSON.stringify(subscribers));
        console.log(`📧 New subscriber saved locally: ${email} (zodiac: ${zodiac || 'none'}, source: ${source})`);
        console.log(`📊 Total local subscribers: ${subscribers.length}`);
    }

    function markSubscribed(email, zodiac) {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
            email,
            zodiac,
            date: new Date().toISOString()
        }));
    }

    function isSubscribed() {
        return !!localStorage.getItem(CONFIG.STORAGE_KEY);
    }

    // ===== UI EFFECTS =====
    function showSuccess(form) {
        const container = form.closest('.subscribe-inline') || form.closest('.lead-magnet');
        if (!container) return;

        // Hide form elements
        const formElements = container.querySelectorAll('.subscribe-form, .lead-email-form, .subscribe-subtitle, .zodiac-select-wrapper, .subscribe-note');
        formElements.forEach(el => el.style.display = 'none');

        // Show success message
        let successEl = container.querySelector('.subscribe-success');
        if (!successEl) {
            successEl = document.createElement('div');
            successEl.className = 'subscribe-success';
            successEl.innerHTML = `
                <div class="success-icon">🎋</div>
                <h4>Welcome to the Feng Shui Family!</h4>
                <p>You'll receive your first fortune reading soon. Check your inbox! 📬</p>
            `;
            const heading = container.querySelector('h2, h3');
            if (heading) {
                heading.insertAdjacentElement('afterend', successEl);
            } else {
                container.appendChild(successEl);
            }
        }
        successEl.classList.add('active');
    }

    function shakeElement(el) {
        if (!el) return;
        el.style.animation = 'none';
        el.offsetHeight; // trigger reflow
        el.style.animation = 'shake 0.5s ease-in-out';
        el.style.borderColor = '#e74c3c';
        setTimeout(() => {
            el.style.borderColor = '';
            el.style.animation = '';
        }, 1500);
    }

    // ===== ANALYTICS =====
    function trackEvent(action, params) {
        if (typeof gtag === 'function') {
            gtag('event', action, {
                event_category: 'email_subscribe',
                event_label: params.source,
                zodiac_sign: params.zodiac || 'none'
            });
        }
    }

    // ===== UTILITIES =====
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ===== INIT ON DOM READY =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
