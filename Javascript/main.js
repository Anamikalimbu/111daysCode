let marks = 75;

if (marks >= 80) {
  console.log("Distinction");
} else if (marks >= 60) {
  console.log("First Division");
} else {
  console.log("Pass");
}

// Additional JS examples

// 1. Array and Loop
const subjects = ["Math", "Science", "English"];
console.log("\nSubjects:");
for (let i = 0; i < subjects.length; i++) {
  console.log(`- ${subjects[i]}`);
}

// 2. Function
function calculateAverage(marksArray) {
  let total = 0;
  for (let mark of marksArray) {
    total += mark;
  }
  return total / marksArray.length;
}

const myMarks = [75, 82, 68];
console.log(`\nAverage marks: ${calculateAverage(myMarks)}`);