/**
 * Fortune Data Library (Enhanced)
 * Provides zodiac-specific data pools used by BaziEngine for daily fortune generation.
 * Each zodiac has multiple advice entries, color sets, and feng shui tips
 * that are selected based on the day's Heavenly Stem & Earthly Branch.
 */

const fortuneData = {
    rat: {
        name: "Rat", emoji: "🐀", branchIndex: 0, element: "Water",
        colorSets: [
            ["Blue", "Gold", "Green"], ["White", "Blue", "Gold"], ["Black", "Silver", "Teal"],
            ["Navy", "Green", "White"], ["Blue", "Purple", "Silver"], ["Teal", "Gold", "Black"]
        ],
        directions: ["North", "Northeast", "Northwest", "East", "Southeast"],
        numberSets: [[2, 3, 7], [1, 6, 8], [3, 7, 9], [1, 4, 6], [2, 8, 9], [1, 3, 5]],
        crystals: ["Amethyst", "Black Tourmaline", "Aquamarine", "Lapis Lazuli", "Blue Sapphire"],
        advice: [
            "Place a small water fountain in the North corner of your office to enhance career luck. Your networking skills are at their peak today!",
            "Keep your wealth corner (Southeast) clean and add a jade plant. Financial opportunities may arise from unexpected sources.",
            "Your Water energy is strong today. Use it for negotiations and building connections. Wear blue for confidence.",
            "Focus on creative projects today. Add a crystal bowl with water in your workspace for mental clarity.",
            "Network actively — your charm is magnetic today. Place 6 Chinese coins in the Northwest for mentor luck.",
            "Trust your instincts about money matters. Your intuition about investments is heightened today.",
            "Communication flows easily. Write important emails or make calls during the morning hours for best results.",
            "A good day for learning and research. Place books or study materials in the Northeast for knowledge luck.",
            "Your adaptability is your strength today. Be flexible with plans and opportunities will find you.",
            "Partnerships are favored. Meet with allies and discuss future plans. Add paired items to your desk.",
            "Financial acumen is sharp. Review budgets and plan savings. Metal objects on your desk attract wealth energy.",
            "Social energy peaks in the evening. Attend gatherings or host friends. Keep your entryway bright and welcoming.",
            "Career momentum builds today. Take initiative on stalled projects. Face North while working for best focus.",
            "Emotional intelligence is your superpower now. Listen more than you speak for deeper connections.",
            "Travel luck is favorable. Plan trips facing your lucky direction. Pack something blue for protection."
        ],
        fengShuiTips: [
            "Add a small aquarium or water feature in the North sector",
            "Place a metal wind chime near your front door for career luck",
            "Keep a glass of water on your nightstand for better sleep and intuition",
            "Use blue lighting or candles in your meditation space",
            "Display a rat figurine facing the door to attract opportunities",
            "Clear clutter from your North wall to let career energy flow"
        ]
    },
    ox: {
        name: "Ox", emoji: "🐂", branchIndex: 1, element: "Earth",
        colorSets: [
            ["Yellow", "Green", "Brown"], ["Green", "Red", "Purple"], ["Beige", "Gold", "White"],
            ["Brown", "Orange", "Yellow"], ["Cream", "Sage", "Terracotta"], ["Gold", "Forest Green", "Tan"]
        ],
        directions: ["Northeast", "North", "South", "Southwest", "West"],
        numberSets: [[1, 4, 9], [2, 5, 8], [3, 6, 7], [1, 5, 9], [4, 6, 8], [2, 7, 9]],
        crystals: ["Tiger Eye", "Jasper", "Citrine", "Smoky Quartz", "Amber"],
        advice: [
            "Patience is your strength today. Place yellow flowers in your living room to attract stability and harmony.",
            "Focus on relationships today. Add paired items in your bedroom's Southwest corner to enhance romance.",
            "Your determination is rewarded. Push forward on long-term goals. Earth-tone decor enhances your stamina.",
            "Financial stability improves. Review investments and savings. A golden object in the Northeast attracts wealth.",
            "Hard work pays dividends today. Others admire your reliability. Wear brown or yellow for grounding.",
            "Focus on health and wellness. Take a walk in nature. Green plants strengthen your nurturing energy.",
            "Property and real estate matters are favored. Place a globe or map in your office for expansion luck.",
            "Teamwork brings success today. Your steadfast nature inspires others. Add Earth-tone crystals to your desk.",
            "Slow and steady wins. Avoid rushing decisions. Meditate with yellow candles for clarity and patience.",
            "Family bonds strengthen today. Cook a meal together. Display family photos in the Southwest corner.",
            "Your practical wisdom shines. Mentor someone younger. Place a ceramic ox in the Northeast for growth.",
            "Financial planning is especially effective today. Create or review your budget under favorable stars.",
            "Rest and recovery is important. Listen to your body. Add an earthenware pot with soil to your bedroom corner.",
            "Loyalty is recognized and rewarded today. Stand firm in your values. Others will follow your lead.",
            "Home improvement projects are highly favored. Rearrange furniture for better chi flow."
        ],
        fengShuiTips: [
            "Place terracotta or ceramic items in the Northeast sector",
            "Use square shapes in decor — they represent Earth energy",
            "Add crystals or stones to your windowsill for grounding",
            "Keep the center of your home uncluttered for stable Earth chi",
            "Display an ox figurine in the living room for perseverance",
            "Use warm, earthy color tones in your bedroom for restful sleep"
        ]
    },
    tiger: {
        name: "Tiger", emoji: "🐅", branchIndex: 2, element: "Wood",
        colorSets: [
            ["Orange", "Red", "Gold"], ["Blue", "Green", "White"], ["Emerald", "Amber", "Crimson"],
            ["Forest Green", "Bronze", "Scarlet"], ["Jade", "Copper", "Ivory"], ["Lime", "Gold", "Burgundy"]
        ],
        directions: ["East", "Northeast", "South", "Southeast", "North"],
        numberSets: [[1, 3, 7], [4, 6, 9], [2, 5, 8], [1, 7, 9], [3, 4, 6], [2, 3, 8]],
        crystals: ["Carnelian", "Red Jasper", "Green Aventurine", "Malachite", "Ruby"],
        advice: [
            "Your bold energy is strong! Place a red candle in the South to boost recognition. Perfect day for new ventures.",
            "Balance your fiery nature with calming elements. Add a small water feature to your workspace for clarity.",
            "Leadership opportunities arise. Take charge of group projects. Wear orange to amplify your courage.",
            "Adventure calls! Plan something spontaneous. Your Wood energy thrives with movement and exploration.",
            "Channel your competitive spirit constructively. Sports or exercise channels excess energy positively.",
            "Your charisma is magnetic today. Pitch ideas and present proposals. Face East for maximum impact.",
            "Protect your territory in business. Review contracts carefully. A tiger figurine guards against setbacks.",
            "Creative energy peaks. Express yourself through art, music, or writing. Green enhances inspiration.",
            "Stand up for someone today. Your protective instincts are heightened. This earns lasting loyalty.",
            "Financial courage pays off. Take a calculated risk you've been considering. Lucky stars support bold moves.",
            "Physical energy is abundant. Start a new fitness routine or challenge yourself physically today.",
            "Your natural authority shines. Others look to you for direction. Lead with confidence and compassion.",
            "Partnerships with Horse and Dog signs are particularly favorable today.",
            "Innovation is your ally. Think outside the box for solutions. A bamboo plant enhances creative Wood chi.",
            "Travel to the East brings luck. Even a short walk eastward during lunch recharges your energy."
        ],
        fengShuiTips: [
            "Place living plants in the East sector to activate Wood energy",
            "Use vertical stripes or tall items to represent growing Wood chi",
            "Display a tiger painting or figurine facing the front door for protection",
            "Add green crystals (jade, malachite) to your workspace",
            "Keep fresh flowers in the Southeast for wealth and growth",
            "Use wooden furniture or bamboo accessories in your study"
        ]
    },
    rabbit: {
        name: "Rabbit", emoji: "🐇", branchIndex: 3, element: "Wood",
        colorSets: [
            ["Pink", "Purple", "Blue"], ["Green", "Red", "White"], ["Lavender", "Mint", "Rose"],
            ["Sage", "Blush", "Cream"], ["Lilac", "Teal", "Peach"], ["Pastel Green", "Soft Pink", "Sky Blue"]
        ],
        directions: ["East", "Southeast", "South", "North", "Southwest"],
        numberSets: [[3, 4, 9], [1, 6, 8], [2, 5, 7], [3, 7, 9], [1, 4, 8], [2, 6, 9]],
        crystals: ["Rose Quartz", "Moonstone", "Jade", "Amethyst", "Pink Tourmaline"],
        advice: [
            "Your gentle energy attracts good fortune. Place fresh flowers in the East to enhance creativity.",
            "Focus on self-care today. Light a pink candle in your bedroom to attract peace and harmony.",
            "Diplomacy wins hearts. Use your natural tact to resolve conflicts. Wear soft pastels for calming influence.",
            "Artistic pursuits are highly favored. Paint, write, or craft something beautiful. It attracts abundance.",
            "Romance is in the air. Place rose quartz in the Southwest corner of your bedroom for love luck.",
            "Your intuition is razor-sharp today. Trust your gut feelings about people and situations.",
            "Home beautification projects bring great energy. Add flowers or rearrange for fresh chi flow.",
            "Negotiation skills are enhanced. Approach difficult conversations with your signature grace.",
            "Social connections deepen. Quality time with close friends nourishes your soul. Host a tea gathering.",
            "Health improves with gentle exercise. Tai chi, yoga, or walking in nature is ideal today.",
            "Your aesthetic eye spots opportunities others miss. Trust your taste in business decisions too.",
            "Literary and communication luck is strong. Write proposals, applications, or heartfelt messages today.",
            "Partnerships with Goat and Pig signs bring special harmony and mutual support.",
            "Beauty and fashion purchases made today will serve you well. Trust your instincts on style.",
            "Peaceful energy surrounds you. Use this calm to plan your next move strategically."
        ],
        fengShuiTips: [
            "Place fresh flowers in the East and Southeast for growth energy",
            "Use soft, rounded shapes in decor for gentle chi flow",
            "Add a rabbit figurine in the living room for peace and fertility",
            "Scented candles or essential oils enhance your space's serenity",
            "Keep your bedroom in pastel tones for optimal rest",
            "Display artwork of gardens or nature scenes for Wood nourishment"
        ]
    },
    dragon: {
        name: "Dragon", emoji: "🐉", branchIndex: 4, element: "Earth",
        colorSets: [
            ["Gold", "Red", "Purple"], ["Green", "Yellow", "White"], ["Imperial Purple", "Crimson", "Gold"],
            ["Emerald", "Rose Gold", "Royal Blue"], ["Silver", "Deep Red", "Forest Green"], ["Bronze", "Violet", "Ivory"]
        ],
        directions: ["Southeast", "East", "South", "Southwest", "North"],
        numberSets: [[1, 6, 7], [3, 8, 9], [2, 5, 7], [1, 3, 6], [4, 7, 8], [2, 6, 9]],
        crystals: ["Citrine", "Dragon Vein Agate", "Imperial Jade", "Gold Tiger Eye", "Garnet"],
        advice: [
            "Your power is at its peak! Place a citrine crystal in your wealth corner. Major opportunities await!",
            "Channel your energy wisely. Add bamboo plants to your office for sustained growth and prosperity.",
            "Leadership destiny calls. Step into authority roles with confidence. Gold accessories amplify your aura.",
            "Your vision is clearest today. Make strategic decisions about long-term goals. The universe supports your ambition.",
            "Imperial energy surrounds you. Others are drawn to your magnetic presence. Use it to inspire, not dominate.",
            "Creative breakthroughs are likely. Let your imagination run wild. Purple enhances your mystical connection.",
            "Business ventures launched today have auspicious energy. Sign contracts facing Southeast for best results.",
            "Mentor someone today — your wisdom has transformative power. This also strengthens your own luck.",
            "Financial prosperity flows toward you. Be generous and it multiplies. Donate to charity for karmic returns.",
            "Your reputation grows. Ensure your actions match your words. Integrity is your greatest treasure.",
            "Competitive situations favor you today. Enter contests, bid on projects, or pitch to investors.",
            "Mystical insight is available. Meditate or journal for revelations. A dragon statue amplifies spiritual power.",
            "Partnerships with Rat, Tiger, and Snake bring exceptional synergy today.",
            "Exercise authority with wisdom. The balance of power and compassion defines great leaders.",
            "Innovation luck is extremely high. Patent ideas, launch products, or propose bold solutions."
        ],
        fengShuiTips: [
            "Display a dragon figurine in the East sector for power and authority",
            "Use gold accents throughout your home for prosperity chi",
            "Place a large crystal in the center of your home for Earth stability",
            "Add red and gold to your workspace for ambition energy",
            "Keep the Southeast corner bright and clutter-free for wealth luck",
            "Use an imperial jade piece on your desk for wisdom and protection"
        ]
    },
    snake: {
        name: "Snake", emoji: "🐍", branchIndex: 5, element: "Fire",
        colorSets: [
            ["Red", "Black", "Yellow"], ["Purple", "Gold", "Green"], ["Burgundy", "Charcoal", "Amber"],
            ["Deep Red", "Obsidian", "Bronze"], ["Maroon", "Silver", "Olive"], ["Crimson", "Onyx", "Saffron"]
        ],
        directions: ["Southeast", "South", "Southwest", "East", "West"],
        numberSets: [[2, 8, 9], [1, 4, 6], [3, 5, 7], [2, 6, 8], [1, 7, 9], [3, 4, 5]],
        crystals: ["Black Obsidian", "Garnet", "Red Coral", "Onyx", "Fire Opal"],
        advice: [
            "Trust your intuition today. Place a red object in the South to enhance your wisdom and insight.",
            "Your analytical skills are sharp. Keep your workspace organized and add metal elements for clarity.",
            "Strategic thinking pays off. Plan your moves carefully like the wise snake you are.",
            "Mystery and allure work in your favor. Use your magnetic personality in negotiations.",
            "Financial intuition is heightened. You sense market trends before others. Act discreetly on insights.",
            "Transformation energy is powerful today. Shed old habits like a snake sheds skin. Embrace renewal.",
            "Deep research and investigation are favored. Uncover hidden opportunities in data or contracts.",
            "Your patience is a weapon today. Wait for the perfect moment before striking with your proposal.",
            "Healing energy surrounds you. Focus on health practices. Snake medicine is about regeneration.",
            "Secrets may be revealed today. Handle sensitive information with your characteristic discretion.",
            "Investment timing is favorable. Real estate and long-term assets show particular promise.",
            "Intellectual pursuits are rewarded. Study, certify, or present research for recognition.",
            "Alliances with Dragon, Rooster, and Ox bring powerful results today.",
            "Your observational skills are unmatched. Use them to read people and situations accurately.",
            "Elegant solutions come naturally. Simplify complex problems with your incisive mind."
        ],
        fengShuiTips: [
            "Keep a black obsidian stone near your front door for protection",
            "Use warm, low lighting in the evening for Snake's contemplative energy",
            "Place a snake figurine in the Southeast for wealth wisdom",
            "Add Fire element items (candles, triangles) to the South sector",
            "Use dark, rich fabrics in your decor for sophistication chi",
            "Keep a journal by your bed — Snake energy brings prophetic dreams"
        ]
    },
    horse: {
        name: "Horse", emoji: "🐴", branchIndex: 6, element: "Fire",
        colorSets: [
            ["Red", "Orange", "Purple"], ["Green", "Yellow", "White"], ["Scarlet", "Coral", "Magenta"],
            ["Flame Orange", "Burgundy", "Gold"], ["Hot Pink", "Amber", "Crimson"], ["Tangerine", "Ruby", "Bronze"]
        ],
        directions: ["South", "Southwest", "East", "Southeast", "West"],
        numberSets: [[2, 3, 7], [5, 8, 9], [1, 4, 6], [2, 7, 8], [3, 5, 9], [1, 6, 7]],
        crystals: ["Red Jasper", "Sunstone", "Carnelian", "Fire Agate", "Ruby"],
        advice: [
            "2026 is YOUR year! Place a horse statue facing South to maximize your dynamic energy and success.",
            "Balance your active nature. Add earth-tone decor to your bedroom for grounding and relationship harmony.",
            "Speed and momentum are your allies. Launch projects quickly before second-guessing yourself.",
            "Your enthusiasm inspires everyone around you. Lead team activities and social events today.",
            "Physical activity brings clarity. Run, ride, or dance — movement unlocks your best ideas.",
            "Romance blazes brightly today. Express your passion boldly. Red flowers in the bedroom amplify love.",
            "Travel luck is exceptional. Plan adventures or relocate for career growth. The journey matters.",
            "Your free spirit attracts admirers. Be authentic and magnetic. Wear your boldest outfit today.",
            "Competition brings out your best. Enter races (literal or figurative) with fiery determination.",
            "Avoid burnout by adding Water or Earth elements to your routine. Balance is key to sustained success.",
            "Your independence is attractive but remember allies multiply power. Accept help graciously.",
            "Public speaking or performing arts are strongly favored. Your stage presence is electrifying today.",
            "Partnerships with Tiger, Goat, and Dog signs create dynamic and supportive energy.",
            "Adventure sports or outdoor activities channel your Fire energy positively and prevent restlessness.",
            "Recognition and awards are likely. Your flame burns bright enough for everyone to see."
        ],
        fengShuiTips: [
            "Place a galloping horse figurine in the South for fame and recognition",
            "Use triangular shapes and red accents for Fire energy activation",
            "Add Earth elements (ceramics, stones) to prevent Fire burnout",
            "Keep the South sector of your home bright and well-lit",
            "Display a victory horse painting in your office for career success",
            "Use cinnamon or ginger scents to activate your Fire element"
        ]
    },
    goat: {
        name: "Goat", emoji: "🐐", branchIndex: 7, element: "Earth",
        colorSets: [
            ["Green", "Purple", "White"], ["Pink", "Red", "Yellow"], ["Lavender", "Sage", "Cream"],
            ["Mauve", "Olive", "Peach"], ["Pastel Purple", "Mint", "Coral"], ["Dusty Rose", "Forest Green", "Ivory"]
        ],
        directions: ["Southwest", "South", "West", "Northwest", "East"],
        numberSets: [[3, 4, 9], [2, 7, 8], [1, 5, 6], [3, 6, 9], [2, 4, 7], [1, 5, 8]],
        crystals: ["Jade", "Rose Quartz", "Amethyst", "Moonstone", "Prehnite"],
        advice: [
            "Your creative energy flows! Place art or purple items in your living space to attract inspiration.",
            "Nurture yourself and others. Fresh flowers in the Southwest enhance family harmony and wellbeing.",
            "Artistic pursuits bring both joy and income today. Don't undervalue your creative talents.",
            "Emotional intelligence is your superpower. Use it to build deeper, more meaningful connections.",
            "Home and family matters take priority. Create a peaceful sanctuary for yourself and loved ones.",
            "Collaboration over competition today. Your gentle approach wins more allies than force ever could.",
            "Beauty surrounds you. Visit galleries, gardens, or create something beautiful for your space.",
            "Culinary arts are favored. Cook with intention and share meals with people who matter to you.",
            "Fashion and design decisions made today will be inspired. Trust your aesthetic judgment fully.",
            "Self-care is not selfish. Take time for spa treatments, meditation, or journaling. You deserve it.",
            "Romantic energy is tender and deep. Write love letters or plan intimate dates. Sweetness attracts sweetness.",
            "Community service brings karmic rewards. Volunteer your talents for a cause close to your heart.",
            "Partnerships with Rabbit, Horse, and Pig create beautiful harmony in your life today.",
            "Musical and poetic expression channels your emotions constructively and attracts abundance.",
            "Gentle persistence overcomes resistance. Water the seed and let it grow in its own time."
        ],
        fengShuiTips: [
            "Place artwork or crafts in the Southwest for relationship harmony",
            "Use soft textures and natural fabrics in your bedroom for comfort",
            "Add a jade goat figurine for gentle prosperity energy",
            "Fresh flowers in every room uplift the chi for artistic Goat energy",
            "Use aromatherapy diffusers with calming scents like lavender",
            "Keep the Southwest sector of your home warm and inviting"
        ]
    },
    monkey: {
        name: "Monkey", emoji: "🐵", branchIndex: 8, element: "Metal",
        colorSets: [
            ["White", "Gold", "Blue"], ["Yellow", "Red", "Green"], ["Silver", "Royal Blue", "Platinum"],
            ["Champagne", "Electric Blue", "Pearl"], ["Chrome", "Turquoise", "Gold"], ["Ivory", "Cobalt", "Bronze"]
        ],
        directions: ["West", "Northwest", "North", "Southwest", "East"],
        numberSets: [[1, 7, 8], [3, 6, 9], [2, 4, 5], [1, 6, 7], [3, 8, 9], [2, 5, 7]],
        crystals: ["Clear Quartz", "White Topaz", "Citrine", "Pyrite", "Labradorite"],
        advice: [
            "Your clever mind shines! Place metal wind chimes in the West for business success and innovation.",
            "Network and connect today. Add a money tree plant to your office for financial opportunities.",
            "Problem-solving genius is at peak. Tackle complex challenges others have abandoned.",
            "Your quick wit makes you the star of every conversation. Use humor to close deals.",
            "Technology and innovation are your domains today. Code, design, or invent something remarkable.",
            "Adaptability wins. When plans change, you pivot faster than anyone. Flexibility is your superpower.",
            "Multiple income streams activate today. Explore side projects or freelance opportunities.",
            "Social intelligence helps you navigate office politics. Play the long game with strategic alliances.",
            "Entertainment and media ventures are especially lucky. Create, perform, or produce content today.",
            "Your resourcefulness turns limitations into advantages. Use constraints as creative fuel.",
            "Financial trading or investment analysis is sharp today. Your analytical Metal mind spots patterns.",
            "Teaching and mentoring multiply your wisdom. Share your tricks and you gain more in return.",
            "Partnerships with Rat, Dragon, and Snake bring brilliant collaborative results.",
            "Pranks and playfulness have their place, but today focus your mischief into productive disruption.",
            "Speed of execution matters today. First-mover advantage is real. Don't overthink, just ship it."
        ],
        fengShuiTips: [
            "Hang metal wind chimes in the West for creative breakthrough energy",
            "Use round metallic objects in your workspace for focus",
            "Display a monkey figurine near your computer for tech luck",
            "Keep your West sector organized with metal containers or shelves",
            "Add clear quartz crystals to amplify mental clarity",
            "Use white or metallic tones in your study for sharp thinking"
        ]
    },
    rooster: {
        name: "Rooster", emoji: "🐔", branchIndex: 9, element: "Metal",
        colorSets: [
            ["Gold", "Brown", "Yellow"], ["Red", "Purple", "White"], ["Amber", "Bronze", "Cream"],
            ["Copper", "Magenta", "Platinum"], ["Honey", "Scarlet", "Silver"], ["Champagne Gold", "Wine", "Pearl"]
        ],
        directions: ["West", "Southwest", "South", "Northwest", "Northeast"],
        numberSets: [[5, 7, 8], [1, 4, 9], [2, 3, 6], [5, 8, 9], [1, 3, 7], [4, 6, 8]],
        crystals: ["Pyrite", "Gold Tiger Eye", "Amber", "Topaz", "Peridot"],
        advice: [
            "Your hard work pays off! Display awards or certificates in the South for recognition and success.",
            "Balance work and relationships. Add paired candles in your bedroom for romance and harmony.",
            "Precision and attention to detail give you the edge today. Quality over quantity always wins.",
            "Your punctuality and reliability earn respect. Be the first to arrive and the last to leave.",
            "Appearance matters today. Dress sharp and present yourself with the confidence you deserve.",
            "Organizational skills are at peak. Systematize your workflow for lasting efficiency.",
            "Morning hours are your power time. Schedule important meetings and decisions before noon.",
            "Your direct communication style is refreshing. Speak truth with grace and people will follow.",
            "Financial planning and budgeting are especially effective. Crunch numbers with confidence today.",
            "Courage to stand alone in your convictions attracts admirers. Be the voice of reason.",
            "Home organization brings mental clarity. Declutter and create systems that save future time.",
            "Your critical eye spots flaws others miss. Use this talent constructively to improve processes.",
            "Alliances with Ox, Snake, and Dragon create powerful Metal-Earth-Fire synergy today.",
            "Early morning exercise sets your tone for exceptional productivity all day.",
            "Your watchful nature protects others. Be the guardian who prevents mistakes before they happen."
        ],
        fengShuiTips: [
            "Place a rooster figurine in the West to ward off infidelity and negativity",
            "Use gold-framed mirrors in the South for fame and recognition",
            "Add metallic desk organizers for productive Metal energy",
            "Keep your morning routine sacred — it's your power ritual",
            "Display achievements and awards prominently for self-confidence chi",
            "Use warm gold lighting in your workspace for focused energy"
        ]
    },
    dog: {
        name: "Dog", emoji: "🐕", branchIndex: 10, element: "Earth",
        colorSets: [
            ["Red", "Green", "Purple"], ["Yellow", "Blue", "White"], ["Burgundy", "Olive", "Plum"],
            ["Terra Cotta", "Teal", "Cream"], ["Wine Red", "Forest Green", "Lavender"], ["Brick Red", "Sage", "Mauve"]
        ],
        directions: ["Northwest", "Northeast", "East", "South", "West"],
        numberSets: [[3, 4, 9], [2, 6, 7], [1, 5, 8], [3, 7, 9], [2, 4, 6], [1, 8, 9]],
        crystals: ["Lapis Lazuli", "Turquoise", "Blue Lace Agate", "Sodalite", "Chrysocolla"],
        advice: [
            "Focus on health and wellness. Place green plants in your bedroom for vitality and peaceful sleep.",
            "Loyalty brings rewards. Strengthen relationships by adding family photos in the Southwest corner.",
            "Your protective instincts are heightened. Guard those you love with wisdom and strength.",
            "Justice matters to you today. Stand up for fairness in your workplace and community.",
            "Volunteer work or charity brings deep satisfaction and karmic returns today.",
            "Your honest nature is valued. People seek your trustworthy opinion. Give it generously.",
            "Security matters are well-starred. Review insurance, locks, or cybersecurity measures today.",
            "Outdoor activities with friends or family bring joy and strengthen bonds naturally.",
            "Your nose for trouble saves the day. Trust your instincts about people who seem untrustworthy.",
            "Home security improvements are favored. Upgrade systems or simply reorganize for family safety.",
            "Loyalty in business partnerships deepens. Reward those who've stood by you through tough times.",
            "Exercise with a buddy amplifies benefits. Your motivational energy inspires others to be healthier.",
            "Partnerships with Tiger, Rabbit, and Horse bring security and warmth to your life today.",
            "Evening walks help process the day's emotions. Nature is your therapist and healer.",
            "Your sense of duty is admirable but remember to rest. Even guardians need downtime."
        ],
        fengShuiTips: [
            "Place a dog figurine by the front door for protection and loyalty energy",
            "Display family photos in the Southwest for strengthened bonds",
            "Use Earth-tone throw pillows for grounding comfort energy",
            "Keep the Northwest sector clean for helpful people and mentor luck",
            "Add blue stones (turquoise, lapis) for calm, balanced energy",
            "Install a doorbell or wind chime at the entrance for alert energy"
        ]
    },
    pig: {
        name: "Pig", emoji: "🐷", branchIndex: 11, element: "Water",
        colorSets: [
            ["Yellow", "Gold", "Brown"], ["Green", "Red", "Purple"], ["Rose Gold", "Cream", "Olive"],
            ["Honey", "Blush", "Chocolate"], ["Amber", "Peach", "Forest Green"], ["Champagne", "Wine", "Sage"]
        ],
        directions: ["Northwest", "North", "East", "Northeast", "Southeast"],
        numberSets: [[2, 5, 8], [1, 6, 9], [3, 4, 7], [2, 7, 8], [1, 5, 9], [3, 6, 8]],
        crystals: ["Smoky Quartz", "Rose Quartz", "Carnelian", "Jade", "Amber"],
        advice: [
            "Prosperity flows to you! Place a golden pig figurine in your wealth corner for abundance.",
            "Enjoy life's pleasures. Add fresh fruit in a bowl to your kitchen for nourishment and joy.",
            "Generosity multiplies your wealth. Share freely and watch the universe return tenfold.",
            "Gourmet experiences are favored. Host a dinner party or try a new restaurant. Food feeds your soul.",
            "Your natural optimism lifts everyone's spirits. Spread joy and watch opportunities follow.",
            "Comfort is productive for you. Create a cozy workspace and your creativity will soar.",
            "Honest dealings in business attract lasting partners. Your integrity is your best brand.",
            "Savings and investments made today have favorable long-term returns. Be wise with windfalls.",
            "Leisure activities aren't lazy — they're recharging. Give yourself permission to enjoy today.",
            "Your sincerity in relationships creates deep trust. Be your authentic self, always.",
            "Nature outings bring renewal. Visit farms, gardens, or parks for health and happiness.",
            "Material comforts are your reward for hard work. Buy something quality you've been wanting.",
            "Partnerships with Rabbit, Goat, and Tiger create a nurturing and prosperous circle today.",
            "Creative cooking, baking, or mixing drinks channels your creative Earth-Water energy beautifully.",
            "Your laugh is medicine for others. Don't hold back your joy — it's contagious and healing."
        ],
        fengShuiTips: [
            "Place a golden pig or piggy bank in the Southeast for wealth luck",
            "Use warm, cozy textures in your living room for comfort chi",
            "Add Water features in the North for career flow",
            "Display abundant fruit bowls for prosperity and abundance energy",
            "Use comfortable, high-quality bedding for optimal rest and recovery",
            "Keep fresh herbs in your kitchen for nourishing Earth energy"
        ]
    }
};

// Export for use
if (typeof window !== 'undefined') {
    window.fortuneData = fortuneData;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = fortuneData;
}
