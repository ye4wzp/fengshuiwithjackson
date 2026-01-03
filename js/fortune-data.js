// Fortune Data Library
const fortuneData = {
    rat: {
        name: "Rat",
        emoji: "🐀",
        fortunes: [
            {
                colors: ["Blue", "Gold", "Green"],
                direction: "North",
                numbers: [2, 3, 7],
                element: "Water",
                wealth: 4,
                love: 3,
                career: 5,
                health: 4,
                advice: "Place a small water fountain in the North corner of your office to enhance career luck. Your networking skills are at their peak today!"
            },
            {
                colors: ["White", "Blue", "Gold"],
                direction: "Northeast",
                numbers: [1, 6, 8],
                element: "Metal",
                wealth: 5,
                love: 4,
                career: 4,
                health: 3,
                advice: "Keep your wealth corner (Southeast) clean and add a jade plant. Financial opportunities may arise from unexpected sources."
            }
        ]
    },
    ox: {
        name: "Ox",
        emoji: "🐂",
        fortunes: [
            {
                colors: ["Yellow", "Green", "Brown"],
                direction: "Northeast",
                numbers: [1, 4, 9],
                element: "Earth",
                wealth: 4,
                love: 4,
                career: 4,
                health: 5,
                advice: "Patience is your strength today. Place yellow flowers in your living room to attract stability and harmony."
            },
            {
                colors: ["Green", "Red", "Purple"],
                direction: "North",
                numbers: [2, 5, 8],
                element: "Wood",
                wealth: 3,
                love: 5,
                career: 4,
                health: 4,
                advice: "Focus on relationships today. Add paired items in your bedroom's Southwest corner to enhance romance."
            }
        ]
    },
    tiger: {
        name: "Tiger",
        emoji: "🐅",
        fortunes: [
            {
                colors: ["Orange", "Red", "Gold"],
                direction: "East",
                numbers: [1, 3, 7],
                element: "Wood",
                wealth: 5,
                love: 4,
                career: 5,
                health: 3,
                advice: "Your bold energy is strong! Place a red candle in the South to boost recognition. Perfect day for new ventures."
            },
            {
                colors: ["Blue", "Green", "White"],
                direction: "Northeast",
                numbers: [4, 6, 9],
                element: "Water",
                wealth: 4,
                love: 3,
                career: 4,
                health: 4,
                advice: "Balance your fiery nature with calming elements. Add a small water feature to your workspace for clarity."
            }
        ]
    },
    rabbit: {
        name: "Rabbit",
        emoji: "🐇",
        fortunes: [
            {
                colors: ["Pink", "Purple", "Blue"],
                direction: "East",
                numbers: [3, 4, 9],
                element: "Wood",
                wealth: 3,
                love: 5,
                career: 4,
                health: 4,
                advice: "Your gentle energy attracts good fortune. Place fresh flowers in the East to enhance creativity and relationships."
            },
            {
                colors: ["Green", "Red", "White"],
                direction: "Southeast",
                numbers: [1, 6, 8],
                element: "Fire",
                wealth: 4,
                love: 4,
                career: 3,
                health: 5,
                advice: "Focus on self-care today. Light a pink candle in your bedroom to attract peace and harmony."
            }
        ]
    },
    dragon: {
        name: "Dragon",
        emoji: "🐉",
        fortunes: [
            {
                colors: ["Gold", "Red", "Purple"],
                direction: "Southeast",
                numbers: [1, 6, 7],
                element: "Earth",
                wealth: 5,
                love: 4,
                career: 5,
                health: 4,
                advice: "Your power is at its peak! Place a citrine crystal in your wealth corner. Major opportunities await!"
            },
            {
                colors: ["Green", "Yellow", "White"],
                direction: "East",
                numbers: [3, 8, 9],
                element: "Wood",
                wealth: 4,
                love: 5,
                career: 4,
                health: 3,
                advice: "Channel your energy wisely. Add bamboo plants to your office for sustained growth and prosperity."
            }
        ]
    },
    snake: {
        name: "Snake",
        emoji: "🐍",
        fortunes: [
            {
                colors: ["Red", "Black", "Yellow"],
                direction: "Southeast",
                numbers: [2, 8, 9],
                element: "Fire",
                wealth: 4,
                love: 4,
                career: 5,
                health: 3,
                advice: "Trust your intuition today. Place a red object in the South to enhance your wisdom and insight."
            },
            {
                colors: ["Purple", "Gold", "Green"],
                direction: "South",
                numbers: [1, 4, 6],
                element: "Metal",
                wealth: 5,
                love: 3,
                career: 4,
                health: 4,
                advice: "Your analytical skills are sharp. Keep your workspace organized and add metal elements for clarity."
            }
        ]
    },
    horse: {
        name: "Horse",
        emoji: "🐴",
        fortunes: [
            {
                colors: ["Red", "Orange", "Purple"],
                direction: "South",
                numbers: [2, 3, 7],
                element: "Fire",
                wealth: 5,
                love: 4,
                career: 5,
                health: 4,
                advice: "2026 is YOUR year! Place a horse statue facing South to maximize your dynamic energy and success."
            },
            {
                colors: ["Green", "Yellow", "White"],
                direction: "Southwest",
                numbers: [5, 8, 9],
                element: "Earth",
                wealth: 4,
                love: 5,
                career: 4,
                health: 3,
                advice: "Balance your active nature. Add earth-tone decor to your bedroom for grounding and relationship harmony."
            }
        ]
    },
    goat: {
        name: "Goat",
        emoji: "🐐",
        fortunes: [
            {
                colors: ["Green", "Purple", "White"],
                direction: "Southwest",
                numbers: [3, 4, 9],
                element: "Earth",
                wealth: 4,
                love: 5,
                career: 3,
                health: 4,
                advice: "Your creative energy flows! Place art or purple items in your living space to attract inspiration."
            },
            {
                colors: ["Pink", "Red", "Yellow"],
                direction: "South",
                numbers: [2, 7, 8],
                element: "Fire",
                wealth: 3,
                love: 4,
                career: 4,
                health: 5,
                advice: "Nurture yourself and others. Fresh flowers in the Southwest enhance family harmony and wellbeing."
            }
        ]
    },
    monkey: {
        name: "Monkey",
        emoji: "🐵",
        fortunes: [
            {
                colors: ["White", "Gold", "Blue"],
                direction: "West",
                numbers: [1, 7, 8],
                element: "Metal",
                wealth: 5,
                love: 3,
                career: 5,
                health: 4,
                advice: "Your clever mind shines! Place metal wind chimes in the West for business success and innovation."
            },
            {
                colors: ["Yellow", "Red", "Green"],
                direction: "Northwest",
                numbers: [3, 6, 9],
                element: "Earth",
                wealth: 4,
                love: 4,
                career: 4,
                health: 4,
                advice: "Network and connect today. Add a money tree plant to your office for financial opportunities."
            }
        ]
    },
    rooster: {
        name: "Rooster",
        emoji: "🐔",
        fortunes: [
            {
                colors: ["Gold", "Brown", "Yellow"],
                direction: "West",
                numbers: [5, 7, 8],
                element: "Metal",
                wealth: 4,
                love: 4,
                career: 5,
                health: 3,
                advice: "Your hard work pays off! Display awards or certificates in the South for recognition and success."
            },
            {
                colors: ["Red", "Purple", "White"],
                direction: "Southwest",
                numbers: [1, 4, 9],
                element: "Fire",
                wealth: 5,
                love: 5,
                career: 4,
                health: 4,
                advice: "Balance work and relationships. Add paired candles in your bedroom for romance and harmony."
            }
        ]
    },
    dog: {
        name: "Dog",
        emoji: "🐕",
        fortunes: [
            {
                colors: ["Red", "Green", "Purple"],
                direction: "Northwest",
                numbers: [3, 4, 9],
                element: "Earth",
                wealth: 3,
                love: 4,
                career: 4,
                health: 5,
                advice: "Focus on health and wellness. Place green plants in your bedroom for vitality and peaceful sleep."
            },
            {
                colors: ["Yellow", "Blue", "White"],
                direction: "Northeast",
                numbers: [2, 6, 7],
                element: "Metal",
                wealth: 4,
                love: 5,
                career: 3,
                health: 4,
                advice: "Loyalty brings rewards. Strengthen relationships by adding family photos in the Southwest corner."
            }
        ]
    },
    pig: {
        name: "Pig",
        emoji: "🐖",
        fortunes: [
            {
                colors: ["Yellow", "Gold", "Brown"],
                direction: "Northwest",
                numbers: [2, 5, 8],
                element: "Water",
                wealth: 5,
                love: 4,
                career: 4,
                health: 4,
                advice: "Prosperity flows to you! Place a golden pig figurine in your wealth corner for abundance."
            },
            {
                colors: ["Green", "Red", "Purple"],
                direction: "North",
                numbers: [1, 6, 9],
                element: "Wood",
                wealth: 4,
                love: 5,
                career: 4,
                health: 3,
                advice: "Enjoy life's pleasures. Add fresh fruit in a bowl to your kitchen for nourishment and joy."
            }
        ]
    }
};
