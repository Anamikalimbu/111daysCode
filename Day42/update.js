const fs = require("fs");

// Step 1: read file
fs.readFile("./route/info.json", "utf8", (err, data) => {
  if (err) return;

  let jsonData = JSON.parse(data);

  // Step 2: update data
  jsonData.class = 11;

  // Step 3: write back
  fs.writeFile("./route/info.json", JSON.stringify(jsonData, null, 2), (err) => {
    if (!err) console.log("Updated successfully!");
  });   
});