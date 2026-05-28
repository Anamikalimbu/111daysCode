// const express = require("express");

// const app = express();

// app.get("/", (req, res) => {
//     res.send("Server is running");
// });

// app.listen(3000, () => {
//     console.log("Server started on port 3000");
// });

const express = require("express");

const app = express();

app.use(express.json());

let users = [
    { id: 1, name: "Anamika" },
    { id: 2, name: "Smriti" }
];


// HOME ROUTE
app.get("/", (req, res) => {
    res.send("Welcome to Express API");
});


// GET ALL USERS
app.get("/users", (req, res) => {
    res.json(users);
});


// GET SINGLE USER
app.get("/users/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);
});


// POST NEW USER
app.post("/users", (req, res) => {

    const newUser = {
        id: users.length + 1,
        name: req.body.name
    };

    users.push(newUser);

    res.status(201).json({
        message: "User added successfully",
        user: newUser
    });
});


// DELETE USER
app.delete("/users/:id", (req, res) => {

    const id = parseInt(req.params.id);

    users = users.filter(user => user.id !== id);

    res.json({
        message: "User deleted successfully"
    });
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});