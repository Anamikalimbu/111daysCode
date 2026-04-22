const students = [
  { name: "Anamika", age: 18 },
  { name: "Rita", age: 17 }
];

const student = students.find(s => s.name === "Rita");
console.log(student);

// Find user by ID
const users = [
  { id: 1, name: "Anamika" },
  { id: 2, name: "Rita" }
];

const user = users.find(u => u.id === 2);
console.log(user);

