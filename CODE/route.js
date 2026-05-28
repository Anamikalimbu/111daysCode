const express = require("express");

const app = express();

app.get("/product/:id", (req, res) => {

    const id = req.params.id;

    res.send(`Product ID is ${id}`);
});

app.listen(3000);