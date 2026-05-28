const express = require("express");

const app = express();


// MIDDLEWARE
app.use((req, res, next) => {

    console.log("Request received");

    next();
});


app.get("/", (req, res) => {
    res.send("Home page");
});


app.listen(3000);