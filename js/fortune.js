// Fortune Logic
(function () {
    'use strict';

    // Display current date
    function displayDate() {
        const dateElement = document.getElementById('currentDate');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }

    // Generate pseudo-random number based on date and zodiac
    function getSeededRandom(zodiac, date) {
        const str = zodiac + date;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Get fortune for zodiac and date
    function getFortune(zodiac) {
        const today = new Date().toISOString().split('T')[0];
        const zodiacData = fortuneData[zodiac];

        if (!zodiacData) return null;

        // Use seeded random to get consistent fortune for the day
        const seed = getSeededRandom(zodiac, today);
        const fortuneIndex = seed % zodiacData.fortunes.length;
        const fortune = zodiacData.fortunes[fortuneIndex];

        return {
            zodiac: zodiac,
            name: zodiacData.name,
            emoji: zodiacData.emoji,
            ...fortune,
            date: today
        };
    }

    // Generate star rating HTML
    function generateStars(rating) {
        const fullStars = '★'.repeat(rating);
        const emptyStars = '☆'.repeat(5 - rating);
        return fullStars + emptyStars;
    }

    // Display fortune card
    function displayFortune(fortune) {
        // Hide zodiac selector
        document.getElementById('zodiacSelector').style.display = 'none';

        // Show fortune card
        const container = document.getElementById('fortuneCardContainer');
        container.style.display = 'block';

        // Calculate overall rating
        const overall = Math.round((fortune.wealth + fortune.love + fortune.career + fortune.health) / 4);

        // Populate card
        document.getElementById('fortuneZodiacEmoji').textContent = fortune.emoji;
        document.getElementById('fortuneZodiacName').textContent = fortune.name + ' Fortune for Today';
        document.getElementById('fortuneStars').textContent = generateStars(overall);

        document.getElementById('luckyColors').textContent = fortune.colors.join(', ');
        document.getElementById('luckyDirection').textContent = fortune.direction;
        document.getElementById('luckyNumbers').textContent = fortune.numbers.join(', ');
        document.getElementById('luckyElement').textContent = fortune.element;

        document.getElementById('wealthRating').textContent = generateStars(fortune.wealth);
        document.getElementById('loveRating').textContent = generateStars(fortune.love);
        document.getElementById('careerRating').textContent = generateStars(fortune.career);
        document.getElementById('healthRating').textContent = generateStars(fortune.health);

        document.getElementById('fortuneAdvice').textContent = fortune.advice;

        // Save to localStorage
        localStorage.setItem('lastZodiac', fortune.zodiac);
        localStorage.setItem('lastVisit', fortune.date);

        // Scroll to card
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Handle zodiac selection
    function handleZodiacClick(event) {
        const button = event.currentTarget;
        const zodiac = button.dataset.zodiac;

        // Add loading effect
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            const fortune = getFortune(zodiac);
            if (fortune) {
                displayFortune(fortune);
            }
        }, 300);
    }

    // Change zodiac (show selector again)
    window.changeZodiac = function () {
        // Hide fortune card
        document.getElementById('fortuneCardContainer').style.display = 'none';

        // Show zodiac selector
        const selector = document.getElementById('zodiacSelector');
        selector.style.display = 'block';

        // Scroll to selector
        selector.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Share fortune
    window.shareFortune = function () {
        const zodiac = localStorage.getItem('lastZodiac');
        const fortune = getFortune(zodiac);

        if (fortune) {
            const text = `🔮 My Daily Feng Shui Fortune:\n\n${fortune.emoji} ${fortune.name}\n⭐ ${generateStars(Math.round((fortune.wealth + fortune.love + fortune.career + fortune.health) / 4))}\n\n🎨 Lucky Colors: ${fortune.colors.join(', ')}\n🧭 Lucky Direction: ${fortune.direction}\n\nCheck yours at fengshuiwithjackson.com/daily-fortune.html`;

            if (navigator.share) {
                navigator.share({
                    title: 'My Daily Feng Shui Fortune',
                    text: text,
                    url: window.location.href
                }).catch(err => console.log('Share failed:', err));
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(text).then(() => {
                    alert('Fortune copied to clipboard! Share it with your friends!');
                }).catch(err => {
                    console.log('Copy failed:', err);
                });
            }
        }
    };

    // Initialize
    function init() {
        displayDate();

        // Add click handlers to zodiac buttons
        const zodiacButtons = document.querySelectorAll('.zodiac-btn');
        zodiacButtons.forEach(button => {
            button.addEventListener('click', handleZodiacClick);
        });

        // Check if user has visited today
        const lastVisit = localStorage.getItem('lastVisit');
        const lastZodiac = localStorage.getItem('lastZodiac');
        const today = new Date().toISOString().split('T')[0];

        if (lastVisit === today && lastZodiac) {
            // Show previous fortune
            const fortune = getFortune(lastZodiac);
            if (fortune) {
                displayFortune(fortune);
            }
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
