// Convert to uppercase using map
const names = ["anamika", "numa"];
const upper = names.map(n => n.toUpperCase());

console.log(upper);

// Add "Rs." before each price using map
const prices = [100, 200, 300];
const formatted = prices.map(p => "Rs." + p);
console.log(formatted);
