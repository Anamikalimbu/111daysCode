const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

app.post("/save", (req, res) => {
  fs.writeFile("./route/info.json", JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      return res.send("Error saving data");
    }
    res.send("Data saved to JSON file");
  });
});

app.listen(3000, () => console.log("Server running"));