/**
 * Interactive Feng Shui Diagnostic Tool
 * A 3-step mini-quiz embedded on the homepage.
 * 
 * Flow:
 * 1. Select area to improve (Wealth, Love, Career, Health, Sleep)
 * 2. Enter birth year → determine zodiac
 * 3. Show personalized feng shui tips + recommended articles + products
 * 
 * Uses BaziEngine (if available) or simple zodiac calculation as fallback.
 */

(function () {
    'use strict';

    const DIAGNOSTIC_AREAS = {
        wealth: {
            icon: '💰', label: 'Wealth',
            articles: [
                { title: 'How to Find Your Wealth Corner', url: 'article-wealth-corner.html' },
                { title: 'Top 5 Money Plants', url: 'article-money-plants.html' }
            ],
            product: { name: 'Citrine Crystal Cluster', url: 'https://amzn.to/4pbsSnz', emoji: '💎' },
            tipsByElement: {
                Wood: 'Add a water fountain to your Southeast corner to nourish your Wood energy and attract wealth.',
                Fire: 'Your Fire energy attracts attention — place red accents in the South to boost recognition and income.',
                Earth: 'Ground your finances with yellow crystals in your Southwest corner. Stability brings wealth.',
                Metal: 'Organize your finances with precision. Place a metal wind chime in the West for money luck.',
                Water: 'Your intuition about money is strong. Add a fish tank or water feature in the North.'
            }
        },
        love: {
            icon: '❤️', label: 'Love & Relationships',
            articles: [
                { title: 'Love Feng Shui Guide', url: 'article-love-fengshui.html' },
                { title: 'Bedroom Feng Shui', url: 'article-bedroom-fengshui.html' }
            ],
            product: { name: 'Rose Quartz Crystal', url: 'https://amzn.to/placeholder-rose-quartz', emoji: '💗' },
            tipsByElement: {
                Wood: 'Place paired items (two candles, two plants) in your Southwest corner for relationship harmony.',
                Fire: 'Your warm energy naturally attracts love. Add pink accents to your bedroom for deeper connection.',
                Earth: 'Create a cozy, nurturing bedroom. Use Earth-tone bedding and add rose quartz crystals.',
                Metal: 'Soften your space with fabrics and flowers. Your precision benefits from emotional warmth.',
                Water: 'Your deep emotions are your strength in love. Add Fire elements (candles) to balance.'
            }
        },
        career: {
            icon: '💼', label: 'Career',
            articles: [
                { title: 'Career & Business Feng Shui', url: 'article-career-business.html' },
                { title: 'Office Feng Shui Guide', url: 'article-office-fengshui.html' }
            ],
            product: { name: 'Desktop Water Fountain', url: 'https://amzn.to/492GXxr', emoji: '⛲' },
            tipsByElement: {
                Wood: 'Face East while working. Add a bamboo plant to your desk for creative career growth.',
                Fire: 'You shine in leadership. Place awards in the South sector. Wear red for presentations.',
                Earth: 'Real estate and finance suit you well. Place a globe in your office for expansion luck.',
                Metal: 'Technology and finance are your domains. Metal desk accessories boost focus and precision.',
                Water: 'Your networking skills are unmatched. A water feature in the North enhances career flow.'
            }
        },
        health: {
            icon: '🏠', label: 'Health',
            articles: [
                { title: 'Health & Longevity Feng Shui', url: 'article-health-longevity.html' },
                { title: 'Kitchen Feng Shui', url: 'article-kitchen-fengshui.html' }
            ],
            product: { name: 'Himalayan Salt Lamp', url: 'https://amzn.to/placeholder-salt-lamp', emoji: '🧂' },
            tipsByElement: {
                Wood: 'Spend time in nature daily. Add living plants throughout your home for vitality.',
                Fire: 'Watch for burnout. Balance with Water elements (blue decor, calm music) in your bedroom.',
                Earth: 'Nourish yourself with home-cooked meals. Keep kitchen clean and use earthy ceramics.',
                Metal: 'Breathing exercises in the West corner of your room. White and silver promote healing.',
                Water: 'Rest near water features for recovery. Hydrate more and clutter your North sector.'
            }
        },
        sleep: {
            icon: '😴', label: 'Better Sleep',
            articles: [
                { title: 'Best Sleep Direction Guide', url: 'article-sleep-direction.html' },
                { title: 'Bedroom Mistakes to Avoid', url: 'article-bedroom-mistakes.html' }
            ],
            product: { name: 'Singing Bowl for Sleep', url: 'https://amzn.to/placeholder-singing-bowl', emoji: '🔔' },
            tipsByElement: {
                Wood: 'Sleep with your head facing East for rejuvenation. Add soft green tones to your bedding.',
                Fire: 'Cool your bedroom with blue accents. Remove electronics and harsh lighting before bed.',
                Earth: 'Ground your sleep with a firm mattress. Use beige or warm earth tones in your bedroom.',
                Metal: 'Create a pristine bedroom sanctuary. White bedding and organized nightstand for restful sleep.',
                Water: 'Sleep with your head facing North. Add a small salt lamp for warm, calming light.'
            }
        }
    };

    const ZODIAC_BY_BRANCH = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    const ZODIAC_EMOJIS = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐴', '🐐', '🐵', '🐔', '🐕', '🐷'];
    const BRANCH_TO_ELEMENT = ['Water', 'Earth', 'Wood', 'Wood', 'Earth', 'Fire', 'Fire', 'Earth', 'Metal', 'Metal', 'Earth', 'Water'];

    let selectedArea = null;

    function init() {
        const container = document.getElementById('diagnosticTool');
        if (!container) return;

        // Show step 1
        showStep1();
    }

    function showStep1() {
        const container = document.getElementById('diagnosticTool');
        const content = document.getElementById('diagnosticContent');
        const steps = container.querySelectorAll('.diag-step');
        steps.forEach((s, i) => s.classList.toggle('active', i === 0));

        content.innerHTML = `
            <p style="text-align:center; color:var(--gray-dark); margin-bottom:1.5rem; font-size:1.05rem;">
                Select what you'd like to improve most:
            </p>
            <div class="diag-options">
                ${Object.entries(DIAGNOSTIC_AREAS).map(([key, area]) => `
                    <button class="diag-option" data-area="${key}" onclick="window._diagSelectArea('${key}')">
                        <span class="diag-option-icon">${area.icon}</span>
                        <span class="diag-option-label">${area.label}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    function selectArea(key) {
        selectedArea = key;
        showStep2();
    }

    function showStep2() {
        const container = document.getElementById('diagnosticTool');
        const content = document.getElementById('diagnosticContent');
        const steps = container.querySelectorAll('.diag-step');
        steps.forEach((s, i) => s.classList.toggle('active', i === 1));

        content.innerHTML = `
            <p style="text-align:center; color:var(--gray-dark); margin-bottom:1.5rem; font-size:1.05rem;">
                Enter your birth year to get personalized advice:
            </p>
            <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap; max-width:400px; margin:0 auto;">
                <input type="number" id="diagBirthYear" placeholder="e.g. 1990" min="1924" max="2025"
                    style="flex:1; min-width:150px; padding:0.9rem 1.5rem; border:2px solid var(--gray-light);
                    border-radius:50px; font-size:1.1rem; font-family:var(--font-body);
                    text-align:center; transition:var(--transition-smooth);"
                    onfocus="this.style.borderColor='var(--champagne-gold)'"
                    onblur="this.style.borderColor='var(--gray-light)'">
                <button onclick="window._diagSubmitYear()" class="btn btn-primary"
                    style="padding:0.9rem 2rem; white-space:nowrap;">
                    Get My Tips →
                </button>
            </div>
            <p style="text-align:center; margin-top:1rem;">
                <a href="javascript:void(0)" onclick="window._diagShowStep1()" style="color:var(--champagne-gold); font-size:0.9rem; text-decoration:none;">
                    ← Change selection
                </a>
            </p>
        `;

        // Auto-focus
        setTimeout(() => document.getElementById('diagBirthYear')?.focus(), 300);
    }

    function submitYear() {
        const yearInput = document.getElementById('diagBirthYear');
        const year = parseInt(yearInput?.value);

        if (!year || year < 1924 || year > 2025) {
            yearInput.style.borderColor = '#e74c3c';
            yearInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                yearInput.style.borderColor = 'var(--gray-light)';
                yearInput.style.animation = '';
            }, 1500);
            return;
        }

        const branchIndex = (year - 4) % 12;
        const normalizedIndex = ((branchIndex % 12) + 12) % 12;
        const zodiac = ZODIAC_BY_BRANCH[normalizedIndex];
        const zodiacEmoji = ZODIAC_EMOJIS[normalizedIndex];
        const element = BRANCH_TO_ELEMENT[normalizedIndex];

        showStep3(zodiac, zodiacEmoji, element, year);
    }

    function showStep3(zodiac, emoji, element, year) {
        const container = document.getElementById('diagnosticTool');
        const content = document.getElementById('diagnosticContent');
        const steps = container.querySelectorAll('.diag-step');
        steps.forEach((s, i) => s.classList.toggle('active', i === 2));

        const area = DIAGNOSTIC_AREAS[selectedArea];
        const tip = area.tipsByElement[element];

        content.innerHTML = `
            <div class="diag-result">
                <div class="diag-result-header">
                    <div style="font-size:3rem; margin-bottom:0.5rem;">${emoji}</div>
                    <h4 style="font-family:var(--font-heading); color:var(--emerald-deep); font-size:1.5rem; margin-bottom:0.3rem;">
                        ${zodiac} · ${element} Element
                    </h4>
                    <p style="color:var(--gray-medium); font-size:0.9rem;">Born ${year} · Improving ${area.label}</p>
                </div>

                <div class="diag-tip-box">
                    <h5 style="color:var(--champagne-gold); font-size:0.85rem; font-weight:600; text-transform:uppercase; letter-spacing:1px; margin-bottom:0.5rem;">
                        🏡 Jackson's Personalized Tip
                    </h5>
                    <p style="color:var(--emerald-deep); font-size:1.05rem; line-height:1.7;">${tip}</p>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1.5rem;">
                    ${area.articles.map(a => `
                        <a href="${a.url}" class="diag-article-link">
                            📖 ${a.title}
                        </a>
                    `).join('')}
                </div>

                <div style="margin-top:1.5rem; text-align:center;">
                    <a href="${area.product.url}" target="_blank" rel="nofollow" class="btn btn-gold" style="font-size:0.9rem;">
                        ${area.product.emoji} Shop: ${area.product.name} →
                    </a>
                </div>

                <div style="margin-top:1.5rem; text-align:center;">
                    <a href="daily-fortune.html" style="color:var(--champagne-gold); font-weight:600; text-decoration:none; font-size:0.95rem;">
                        🔮 Check your daily fortune as a ${zodiac} →
                    </a>
                </div>

                <div style="text-align:center; margin-top:1rem;">
                    <a href="javascript:void(0)" onclick="window._diagShowStep1()" style="color:var(--gray-medium); font-size:0.85rem; text-decoration:none;">
                        ↻ Start over
                    </a>
                </div>
            </div>
        `;

        // Track in GA4
        if (typeof gtag === 'function') {
            gtag('event', 'diagnostic_complete', {
                event_category: 'engagement',
                zodiac: zodiac,
                element: element,
                area: selectedArea
            });
        }
    }

    // Expose functions for inline onclick handlers
    window._diagSelectArea = selectArea;
    window._diagSubmitYear = submitYear;
    window._diagShowStep1 = showStep1;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
