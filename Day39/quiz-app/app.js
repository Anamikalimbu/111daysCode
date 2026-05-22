// State Variables
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = []; // Array to store objects: { questionId, selectedAnswer, correctAnswer, isCorrect }

// DOM Elements
const startScreen = document.getElementById('start-screen');
const loadingScreen = document.getElementById('loading-screen');
const errorScreen = document.getElementById('error-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');

const startBtn = document.getElementById('start-btn');
const retryBtn = document.getElementById('retry-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionCounter = document.getElementById('question-counter');
const scoreIndicator = document.getElementById('score-indicator');
const progressBar = document.getElementById('progress-bar');
const errorMessage = document.getElementById('error-message');

// Results elements
const circleProgress = document.getElementById('circle-progress');
const scorePercent = document.getElementById('score-percent');
const scoreFraction = document.getElementById('score-fraction');
const resultMessageHeading = document.getElementById('result-message-heading');
const resultMessageBody = document.getElementById('result-message-body');
const statCorrect = document.getElementById('stat-correct');
const statIncorrect = document.getElementById('stat-incorrect');
const statAccuracy = document.getElementById('stat-accuracy');

// Screen Transition Helper
const showScreen = (activeScreen) => {
    const screens = [startScreen, loadingScreen, errorScreen, quizScreen, resultsScreen];
    screens.forEach(screen => {
        if (screen === activeScreen) {
            screen.classList.remove('hidden');
            screen.classList.add('active');
        } else {
            screen.classList.remove('active');
            screen.classList.add('hidden');
        }
    });
};

// 1. Fetching questions using async/await and handling states
const fetchQuestions = async () => {
    showScreen(loadingScreen);
    
    // Simulate a network delay of 1200ms to show off the micro-animations & loading screen
    await new Promise(resolve => setTimeout(resolve, 1200));

    try {
        const response = await fetch('questions.json');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch quiz database: Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Invalid quiz data format or empty questions list.");
        }
        
        quizQuestions = data;
        startQuizPlay();
    } catch (error) {
        console.error("Quiz initialization failed:", error);
        errorMessage.textContent = error.message || "An unexpected error occurred.";
        showScreen(errorScreen);
    }
};

// Start the Quiz after data is fetched
const startQuizPlay = () => {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    scoreIndicator.textContent = `Score: ${score}`;
    showScreen(quizScreen);
    loadQuestion();
};

// Load and render a single question
const loadQuestion = () => {
    // Disable Next Button at start of each question
    nextBtn.disabled = true;
    nextBtn.classList.add('disabled');

    // Get current question using destructuring
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const { question, options } = currentQuestion;

    // Render Question Text
    questionText.textContent = question;

    // Render Progress indicators
    const totalQuestions = quizQuestions.length;
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    
    const progressPercent = ((currentQuestionIndex) / totalQuestions) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Render Options using Array.prototype.map()
    // Labels array for options (A, B, C, D)
    const optionLabels = ['A', 'B', 'C', 'D'];
    
    optionsContainer.innerHTML = options.map((option, index) => {
        const label = optionLabels[index] || '';
        return `
            <button class="option-btn" data-option="${option.replace(/"/g, '&quot;')}">
                <span class="option-text">${option}</span>
                <span class="option-badge">${label}</span>
            </button>
        `;
    }).join('');

    // Add event listeners to the newly rendered options
    const optionButtons = optionsContainer.querySelectorAll('.option-btn');
    optionButtons.forEach(button => {
        button.addEventListener('click', (e) => handleOptionClick(e, button, optionButtons));
    });
};

// Handle selection click
const handleOptionClick = (event, clickedBtn, allButtons) => {
    // Guard against clicks after choice is locked
    if (clickedBtn.classList.contains('locked')) return;

    const selectedOption = clickedBtn.getAttribute('data-option');
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const { answer: correctAnswer, id: questionId } = currentQuestion;

    const isCorrect = selectedOption === correctAnswer;

    // Highlight selected, correct and incorrect
    allButtons.forEach(btn => {
        btn.classList.add('locked'); // Prevent any further clicks
        const optionVal = btn.getAttribute('data-option');
        
        if (optionVal === correctAnswer) {
            btn.classList.add('correct');
            btn.querySelector('.option-badge').innerHTML = '<i class="fa-solid fa-check"></i>';
        } else if (optionVal === selectedOption && !isCorrect) {
            btn.classList.add('incorrect');
            btn.querySelector('.option-badge').innerHTML = '<i class="fa-solid fa-xmark"></i>';
        }
    });

    // Update state
    if (isCorrect) {
        score++;
        scoreIndicator.textContent = `Score: ${score}`;
    }

    userAnswers.push({
        questionId,
        selectedAnswer: selectedOption,
        correctAnswer,
        isCorrect
    });

    // Enable Next Button
    nextBtn.disabled = false;
    nextBtn.classList.remove('disabled');
    
    // Change button text to Finish on the last question
    if (currentQuestionIndex === quizQuestions.length - 1) {
        nextBtn.querySelector('span').textContent = "Finish Quiz";
        nextBtn.querySelector('i').className = "fa-solid fa-flag-checkered";
    } else {
        nextBtn.querySelector('span').textContent = "Next Question";
        nextBtn.querySelector('i').className = "fa-solid fa-arrow-right";
    }
};

// Handle Next Button Action
const handleNextClick = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
    } else {
        progressBar.style.width = `100%`;
        showResults();
    }
};

// Calculate and render final results
const showResults = () => {
    showScreen(resultsScreen);

    const totalQuestions = quizQuestions.length;
    
    // Using array filter method to calculate final statistics
    const correctCount = userAnswers.filter(ans => ans.isCorrect).length;
    const incorrectCount = totalQuestions - correctCount;
    const percentScore = Math.round((correctCount / totalQuestions) * 100);

    // Update text content
    scoreFraction.textContent = `${correctCount}/${totalQuestions}`;
    statCorrect.textContent = correctCount;
    statIncorrect.textContent = incorrectCount;
    statAccuracy.textContent = `${percentScore}%`;

    // Animate radial score percentage
    let currentPercentVal = 0;
    const countSpeed = Math.max(10, Math.round(1500 / percentScore)); // Total animation time ~1.5s
    
    const countInterval = setInterval(() => {
        if (currentPercentVal >= percentScore || percentScore === 0) {
            scorePercent.textContent = `${percentScore}%`;
            clearInterval(countInterval);
        } else {
            currentPercentVal++;
            scorePercent.textContent = `${currentPercentVal}%`;
        }
    }, countSpeed);

    // Update SVG stroke-dashoffset based on percentScore
    // Circle circumference is 2 * PI * R where R=40 -> 251.2
    const circumference = 251.2;
    const strokeOffset = circumference - (circumference * percentScore) / 100;
    
    // Slight delay to allow transition after screen load
    setTimeout(() => {
        circleProgress.style.strokeDashoffset = strokeOffset;
    }, 150);

    // Evaluate message based on performance
    let messageHeading = "";
    let messageBody = "";

    if (percentScore === 100) {
        messageHeading = "JS Guru Status!";
        messageBody = "Flawless! You've perfectly mastered the core JavaScript, ES6, and asynchronous concepts.";
    } else if (percentScore >= 80) {
        messageHeading = "Exceptional Job!";
        messageBody = "Excellent grasp of JavaScript fundamentals. Just a tiny step away from absolute mastery.";
    } else if (percentScore >= 50) {
        messageHeading = "Good Progress!";
        messageBody = "You have a solid foundation, but there is still room for improvement in some areas. Keep practicing!";
    } else {
        messageHeading = " Keep Learning!";
        messageBody = "A great opportunity to review Promises, closures, and scoping. Re-read the practice sheet and try again!";
    }

    resultMessageHeading.textContent = messageHeading;
    resultMessageBody.textContent = messageBody;
};

// Event Listeners Setup
startBtn.addEventListener('click', fetchQuestions);
retryBtn.addEventListener('click', fetchQuestions);
nextBtn.addEventListener('click', handleNextClick);
restartBtn.addEventListener('click', () => {
    showScreen(startScreen);
});
