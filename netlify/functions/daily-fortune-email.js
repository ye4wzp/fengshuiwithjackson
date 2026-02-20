/**
 * Daily Fortune Email - Netlify Scheduled Function
 * 
 * Runs daily at 7:00 AM UTC (3:00 PM Beijing / 11:00 PM PST)
 * 
 * Flow:
 * 1. Calculate today's fortune for all 12 zodiac signs
 * 2. Fetch subscriber list from database/KV store
 * 3. Send personalized emails via SendGrid/Resend
 * 
 * Environment Variables Required:
 * - EMAIL_API_KEY: SendGrid or Resend API key
 * - EMAIL_FROM: Sender email address
 * - EMAIL_SERVICE: 'sendgrid' or 'resend' (default: 'mock')
 * 
 * To test locally:
 *   netlify functions:invoke daily-fortune-email
 * 
 * @see https://docs.netlify.com/functions/scheduled-functions/
 */

const path = require('path');

// Netlify scheduled function config
exports.config = {
    schedule: '0 7 * * *' // Daily at 7:00 AM UTC
};

// ===== ZODIAC DATA =====
const ZODIAC_SIGNS = [
    'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
    'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'
];

const ZODIAC_EMOJIS = {
    rat: '🐀', ox: '🐂', tiger: '🐅', rabbit: '🐇',
    dragon: '🐉', snake: '🐍', horse: '🐴', goat: '🐐',
    monkey: '🐵', rooster: '🐔', dog: '🐕', pig: '🐷'
};

// ===== SIMPLE FORTUNE GENERATOR =====
// Lightweight version that doesn't require the full BaZi Engine
function generateSimpleFortune(zodiacIndex, date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const seed = (year * 366 + month * 31 + day + zodiacIndex * 7) % 100;

    const elements = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const dayElement = elements[(day + month) % 5];

    const tips = [
        `Today's ${dayElement} energy suggests focusing on your environment's balance.`,
        `Add ${dayElement === 'Water' ? 'a water feature' : dayElement === 'Wood' ? 'fresh plants' : dayElement === 'Fire' ? 'candles' : dayElement === 'Earth' ? 'crystals' : 'metallic accents'} to your living space.`,
        `The ${dayElement} element favors ${dayElement === 'Water' ? 'intuition' : dayElement === 'Wood' ? 'growth' : dayElement === 'Fire' ? 'passion' : dayElement === 'Earth' ? 'stability' : 'precision'} today.`
    ];

    return {
        overall: 55 + (seed % 40),
        wealth: 50 + ((seed * 3 + 7) % 45),
        love: 50 + ((seed * 7 + 13) % 45),
        career: 50 + ((seed * 11 + 19) % 45),
        health: 55 + ((seed * 13 + 23) % 40),
        tip: tips[seed % tips.length],
        element: dayElement
    };
}

// ===== EMAIL TEMPLATE =====
function buildEmail(zodiac, fortune, date) {
    const emoji = ZODIAC_EMOJIS[zodiac] || '🔮';
    const name = zodiac.charAt(0).toUpperCase() + zodiac.slice(1);
    const dateStr = date.toISOString().split('T')[0];

    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#faf8f3;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:20px;">
<div style="background:linear-gradient(135deg,#0d4d3d,#1a6b54);border-radius:16px 16px 0 0;padding:30px;text-align:center;">
<div style="font-size:48px;">${emoji}</div>
<h1 style="color:white;font-size:22px;margin:10px 0 5px;">${name} · Daily Fortune</h1>
<p style="color:rgba(255,255,255,0.8);font-size:13px;margin:0;">${dateStr}</p>
</div>
<div style="background:white;padding:25px;">
<table style="width:100%;text-align:center;">
<tr>
<td><div style="font-size:22px;font-weight:bold;color:#0d4d3d;">${fortune.overall}%</div><div style="font-size:11px;color:#8a8a8a;">Overall</div></td>
<td><div style="font-size:22px;font-weight:bold;color:#d4af37;">${fortune.wealth}%</div><div style="font-size:11px;color:#8a8a8a;">Wealth</div></td>
<td><div style="font-size:22px;font-weight:bold;color:#e74c3c;">${fortune.love}%</div><div style="font-size:11px;color:#8a8a8a;">Love</div></td>
<td><div style="font-size:22px;font-weight:bold;color:#3498db;">${fortune.career}%</div><div style="font-size:11px;color:#8a8a8a;">Career</div></td>
</tr></table>
</div>
<div style="background:#f5f3ed;padding:20px;border-left:1px solid #e0e0e0;border-right:1px solid #e0e0e0;">
<p style="color:#0d4d3d;font-weight:bold;margin:0 0 8px;">🏡 Today's Feng Shui Tip</p>
<p style="color:#4a4a4a;line-height:1.6;margin:0;">${fortune.tip}</p>
</div>
<div style="background:white;padding:20px;text-align:center;border-left:1px solid #e0e0e0;border-right:1px solid #e0e0e0;">
<a href="https://fengshuiwithjackson.com/daily-fortune.html" style="display:inline-block;background:#d4af37;color:white;padding:12px 30px;border-radius:50px;text-decoration:none;font-weight:600;">🔮 See Full Fortune →</a>
</div>
<div style="background:#0d4d3d;border-radius:0 0 16px 16px;padding:15px;text-align:center;">
<p style="color:rgba(255,255,255,0.6);font-size:11px;margin:0;">© 2026 FengShuiWithJackson · <a href="https://fengshuiwithjackson.com" style="color:#d4af37;">Website</a></p>
</div>
</div></body></html>`;
}

// ===== SEND EMAIL =====
async function sendEmail(to, subject, html) {
    const service = process.env.EMAIL_SERVICE || 'mock';
    const apiKey = process.env.EMAIL_API_KEY;
    const from = process.env.EMAIL_FROM || 'jackson@fengshuiwithjackson.com';

    if (service === 'mock' || !apiKey) {
        console.log(`📧 [MOCK] Would send to: ${to} | Subject: ${subject}`);
        return { success: true, mock: true };
    }

    if (service === 'sendgrid') {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email: to }] }],
                from: { email: from, name: 'Jackson · Feng Shui' },
                subject: subject,
                content: [{ type: 'text/html', value: html }]
            })
        });
        return { success: response.status === 202, status: response.status };
    }

    if (service === 'resend') {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: `Jackson <${from}>`,
                to: [to],
                subject: subject,
                html: html
            })
        });
        return { success: response.ok, status: response.status };
    }

    return { success: false, error: `Unknown service: ${service}` };
}

// ===== HANDLER =====
exports.handler = async function (event) {
    console.log('🔮 Daily Fortune Email - Starting...');

    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];

    // In production, fetch subscribers from a database or KV store
    // For mock mode, use sample data
    const subscribers = [
        { email: 'test@example.com', zodiac: 'dragon' }
    ];

    let sent = 0;
    let errors = 0;

    for (const subscriber of subscribers) {
        try {
            const zodiacIndex = ZODIAC_SIGNS.indexOf(subscriber.zodiac);
            if (zodiacIndex === -1) continue;

            const fortune = generateSimpleFortune(zodiacIndex, today);
            const html = buildEmail(subscriber.zodiac, fortune, today);
            const subject = `${ZODIAC_EMOJIS[subscriber.zodiac]} Your ${dateStr} Fortune: ${fortune.overall}% Overall`;

            const result = await sendEmail(subscriber.email, subject, html);
            if (result.success) {
                sent++;
            } else {
                errors++;
                console.error(`Failed to send to ${subscriber.email}:`, result);
            }
        } catch (err) {
            errors++;
            console.error(`Error for ${subscriber.email}:`, err.message);
        }
    }

    console.log(`✅ Done: ${sent} sent, ${errors} errors`);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `Daily fortune emails processed`,
            date: dateStr,
            sent,
            errors
        })
    };
};
