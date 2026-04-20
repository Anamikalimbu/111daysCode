import fs from "fs";
const fetchData = new Promise((resolve, reject) => {
    fs.readFile("./file1.txt", "utf-8", (error, data) => {
  if (error) {
    reject(error);
 }
    else {
      resolve(data);
    }
});
});

fetchData.then((data) => {
    console.log(data);
});

// async function myfetchData() {
//     const data = await fetchData();
//     console.log(data);
// }
// myfetchData();