const printHeader = (title) => {
    console.log(`\n=========================================`);
    console.log(`🚀 ${title.toUpperCase()}`);
    console.log(`=========================================`);
};

printHeader("1. ES6 Concepts (Scope, Arrows, Destructuring)");

// let vs const (Block Scope)
console.log(" Block Scope (let/const vs var):");
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

// Arrow Functions
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

// C. Destructuring (Object and Array)
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
