const express = require("express");

const app = express();

app.get("/search", (req, res) => {

    const name = req.query.name;

    res.send(`Searching for ${name}`);
});

app.listen(3000);