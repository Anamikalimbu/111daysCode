// const fs = require("fs");
// const { sum } = require("./utils.js");

import fs from "fs";
import greet, { sum as mySum, square } from "./utils.js";

console.log("Start");

const name = "Ram";

console.log(name);

fs.readFile("data.txt", "utf-8", (error, data) => {
  if (error) {
    console.log(error);
    return;
  }

  console.log(data);
});

const result = mySum(23, 34);
console.log(result);

console.log(greet());

console.log(square(5))

console.log("End");