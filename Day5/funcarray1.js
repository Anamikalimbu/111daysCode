function largestElement(arr) {
    return arr.reduce((largest, current) =>
        (current > largest ? current : largest), arr[0]);
}

let num1 = [10, 15, 38, 20, 13];
console.log(largestElement(num1));


// syntax function largestElement(arr) {
//     return Math.max(...arr);
// };

// Math.max() method returns the largest of zero or more numbers.
// The spread syntax (...) allows an iterable such as an array expression or string to be expanded in places where zero or more arguments (for function calls) or elements (for array literals) are expected, or an object expression to be expanded in places where zero or more key-value pairs (for object literals) are expected