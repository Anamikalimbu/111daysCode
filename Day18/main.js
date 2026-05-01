// map()
const nums = [1,2,3,4,5];

const result = nums.map(n => n * 2);
console.log(result);

//filter()
const n = [1,2,3,4,5,6,7,8,9,10];
const even = n.filter(n => n % 2 === 0);
console.log(even);

//find()
const num = [3,6,7,8,9,12,15];
const found = num.find(n => n > 8);
console.log(found);

// reduce()
const numbers = [1,2,3,4,5];
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log(sum);

