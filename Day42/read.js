const fs = require("fs");

fs.readFile("./route/info.json", "utf8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  const jsonData = JSON.parse(data);
  console.log(jsonData);
});