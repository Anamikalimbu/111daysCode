//Callback functions: function used as a parameter in another function
// Higher order functions: function that accepts another as parameter

// function test(hello){
//     hello();
// }

// test((=>{

// }))

import fs from "fs";
// fs.readFile("data.txt", "utf-8", (error, data) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(data);
//   }
// });

// Scenario: Read  file1 => Success => Read file2 => Success => Read file3 all
// Callback hell: when we have multiple nested callbacks, it becomes difficult to read and maintain the code. It is also known as "Pyramid of Doom" because of the way the code is structured. To avoid callback hell, we can use Promises or async/await syntax which provides a cleaner and more readable way to handle asynchronous operations.
fs.readFile("file1.txt", "utf-8", (error1, data1) => {
  if (error1) {
    console.log(error1);
  } else {
    fs.readFile("file2.txt", "utf-8", (error2, data2) => {
      if (error2) {
        console.log(error2);
      } else {
        fs.readFile("file3.txt", "utf-8", (error3, data3) => {
          if (error3) {
            console.log(error3);
          } else {
            console.log(data1);
            console.log(data2);
            console.log(data3);
          }
        });
      }
    });
  }
});
