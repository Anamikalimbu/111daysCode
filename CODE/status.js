const express = require("express");

const app = express();

app.get("/error", (req, res) => {

    res.status(404).json({
        message: "Page not found"
    });
});

app.listen(3000);