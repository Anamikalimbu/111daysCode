function sum(value1, value2) {
  return value1 + value2;
}

export function square(value) {
  return value * value;
}

function greet() {
  return "Hello world";
}

// module.exports = { sum };

export { sum };
export default greet;