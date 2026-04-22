let total = 0;
const prices = [100, 200, 150];

prices.forEach(p => total += p);
console.log(total);

// create a new array with forEach manually
const nums = [1, 2, 3];
let result = [];

nums.forEach(n => result.push(n * 2));

console.log(result);
