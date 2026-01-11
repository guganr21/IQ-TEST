// ---------------- GAME STATE ----------------
const gameState = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    selectedOptions: new Array(10).fill(null),
    timer: 30,
    timerInterval: null,
    soundEnabled: true,
    usedQuestionIndices: new Set()
};

// ---------------- DOM ----------------
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const questionText = document.getElementById('questionText');
const questionNumber = document.getElementById('questionNumber');
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
const soundIcon = soundToggle?.querySelector('i');

// ---------------- SOUNDS ----------------
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const clickSound = document.getElementById('clickSound');
const completeSound = document.getElementById('completeSound');

// ---------------- QUESTION BANK ----------------
// 🔽 PASTE YOUR FULL 200 QUESTION BANK HERE (UNCHANGED)
const questionBank = [
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
        question: "Which pattern continues the sequence: △, □, ●, △, □, ?", 
        options: ["△", "□", "●", "◇"], 
        answer: 2,
        category: "Patterns",
        explanation: "The pattern repeats every 3 shapes: triangle, square, circle"
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
    { 
        question: "What comes next: △, ▽, △, ▽, △, ?", 
        options: ["△", "▽", "▶", "◀"], 
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
        category: "Math Reasoning",
        explanation: "15% of 200 = 0.15 × 200 = 30"
    },

    // Additional Questions (61-100)
    { 
        question: "Which word is spelled correctly?", 
        options: ["Recieve", "Receive", "Recieive", "Receve"], 
        answer: 1,
        category: "Verbal Reasoning",
        explanation: "Receive follows 'i before e except after c' rule"
    },
    { 
        question: "What number is one-third of one-half of one-quarter of 240?", 
        options: ["5", "10", "15", "20"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "1/4 of 240 = 60, 1/2 of 60 = 30, 1/3 of 30 = 10"
    },
    { 
        question: "If Tuesday is the 4th, what is the date of the following Friday?", 
        options: ["6th", "7th", "8th", "9th"], 
        answer: 1,
        category: "Logic",
        explanation: "Tuesday 4th, Wednesday 5th, Thursday 6th, Friday 7th"
    },
    { 
        question: "Which shape has more sides: Pentagon or Hexagon?", 
        options: ["Pentagon", "Hexagon", "Both same", "Cannot determine"], 
        answer: 1,
        category: "Spatial Reasoning",
        explanation: "Pentagon has 5 sides, Hexagon has 6 sides"
    },
    { 
        question: "What is 9 squared minus 7 squared?", 
        options: ["25", "32", "36", "40"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "9² = 81, 7² = 49, 81-49 = 32"
    },
    { 
        question: "Complete the analogy: Doctor is to Hospital as Teacher is to _____", 
        options: ["School", "Office", "Classroom", "University"], 
        answer: 0,
        category: "Verbal Reasoning",
        explanation: "Doctor works in Hospital, Teacher works in School"
    },
    { 
        question: "What is the next number: 1, 3, 6, 10, 15, ?", 
        options: ["20", "21", "22", "23"], 
        answer: 1,
        category: "Patterns",
        explanation: "Triangular numbers: +2, +3, +4, +5, +6 → 15+6=21"
    },
    { 
        question: "If you have 4 apples and take away 3, how many do you have?", 
        options: ["1", "3", "4", "7"], 
        answer: 2,
        category: "Logic",
        explanation: "You took away 3 apples, but you still have 4 apples originally"
    },
    { 
        question: "Which is heavier: 1kg of feathers or 1kg of steel?", 
        options: ["Feathers", "Steel", "Same weight", "Cannot compare"], 
        answer: 2,
        category: "Logic",
        explanation: "1kg = 1kg regardless of material"
    },
    { 
        question: "What is the Roman numeral for 50?", 
        options: ["V", "X", "L", "C"], 
        answer: 2,
        category: "General Knowledge",
        explanation: "L = 50 in Roman numerals"
    },
    { 
        question: "Which is not a vowel?", 
        options: ["A", "E", "I", "R"], 
        answer: 3,
        category: "Verbal Reasoning",
        explanation: "R is a consonant"
    },
    { 
        question: "How many sides does an octagon have?", 
        options: ["6", "7", "8", "9"], 
        answer: 2,
        category: "Spatial Reasoning",
        explanation: "Octagon has 8 sides (octo means eight)"
    },
    { 
        question: "What is 0.75 as a fraction?", 
        options: ["1/4", "1/2", "3/4", "4/5"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "0.75 = 75/100 = 3/4"
    },
    { 
        question: "Which continent is the largest?", 
        options: ["Africa", "Asia", "Europe", "North America"], 
        answer: 1,
        category: "General Knowledge",
        explanation: "Asia is the largest continent by area"
    },
    { 
        question: "What is the capital of France?", 
        options: ["London", "Berlin", "Paris", "Madrid"], 
        answer: 2,
        category: "General Knowledge",
        explanation: "Paris is the capital of France"
    },
    { 
        question: "How many degrees in a right angle?", 
        options: ["45", "90", "180", "360"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "A right angle is exactly 90 degrees"
    },
    { 
        question: "Which planet is known as the Red Planet?", 
        options: ["Venus", "Mars", "Jupiter", "Saturn"], 
        answer: 1,
        category: "General Knowledge",
        explanation: "Mars appears red due to iron oxide on its surface"
    },
    { 
        question: "What is 12 × 12?", 
        options: ["121", "144", "169", "196"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "12 × 12 = 144"
    },
    { 
        question: "Which is the longest river in the world?", 
        options: ["Amazon", "Nile", "Yangtze", "Mississippi"], 
        answer: 1,
        category: "General Knowledge",
        explanation: "Nile River is approximately 6,650 km long"
    },
    { 
        question: "What is the chemical symbol for gold?", 
        options: ["Go", "Gd", "Au", "Ag"], 
        answer: 2,
        category: "General Knowledge",
        explanation: "Au comes from Latin 'aurum' meaning gold"
    },
    { 
        question: "How many players on a soccer team?", 
        options: ["9", "10", "11", "12"], 
        answer: 2,
        category: "General Knowledge",
        explanation: "11 players including goalkeeper"
    },
    { 
        question: "What is the square root of 169?", 
        options: ["11", "12", "13", "14"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "13 × 13 = 169"
    },
    { 
        question: "Which is the smallest prime number?", 
        options: ["0", "1", "2", "3"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "2 is the smallest prime number"
    },
    { 
        question: "What is the opposite of 'hot'?", 
        options: ["Warm", "Cold", "Boiling", "Freezing"], 
        answer: 1,
        category: "Verbal Reasoning",
        explanation: "Cold is the direct opposite of hot"
    },
    { 
        question: "How many years in a century?", 
        options: ["10", "50", "100", "1000"], 
        answer: 2,
        category: "General Knowledge",
        explanation: "A century is 100 years"
    },
    { 
        question: "What is 2 to the power of 5?", 
        options: ["16", "25", "32", "64"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "2⁵ = 2×2×2×2×2 = 32"
    },
    { 
        question: "Which is a mammal?", 
        options: ["Shark", "Dolphin", "Frog", "Snake"], 
        answer: 1,
        category: "General Knowledge",
        explanation: "Dolphins are mammals, not fish"
    },
    { 
        question: "What is 1000 minus 777?", 
        options: ["123", "223", "233", "333"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "1000 - 777 = 223"
    },
    { 
        question: "Which metal is liquid at room temperature?", 
        options: ["Iron", "Mercury", "Gold", "Silver"], 
        answer: 1,
        category: "General Knowledge",
        explanation: "Mercury is the only metal liquid at room temperature"
    },
    { 
        question: "What is ¾ of 100?", 
        options: ["25", "50", "75", "100"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "¾ × 100 = 75"
    },
    { 
        question: "How many continents are there?", 
        options: ["5", "6", "7", "8"], 
        answer: 2,
        category: "General Knowledge",
        explanation: "7 continents: Asia, Africa, Europe, NA, SA, Australia, Antarctica"
    },
    { 
        question: "What is 10% of 1000?", 
        options: ["1", "10", "100", "1000"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "10% of 1000 = 100"
    },
    { 
        question: "Which planet has rings?", 
        options: ["Earth", "Mars", "Jupiter", "Saturn"], 
        answer: 3,
        category: "General Knowledge",
        explanation: "Saturn has the most prominent ring system"
    },
    { 
        question: "What is 5 factorial (5!)?", 
        options: ["25", "60", "120", "720"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "5! = 5×4×3×2×1 = 120"
    },
    { 
        question: "How many colors in a rainbow?", 
        options: ["5", "6", "7", "8"], 
        answer: 2,
        category: "General Knowledge",
        explanation: "ROYGBIV: Red, Orange, Yellow, Green, Blue, Indigo, Violet"
    },
    { 
        question: "What is the cube of 3?", 
        options: ["9", "27", "81", "243"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "3³ = 3×3×3 = 27"
    },
    { 
        question: "Which gas do plants absorb?", 
        options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], 
        answer: 1,
        category: "General Knowledge",
        explanation: "Plants absorb CO2 for photosynthesis"
    },

    // Advanced Logic Questions (101-140)
    { 
        question: "If RED means STOP and GREEN means GO, what does YELLOW mean?", 
        options: ["Caution", "Slow", "Wait", "Prepare"], 
        answer: 0,
        category: "Logic",
        explanation: "Yellow traffic light means caution/warning"
    },
    { 
        question: "What is the next shape: △, □, ○, △, □, ?", 
        options: ["△", "□", "○", "◇"], 
        answer: 2,
        category: "Patterns",
        explanation: "Repeating pattern of three shapes"
    },
    { 
        question: "If 5 cats catch 5 mice in 5 minutes, how many cats to catch 100 mice in 100 minutes?", 
        options: ["5", "10", "20", "100"], 
        answer: 0,
        category: "Logic",
        explanation: "Each cat catches 1 mouse in 5 minutes, so 5 cats catch 100 mice in 100 minutes"
    },
    { 
        question: "Which number doesn't belong: 2, 4, 8, 16, 32, 64, 100?", 
        options: ["8", "32", "64", "100"], 
        answer: 3,
        category: "Patterns",
        explanation: "All others are powers of 2 (2¹ to 2⁶), 100 is not"
    },
    { 
        question: "Complete: 2, 3, 5, 7, 11, 13, ?", 
        options: ["15", "17", "19", "21"], 
        answer: 1,
        category: "Patterns",
        explanation: "Prime numbers in sequence: next is 17"
    },
    { 
        question: "If you write all numbers from 1 to 100, how many times do you write the digit 5?", 
        options: ["10", "11", "19", "20"], 
        answer: 3,
        category: "Logic",
        explanation: "5 appears in: 5, 15, 25, 35, 45, 50-59, 65, 75, 85, 95 = 20 times"
    },
    { 
        question: "What is the next letter: B, D, G, K, ?", 
        options: ["N", "O", "P", "Q"], 
        answer: 2,
        category: "Patterns",
        explanation: "+2, +3, +4, +5: B→D(+2), D→G(+3), G→K(+4), K→P(+5)"
    },
    { 
        question: "If 1=5, 2=10, 3=15, 4=20, then 5=?", 
        options: ["1", "5", "20", "25"], 
        answer: 0,
        category: "Logic",
        explanation: "If 1=5, then 5=1 (trick question)"
    },
    { 
        question: "What is missing: 1, 8, 27, 64, ?", 
        options: ["81", "100", "125", "216"], 
        answer: 2,
        category: "Patterns",
        explanation: "Cube numbers: 1³=1, 2³=8, 3³=27, 4³=64, 5³=125"
    },
    { 
        question: "Which word can be made from 'RATHE'?", 
        options: ["EARTH", "HEART", "THERE", "THREE"], 
        answer: 1,
        category: "Verbal Reasoning",
        explanation: "HEART can be made from RATHE letters"
    },
    { 
        question: "If all Zips are Zaps and some Zaps are Zops, then:", 
        options: ["All Zips are Zops", "Some Zips are Zops", "No Zips are Zops", "Cannot be determined"], 
        answer: 3,
        category: "Logic",
        explanation: "We don't know if Zips and Zops overlap"
    },
    { 
        question: "What number is 3 less than 5 times 7?", 
        options: ["28", "32", "35", "38"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "5×7=35, 35-3=32"
    },
    { 
        question: "Which is the odd one: 12, 25, 36, 49, 64?", 
        options: ["12", "25", "36", "49"], 
        answer: 0,
        category: "Patterns",
        explanation: "All others are perfect squares, 12 is not"
    },
    { 
        question: "Complete: 10, 20, 40, 80, 160, ?", 
        options: ["240", "280", "320", "360"], 
        answer: 2,
        category: "Patterns",
        explanation: "Each number doubles: 160×2=320"
    },
    { 
        question: "If 30% of a number is 45, what is the number?", 
        options: ["120", "135", "150", "165"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "0.3x = 45, x = 45/0.3 = 150"
    },
    { 
        question: "What comes next: ZA, YB, XC, WD, ?", 
        options: ["UE", "VE", "TE", "VF"], 
        answer: 1,
        category: "Patterns",
        explanation: "First letter goes backward, second goes forward"
    },
    { 
        question: "If 4 notebooks cost $12, how much for 10 notebooks?", 
        options: ["$24", "$30", "$36", "$48"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "Each notebook = $12/4 = $3, 10 notebooks = $30"
    },
    { 
        question: "Which pattern: AA, BB, CC, DD, ?", 
        options: ["DD", "EE", "EF", "FF"], 
        answer: 1,
        category: "Patterns",
        explanation: "Double letters in alphabetical order"
    },
    { 
        question: "What is the average of 10, 20, and 30?", 
        options: ["15", "20", "25", "30"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "(10+20+30)/3 = 60/3 = 20"
    },
    { 
        question: "If CIRCLE is to ROUND, SQUARE is to:", 
        options: ["FOUR", "ANGLE", "SIDE", "BOX"], 
        answer: 0,
        category: "Analogy",
        explanation: "Circle is round, square has four sides"
    },

    // Mathematical Reasoning (141-180)
    { 
        question: "What is 0.125 as a fraction?", 
        options: ["1/4", "1/6", "1/8", "1/10"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "0.125 = 125/1000 = 1/8"
    },
    { 
        question: "Simplify: (x + 3)(x - 3)", 
        options: ["x² - 9", "x² + 9", "x² - 6x + 9", "x² + 6x + 9"], 
        answer: 0,
        category: "Math Reasoning",
        explanation: "Difference of squares: (a+b)(a-b) = a² - b²"
    },
    { 
        question: "What is 3/4 of 1/2 of 80?", 
        options: ["20", "30", "40", "50"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "1/2 of 80 = 40, 3/4 of 40 = 30"
    },
    { 
        question: "Solve: 2x - 5 = 15", 
        options: ["x = 5", "x = 8", "x = 10", "x = 12"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "2x = 20, x = 10"
    },
    { 
        question: "What is 10% of 50% of 200?", 
        options: ["5", "10", "15", "20"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "50% of 200 = 100, 10% of 100 = 10"
    },
    { 
        question: "Which is largest: 2/3, 3/4, 4/5, 5/6?", 
        options: ["2/3", "3/4", "4/5", "5/6"], 
        answer: 3,
        category: "Math Reasoning",
        explanation: "5/6 = 0.833, 4/5 = 0.8, 3/4 = 0.75, 2/3 = 0.667"
    },
    { 
        question: "What is 7² + 8²?", 
        options: ["100", "113", "121", "144"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "49 + 64 = 113"
    },
    { 
        question: "If a=3, b=4, what is √(a² + b²)?", 
        options: ["5", "6", "7", "8"], 
        answer: 0,
        category: "Math Reasoning",
        explanation: "√(9+16) = √25 = 5 (3-4-5 triangle)"
    },
    { 
        question: "What is 15% of 300?", 
        options: ["30", "45", "60", "75"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "0.15 × 300 = 45"
    },
    { 
        question: "Simplify: 3/5 × 10/9", 
        options: ["2/3", "3/4", "4/5", "5/6"], 
        answer: 0,
        category: "Math Reasoning",
        explanation: "(3×10)/(5×9) = 30/45 = 2/3"
    },
    { 
        question: "What is 0.25 × 0.4?", 
        options: ["0.01", "0.1", "1", "10"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "0.25 × 0.4 = 0.1"
    },
    { 
        question: "If x=2, what is 3x² - 2x + 1?", 
        options: ["7", "8", "9", "10"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "3(4) - 4 + 1 = 12 - 4 + 1 = 9"
    },
    { 
        question: "What is the area of triangle with base 6, height 8?", 
        options: ["20", "24", "28", "32"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "Area = ½ × base × height = ½ × 6 × 8 = 24"
    },
    { 
        question: "What is 5! ÷ 3!?", 
        options: ["10", "15", "20", "25"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "120 ÷ 6 = 20"
    },
    { 
        question: "Convert 0.6 to fraction", 
        options: ["3/5", "2/3", "4/5", "5/6"], 
        answer: 0,
        category: "Math Reasoning",
        explanation: "0.6 = 6/10 = 3/5"
    },
    { 
        question: "What is 1/8 as a percentage?", 
        options: ["8%", "10%", "12.5%", "15%"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "1/8 = 0.125 = 12.5%"
    },
    { 
        question: "If radius=7, what is circle area? (π=22/7)", 
        options: ["154", "176", "196", "220"], 
        answer: 0,
        category: "Math Reasoning",
        explanation: "Area = πr² = (22/7)×7×7 = 154"
    },
    { 
        question: "What is 9 × 8 - 7 × 6?", 
        options: ["18", "24", "30", "36"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "72 - 42 = 30"
    },
    { 
        question: "Solve: 2(x+3) = 16", 
        options: ["x=3", "x=4", "x=5", "x=6"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "2x+6=16, 2x=10, x=5"
    },
    { 
        question: "What is √81 + √64?", 
        options: ["15", "16", "17", "18"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "9 + 8 = 17"
    },

    // Final Questions (181-200)
    { 
        question: "Which number is a multiple of 7?", 
        options: ["42", "45", "48", "52"], 
        answer: 0,
        category: "Math Reasoning",
        explanation: "42 ÷ 7 = 6 exactly"
    },
    { 
        question: "What is the next prime after 7?", 
        options: ["9", "10", "11", "12"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "11 is the next prime number after 7"
    },
    { 
        question: "If a clock shows 3:15, what is angle between hands?", 
        options: ["0°", "7.5°", "15°", "30°"], 
        answer: 1,
        category: "Logic",
        explanation: "At 3:15, minute hand at 3, hour hand moves 0.5°/min = 7.5°"
    },
    { 
        question: "What is 2³ + 3²?", 
        options: ["13", "15", "17", "19"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "8 + 9 = 17"
    },
    { 
        question: "Which is not a perfect square?", 
        options: ["25", "36", "48", "64"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "48 is not a perfect square"
    },
    { 
        question: "What is LCM of 6 and 8?", 
        options: ["12", "24", "36", "48"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "Least Common Multiple of 6 and 8 is 24"
    },
    { 
        question: "If 3x = 27, what is x?", 
        options: ["6", "7", "8", "9"], 
        answer: 3,
        category: "Math Reasoning",
        explanation: "3×9 = 27, so x=9"
    },
    { 
        question: "What is 1/2 + 1/3 + 1/6?", 
        options: ["1", "1.5", "2", "2.5"], 
        answer: 0,
        category: "Math Reasoning",
        explanation: "3/6 + 2/6 + 1/6 = 6/6 = 1"
    },
    { 
        question: "Which is smaller: 0.3 or 1/3?", 
        options: ["0.3", "1/3", "Equal", "Cannot compare"], 
        answer: 0,
        category: "Math Reasoning",
        explanation: "0.3 = 0.300, 1/3 = 0.333..., so 0.3 < 1/3"
    },
    { 
        question: "What is 10² - 8²?", 
        options: ["28", "32", "36", "40"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "100 - 64 = 36"
    },
    { 
        question: "If perimeter of square is 20, what is area?", 
        options: ["20", "25", "30", "36"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "Side = 20/4 = 5, area = 5² = 25"
    },
    { 
        question: "What is 7 × 8 + 4 × 5?", 
        options: ["66", "72", "76", "82"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "56 + 20 = 76"
    },
    { 
        question: "Which fraction equals 0.6?", 
        options: ["2/3", "3/4", "3/5", "4/5"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "3/5 = 0.6 exactly"
    },
    { 
        question: "What is 15% of 200?", 
        options: ["20", "30", "40", "50"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "0.15 × 200 = 30"
    },
    { 
        question: "If a=2, b=3, what is a² + b²?", 
        options: ["5", "10", "13", "15"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "4 + 9 = 13"
    },
    { 
        question: "What is 1/4 of 1/2 of 80?", 
        options: ["5", "10", "15", "20"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "1/2 of 80 = 40, 1/4 of 40 = 10"
    },
    { 
        question: "Simplify: (x+2)²", 
        options: ["x²+4", "x²+4x+4", "x²+2x+4", "x²+4x+2"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "(x+2)² = x² + 4x + 4"
    },
    { 
        question: "What is √144 - √121?", 
        options: ["1", "2", "3", "4"], 
        answer: 0,
        category: "Math Reasoning",
        explanation: "12 - 11 = 1"
    },
    { 
        question: "If 5x = 40, what is x?", 
        options: ["6", "7", "8", "9"], 
        answer: 2,
        category: "Math Reasoning",
        explanation: "5×8 = 40, so x=8"
    },
    { 
        question: "What is 3/8 as a decimal?", 
        options: ["0.325", "0.375", "0.425", "0.475"], 
        answer: 1,
        category: "Math Reasoning",
        explanation: "3/8 = 0.375"
    }

];

// ---------------- EVENTS ----------------
startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartGame);
soundToggle?.addEventListener('click', toggleSound);

// ---------------- GAME FLOW ----------------
function startGame() {
    playSound(clickSound);
    gameState.questions = [];
    gameState.usedQuestionIndices.clear();

    while (gameState.questions.length < 10) {
        const r = Math.floor(Math.random() * questionBank.length);
        if (!gameState.usedQuestionIndices.has(r)) {
            gameState.questions.push(questionBank[r]);
            gameState.usedQuestionIndices.add(r);
        }
    }

    gameState.currentQuestionIndex = 0;
    gameState.score = 0;
    gameState.selectedOptions.fill(null);

    startScreen.classList.remove('active-screen');
    quizScreen.classList.add('active-screen');

    loadQuestion();
}

function loadQuestion() {
    const q = gameState.questions[gameState.currentQuestionIndex];

    questionText.textContent = q.question;
    questionNumber.textContent = `Question ${gameState.currentQuestionIndex + 1}`;
    progressText.textContent = `Question ${gameState.currentQuestionIndex + 1} of 10`;
    scoreText.textContent = `Score: ${gameState.score}`;
    progressFill.style.width = `${((gameState.currentQuestionIndex + 1) / 10) * 100}%`;

    optionsContainer.innerHTML = '';
    const letters = ['A','B','C','D'];

    q.options.forEach((opt, i) => {
        const div = document.createElement('div');
        div.className = 'option';
        div.innerHTML = `
            <div class="option-letter">${letters[i]}</div>
            <div class="option-text">${opt}</div>
        `;
        div.onclick = () => selectOption(i);
        optionsContainer.appendChild(div);
    });

    startTimer(); // ✅ Timer restarts every question
}

function selectOption(i) {
    playSound(clickSound);
    document.querySelectorAll('.option').forEach(o=>o.classList.remove('selected'));
    document.querySelectorAll('.option')[i].classList.add('selected');
    gameState.selectedOptions[gameState.currentQuestionIndex] = i;
}

function nextQuestion() {
    playSound(clickSound);
    const q = gameState.questions[gameState.currentQuestionIndex];
    const sel = gameState.selectedOptions[gameState.currentQuestionIndex];

    if (sel !== null) {
        if (sel === q.answer) {
            gameState.score++;
            playSound(correctSound);
        } else playSound(wrongSound);
    }

    gameState.currentQuestionIndex++;

    if (gameState.currentQuestionIndex < 10) loadQuestion();
    else showResults();
}


function showResults() {
  clearInterval(timer);
  resultScreen.style.display = "block";
  quizScreen.style.display = "none";

  finalScore.innerText = score + "/10";

  let iqText = "";

  if (score <= 2) iqText = "IQ Range: Below 80";
  else if (score <= 4) iqText = "IQ Range: 80 – 90";
  else if (score <= 6) iqText = "IQ Range: 90 – 100";
  else if (score <= 8) iqText = "IQ Range: 100 – 115";
  else iqText = "IQ Range: 115+";

  document.getElementById("iqRange").innerText = iqText;
}

   
    if (iqRange) {
        iqRange.textContent = iqText;
    }
}


function restartGame() {
    playSound(clickSound);
    resultScreen.classList.remove('active-screen');
    startScreen.classList.add('active-screen');
}

// ---------------- TIMER FIX ----------------
function startTimer() {
    clearInterval(gameState.timerInterval);
    gameState.timer = 60;
    timerElement.textContent = gameState.timer;

    gameState.timerInterval = setInterval(() => {
        gameState.timer--;
        timerElement.textContent = gameState.timer;
        if (gameState.timer <= 0) {
            clearInterval(gameState.timerInterval);
            nextQuestion();
        }
    }, 1000);
}

// ---------------- SOUND ----------------
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    if (soundIcon) {
        soundIcon.className = gameState.soundEnabled ? 
            'fas fa-volume-up' : 'fas fa-volume-mute';
    }
}

function playSound(el) {
    if (gameState.soundEnabled && el) {
        el.currentTime = 0;
        el.play().catch(()=>{});
    }
}



