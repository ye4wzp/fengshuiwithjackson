/**
 * Fortune Logic (Enhanced with BaZi Engine)
 * Uses traditional Chinese metaphysics for accurate daily fortune generation.
 */

(function () {
    'use strict';

    // Display current date with Chinese calendar info
    function displayDate() {
        const dateElement = document.getElementById('currentDate');
        if (!dateElement) return;

        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const westernDate = today.toLocaleDateString('en-US', options);

        // Get Chinese calendar day info from BaZi engine
        if (typeof BaziEngine !== 'undefined') {
            const dayPillar = BaziEngine.getDayPillar(today.getFullYear(), today.getMonth() + 1, today.getDate());
            const pillarName = BaziEngine.formatPillar(dayPillar);
            const dayElement = BaziEngine.getStemElement(dayPillar.stem);
            dateElement.innerHTML = `${westernDate}<br><span class="chinese-date">${pillarName}日 · ${dayElement} Day</span>`;
        } else {
            dateElement.textContent = westernDate;
        }
    }

    /**
     * Get fortune for a zodiac sign using BaZi engine + fortune data pools
     */
    function getFortune(zodiac) {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        const zodiacInfo = fortuneData[zodiac];
        if (!zodiacInfo) return null;

        const branchIndex = zodiacInfo.branchIndex;

        // Get BaZi-based ratings
        let ratings;
        if (typeof BaziEngine !== 'undefined') {
            ratings = BaziEngine.getDailyFortuneRatings(branchIndex, today);
        } else {
            // Fallback if BaZi engine not loaded
            const seed = simpleHash(zodiac + today.toISOString().split('T')[0]);
            ratings = {
                wealth: (seed % 5) + 1,
                love: ((seed >> 3) % 5) + 1,
                career: ((seed >> 6) % 5) + 1,
                health: ((seed >> 9) % 5) + 1,
                overall: 3,
                dayStem: 0,
                dayBranch: 0
            };
        }

        // Select data from pools using day pillar values (deterministic per day)
        const stemVal = ratings.dayStem || 0;
        const branchVal = ratings.dayBranch || 0;
        const dayIndex = (stemVal + branchVal + branchIndex) % zodiacInfo.advice.length;
        const colorIndex = (stemVal + branchVal) % zodiacInfo.colorSets.length;
        const numIndex = (stemVal * 2 + branchVal) % zodiacInfo.numberSets.length;
        const dirIndex = (stemVal + branchVal * 2) % zodiacInfo.directions.length;
        const crystalIndex = (stemVal + branchVal + day) % zodiacInfo.crystals.length;
        const tipIndex = (stemVal * 3 + branchVal) % zodiacInfo.fengShuiTips.length;

        // Get almanac data (do/don't items)
        let almanac = { doItems: [], dontItems: [], pillarName: '', dayElement: '' };
        if (typeof BaziEngine !== 'undefined') {
            almanac = BaziEngine.getDailyAlmanac(year, month, day);
        }

        // Get lucky hours
        let luckyHours = [];
        if (typeof BaziEngine !== 'undefined') {
            luckyHours = BaziEngine.getLuckyHours(year, month, day);
        }

        // Get feng shui tip
        let fengShuiTip = zodiacInfo.fengShuiTips[tipIndex];
        if (typeof BaziEngine !== 'undefined') {
            fengShuiTip = BaziEngine.getDailyFengShuiTip(year, month, day, branchIndex);
        }

        // Get branch relation info
        let branchRelation = '';
        if (typeof BaziEngine !== 'undefined') {
            const dayPillar = BaziEngine.getDayPillar(year, month, day);
            const relation = BaziEngine.getBranchRelation(branchIndex, dayPillar.branch);
            branchRelation = relation.description;
        }

        return {
            zodiac: zodiac,
            name: zodiacInfo.name,
            emoji: zodiacInfo.emoji,
            element: zodiacInfo.element,
            colors: zodiacInfo.colorSets[colorIndex],
            direction: zodiacInfo.directions[dirIndex],
            numbers: zodiacInfo.numberSets[numIndex],
            crystal: zodiacInfo.crystals[crystalIndex],
            wealth: ratings.wealth,
            love: ratings.love,
            career: ratings.career,
            health: ratings.health,
            overall: ratings.overall,
            advice: zodiacInfo.advice[dayIndex],
            fengShuiTip: fengShuiTip,
            doItems: almanac.doItems,
            dontItems: almanac.dontItems,
            luckyHours: luckyHours,
            dayPillar: almanac.pillarName,
            dayElement: almanac.dayElement,
            branchRelation: branchRelation,
            date: today.toISOString().split('T')[0]
        };
    }

    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Generate star rating HTML
    function generateStars(rating) {
        const fullStars = '★'.repeat(rating);
        const emptyStars = '☆'.repeat(5 - rating);
        return fullStars + emptyStars;
    }

    // Display fortune card
    function displayFortune(fortune) {
        // Hide zodiac selector with fade
        const selector = document.getElementById('zodiacSelector');
        selector.classList.add('fade-out');
        setTimeout(() => { selector.style.display = 'none'; }, 300);

        // Show fortune card
        const container = document.getElementById('fortuneCardContainer');
        container.style.display = 'block';
        container.classList.add('fade-in');

        // Populate card - basic info
        document.getElementById('fortuneZodiacEmoji').textContent = fortune.emoji;
        document.getElementById('fortuneZodiacName').textContent = fortune.name + ' Fortune for Today';
        document.getElementById('fortuneStars').textContent = generateStars(fortune.overall);

        document.getElementById('luckyColors').textContent = fortune.colors.join(', ');
        document.getElementById('luckyDirection').textContent = fortune.direction;
        document.getElementById('luckyNumbers').textContent = fortune.numbers.join(', ');
        document.getElementById('luckyElement').textContent = fortune.element;

        // Ratings
        document.getElementById('wealthRating').textContent = generateStars(fortune.wealth);
        document.getElementById('loveRating').textContent = generateStars(fortune.love);
        document.getElementById('careerRating').textContent = generateStars(fortune.career);
        document.getElementById('healthRating').textContent = generateStars(fortune.health);

        // Advice
        document.getElementById('fortuneAdvice').textContent = fortune.advice;

        // Crystal (if element exists)
        const crystalEl = document.getElementById('luckyCrystal');
        if (crystalEl) crystalEl.textContent = fortune.crystal;

        // Day pillar info
        const pillarEl = document.getElementById('dayPillarInfo');
        if (pillarEl && fortune.dayPillar) {
            pillarEl.textContent = fortune.dayPillar + ' · ' + fortune.dayElement + ' Day';
            pillarEl.style.display = 'block';
        }

        // Branch relation
        const relationEl = document.getElementById('branchRelation');
        if (relationEl && fortune.branchRelation) {
            relationEl.textContent = fortune.branchRelation;
            relationEl.style.display = 'block';
        }

        // Do/Don't items (almanac panel)
        const doListEl = document.getElementById('doItems');
        const dontListEl = document.getElementById('dontItems');
        if (doListEl && fortune.doItems && fortune.doItems.length > 0) {
            doListEl.innerHTML = fortune.doItems.map(item =>
                `<li class="do-item">✅ ${item}</li>`
            ).join('');
        }
        if (dontListEl && fortune.dontItems && fortune.dontItems.length > 0) {
            dontListEl.innerHTML = fortune.dontItems.map(item =>
                `<li class="dont-item">❌ ${item}</li>`
            ).join('');
        }

        // Almanac panel visibility
        const almanacPanel = document.getElementById('almanacPanel');
        if (almanacPanel && fortune.doItems && fortune.doItems.length > 0) {
            almanacPanel.style.display = 'block';
        }

        // Lucky hours
        const luckyHoursEl = document.getElementById('luckyHours');
        if (luckyHoursEl && fortune.luckyHours && fortune.luckyHours.length > 0) {
            luckyHoursEl.innerHTML = fortune.luckyHours.map(h =>
                `<span class="lucky-hour-badge">${h.name} ${h.timeRange}</span>`
            ).join('');
            const luckyHoursPanel = document.getElementById('luckyHoursPanel');
            if (luckyHoursPanel) luckyHoursPanel.style.display = 'block';
        }

        // Feng Shui Tip
        const tipEl = document.getElementById('fengShuiTip');
        if (tipEl && fortune.fengShuiTip) {
            tipEl.textContent = fortune.fengShuiTip;
            const tipPanel = document.getElementById('fengShuiTipPanel');
            if (tipPanel) tipPanel.style.display = 'block';
        }

        // Draw radar chart
        drawRadarChart(fortune);

        // Save to localStorage
        localStorage.setItem('lastZodiac', fortune.zodiac);
        localStorage.setItem('lastVisit', fortune.date);

        // Trigger check-in, history, countdown
        saveFortuneToHistory(fortune);
        updateCheckinStats();
        startCountdown();
        const historyBtn = document.getElementById('historyBtn');
        if (historyBtn) historyBtn.style.display = 'inline-block';

        // Scroll to card
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Draw fortune radar chart using Canvas
     */
    function drawRadarChart(fortune) {
        const canvas = document.getElementById('fortuneRadar');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const center = size / 2;
        const radius = size * 0.35;
        const categories = ['Wealth', 'Love', 'Career', 'Health'];
        const values = [fortune.wealth, fortune.love, fortune.career, fortune.health];
        const maxVal = 5;

        ctx.clearRect(0, 0, size, size);

        // Draw grid
        for (let level = 1; level <= maxVal; level++) {
            ctx.beginPath();
            const r = (radius / maxVal) * level;
            for (let i = 0; i <= categories.length; i++) {
                const angle = (Math.PI * 2 / categories.length) * i - Math.PI / 2;
                const x = center + r * Math.cos(angle);
                const y = center + r * Math.sin(angle);
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw axes
        for (let i = 0; i < categories.length; i++) {
            const angle = (Math.PI * 2 / categories.length) * i - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.lineTo(center + radius * Math.cos(angle), center + radius * Math.sin(angle));
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
            ctx.stroke();
        }

        // Draw data
        ctx.beginPath();
        for (let i = 0; i <= categories.length; i++) {
            const idx = i % categories.length;
            const angle = (Math.PI * 2 / categories.length) * idx - Math.PI / 2;
            const r = (radius / maxVal) * values[idx];
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(13, 77, 61, 0.25)';
        ctx.fill();
        ctx.strokeStyle = '#0d4d3d';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw data points
        for (let i = 0; i < categories.length; i++) {
            const angle = (Math.PI * 2 / categories.length) * i - Math.PI / 2;
            const r = (radius / maxVal) * values[i];
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#d4af37';
            ctx.fill();
            ctx.strokeStyle = '#0d4d3d';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw labels
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = '#0d4d3d';
        ctx.textAlign = 'center';
        for (let i = 0; i < categories.length; i++) {
            const angle = (Math.PI * 2 / categories.length) * i - Math.PI / 2;
            const labelR = radius + 22;
            const x = center + labelR * Math.cos(angle);
            const y = center + labelR * Math.sin(angle) + 4;
            ctx.fillText(categories[i], x, y);
        }
    }

    // Handle zodiac selection with flip animation
    function handleZodiacClick(event) {
        const button = event.currentTarget;
        const zodiac = button.dataset.zodiac;

        // Add flip animation to button
        button.classList.add('zodiac-flip');

        setTimeout(() => {
            const fortune = getFortune(zodiac);
            if (fortune) {
                displayFortune(fortune);
            }
        }, 400);
    }

    // Change zodiac (show selector again)
    window.changeZodiac = function () {
        document.getElementById('fortuneCardContainer').style.display = 'none';
        const selector = document.getElementById('zodiacSelector');
        selector.style.display = 'block';
        selector.classList.remove('fade-out');
        selector.classList.add('fade-in');
        selector.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Share fortune
    window.shareFortune = function () {
        const zodiac = localStorage.getItem('lastZodiac');
        const fortune = getFortune(zodiac);

        if (fortune) {
            const overall = Math.round((fortune.wealth + fortune.love + fortune.career + fortune.health) / 4);
            const text = `🔮 My Daily Feng Shui Fortune:\n\n${fortune.emoji} ${fortune.name}\n⭐ ${generateStars(overall)}\n\n🎨 Lucky Colors: ${fortune.colors.join(', ')}\n🧭 Lucky Direction: ${fortune.direction}\n💎 Lucky Crystal: ${fortune.crystal}\n\nCheck yours at fengshuiwithjackson.com/daily-fortune.html`;

            if (navigator.share) {
                navigator.share({
                    title: 'My Daily Feng Shui Fortune',
                    text: text,
                    url: window.location.href
                }).catch(err => console.log('Share failed:', err));
            } else {
                navigator.clipboard.writeText(text).then(() => {
                    alert('Fortune copied to clipboard! Share it with your friends!');
                }).catch(err => console.log('Copy failed:', err));
            }
        }
    };

    // Initialize
    function init() {
        displayDate();

        const zodiacButtons = document.querySelectorAll('.zodiac-btn');
        zodiacButtons.forEach(button => {
            button.addEventListener('click', handleZodiacClick);
        });

        // Check if user has visited today
        const lastVisit = localStorage.getItem('lastVisit');
        const lastZodiac = localStorage.getItem('lastZodiac');
        const today = new Date().toISOString().split('T')[0];

        if (lastVisit === today && lastZodiac) {
            const fortune = getFortune(lastZodiac);
            if (fortune) {
                displayFortune(fortune);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// ===== CHECK-IN SYSTEM =====
function updateCheckinStats() {
    const today = new Date().toISOString().split('T')[0];
    let checkinData = JSON.parse(localStorage.getItem('checkinData') || '{"dates": [], "streak": 0, "total": 0}');

    if (!checkinData.dates.includes(today)) {
        checkinData.dates.push(today);
        checkinData.total++;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        checkinData.streak = checkinData.dates.includes(yesterdayStr) ? checkinData.streak + 1 : 1;
        if (checkinData.dates.length > 30) checkinData.dates = checkinData.dates.slice(-30);
        localStorage.setItem('checkinData', JSON.stringify(checkinData));
    }

    const streakEl = document.getElementById('streakDays');
    const totalEl = document.getElementById('totalCheckins');
    const statsEl = document.getElementById('checkinStats');
    if (streakEl) streakEl.textContent = checkinData.streak;
    if (totalEl) totalEl.textContent = checkinData.total;
    if (statsEl) statsEl.style.display = 'flex';
}

// ===== COUNTDOWN TIMER =====
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

// ===== HISTORY SYSTEM =====
function saveFortuneToHistory(fortune) {
    let history = JSON.parse(localStorage.getItem('fortuneHistory') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = history.findIndex(item => item.date === today && item.zodiac === fortune.zodiac);
    const entry = {
        date: today, zodiac: fortune.zodiac, name: fortune.name, emoji: fortune.emoji,
        overall: Math.round((fortune.wealth + fortune.love + fortune.career + fortune.health) / 4),
        wealth: fortune.wealth, love: fortune.love, career: fortune.career, health: fortune.health
    };
    if (existingIndex >= 0) history[existingIndex] = entry;
    else history.push(entry);
    if (history.length > 30) history = history.slice(-30);
    localStorage.setItem('fortuneHistory', JSON.stringify(history));
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem('fortuneHistory') || '[]');
    const contentEl = document.getElementById('historyContent');
    if (!contentEl) return;

    if (history.length === 0) {
        contentEl.innerHTML = '<div class="history-empty">No history yet. Check your fortune daily!</div>';
        return;
    }

    const last7 = history.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
    contentEl.innerHTML = last7.map(item => {
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const stars = '★'.repeat(item.overall) + '☆'.repeat(5 - item.overall);
        return `<div class="history-item">
            <div class="history-date">${dateStr}</div>
            <div class="history-zodiac"><span>${item.emoji}</span> <span>${item.name}</span></div>
            <div class="history-rating">${stars}</div>
        </div>`;
    }).join('');

    // Draw trend chart
    drawTrendChart(last7.reverse());
}

/**
 * Draw 7-day trend line chart
 */
function drawTrendChart(historyData) {
    const canvas = document.getElementById('trendChart');
    if (!canvas || historyData.length < 2) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const padding = 30;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = 'rgba(13, 77, 61, 0.03)';
    ctx.fillRect(0, 0, w, h);

    const points = historyData.map((item, i) => ({
        x: padding + (i / (historyData.length - 1)) * (w - padding * 2),
        y: h - padding - ((item.overall / 5) * (h - padding * 2)),
        label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: item.overall
    }));

    // Draw line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = '#0d4d3d';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw area fill
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.lineTo(points[points.length - 1].x, h - padding);
    ctx.lineTo(points[0].x, h - padding);
    ctx.closePath();
    ctx.fillStyle = 'rgba(13, 77, 61, 0.1)';
    ctx.fill();

    // Draw points and labels
    points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#d4af37';
        ctx.fill();
        ctx.strokeStyle = '#0d4d3d';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '10px Inter';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText(p.label, p.x, h - 8);
        ctx.fillStyle = '#0d4d3d';
        ctx.font = 'bold 11px Inter';
        ctx.fillText('★' + p.value, p.x, p.y - 12);
    });
}

window.toggleHistory = function () {
    const panel = document.getElementById('historyPanel');
    if (!panel) return;
    if (panel.style.display === 'none') {
        displayHistory();
        panel.style.display = 'block';
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        panel.style.display = 'none';
    }
};

// ===== NEW DAY CHECK =====
function checkNewDay() {
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toISOString().split('T')[0];
    if (lastVisit && lastVisit !== today) {
        const dateEl = document.getElementById('currentDate');
        if (dateEl && !dateEl.querySelector('.new-badge')) {
            const badge = document.createElement('span');
            badge.className = 'new-badge';
            badge.textContent = 'NEW';
            dateEl.appendChild(badge);
        }
    }
}

// Initialize supplementary features on page load
(function () {
    checkNewDay();
    const lastVisit = localStorage.getItem('lastVisit');
    const today = new Date().toISOString().split('T')[0];
    if (lastVisit === today) {
        updateCheckinStats();
        startCountdown();
        const historyBtn = document.getElementById('historyBtn');
        if (historyBtn) historyBtn.style.display = 'inline-block';
    }
})();
