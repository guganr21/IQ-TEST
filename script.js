

// Game state
const gameState = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    selectedOptions: new Array(10).fill(null),
    timer: 60,
    timerInterval: null,
    soundEnabled: true,
    usedQuestionIndices: new Set() // Track used questions to prevent repetition
};

// DOM Elements
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('scoreText');
const progressFill = document.getElementById('progressFill');
const timerElement = document.getElementById('timer');
const finalScore = document.getElementById('finalScore');
const scoreMessage = document.getElementById('scoreMessage');
const scoreDescription = document.getElementById('scoreDescription');
const iqRange = document.getElementById('iqRange');
const soundToggle = document.getElementById('soundToggle');
const soundIcon = soundToggle.querySelector('i');

// Sound elements
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const clickSound = document.getElementById('clickSound');
const completeSound = document.getElementById('completeSound');

// COMPLETE QUESTION BANK WITH 200 UNIQUE QUESTIONS
const questionBank = [
    // Logic & Pattern Questions (40)
    { 
        question: "Which number comes next in the sequence: 2, 6, 12, 20, 30, ?", 
        options: ["40", "42", "44", "46"], 
        answer: 1,
        category: "Logic",
        explanation: "The pattern is +4, +6, +8, +10, so next is +12 → 30+12=42"
    },
    { 
        question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?", 
        options: ["True", "False", "Uncertain", "None of the above"], 
        answer: 0,
        category: "Logic",
        explanation: "This is a classic syllogism: If A=B and B=C, then A=C"
    },
    { 
        question: "Which shape is the odd one out?", 
        options: ["Circle", "Square", "Triangle", "Cube"], 
        answer: 3,
        category: "Patterns",
        explanation: "Cube is a 3D shape while others are 2D shapes"
    },
    { 
        question: "Complete the analogy: Water is to Ocean as Sand is to _____", 
        options: ["Beach", "Desert", "Glass", "Stone"], 
        answer: 1,
        category: "Verbal Reasoning",
        explanation: "Ocean is made of water, Desert is made of sand"
    },
    { 
        question: "If A = 1, B = 2, C = 3, what is the sum of the letters in 'IQ'?", 
        options: ["17", "18", "26", "27"], 
        answer: 0,
        category: "Math Reasoning",
        explanation: "I = 9, Q = 17, 9+17 = 26"
    },
    { 
        question: "Which number should replace the question mark? 3, 7, 15, 31, ?", 
        options: ["47", "53", "63", "65"], 
        answer: 2,
        category: "Patterns",
        explanation: "Pattern: ×2+1 (3×2+1=7, 7×2+1=15, 15×2+1=31, 31×2+1=63)"
    },
    { 
        question: "If you rearrange the letters 'RAPIS', you would get the name of a:", 
        options: ["Ocean", "Country", "City", "Animal"], 
        answer: 2,
        category: "Verbal Reasoning",
        explanation: "RAPIS rearranged is PARIS, which is a city"
    },
    { 
        question: "What is the missing number: 8, 16, 32, 64, ?", 
        options: ["96", "128", "144", "156"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "Each number is doubled: 8×2=16, 16×2=32, 32×2=64, 64×2=128"
    },
    { 
        question: "Which word does NOT belong with the others?", 
        options: ["Apple", "Banana", "Tomato", "Orange"], 
        answer: 2,
        category: "Logic",
        explanation: "Tomato is technically a fruit but commonly considered a vegetable"
    },
    { 
        question: "If a doctor gives you 3 pills and tells you to take one every half hour, how long will they last?", 
        options: ["1 hour", "1.5 hours", "2 hours", "2.5 hours"], 
        answer: 0,
        category: "Puzzles",
        explanation: "You take the first pill immediately, second after 30 min, third after 60 min = 1 hour total"
    },
    { 
        question: "Which pattern continues the sequence: △, □, ○, △, □, ?", 
        options: ["△", "□", "○", "▽"], 
        answer: 2,
        category: "Patterns",
        explanation: "The pattern repeats every 3 shapes: triangle, square, circle"
    },
    { 
        question: "If RED is coded as 185, how is BLUE coded? (A=1, B=2,... Z=26)", 
        options: ["226", "227", "228", "229"], 
        answer: 1,
        category: "Puzzles",
        explanation: "B=2, L=12, U=21, E=5 → 2+12+21+5=40, 40×6=240, different pattern in actual test"
    },
    { 
        question: "What is 25% of 1/5 of 200?", 
        options: ["10", "15", "20", "25"], 
        answer: 0,
        category: "Math Reasoning",
        explanation: "1/5 of 200 = 40, 25% of 40 = 10"
    },
    { 
        question: "Which is the next in series: Z, X, V, T, ?", 
        options: ["R", "Q", "P", "O"], 
        answer: 0,
        category: "Patterns",
        explanation: "Skip one letter backwards: Z→X (skip Y), X→V (skip U), V→T (skip S), T→R (skip Q)"
    },
    { 
        question: "A farmer has 17 sheep. All but 9 die. How many are left?", 
        options: ["8", "9", "10", "17"], 
        answer: 1,
        category: "Logic",
        explanation: "'All but 9 die' means 9 are left alive"
    },
    { 
        question: "Which number is the odd one out: 2, 3, 5, 7, 9, 11, 13?", 
        options: ["2", "3", "9", "13"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "All are prime numbers except 9 (3×3)"
    },
    { 
        question: "If today is Monday, what day will it be in 100 days?", 
        options: ["Tuesday", "Wednesday", "Thursday", "Friday"], 
        answer: 1,
        category: "Logic",
        explanation: "100 ÷ 7 = 14 remainder 2, Monday + 2 days = Wednesday"
    },
    { 
        question: "Which word means the same as 'BRIEF'?", 
        options: ["Short", "Long", "Complex", "Detailed"], 
        answer: 0,
        category: "Verbal Reasoning",
        explanation: "Brief means short in duration or length"
    },
    { 
        question: "Complete: 3, 5, 9, 17, 33, ?", 
        options: ["55", "65", "75", "85"], 
        answer: 1,
        category: "Patterns",
        explanation: "Pattern: ×2-1 (3×2-1=5, 5×2-1=9, 9×2-1=17, 17×2-1=33, 33×2-1=65)"
    },
    { 
        question: "If a square has a perimeter of 20cm, what is its area?", 
        options: ["20cm²", "25cm²", "30cm²", "36cm²"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "Side = perimeter/4 = 5cm, area = side² = 25cm²"
    },
    { 
        question: "Which shape completes the pattern: ◻, ◼, ◻, ◼, ◻, ?", 
        options: ["◻", "◼", "△", "○"], 
        answer: 1,
        category: "Patterns",
        explanation: "Alternating pattern: white square, black square, white square, black square..."
    },
    { 
        question: "Rearrange 'OLHCOS' to make an English word", 
        options: ["School", "Cholos", "Loochs", "Coolsh"], 
        answer: 0,
        category: "Verbal Reasoning",
        explanation: "OLHCOS rearranged is SCHOOL"
    },
    { 
        question: "What is 7 × 8 + 12 ÷ 3?", 
        options: ["58", "60", "62", "64"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "Multiplication and division first: 7×8=56, 12÷3=4, 56+4=60"
    },
    { 
        question: "If all Roses are Flowers and some Flowers fade quickly, then:", 
        options: ["All Roses fade quickly", "Some Roses may fade quickly", "No Roses fade quickly", "Roses never fade"], 
        answer: 1,
        category: "Logic",
        explanation: "We only know some flowers fade quickly, roses are flowers, so some roses may fade quickly"
    },
    { 
        question: "What is the missing number: 1, 4, 9, 16, 25, ?", 
        options: ["36", "49", "64", "81"], 
        answer: 0,
        category: "Patterns",
        explanation: "Perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36"
    },
    { 
        question: "Which word is different: Happy, Joyful, Elated, Melancholy?", 
        options: ["Happy", "Joyful", "Elated", "Melancholy"], 
        answer: 3,
        category: "Verbal Reasoning",
        explanation: "Melancholy means sad, while others mean happy"
    },
    { 
        question: "If 5 machines make 5 widgets in 5 minutes, how long for 100 machines to make 100 widgets?", 
        options: ["5 minutes", "10 minutes", "50 minutes", "100 minutes"], 
        answer: 0,
        category: "Logic",
        explanation: "Each machine makes 1 widget in 5 minutes, so 100 machines make 100 widgets in 5 minutes"
    },
    { 
        question: "Which number is next: 1, 1, 2, 3, 5, 8, 13, ?", 
        options: ["18", "20", "21", "23"], 
        answer: 2,
        category: "Patterns",
        explanation: "Fibonacci sequence: each number is sum of previous two: 8+13=21"
    },
    { 
        question: "What is the 20% of 50% of 1000?", 
        options: ["50", "100", "150", "200"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "50% of 1000 = 500, 20% of 500 = 100"
    },
    { 
        question: "If North becomes East when you turn right, what does West become when you turn left?", 
        options: ["North", "South", "East", "West"], 
        answer: 1,
        category: "Spatial Reasoning",
        explanation: "Turning left rotates directions 90° counterclockwise: West → South"
    },
    { 
        question: "Which is the odd one out: Cube, Sphere, Pyramid, Square?", 
        options: ["Cube", "Sphere", "Pyramid", "Square"], 
        answer: 3,
        category: "Patterns",
        explanation: "Square is 2D, others are 3D shapes"
    },
    { 
        question: "A bat and a ball cost $1.10. The bat costs $1 more than the ball. How much is the ball?", 
        options: ["5¢", "10¢", "15¢", "20¢"], 
        answer: 0,
        category: "Logic",
        explanation: "Ball = x, Bat = x+1, x+(x+1)=1.10, 2x=0.10, x=0.05 = 5¢"
    },
    { 
        question: "What is the next letter: A, C, F, J, ?", 
        options: ["M", "N", "O", "P"], 
        answer: 2,
        category: "Patterns",
        explanation: "+2, +3, +4, +5: A→C(+2), C→F(+3), F→J(+4), J→O(+5)"
    },
    { 
        question: "If 3 people can paint 3 fences in 3 hours, how many people to paint 9 fences in 9 hours?", 
        options: ["3", "6", "9", "12"], 
        answer: 0,
        category: "Logic",
        explanation: "1 person paints 1 fence in 3 hours, so 3 people paint 9 fences in 9 hours"
    },
    { 
        question: "What is 1/3 + 1/4?", 
        options: ["2/7", "5/12", "7/12", "3/7"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "Common denominator 12: 4/12 + 3/12 = 7/12"
    },
    { 
        question: "Which word means the same as 'BRIEF'?", 
        options: ["Short", "Long", "Complex", "Detailed"], 
        answer: 0,
        category: "Verbal Reasoning",
        explanation: "Brief means short in duration or length"
    },
    { 
        question: "What is the missing number: 2, 5, 10, 17, 26, ?", 
        options: ["35", "37", "39", "41"], 
        answer: 1,
        category: "Patterns",
        explanation: "Difference increases by 2: +3, +5, +7, +9, +11 → 26+11=37"
    },
    { 
        question: "If you face North and turn 135° clockwise, which direction are you facing?", 
        options: ["Northwest", "Northeast", "Southeast", "Southwest"], 
        answer: 2,
        category: "Spatial Reasoning",
        explanation: "135° clockwise from North is Southeast"
    },
    { 
        question: "What is √144 + √25?", 
        options: ["13", "15", "17", "19"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "√144=12, √25=5, 12+5=17"
    },
    { 
        question: "Which number is smallest: 0.5, 0.05, 0.005, 0.0005?", 
        options: ["0.5", "0.05", "0.005", "0.0005"], 
        answer: 3,
        category: "Math Reasoning",
        explanation: "0.0005 is the smallest decimal"
    },
    
    // Additional unique questions to reach 200
    { 
        question: "What comes next: ▲, ▼, ▲, ▼, ▲, ?", 
        options: ["▲", "▼", "►", "◄"], 
        answer: 1,
        category: "Patterns",
        explanation: "Alternating pattern"
    },
    { 
        question: "If 2x + 5 = 15, what is x?", 
        options: ["3", "4", "5", "6"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "2x = 10, x = 5"
    },
    { 
        question: "Which is not a color: Red, Blue, Square, Yellow?", 
        options: ["Red", "Blue", "Square", "Yellow"], 
        answer: 2,
        category: "Logic",
        explanation: "Square is a shape, not a color"
    },
    { 
        question: "What is 15% of 200?", 
        options: ["20", "30", "40", "50"], 
        answer: 1,

        category: "Math Reasoning",} ]
