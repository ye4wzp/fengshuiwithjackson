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

// Check-in System
function updateCheckinStats() {
    const today = new Date().toISOString().split('T')[0];
    
    // Get check-in data
    let checkinData = JSON.parse(localStorage.getItem('checkinData') || '{"dates": [], "streak": 0, "total": 0}');
    
    // Check if already checked in today
    if (!checkinData.dates.includes(today)) {
        // New check-in
        checkinData.dates.push(today);
        checkinData.total++;
        
        // Calculate streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (checkinData.dates.includes(yesterdayStr)) {
            checkinData.streak++;
        } else {
            checkinData.streak = 1;
        }
        
        // Keep only last 30 days
        if (checkinData.dates.length > 30) {
            checkinData.dates = checkinData.dates.slice(-30);
        }
        
        localStorage.setItem('checkinData', JSON.stringify(checkinData));
    }
    
    // Display stats
    document.getElementById('streakDays').textContent = checkinData.streak;
    document.getElementById('totalCheckins').textContent = checkinData.total;
    document.getElementById('checkinStats').style.display = 'flex';
}

// Countdown Timer
function startCountdown() {
    function updateCountdown() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) {
            countdownEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// History System
function saveFortuneToHistory(fortune) {
    let history = JSON.parse(localStorage.getItem('fortuneHistory') || '[]');
    
    // Check if today's fortune already exists
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = history.findIndex(item => item.date === today && item.zodiac === fortune.zodiac);
    
    if (existingIndex >= 0) {
        // Update existing
        history[existingIndex] = {
            date: today,
            zodiac: fortune.zodiac,
            name: fortune.name,
            emoji: fortune.emoji,
            overall: Math.round((fortune.wealth + fortune.love + fortune.career + fortune.health) / 4)
        };
    } else {
        // Add new
        history.push({
            date: today,
            zodiac: fortune.zodiac,
            name: fortune.name,
            emoji: fortune.emoji,
            overall: Math.round((fortune.wealth + fortune.love + fortune.career + fortune.health) / 4)
        });
    }
    
    // Keep only last 30 days
    if (history.length > 30) {
        history = history.slice(-30);
    }
    
    localStorage.setItem('fortuneHistory', JSON.stringify(history));
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem('fortuneHistory') || '[]');
    const contentEl = document.getElementById('historyContent');
    
    if (history.length === 0) {
        contentEl.innerHTML = '<div class="history-empty">No history yet. Check your fortune daily to build your history!</div>';
        return;
    }
    
    // Sort by date descending and take last 7
    const last7 = history.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
    
    contentEl.innerHTML = last7.map(item => {
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const stars = '★'.repeat(item.overall) + '☆'.repeat(5 - item.overall);
        
        return `
            <div class="history-item">
                <div class="history-date">${dateStr}</div>
                <div class="history-zodiac">
                    <span class="history-zodiac-emoji">${item.emoji}</span>
                    <span class="history-zodiac-name">${item.name}</span>
                </div>
                <div class="history-rating">${stars}</div>
            </div>
        `;
    }).join('');
}

window.toggleHistory = function() {
    const panel = document.getElementById('historyPanel');
    if (panel.style.display === 'none') {
        displayHistory();
        panel.style.display = 'block';
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        panel.style.display = 'none';
    }
};

// Check if it's a new day
function checkNewDay() {
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toISOString().split('T')[0];
    
    if (lastVisit && lastVisit !== today) {
        // It's a new day!
        const dateEl = document.getElementById('currentDate');
        if (dateEl && !dateEl.querySelector('.new-badge')) {
            const badge = document.createElement('span');
            badge.className = 'new-badge';
            badge.textContent = 'NEW';
            dateEl.appendChild(badge);
        }
    }
}

// Enhanced display fortune
const originalDisplayFortune = window.displayFortune || function() {};
window.displayFortune = function(fortune) {
    // Call original function
    if (typeof originalDisplayFortune === 'function') {
        originalDisplayFortune(fortune);
    }
    
    // Save to history
    saveFortuneToHistory(fortune);
    
    // Update check-in stats
    updateCheckinStats();
    
    // Show history button
    document.getElementById('historyBtn').style.display = 'inline-block';
    
    // Start countdown
    startCountdown();
};

// Initialize on page load
(function() {
    checkNewDay();
    
    // If user has already checked in today, show stats
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toISOString().split('T')[0];
    if (lastVisit === today) {
        updateCheckinStats();
        startCountdown();
        document.getElementById('historyBtn').style.display = 'inline-block';
    }
})();
