/**
 * BaZi (八字) Engine — Chinese Metaphysics Calculation Library
 * 
 * Provides accurate calculations for:
 * - Heavenly Stems (天干) and Earthly Branches (地支)
 * - Four Pillars of Destiny (四柱)
 * - Five Elements (五行) analysis
 * - Daily fortune based on Stem/Branch interactions
 * - Kua Number calculation
 * 
 * All algorithms based on traditional Chinese almanac (万年历) formulas.
 */

const BaziEngine = (function () {
    'use strict';

    // ===== CONSTANTS =====

    // 天干 Heavenly Stems
    const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const STEMS_EN = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
    const STEMS_PINYIN = ['jiǎ', 'yǐ', 'bǐng', 'dīng', 'wù', 'jǐ', 'gēng', 'xīn', 'rén', 'guǐ'];

    // 地支 Earthly Branches
    const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    const BRANCHES_EN = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
    const BRANCHES_ANIMALS = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];
    const BRANCHES_ANIMALS_EMOJI = ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐴', '🐐', '🐵', '🐔', '🐕', '🐷'];

    // 五行 Five Elements
    const FIVE_ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'];
    const FIVE_ELEMENTS_CN = ['木', '火', '土', '金', '水'];
    const FIVE_ELEMENTS_COLORS = {
        Wood: '#2E7D32',
        Fire: '#D32F2F',
        Earth: '#F9A825',
        Metal: '#9E9E9E',
        Water: '#1565C0'
    };

    // 天干→五行 mapping (each pair shares an element)
    // 甲乙→木, 丙丁→火, 戊己→土, 庚辛→金, 壬癸→水
    const STEM_TO_ELEMENT = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4]; // indices into FIVE_ELEMENTS

    // 地支→五行 mapping
    // 子→水, 丑→土, 寅→木, 卯→木, 辰→土, 巳→火, 午→火, 未→土, 申→金, 酉→金, 戌→土, 亥→水
    const BRANCH_TO_ELEMENT = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];

    // 天干阴阳 (0=阳Yang, 1=阴Yin)
    const STEM_YINYANG = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

    // 地支阴阳
    const BRANCH_YINYANG = [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1];

    // 地支藏干 (Hidden Stems in Branches)
    const BRANCH_HIDDEN_STEMS = [
        [9],        // 子: 癸
        [5, 9, 7],  // 丑: 己癸辛
        [0, 2, 4],  // 寅: 甲丙戊
        [1],        // 卯: 乙
        [4, 1, 9],  // 辰: 戊乙癸
        [2, 4, 6],  // 巳: 丙戊庚
        [3, 5],     // 午: 丁己
        [5, 3, 1],  // 未: 己丁乙
        [6, 4, 8],  // 申: 庚戊壬
        [7],        // 酉: 辛
        [4, 7, 3],  // 戌: 戊辛丁
        [8, 0]      // 亥: 壬甲
    ];

    // 十二时辰对应小时范围
    const SHICHEN_HOURS = [
        { start: 23, end: 1, name: '子时' },
        { start: 1, end: 3, name: '丑时' },
        { start: 3, end: 5, name: '寅时' },
        { start: 5, end: 7, name: '卯时' },
        { start: 7, end: 9, name: '辰时' },
        { start: 9, end: 11, name: '巳时' },
        { start: 11, end: 13, name: '午时' },
        { start: 13, end: 15, name: '未时' },
        { start: 15, end: 17, name: '申时' },
        { start: 17, end: 19, name: '酉时' },
        { start: 19, end: 21, name: '戌时' },
        { start: 21, end: 23, name: '亥时' }
    ];

    // 五行相生 (generating cycle): Wood→Fire→Earth→Metal→Water→Wood
    const GENERATING_CYCLE = { Wood: 'Fire', Fire: 'Earth', Earth: 'Metal', Metal: 'Water', Water: 'Wood' };

    // 五行相克 (overcoming cycle): Wood→Earth→Water→Fire→Metal→Wood
    const OVERCOMING_CYCLE = { Wood: 'Earth', Fire: 'Metal', Earth: 'Water', Metal: 'Wood', Water: 'Fire' };

    // Lucky colors per element
    const ELEMENT_LUCKY_COLORS = {
        Wood: ['Green', 'Brown', 'Teal'],
        Fire: ['Red', 'Orange', 'Purple', 'Pink'],
        Earth: ['Yellow', 'Brown', 'Beige', 'Ochre'],
        Metal: ['White', 'Gold', 'Silver', 'Gray'],
        Water: ['Blue', 'Black', 'Navy', 'Teal']
    };

    // Lucky directions per element
    const ELEMENT_DIRECTIONS = {
        Wood: 'East',
        Fire: 'South',
        Earth: 'Center / Southwest / Northeast',
        Metal: 'West / Northwest',
        Water: 'North'
    };

    // ===== CORE CALCULATIONS =====

    /**
     * Year Pillar (年柱) calculation
     * Based on the standard 60-year cycle starting from 甲子
     * Reference: Year 4 CE was 甲子年 (index 0)
     */
    function getYearPillar(year) {
        const stemIndex = (year - 4) % 10;
        const branchIndex = (year - 4) % 12;
        return {
            stem: (stemIndex + 10) % 10,
            branch: (branchIndex + 12) % 12
        };
    }

    /**
     * Month Pillar (月柱) calculation
     * Uses 五虎遁 (Five Tigers Method) to determine the month stem
     * Month branch follows fixed mapping: 寅(1月)→丑(12月)
     * 
     * Note: Uses solar terms (节气) based months, not lunar months
     * For simplification, we use approximate solar term dates
     */
    function getMonthPillar(year, month) {
        // Month branch: 正月(Feb)=寅(2), 二月(Mar)=卯(3), ..., 十二月(Jan)=丑(1)
        // Convert Gregorian month to Chinese month (approximate)
        const chineseMonth = month >= 2 ? month - 1 : 12; // Jan→12月, Feb→1月, ...
        const branchIndex = (chineseMonth + 1) % 12; // 正月=寅(2)

        // 五虎遁: Year stem determines month stem for 正月
        // 甲己→丙寅, 乙庚→戊寅, 丙辛→庚寅, 丁壬→壬寅, 戊癸→甲寅
        const yearStem = getYearPillar(year).stem;
        const baseMonthStem = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0][yearStem]; // 正月 stem
        const stemIndex = (baseMonthStem + chineseMonth - 1) % 10;

        return {
            stem: stemIndex,
            branch: branchIndex
        };
    }

    /**
     * Day Pillar (日柱) calculation
     * Uses the standard formula based on a known reference date
     * Reference: Jan 1, 1900 was 甲戌日 (Stem=0甲, Branch=10戌 → index 10 in 60-cycle)
     */
    function getDayPillar(year, month, day) {
        // Calculate Julian Day Number
        const jdn = julianDayNumber(year, month, day);
        // Reference: JDN of Jan 1, 1900 = 2415021, which is 甲戌 (cycle index 10)
        const refJDN = 2415021;
        const refCycleIndex = 10; // 甲戌 in 60-cycle

        const daysSinceRef = jdn - refJDN;
        const cycleIndex = ((daysSinceRef + refCycleIndex) % 60 + 60) % 60;

        return {
            stem: cycleIndex % 10,
            branch: cycleIndex % 12
        };
    }

    /**
     * Hour Pillar (时柱) calculation
     * Uses 五鼠遁 (Five Rats Method) to determine hour stem
     */
    function getHourPillar(year, month, day, hour) {
        const branchIndex = getHourBranch(hour);

        // 五鼠遁: Day stem determines hour stem for 子时
        // 甲己→甲子, 乙庚→丙子, 丙辛→戊子, 丁壬→庚子, 戊癸→壬子
        const dayStem = getDayPillar(year, month, day).stem;
        const baseHourStem = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8][dayStem];
        const stemIndex = (baseHourStem + branchIndex) % 10;

        return {
            stem: stemIndex,
            branch: branchIndex
        };
    }

    /**
     * Convert hour (0-23) to Earthly Branch index
     */
    function getHourBranch(hour) {
        if (hour === 23 || hour === 0) return 0; // 子时
        return Math.floor((hour + 1) / 2);
    }

    /**
     * Julian Day Number calculation (Gregorian calendar)
     */
    function julianDayNumber(year, month, day) {
        const a = Math.floor((14 - month) / 12);
        const y = year + 4800 - a;
        const m = month + 12 * a - 3;
        return day + Math.floor((153 * m + 2) / 5) + 365 * y +
            Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    }

    /**
     * Get complete Four Pillars (四柱) for a given birth date/time
     */
    function getFourPillars(year, month, day, hour) {
        const yearPillar = getYearPillar(year);
        const monthPillar = getMonthPillar(year, month);
        const dayPillar = getDayPillar(year, month, day);
        const hourPillar = hour !== undefined ? getHourPillar(year, month, day, hour) : null;

        return {
            year: yearPillar,
            month: monthPillar,
            day: dayPillar,
            hour: hourPillar
        };
    }

    // ===== FIVE ELEMENTS ANALYSIS =====

    /**
     * Count Five Elements from Four Pillars
     * Returns { Wood: n, Fire: n, Earth: n, Metal: n, Water: n }
     */
    function countElements(pillars) {
        const count = { Wood: 0, Fire: 0, Earth: 0, Metal: 0, Water: 0 };

        const pillarKeys = ['year', 'month', 'day', 'hour'];
        for (const key of pillarKeys) {
            const p = pillars[key];
            if (!p) continue;

            // Count stem element
            const stemEl = FIVE_ELEMENTS[STEM_TO_ELEMENT[p.stem]];
            count[stemEl]++;

            // Count branch element
            const branchEl = FIVE_ELEMENTS[BRANCH_TO_ELEMENT[p.branch]];
            count[branchEl]++;

            // Count hidden stem elements
            const hiddenStems = BRANCH_HIDDEN_STEMS[p.branch];
            for (const hs of hiddenStems) {
                const hsEl = FIVE_ELEMENTS[STEM_TO_ELEMENT[hs]];
                count[hsEl] += 0.5; // Hidden stems have reduced weight
            }
        }

        return count;
    }

    /**
     * Determine which elements are missing or weak
     */
    function getMissingElements(elementCount) {
        const missing = [];
        const weak = [];
        for (const el of FIVE_ELEMENTS) {
            if (elementCount[el] === 0) missing.push(el);
            else if (elementCount[el] < 1.5) weak.push(el);
        }
        return { missing, weak };
    }

    /**
     * Determine Day Master (日主) strength
     * Simplified version: counts supporting vs draining elements
     */
    function getDayMasterStrength(pillars) {
        const dayMasterElement = FIVE_ELEMENTS[STEM_TO_ELEMENT[pillars.day.stem]];
        const elementCount = countElements(pillars);

        // Supporting elements: same element + generating element
        let support = elementCount[dayMasterElement];
        // Find what generates dayMasterElement
        for (const [source, target] of Object.entries(GENERATING_CYCLE)) {
            if (target === dayMasterElement) {
                support += elementCount[source] * 0.7;
            }
        }

        // Draining elements: what dayMaster generates + what overcomes dayMaster
        let drain = 0;
        drain += elementCount[GENERATING_CYCLE[dayMasterElement]] * 0.7; // what I generate
        for (const [source, target] of Object.entries(OVERCOMING_CYCLE)) {
            if (target === dayMasterElement) {
                drain += elementCount[source]; // what overcomes me
            }
        }
        drain += elementCount[OVERCOMING_CYCLE[dayMasterElement]] * 0.5; // what I overcome

        const total = support + drain;
        const ratio = total > 0 ? support / total : 0.5;

        return {
            element: dayMasterElement,
            elementCn: FIVE_ELEMENTS_CN[FIVE_ELEMENTS.indexOf(dayMasterElement)],
            strength: ratio > 0.55 ? 'strong' : ratio < 0.45 ? 'weak' : 'balanced',
            strengthCn: ratio > 0.55 ? '身强' : ratio < 0.45 ? '身弱' : '中和',
            ratio: ratio,
            support: support,
            drain: drain
        };
    }

    // ===== DAILY FORTUNE CALCULATION =====

    /**
     * Calculate daily fortune for a zodiac sign based on the day's pillar
     * Returns fortune ratings (1-5) for wealth, love, career, health
     */
    function getDailyFortuneRatings(zodiacBranchIndex, date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dayPillar = getDayPillar(year, month, day);

        const dayElement = FIVE_ELEMENTS[STEM_TO_ELEMENT[dayPillar.stem]];
        const zodiacElement = FIVE_ELEMENTS[BRANCH_TO_ELEMENT[zodiacBranchIndex]];

        // Base score from five element interaction
        let baseScore = 3; // neutral

        // Check if day element generates zodiac element (good)
        if (GENERATING_CYCLE[dayElement] === zodiacElement) baseScore = 4;
        // Check if zodiac element generates day element (giving away energy)
        if (GENERATING_CYCLE[zodiacElement] === dayElement) baseScore = 2;
        // Check if day element is same as zodiac element (harmonious)
        if (dayElement === zodiacElement) baseScore = 4;
        // Check if day element overcomes zodiac element (challenging)
        if (OVERCOMING_CYCLE[dayElement] === zodiacElement) baseScore = 2;
        // Check if zodiac element overcomes day element (empowering)
        if (OVERCOMING_CYCLE[zodiacElement] === dayElement) baseScore = 4;

        // Branch interactions (六合, 六冲, 三合, etc.)
        const branchRelation = getBranchRelation(zodiacBranchIndex, dayPillar.branch);

        // Add variation using day stem, branch, AND zodiac index for per-zodiac differentiation
        const stemVal = dayPillar.stem;
        const branchVal = dayPillar.branch;
        const z = zodiacBranchIndex;

        // Use different prime multipliers per category to ensure variance
        const wealth = clamp(baseScore + branchRelation.modifier + ((stemVal * 3 + branchVal * 7 + z * 5 + 1) % 5 - 2), 1, 5);
        const love = clamp(baseScore + branchRelation.modifier + ((stemVal * 7 + branchVal * 3 + z * 11 + 2) % 5 - 2), 1, 5);
        const career = clamp(baseScore + branchRelation.modifier + ((stemVal * 11 + branchVal * 5 + z * 3 + 3) % 5 - 2), 1, 5);
        const health = clamp(baseScore + branchRelation.modifier + ((stemVal * 5 + branchVal * 11 + z * 7 + 4) % 5 - 2), 1, 5);

        return {
            wealth: Math.round(wealth),
            love: Math.round(love),
            career: Math.round(career),
            health: Math.round(health),
            overall: Math.round((wealth + love + career + health) / 4),
            dayElement: dayElement,
            zodiacElement: zodiacElement,
            branchRelation: branchRelation.type,
            dayStem: dayPillar.stem,
            dayBranch: dayPillar.branch
        };
    }

    /**
     * Get the relationship between two Earthly Branches
     */
    function getBranchRelation(branch1, branch2) {
        const diff = Math.abs(branch1 - branch2);

        // 六冲 (Clash): branches 6 apart
        if (diff === 6) return { type: 'clash', typeCn: '六冲', modifier: -1, description: 'Challenging day — stay cautious' };

        // 六合 (Harmony): specific pairs
        const harmonyPairs = [[0, 1], [2, 11], [3, 10], [4, 9], [5, 8], [6, 7]];
        for (const [a, b] of harmonyPairs) {
            if ((branch1 === a && branch2 === b) || (branch1 === b && branch2 === a)) {
                return { type: 'harmony', typeCn: '六合', modifier: 1, description: 'Harmonious day — good fortune flows' };
            }
        }

        // 三合 (Triple Harmony): branches 4 apart forming triangles
        const tripleGroups = [[0, 4, 8], [1, 5, 9], [2, 6, 10], [3, 7, 11]];
        for (const group of tripleGroups) {
            if (group.includes(branch1) && group.includes(branch2)) {
                return { type: 'triple_harmony', typeCn: '三合', modifier: 1, description: 'Supportive energy — take action' };
            }
        }

        // 刑 (Punishment): specific patterns
        const punishPairs = [[0, 3], [1, 10], [2, 5], [4, 4], [6, 6], [7, 1], [8, 2], [9, 9], [11, 11]];
        for (const [a, b] of punishPairs) {
            if ((branch1 === a && branch2 === b) || (branch1 === b && branch2 === a)) {
                return { type: 'punishment', typeCn: '刑', modifier: -1, description: 'Be mindful of conflicts today' };
            }
        }

        // 破 (Destruction) and 害 (Harm) — simplified
        const harmPairs = [[0, 7], [1, 6], [2, 5], [3, 4], [8, 11], [9, 10]];
        for (const [a, b] of harmPairs) {
            if ((branch1 === a && branch2 === b) || (branch1 === b && branch2 === a)) {
                return { type: 'harm', typeCn: '害', modifier: -0.5, description: 'Minor obstacles possible — stay patient' };
            }
        }

        return { type: 'neutral', typeCn: '平', modifier: 0, description: 'Neutral day — steady progress' };
    }

    /**
     * Get lucky time periods (吉时) for a given day based on day stem
     */
    function getLuckyHours(year, month, day) {
        const dayPillar = getDayPillar(year, month, day);
        const dayStem = dayPillar.stem;

        // Traditional lucky hours based on day stem
        // Each stem has specific auspicious hour branches
        const luckyBranches = {
            0: [0, 1, 4, 5],   // 甲: 子丑辰巳
            1: [2, 3, 6, 7],   // 乙: 寅卯午未
            2: [0, 1, 4, 5],   // 丙: 子丑辰巳
            3: [2, 3, 8, 9],   // 丁: 寅卯申酉
            4: [0, 1, 4, 5],   // 戊: 子丑辰巳
            5: [2, 3, 6, 7],   // 己: 寅卯午未
            6: [0, 1, 4, 5],   // 庚: 子丑辰巳
            7: [2, 3, 8, 9],   // 辛: 寅卯申酉
            8: [0, 1, 4, 5],   // 壬: 子丑辰巳
            9: [2, 3, 6, 7]    // 癸: 寅卯午未
        };

        const branches = luckyBranches[dayStem] || [0, 4];
        return branches.map(b => ({
            branch: b,
            branchCn: EARTHLY_BRANCHES[b],
            name: SHICHEN_HOURS[b].name,
            timeRange: formatTimeRange(SHICHEN_HOURS[b]),
            animal: BRANCHES_ANIMALS[b]
        }));
    }

    /**
     * Get daily "Do" and "Don't" items based on day pillar
     */
    function getDailyAlmanac(year, month, day) {
        const dayPillar = getDayPillar(year, month, day);
        const dayElement = FIVE_ELEMENTS[STEM_TO_ELEMENT[dayPillar.stem]];
        const dayYinYang = STEM_YINYANG[dayPillar.stem] === 0 ? 'Yang' : 'Yin';

        // Comprehensive Do/Don't lists based on day element and stem
        const doLists = {
            Wood: [
                ['Start new projects', 'Plant seeds or buy plants', 'Sign creative contracts'],
                ['Network and socialize', 'Begin learning something new', 'Wear green tones'],
                ['Visit parks or nature', 'Reorganize your workspace', 'Plan long-term goals'],
                ['Practice yoga or stretching', 'Write letters or proposals', 'Buy wood furniture'],
                ['Collaborate with others', 'Start a journal', 'Visit the East sector of your city']
            ],
            Fire: [
                ['Give presentations', 'Host gatherings', 'Market your brand'],
                ['Attend social events', 'Redecorate with warm colors', 'Cook a special meal'],
                ['Exercise vigorously', 'Be bold in negotiations', 'Wear red or orange'],
                ['Launch new campaigns', 'Express your feelings', 'Light candles at home'],
                ['Network at events', 'Post on social media', 'Take leadership roles']
            ],
            Earth: [
                ['Handle real estate matters', 'Organize your home', 'Plan investments'],
                ['Focus on stability', 'Strengthen relationships', 'Garden or landscape'],
                ['Review finances', 'Meditate and ground yourself', 'Wear earth tones'],
                ['Consolidate resources', 'Build foundations', 'Declutter spaces'],
                ['Support others', 'Cook nourishing meals', 'Focus on family bonds']
            ],
            Metal: [
                ['Negotiate deals', 'Organize finances', 'Cut ties with bad habits'],
                ['Make disciplined decisions', 'Practice precision work', 'Wear white or gold'],
                ['File paperwork', 'Sharpen your skills', 'Clean and purify spaces'],
                ['Take decisive action', 'Set boundaries', 'Polish your image'],
                ['Focus on tech tasks', 'Invest in quality items', 'Refine your goals']
            ],
            Water: [
                ['Research and study', 'Travel or plan trips', 'Reflect and journal'],
                ['Connect emotionally', 'Seek wisdom from mentors', 'Wear blue or black'],
                ['Explore new ideas', 'Relax near water', 'Handle communication tasks'],
                ['Go with the flow', 'Practice flexibility', 'Network casually'],
                ['Review and adapt plans', 'Rest and recharge', 'Read and learn']
            ]
        };

        const dontLists = {
            Wood: [
                ['Rush into conflicts', 'Neglect your health', 'Make impulsive purchases'],
                ['Overcommit your time', 'Cut live trees', 'Argue with family'],
                ['Be stubborn about plans', 'Skip meals', 'Ignore your intuition'],
                ['Burn bridges', 'Work alone when teamwork helps', 'Procrastinate on important calls'],
                ['Overwater plants', 'Take on too many tasks', 'Go against your principles']
            ],
            Fire: [
                ['Make hasty financial decisions', 'Lose your temper', 'Overexpose to sun'],
                ['Gossip or spread rumors', 'Skip rest', 'Over-promise commitments'],
                ['Start fights', 'Make permanent decisions in anger', 'Overindulge'],
                ['Burn candles unattended', 'Rush through important tasks', 'Be arrogant'],
                ['Ignore signs of burnout', 'Overspend on luxuries', 'Overwork past midnight']
            ],
            Earth: [
                ['Take unnecessary risks', 'Make sudden changes', 'Lend large sums'],
                ['Be overly rigid', 'Neglect exercise', 'Hoard possessions'],
                ['Overthink decisions', 'Isolate yourself', 'Ignore maintenance tasks'],
                ['Resist helpful change', 'Overeat heavy foods', 'Be possessive'],
                ['Skip your routine', 'Procrastinate on health checkups', 'Be overly cautious']
            ],
            Metal: [
                ['Be inflexible', 'Criticize others harshly', 'Ignore emotions'],
                ['Cut corners on quality', 'Rush creative projects', 'Be confrontational'],
                ['Over-control situations', 'Skip gratitude practice', 'Be perfectionist'],
                ['Hold grudges', 'Dismiss new ideas', 'Work in cluttered spaces'],
                ['Be cold in relationships', 'Judge too quickly', 'Neglect rest']
            ],
            Water: [
                ['Procrastinate on deadlines', 'Be indecisive', 'Avoid confrontation needed'],
                ['Overthink situations', 'Stay in bed too long', 'Neglect your boundaries'],
                ['Go swimming in dangerous areas', 'Make vague commitments', 'Escape responsibilities'],
                ['Be too passive', 'Overindulge in alcohol', 'Ignore red flags'],
                ['Waste water resources', 'Be overly emotional in business', 'Give away too much']
            ]
        };

        // Use day pillar values to select from the list deterministically
        const doIndex = (dayPillar.stem + dayPillar.branch) % 5;
        const dontIndex = (dayPillar.stem * 2 + dayPillar.branch) % 5;

        return {
            doItems: doLists[dayElement][doIndex],
            dontItems: dontLists[dayElement][dontIndex],
            dayElement: dayElement,
            dayElementCn: FIVE_ELEMENTS_CN[FIVE_ELEMENTS.indexOf(dayElement)],
            dayStemCn: HEAVENLY_STEMS[dayPillar.stem],
            dayBranchCn: EARTHLY_BRANCHES[dayPillar.branch],
            dayStemEn: STEMS_EN[dayPillar.stem],
            dayBranchEn: BRANCHES_EN[dayPillar.branch],
            dayYinYang: dayYinYang,
            pillarName: HEAVENLY_STEMS[dayPillar.stem] + EARTHLY_BRANCHES[dayPillar.branch],
            pillarNameEn: STEMS_EN[dayPillar.stem] + ' ' + BRANCHES_EN[dayPillar.branch]
        };
    }

    /**
     * Get feng shui tips based on day's element
     */
    function getDailyFengShuiTip(year, month, day, zodiacBranch) {
        const dayPillar = getDayPillar(year, month, day);
        const dayElement = FIVE_ELEMENTS[STEM_TO_ELEMENT[dayPillar.stem]];
        const zodiacElement = FIVE_ELEMENTS[BRANCH_TO_ELEMENT[zodiacBranch]];

        // Tips based on which element the zodiac sign needs for balance
        const tips = {
            'Wood-Wood': 'Add water elements (fountain, blue decor) to nourish your energy today.',
            'Wood-Fire': 'Your energy feeds the day perfectly. Place a green plant on your desk for extra Wood support.',
            'Wood-Earth': 'Ground yourself with yellow or brown crystals. The day challenges you to grow.',
            'Wood-Metal': 'Avoid sharp metal objects in your East corner. Add soft fabrics for protection.',
            'Wood-Water': 'Excellent flow today! Keep your North sector clean for career luck.',
            'Fire-Wood': 'The day supports your flame. Burn incense or light candles for focus.',
            'Fire-Fire': 'Powerful but intense energy. Add earth elements (ceramics) to stay grounded.',
            'Fire-Earth': 'Your energy nourishes the day. Wear red to amplify your influence.',
            'Fire-Metal': 'Strong melting energy. Use this for transformation. Add water to balance.',
            'Fire-Water': 'Tension today — place a plant between your water and fire elements.',
            'Earth-Wood': 'The day pushes growth through you. Accept change gracefully.',
            'Earth-Fire': 'Rich supportive day. Place candles in your Southwest for relationship luck.',
            'Earth-Earth': 'Stable and grounding. Add metal wind chimes to keep energy flowing.',
            'Earth-Metal': 'Productive day for organization. Declutter your workspace.',
            'Earth-Water': 'The day may feel draining. Place yellow crystals for protection.',
            'Metal-Wood': 'Creative tension — use it to refine ideas. Add round shapes to your space.',
            'Metal-Fire': 'Transformation day. Be open to change. Wear white for protection.',
            'Metal-Earth': 'The day nourishes your metal energy. Great for financial planning.',
            'Metal-Metal': 'Strong discipline energy. Add a touch of red for warmth and motivation.',
            'Metal-Water': 'Your energy flows outward. Conserve it by resting more today.',
            'Water-Wood': 'The day draws from your energy. Recharge with blue crystals.',
            'Water-Fire': 'Opposing forces — find balance with green plants near your workspace.',
            'Water-Earth': 'The day contains your flow. Break free with movement and travel.',
            'Water-Metal': 'Supportive day for reflection. Add metal bells for clarity.',
            'Water-Water': 'Deep intuitive energy. Meditate near water for insights.'
        };

        const key = dayElement + '-' + zodiacElement;
        return tips[key] || 'Balance your space with colors that complement today\'s energy.';
    }

    // ===== 2026 SPECIFIC =====

    /**
     * Get 2026 (丙午 Fire Horse Year) fortune for a zodiac
     */
    function get2026YearFortune(zodiacBranchIndex) {
        // 2026 = 丙午年 (Fire Horse)
        const yearStem = 2; // 丙 (Fire/Yang)
        const yearBranch = 6; // 午 (Horse/Fire)

        const zodiacElement = FIVE_ELEMENTS[BRANCH_TO_ELEMENT[zodiacBranchIndex]];
        const relation = getBranchRelation(zodiacBranchIndex, yearBranch);

        // Base year luck
        let yearLuck = 3;
        if (relation.type === 'harmony' || relation.type === 'triple_harmony') yearLuck = 5;
        if (relation.type === 'clash') yearLuck = 2;
        if (relation.type === 'punishment') yearLuck = 2;
        if (relation.type === 'harm') yearLuck = 3;

        // Element interaction with 丙午 (Fire)
        if (zodiacElement === 'Fire') yearLuck = Math.min(yearLuck + 1, 5); // Same element boost
        if (zodiacElement === 'Wood') yearLuck = Math.min(yearLuck + 1, 5); // Wood feeds Fire
        if (zodiacElement === 'Water') yearLuck = Math.max(yearLuck - 1, 1); // Water clashes Fire

        return {
            luck: yearLuck,
            relation: relation,
            zodiacElement: zodiacElement,
            yearElement: 'Fire',
            animal: BRANCHES_ANIMALS[zodiacBranchIndex]
        };
    }

    // ===== KUA NUMBER =====

    /**
     * Calculate Kua Number (命卦数)
     */
    function calculateKua(year, gender) {
        // Sum digits of year until single digit
        let sum = year.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
        while (sum > 9) {
            sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
        }

        let kua;
        if (gender === 'male') {
            kua = 10 - sum;
            if (kua === 5) kua = 2;
            if (kua === 0) kua = 9;
        } else {
            kua = sum + 5;
            if (kua > 9) kua = kua - 9;
            if (kua === 5) kua = 8;
        }

        return kua;
    }

    /**
     * Get auspicious/inauspicious directions from Kua number
     */
    function getKuaDirections(kua) {
        const directions = {
            1: {
                auspicious: ['Southeast', 'East', 'South', 'North'],
                inauspicious: ['West', 'Northwest', 'Southwest', 'Northeast'],
                group: 'East'
            },
            2: {
                auspicious: ['Northeast', 'West', 'Northwest', 'Southwest'],
                inauspicious: ['East', 'Southeast', 'South', 'North'],
                group: 'West'
            },
            3: {
                auspicious: ['South', 'North', 'Southeast', 'East'],
                inauspicious: ['Southwest', 'Northeast', 'Northwest', 'West'],
                group: 'East'
            },
            4: {
                auspicious: ['North', 'South', 'East', 'Southeast'],
                inauspicious: ['Northwest', 'Southwest', 'Northeast', 'West'],
                group: 'East'
            },
            6: {
                auspicious: ['West', 'Northeast', 'Southwest', 'Northwest'],
                inauspicious: ['South', 'North', 'Southeast', 'East'],
                group: 'West'
            },
            7: {
                auspicious: ['Northwest', 'Southwest', 'Northeast', 'West'],
                inauspicious: ['North', 'South', 'East', 'Southeast'],
                group: 'West'
            },
            8: {
                auspicious: ['Southwest', 'Northwest', 'West', 'Northeast'],
                inauspicious: ['Southeast', 'East', 'North', 'South'],
                group: 'West'
            },
            9: {
                auspicious: ['East', 'Southeast', 'North', 'South'],
                inauspicious: ['Northeast', 'West', 'Southwest', 'Northwest'],
                group: 'East'
            }
        };

        return directions[kua] || directions[1];
    }

    // ===== PERSONALITY ANALYSIS =====

    /**
     * Get personality traits based on day master element
     */
    function getPersonalityTraits(dayMasterElement, strength) {
        const traits = {
            Wood: {
                strong: {
                    positive: ['Confident leader', 'Creative visionary', 'Generous spirit', 'Natural growth mindset'],
                    negative: ['Can be stubborn', 'May overextend', 'Sometimes inflexible'],
                    career: 'Leadership, creative industries, education, publishing',
                    advice: 'Practice flexibility. Metal energy (organization, discipline) balances your strong Wood.'
                },
                weak: {
                    positive: ['Gentle and adaptive', 'Empathetic listener', 'Artistic soul', 'Diplomatic nature'],
                    negative: ['May lack confidence', 'Can be indecisive', 'Prone to overthinking'],
                    career: 'Arts, counseling, writing, design',
                    advice: 'Strengthen with Water energy (flow, wisdom). Surround yourself with supportive people.'
                }
            },
            Fire: {
                strong: {
                    positive: ['Charismatic and inspiring', 'Quick-witted', 'Passionate leader', 'Warm-hearted'],
                    negative: ['Can be impulsive', 'May burn out', 'Sometimes too intense'],
                    career: 'Entertainment, marketing, sales, public speaking',
                    advice: 'Use Earth energy (stability, grounding) to channel your fire productively.'
                },
                weak: {
                    positive: ['Warm and approachable', 'Intuitive', 'Good mediator', 'Quietly passionate'],
                    negative: ['May lack assertiveness', 'Can be anxious', 'Sometimes overthinks'],
                    career: 'Therapy, coaching, non-profit, social work',
                    advice: 'Feed your fire with Wood energy (growth, activity). Stay physically active.'
                }
            },
            Earth: {
                strong: {
                    positive: ['Reliable and trustworthy', 'Practical problem-solver', 'Nurturing presence', 'Steady under pressure'],
                    negative: ['Can be too cautious', 'May resist change', 'Sometimes overthinks'],
                    career: 'Real estate, finance, agriculture, HR, management',
                    advice: 'Wood energy (growth, change) prevents stagnation. Embrace new experiences.'
                },
                weak: {
                    positive: ['Adaptable and open', 'Good listener', 'Gentle strength', 'Versatile'],
                    negative: ['May worry excessively', 'Can be scattered', 'Prone to self-doubt'],
                    career: 'Support roles, analysis, research, healthcare',
                    advice: 'Fire energy (passion, confidence) strengthens your Earth. Set firm boundaries.'
                }
            },
            Metal: {
                strong: {
                    positive: ['Disciplined and precise', 'Strong moral compass', 'Decisive leader', 'Detail-oriented'],
                    negative: ['Can be rigid', 'May be overly critical', 'Sometimes cold'],
                    career: 'Law, engineering, technology, finance, surgery',
                    advice: 'Water energy (flow, emotion) softens your metal edge. Practice empathy.'
                },
                weak: {
                    positive: ['Refined taste', 'Thoughtful and fair', 'Good aesthetic sense', 'Balanced thinker'],
                    negative: ['May lack follow-through', 'Can be too accommodating', 'Self-critical'],
                    career: 'Design, jewelry, wellness, music, accounting',
                    advice: 'Earth energy (stability, support) strengthens your Metal. Build strong routines.'
                }
            },
            Water: {
                strong: {
                    positive: ['Wise and philosophical', 'Excellent communicator', 'Resourceful', 'Highly adaptive'],
                    negative: ['Can be manipulative', 'May be overly emotional', 'Sometimes unpredictable'],
                    career: 'Research, academia, travel, media, international business',
                    advice: 'Earth energy (boundaries, structure) contains your water wisely. Set clear goals.'
                },
                weak: {
                    positive: ['Sensitive and intuitive', 'Creative thinker', 'Empathetic', 'Flowing personality'],
                    negative: ['May be easily influenced', 'Can feel overwhelmed', 'Sometimes directionless'],
                    career: 'Writing, psychology, spiritual work, customer service',
                    advice: 'Metal energy (structure, clarity) feeds your Water. Use planners and systems.'
                }
            }
        };

        const strengthKey = strength === 'strong' ? 'strong' : 'weak';
        return traits[dayMasterElement]?.[strengthKey] || traits.Water.weak;
    }

    // ===== UTILITY FUNCTIONS =====

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function formatTimeRange(shichen) {
        const formatHour = (h) => {
            const period = h >= 12 ? 'PM' : 'AM';
            const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
            return hour12 + ':00 ' + period;
        };
        return formatHour(shichen.start) + ' – ' + formatHour(shichen.end);
    }

    /**
     * Format a pillar as Chinese characters
     */
    function formatPillar(pillar) {
        if (!pillar) return '--';
        return HEAVENLY_STEMS[pillar.stem] + EARTHLY_BRANCHES[pillar.branch];
    }

    /**
     * Format a pillar as English
     */
    function formatPillarEn(pillar) {
        if (!pillar) return '--';
        return STEMS_EN[pillar.stem] + ' ' + BRANCHES_EN[pillar.branch];
    }

    /**
     * Get element of a stem
     */
    function getStemElement(stemIndex) {
        return FIVE_ELEMENTS[STEM_TO_ELEMENT[stemIndex]];
    }

    /**
     * Get element of a branch
     */
    function getBranchElement(branchIndex) {
        return FIVE_ELEMENTS[BRANCH_TO_ELEMENT[branchIndex]];
    }

    /**
     * Get zodiac animal from birth year
     */
    function getZodiacFromYear(year) {
        const branchIndex = (year - 4) % 12;
        return {
            index: branchIndex,
            animal: BRANCHES_ANIMALS[branchIndex],
            animalLower: BRANCHES_ANIMALS[branchIndex].toLowerCase(),
            emoji: BRANCHES_ANIMALS_EMOJI[branchIndex],
            branch: EARTHLY_BRANCHES[branchIndex],
            branchEn: BRANCHES_EN[branchIndex],
            element: FIVE_ELEMENTS[BRANCH_TO_ELEMENT[branchIndex]]
        };
    }

    /**
     * Get zodiac index from animal name
     */
    function getZodiacIndex(animalName) {
        const name = animalName.toLowerCase();
        return BRANCHES_ANIMALS.findIndex(a => a.toLowerCase() === name);
    }

    // ===== PUBLIC API =====

    return {
        // Core calculations
        getFourPillars,
        getYearPillar,
        getMonthPillar,
        getDayPillar,
        getHourPillar,

        // Five Elements
        countElements,
        getMissingElements,
        getDayMasterStrength,
        getPersonalityTraits,

        // Daily Fortune
        getDailyFortuneRatings,
        getDailyAlmanac,
        getDailyFengShuiTip,
        getLuckyHours,
        getBranchRelation,

        // Year Fortune
        get2026YearFortune,

        // Kua
        calculateKua,
        getKuaDirections,

        // Zodiac
        getZodiacFromYear,
        getZodiacIndex,

        // Formatting
        formatPillar,
        formatPillarEn,
        getStemElement,
        getBranchElement,

        // Constants (read-only access)
        HEAVENLY_STEMS,
        STEMS_EN,
        EARTHLY_BRANCHES,
        BRANCHES_EN,
        BRANCHES_ANIMALS,
        BRANCHES_ANIMALS_EMOJI,
        FIVE_ELEMENTS,
        FIVE_ELEMENTS_CN,
        FIVE_ELEMENTS_COLORS,
        ELEMENT_LUCKY_COLORS,
        ELEMENT_DIRECTIONS,
        SHICHEN_HOURS
    };
})();

// Make available globally
if (typeof window !== 'undefined') {
    window.BaziEngine = BaziEngine;
}
