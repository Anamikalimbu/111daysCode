const votes = ["yes", "no", "yes", "yes", "no"];

const count = votes.reduce((acc, v) => {
  acc[v] = (acc[v] || 0) + 1;
  return acc;
}, {});

console.log(count);

// Multiply all numbers
const nums = [2, 3, 4];
const product = nums.reduce((acc, n) => acc * n, 1);

console.log(product);

// Total price of items in cart
const cart = [
  { name: "Book", price: 100 },
  { name: "Pen", price: 50 },
  { name: "Notebook", price: 150 }
];
const totalPrice = cart.reduce((total, item) => total + item.price, 0);
console.log(totalPrice);

