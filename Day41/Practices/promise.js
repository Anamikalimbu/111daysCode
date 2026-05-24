// Promise: A Promise is an object that represents the eventual completion (or failure) of an asynchronous operation and its resulting value. It allows you to write asynchronous code in a more synchronous and readable manner.

// Promise: Async programming, promise is a future value

// pending -> fulfilled (resolved) , rejected 
// Promise has three states: pending, fulfilled, and rejected. When a promise is created, it is in the pending state. It can transition to either the fulfilled state (when the asynchronous operation is successful) or the rejected state (when the asynchronous operation fails). Promises provide methods like .then() and .catch() to handle the resolved value or any errors that may occur during the asynchronous operation.

// Example of using Promises to handle asynchronous operations:
import fs from "fs/promises";

fs.readFile("../data.txt", "utf-8")
// The .then() method is used to specify a callback function that will be executed when the promise is fulfilled (resolved). It allows you to handle the resolved value of the promise and perform further operations based on that value.
.then((data) => {
  console.log(data);
})
// The .catch() method is used to handle any errors that may occur during the execution of a promise. It allows you to specify a callback function that will be called if the promise is rejected, providing an opportunity to handle the error gracefully.
.catch((error) => {
  console.log(error);
})
// The .finally() method is used to specify a promises function that will be executed regardless of whether the promise is fulfilled or rejected. It is often used for cleanup operations or to perform actions that should happen after the promise has settled, regardless of the outcome.
.finally(() => {
  console.log("This will always be executed");
});


fs.readFile("file1.txt", "utf-8")
  .then((data1) => {
    return fs.readFile("file2.txt", "utf-8")
  })
    .then((data2) => {
        return fs.readFile("file3.txt", "utf-8")
    })
    .then((data3) => {
        console.log(data1);
        console.log(data2);
        console.log(data3);
    })
    .catch((error) => {
      console.log(error);
    });