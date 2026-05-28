const express = require("express");

const app = express();


// ADDITION
app.get("/add/:num1/:num2", (req, res) => {

    const num1 = Number(req.params.num1);
    const num2 = Number(req.params.num2);

    const result = num1 + num2;

    res.json({
        answer: result
    });
});


// SUBTRACTION
app.get("/subtract/:num1/:num2", (req, res) => {

    const result =
        Number(req.params.num1) -
        Number(req.params.num2);

    res.json({
        answer: result
    });
});


app.listen(3000, () => {
    console.log("Calculator API running");
});