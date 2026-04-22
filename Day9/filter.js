// Filter students older than 21
const students = [
  { name: 'Pema', age: 16 },
  { name: 'Anamika', age: 18 },
  { name: 'Arisya', age: 23 }
];
const filteredStudents = students.filter(student => student.age > 21);
console.log(filteredStudents);

// Filter even numbers
const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = numbers.filter(n => n % 2 === 0);
console.log(evenNumbers);

// Filter available products only
const products = [
  { name: "Pen", inStock: true },
  { name: "Book", inStock: false }
];

const available = products.filter(p => p.inStock);

console.log(available);
