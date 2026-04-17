// File System Models 
/**
 * fs: file system module of node js, used for file operations 
 * like create, read, write, delete, update etc.
 * Types of file system models:
 * 1. Synchronous file system model: Blocking operations
 *    In this model, the program execution is blocked until the file operation is completed. 
 *    It is simple to use but can lead to performance issues if the file operation takes a long time.
 * 2. Asynchronous file system model: Non-blocking operations
 *    In this model, the program execution is not blocked and can continue while the file operation is being performed. 
 *    It uses callbacks or promises to handle the completion of the file operation, allowing for better performance and responsiveness.
 */
import fs from "fs";

// Synchronous file system model

//Read file 
// const result = fs.readFileSync("data.txt", "utf-8");
// console.log("File read successfully!");
// console.log(result);

// Write file
//const writeResult = fs.writeFileSync("data.txt", "Byeeeee");
//fs.writeFileSync("data.json", JSON.stringify({hello: "World"}))
// console.log("File written successfully!");
// console.log(writeResult);

// Update file
// const updateResult = fs.appendFileSync("data.txt", "\nI am learning node js");
// console.log("File updated successfully!");
// console.log(updateResult);

// Delete file
// const deleteResult = fs.unlinkSync("data.txt");
// console.log("File deleted successfully!");
// console.log(deleteResult);
// fs.rmSync("data.txt");
// fs.rmdirSync for folder delete
// fs.mkdirSync for folder to create



/**
 * 2. Asynchronous method
 * 
 */

// Read file
console.log("File before read");
fs.readFile("data.txt", "utf-8", (error, data) => {
  if (error) {
    console.log(error);
  } else{
    console.log(data)
  }
});
console.log("File after read");

// Write file
fs.writeFile("data.json", JSON.stringify({Name: "World"})  , (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("File written successfully!");
  }
});

// Update file
fs.appendFile("data.json", JSON.stringify({Age: "18"})  , (error) => {
  if (error) {
    console.log(error);
    } else {
    console.log("File updated successfully!");
  }
});

// Delete file
// fs.unlink("data.txt", (error) => {
//   if (error) {
//     console.log(error);
//     } else {
//     console.log("File deleted successfully!");
//   }
// });

