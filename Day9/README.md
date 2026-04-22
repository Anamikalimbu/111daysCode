# map()
create a new array with the results of calling a provided function on every element in the calling array.

```javascript
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
```
# filter()
creates a new array with all elements that pass the test implemented by the provided function.

```javascript
const numbers = [1, 2, 3, 4, 5];
const even = numbers.filter(x => x % 2 === 0);
console.log(even); // [2, 4]
```
# reduce()
executes a reducer function (that you provide) on each element of the array, resulting in a single output value.

```javascript
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
console.log(sum); // 15
```
# forEach()
executes a provided function once for each array element.

```javascriptconst numbers = [1, 2, 3, 4, 5];
numbers.forEach(x => console.log(x));
// Output:
// 1
// 2
// 3
// 4
// 5
```
# find()
returns the value of the first element in the provided array that satisfies the provided testing function. If no values satisfy the testing function, undefined is returned.

```javascript
const numbers = [1, 2, 3, 4, 5];    
const found = numbers.find(x => x > 3);
console.log(found); // 4
```
