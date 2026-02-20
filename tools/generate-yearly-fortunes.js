#!/usr/bin/env node

/**
 * Generate Yearly Fortune Content
 * 
 * Usage:
 *   node tools/generate-yearly-fortunes.js [--zodiac <sign>] [--days <n>] [--output <path>]
 * 
 * Examples:
 *   node tools/generate-yearly-fortunes.js                          # All 12 signs, 365 days
 *   node tools/generate-yearly-fortunes.js --zodiac dragon --days 3  # Dragon only, 3 days
 *   node tools/generate-yearly-fortunes.js --output ./output/        # Custom output directory
 * 
 * Output:
 *   - JSON files per zodiac: fortunes-<zodiac>.json
 *   - Each entry contains: date, ratings, almanac, tips, colors, advice
 * 
 * This script reuses the existing BaZi Engine and Fortune Data.
 */

const path = require('path');
const fs = require('fs');

// Import the BaZi Engine (it has CommonJS export support)
const BaziEngine = require(path.join(__dirname, '..', 'js', 'bazi-engine.js'));

// Import fortune data - needs a small adapter since it uses window.fortuneData
const fortuneDataPath = path.join(__dirname, '..', 'js', 'fortune-data.js');
const fortuneDataContent = fs.readFileSync(fortuneDataPath, 'utf-8');

// Create a sandbox to evaluate fortune-data.js
let fortuneData;
try {
    // Try CommonJS require first
    fortuneData = require(fortuneDataPath);
} catch (e) {
    // Fallback: evaluate in a sandbox context
    const vm = require('vm');
    const sandbox = { window: {}, module: { exports: {} } };
    vm.createContext(sandbox);
    vm.runInContext(fortuneDataContent, sandbox);
    fortuneData = sandbox.window.fortuneData || sandbox.module.exports;
}

if (!fortuneData || Object.keys(fortuneData).length === 0) {
    console.error('❌ Failed to load fortune data. Check js/fortune-data.js');
    process.exit(1);
}

// ===== CLI ARGUMENTS =====
const args = process.argv.slice(2);
const zodiacArg = getArg('--zodiac');
const daysArg = parseInt(getArg('--days') || '365');
const outputDir = getArg('--output') || path.join(__dirname, '..', 'generated-fortunes');

function getArg(name) {
    const idx = args.indexOf(name);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

// ===== ZODIAC MAPPING =====
const ZODIAC_SIGNS = [
    'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
    'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'
];

const ZODIAC_EMOJIS = {
    rat: '🐀', ox: '🐂', tiger: '🐅', rabbit: '🐇',
    dragon: '🐉', snake: '🐍', horse: '🐴', goat: '🐐',
    monkey: '🐵', rooster: '🐔', dog: '🐕', pig: '🐷'
};

// ===== MAIN GENERATION =====
function generateFortunes(zodiacSign, numDays) {
    const branchIndex = ZODIAC_SIGNS.indexOf(zodiacSign);
    if (branchIndex === -1) {
        console.error(`❌ Unknown zodiac: ${zodiacSign}`);
        return null;
    }

    const data = fortuneData[zodiacSign];
    if (!data) {
        console.error(`❌ No fortune data for: ${zodiacSign}`);
        return null;
    }

    const fortunes = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < numDays; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        // Get daily fortune ratings
        let ratings = null;
        try {
            ratings = BaziEngine.getDailyFortuneRatings(branchIndex, date);
        } catch (e) {
            // Fallback simple ratings
            const seed = (year * 366 + month * 31 + day + branchIndex) % 100;
            ratings = {
                overall: 60 + (seed % 35),
                wealth: 55 + ((seed * 3) % 40),
                love: 55 + ((seed * 7) % 40),
                career: 55 + ((seed * 11) % 40),
                health: 60 + ((seed * 13) % 35)
            };
        }

        // Get daily almanac
        let almanac = null;
        try {
            almanac = BaziEngine.getDailyAlmanac(year, month, day);
        } catch (e) {
            almanac = {
                doList: ['Plan important tasks', 'Practice gratitude'],
                dontList: ['Argue with others', 'Make impulsive decisions']
            };
        }

        // Get daily feng shui tip
        let fengShuiTip = '';
        try {
            if (typeof BaziEngine.getDailyFengShuiTip === 'function') {
                fengShuiTip = BaziEngine.getDailyFengShuiTip(branchIndex, date);
            }
        } catch (e) {
            // Use fortune data tips as fallback
            const tips = data.fengShuiTips || data.advice || [];
            fengShuiTip = tips[(day + month) % tips.length] || 'Focus on harmonizing your space today.';
        }

        // Get colors for the day
        const colorSets = data.colorSets || [];
        const colorIndex = (day + month) % Math.max(colorSets.length, 1);
        const colors = colorSets[colorIndex] || ['Green', 'Gold'];

        // Get advice
        const advicePool = data.advice || [];
        const adviceIndex = (day * 3 + month) % Math.max(advicePool.length, 1);
        const advice = advicePool[adviceIndex] || 'Trust the energy of the universe today.';

        // Get lucky direction
        const directions = data.luckyDirections || ['Southeast', 'East'];
        const dirIndex = day % directions.length;

        fortunes.push({
            date: date.toISOString().split('T')[0],
            zodiac: zodiacSign,
            emoji: ZODIAC_EMOJIS[zodiacSign],
            name: data.name || zodiacSign,
            ratings: {
                overall: Math.round(ratings.overall || 75),
                wealth: Math.round(ratings.wealth || 70),
                love: Math.round(ratings.love || 70),
                career: Math.round(ratings.career || 70),
                health: Math.round(ratings.health || 75)
            },
            luckyColors: colors,
            luckyDirection: directions[dirIndex],
            luckyNumbers: data.numberSets ? data.numberSets[day % data.numberSets.length] : [3, 8],
            doList: almanac.doList || [],
            dontList: almanac.dontList || [],
            fengShuiTip: fengShuiTip,
            advice: advice,
            crystal: data.crystals ? data.crystals[day % data.crystals.length] : 'Clear Quartz'
        });
    }

    return fortunes;
}

function generateEmailHTML(fortune) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Daily Feng Shui Fortune - ${fortune.date}</title>
</head>
<body style="margin:0; padding:0; background:#faf8f3; font-family:'Inter','Helvetica',sans-serif;">
    <div style="max-width:600px; margin:0 auto; padding:20px;">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#0d4d3d,#1a6b54); border-radius:16px 16px 0 0; padding:30px; text-align:center;">
            <div style="font-size:48px;">${fortune.emoji}</div>
            <h1 style="color:white; font-family:Georgia,serif; font-size:24px; margin:10px 0 5px;">
                ${fortune.name} Daily Fortune
            </h1>
            <p style="color:rgba(255,255,255,0.8); font-size:14px; margin:0;">${fortune.date}</p>
        </div>

        <!-- Ratings -->
        <div style="background:white; padding:25px; border-left:1px solid #e0e0e0; border-right:1px solid #e0e0e0;">
            <div style="display:flex; justify-content:space-between; text-align:center; flex-wrap:wrap;">
                <div style="flex:1; min-width:80px; padding:10px;">
                    <div style="font-size:24px; font-weight:bold; color:#0d4d3d;">${fortune.ratings.overall}%</div>
                    <div style="font-size:12px; color:#8a8a8a;">Overall</div>
                </div>
                <div style="flex:1; min-width:80px; padding:10px;">
                    <div style="font-size:24px; font-weight:bold; color:#d4af37;">${fortune.ratings.wealth}%</div>
                    <div style="font-size:12px; color:#8a8a8a;">Wealth</div>
                </div>
                <div style="flex:1; min-width:80px; padding:10px;">
                    <div style="font-size:24px; font-weight:bold; color:#e74c3c;">${fortune.ratings.love}%</div>
                    <div style="font-size:12px; color:#8a8a8a;">Love</div>
                </div>
                <div style="flex:1; min-width:80px; padding:10px;">
                    <div style="font-size:24px; font-weight:bold; color:#3498db;">${fortune.ratings.career}%</div>
                    <div style="font-size:12px; color:#8a8a8a;">Career</div>
                </div>
            </div>
        </div>

        <!-- Tips -->
        <div style="background:#f5f3ed; padding:25px; border-left:1px solid #e0e0e0; border-right:1px solid #e0e0e0;">
            <h3 style="color:#0d4d3d; font-size:16px; margin:0 0 10px;">🏡 Feng Shui Tip</h3>
            <p style="color:#4a4a4a; line-height:1.6; margin:0;">${fortune.fengShuiTip}</p>
        </div>

        <!-- Lucky Items -->
        <div style="background:white; padding:25px; border-left:1px solid #e0e0e0; border-right:1px solid #e0e0e0;">
            <table style="width:100%; border-collapse:collapse;">
                <tr>
                    <td style="padding:8px 0; color:#8a8a8a; font-size:13px;">🎨 Lucky Colors</td>
                    <td style="padding:8px 0; color:#1a1a1a; font-weight:500; text-align:right;">${Array.isArray(fortune.luckyColors) ? fortune.luckyColors.join(', ') : fortune.luckyColors}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0; color:#8a8a8a; font-size:13px;">🧭 Lucky Direction</td>
                    <td style="padding:8px 0; color:#1a1a1a; font-weight:500; text-align:right;">${fortune.luckyDirection}</td>
                </tr>
                <tr>
                    <td style="padding:8px 0; color:#8a8a8a; font-size:13px;">💎 Crystal of the Day</td>
                    <td style="padding:8px 0; color:#1a1a1a; font-weight:500; text-align:right;">${fortune.crystal}</td>
                </tr>
            </table>
        </div>

        <!-- Do's and Don'ts -->
        <div style="background:#f5f3ed; padding:25px; border-left:1px solid #e0e0e0; border-right:1px solid #e0e0e0;">
            <div style="display:flex; gap:20px; flex-wrap:wrap;">
                <div style="flex:1; min-width:200px;">
                    <h4 style="color:#2d8b6f; margin:0 0 8px;">✅ Do</h4>
                    ${fortune.doList.slice(0, 3).map(item => `<p style="color:#4a4a4a; font-size:13px; margin:4px 0;">• ${item}</p>`).join('')}
                </div>
                <div style="flex:1; min-width:200px;">
                    <h4 style="color:#e74c3c; margin:0 0 8px;">❌ Don't</h4>
                    ${fortune.dontList.slice(0, 3).map(item => `<p style="color:#4a4a4a; font-size:13px; margin:4px 0;">• ${item}</p>`).join('')}
                </div>
            </div>
        </div>

        <!-- CTA -->
        <div style="background:white; padding:25px; text-align:center; border-left:1px solid #e0e0e0; border-right:1px solid #e0e0e0;">
            <a href="https://fengshuiwithjackson.com/daily-fortune.html" 
               style="display:inline-block; background:#d4af37; color:white; padding:12px 30px; border-radius:50px; text-decoration:none; font-weight:600; font-size:14px;">
                🔮 Check Full Fortune Details →
            </a>
        </div>

        <!-- Footer -->
        <div style="background:#0d4d3d; border-radius:0 0 16px 16px; padding:20px; text-align:center;">
            <p style="color:rgba(255,255,255,0.7); font-size:12px; margin:0;">
                © 2026 FengShuiWithJackson · <a href="https://fengshuiwithjackson.com" style="color:#d4af37;">Visit Website</a>
            </p>
            <p style="color:rgba(255,255,255,0.5); font-size:11px; margin:8px 0 0;">
                You received this because you subscribed to daily fortunes. 
                <a href="https://fengshuiwithjackson.com/unsubscribe" style="color:rgba(255,255,255,0.5);">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

// ===== EXECUTION =====
function main() {
    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const signsToProcess = zodiacArg ? [zodiacArg.toLowerCase()] : ZODIAC_SIGNS;
    let totalGenerated = 0;

    console.log(`\n🔮 Feng Shui Fortune Generator`);
    console.log(`${'─'.repeat(40)}`);
    console.log(`Signs: ${signsToProcess.length} | Days: ${daysArg}`);
    console.log(`Output: ${outputDir}\n`);

    for (const sign of signsToProcess) {
        process.stdout.write(`  ${ZODIAC_EMOJIS[sign]} Generating ${sign}... `);

        const fortunes = generateFortunes(sign, daysArg);
        if (!fortunes) {
            console.log('❌ FAILED');
            continue;
        }

        // Save JSON
        const jsonPath = path.join(outputDir, `fortunes-${sign}.json`);
        fs.writeFileSync(jsonPath, JSON.stringify(fortunes, null, 2));

        // Save sample email HTML (first day of each zodiac)
        const emailPath = path.join(outputDir, `email-sample-${sign}.html`);
        fs.writeFileSync(emailPath, generateEmailHTML(fortunes[0]));

        totalGenerated += fortunes.length;
        console.log(`✅ ${fortunes.length} days`);
    }

    console.log(`\n${'─'.repeat(40)}`);
    console.log(`✅ Generated ${totalGenerated} fortune entries`);
    console.log(`📁 Output saved to: ${outputDir}\n`);
}

main();
