const printHeader = (title) => {
    console.log(`\n=========================================`);
    console.log(`🚀 ${title.toUpperCase()}`);
    console.log(`=========================================`);
};

printHeader("1. ES6 Concepts (Scope, Arrows, Destructuring)");

//let vs const (Block Scope)
console.log("Block Scope (let/const vs var):");
if (true) {
    var varVariable = "I am a var (function/global scoped)";
    let letVariable = "I am a let (block scoped)";
    const constVariable = "I am a const (block scoped & read-only)";
    
    console.log("Inside block: letVariable =", letVariable);
    console.log("Inside block: constVariable =", constVariable);
}
console.log("Outside block: varVariable =", varVariable); // Accessible
try {
    console.log(letVariable); // Will throw ReferenceError
} catch (e) {
    console.log("Outside block: letVariable is NOT accessible! Error:", e.message);
}

//Arrow Functions
console.log("\n Arrow Functions:");
// Regular Function
function regularAdd(a, b) {
    return a + b;
}
// Arrow Function with explicit return
const arrowAdd = (a, b) => {
    return a + b;
};
// Arrow Function with implicit return (no brackets, one-liner)
const implicitAdd = (a, b) => a + b;

console.log("Regular Add (5 + 3):", regularAdd(5, 3));
console.log("Arrow Add (5 + 3):", arrowAdd(5, 3));
console.log("Implicit Arrow Add (5 + 3):", implicitAdd(5, 3));

// Lexical 'this' demonstration
const person = {
    name: "Alex",
    hobbies: ["Coding", "Gaming", "Music"],
    printHobbiesRegular() {
        // 'this' inside regular function refers to global or undefined in strict mode unless bound
        console.log("Regular function context error simulation:");
        try {
            this.hobbies.forEach(function(hobby) {
                // Here, 'this.name' is undefined because regular function has its own 'this' context
                console.log(`${this.name} loves ${hobby}`);
            });
        } catch (e) {
            console.log("Error in regular function:", e.message);
        }
    },
    printHobbiesArrow() {
        // Arrow function inherits 'this' from lexical scope (person object)
        console.log("Arrow function lexical 'this':");
        this.hobbies.forEach(hobby => {
            console.log(`  - ${this.name} loves ${hobby}`);
        });
    }
};
person.printHobbiesArrow();

//Destructuring (Object and Array)
console.log("\n Destructuring:");
const user = {
    id: 101,
    username: "coder39",
    profile: {
        firstName: "Anamika",
        lastName: "Limbu",
        country: "Nepal"
    },
    roles: ["Admin", "Developer"]
};

// Object Destructuring with nested objects, renaming, and defaults
const { 
    username, 
    profile: { firstName, country }, 
    roles: [primaryRole, secondaryRole],
    status = "Active" // Default value
} = user;

console.log(`User: ${firstName} from ${country} (${username})`);
console.log(`Roles: Primary = ${primaryRole}, Secondary = ${secondaryRole}`);
console.log(`Status (Defaulted): ${status}`);

// Array Destructuring with rest operator
const coordinates = [27.7172, 85.3240, 1400]; // Lat, Long, Elevation
const [latitude, longitude, ...restInfo] = coordinates;
console.log(`Coordinates -> Lat: ${latitude}, Lng: ${longitude}, Additional Info:`, restInfo);

// Array Methods (map, filter, reduce)
printHeader("Array Methods (map, filter, reduce)");

const products = [
    { id: 1, name: "Mechanical Keyboard", price: 120, category: "Electronics", inStock: true },
    { id: 2, name: "Wireless Mouse", price: 50, category: "Electronics", inStock: false },
    { id: 3, name: "Ergonomic Chair", price: 350, category: "Furniture", inStock: true },
    { id: 4, name: "LED Monitor", price: 250, category: "Electronics", inStock: true },
    { id: 5, name: "Water Bottle", price: 25, category: "Accessories", inStock: true },
    { id: 6, name: "Desk Mat", price: 30, category: "Accessories", inStock: false }
];

console.log("Original Products List:\n", products.map(p => ` - ${p.name} ($${p.price})`).join("\n"));

//Map: Transform the array (e.g., get a list of product names, or apply a discount)
console.log("\n map(): Applying 10% discount on all items:");
const discountedProducts = products.map(product => ({
    ...product,
    price: product.price * 0.9 // 10% off
}));
console.log(discountedProducts.map(p => ` - ${p.name}: New Price = $${p.price.toFixed(2)}`).join("\n"));

//Filter: Filter items matching a condition (e.g., electronics in stock)
console.log("\n filter(): Filtering items that are in stock and Electronics:");
const availableElectronics = products.filter(product => product.category === "Electronics" && product.inStock);
console.log(availableElectronics.map(p => ` - ${p.name} ($${p.price})`).join("\n"));

//Reduce: Accumulate values (e.g., total cost of all in-stock products)
console.log("\n reduce(): Calculating total value of in-stock items:");
const totalInStockValue = products
    .filter(product => product.inStock)
    .reduce((accumulator, product) => {
        return accumulator + product.price;
    }, 0); // 0 is the initial value of accumulator
console.log(`Total Value of In-Stock items: $${totalInStockValue}`);

// Advanced Reduce: Group products by category
console.log("\n Advanced reduce(): Grouping items by category:");
const groupedByCategory = products.reduce((acc, product) => {
    const cat = product.category;
    if (!acc[cat]) {
        acc[cat] = [];
    }
    acc[cat].push(product.name);
    return acc;
}, {});
console.log(groupedByCategory);

//PROMISES & ASYNC/AWAIT

printHeader("3. Promises & Async/Await");

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
        console.log("[Network] Fetching questions from server...");
        
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
        console.log("[Async/Await] Starting execution...");
        
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
