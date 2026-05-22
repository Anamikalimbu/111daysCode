const printHeader = (title) => {
    console.log(`\n=========================================`);
    console.log(`🚀 ${title.toUpperCase()}`);
    console.log(`=========================================`);
};

printHeader("Promises & Async/Await");

// Simulating a mock database fetch of quiz questions
const mockQuizDatabase = [
    {
        id: 1,
        question: "Which of the following is NOT a JavaScript data type?",
        options: ["String", "Boolean", "Float", "Undefined"],
        answer: "Float"
    },
    {
        id: 2,
        question: "What is the output of: console.log(typeof [])?",
        options: ["array", "object", "null", "undefined"],
        answer: "object"
    },
    {
        id: 3,
        question: "Which ES6 feature allows us to extract values from arrays or objects easily?",
        options: ["Spreading", "Destructuring", "Interpolation", "Async/Await"],
        answer: "Destructuring"
    }
];

// A. Creating a Promise that simulates a network request
const fetchQuizQuestions = (shouldSucceed = true) => {
    return new Promise((resolve, reject) => {
        console.log(" [Network] Fetching questions from server...");
        
        setTimeout(() => {
            if (shouldSucceed) {
                resolve(mockQuizDatabase);
            } else {
                reject(new Error("Network Timeout: Failed to connect to server."));
            }
        }, 1500); // 1.5 second delay
    });
};

// B. Consuming Promise via async/await
async function runQuizSystem() {
    try {
        console.log(" [Async/Await] Starting execution...");
        
        // Fetch questions successfully
        const questions = await fetchQuizQuestions(true);
        console.log(" Success! Received questions:", questions.length, "items loaded.");
        console.log(questions.map(q => `   Q${q.id}: ${q.question}`).join("\n"));
        
        // Simulating error handling
        console.log("\n Testing error state handling...");
        const failedFetch = await fetchQuizQuestions(false);
        console.log(failedFetch); // This line won't run due to error throwing
        
    } catch (error) {
        console.log(" Caught error in catch block:", error.message);
    } finally {
        console.log("\n Quiz System execution completed.");
    }
}

// Execute the async function
runQuizSystem();
