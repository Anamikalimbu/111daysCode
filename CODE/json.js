const express = require("express");

const app = express();

app.get("/profile", (req, res) => {

    res.json({
        name: "Anamika",
        skill: "MERN Stack",
        country: "Nepal"
    });
});

app.listen(3000);