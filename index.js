const fs= require("fs");

console.log("Start");

const name = "Anamika";

console.log(name);

fs.readFile("data.txt", "utf-8", (error, data) => {
    if (error) {
        console.log("Error reading file:", error);
        return;
    }
    console.log("File content:", data);
});
console.log("End");