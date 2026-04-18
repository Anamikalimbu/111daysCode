// Creating an Empty Array
let a = [];
console.log(a);

// Creating an Array and Initializing with Values
let b = [10, 20, 30];
console.log(b);

// Creating and Initializing an array with values
let a = new Array(10, 20, 30);

console.log(a);

// Creating an Array and Initializing with Values
let a = ["HTML", "CSS", "JS"];

// Accessing Array Elements
console.log(a[0]);
console.log(a[1]);

// Creating an Array and Initializing with Values
let a = ["HTML", "CSS", "JS"];
console.log("Original Array: " + a);

// Removes and returns the last element
let lst = a.pop();
console.log("After Removing the last: " + a);

// Removes and returns the first element
let fst = a.shift();
console.log("After Removing the First: " + a);

// Removes 2 elements starting from index 1
a.splice(1, 2);
console.log("After Removing 2 elements starting from index 1: " + a);

// Array: List | index = 0 (First position)
const students = [
  "hari",
  "sita",
  "rohan",
  "ram",
  "sam",
  true,
  false,
  2031,
  -1561,
  2.32,
  {
    user: "admin",
  },
  [12, 12, 21, 12, 21, 32, "asdf", { room: "123" }],
];

console.log(students);
console.log(students[0]);
console.log(students[10].user);
console.log(students[11][2]);
console.log(students[-1]); // undefined

