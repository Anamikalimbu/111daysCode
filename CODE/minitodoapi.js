const express = require("express");

const app = express();

app.use(express.json());

let todos = [];


// GET TODOS
app.get("/todos", (req, res) => {
    res.json(todos);
});


// ADD TODO
app.post("/todos", (req, res) => {

    const todo = {
        id: todos.length + 1,
        task: req.body.task
    };

    todos.push(todo);

    res.json(todo);
});


// DELETE TODO
app.delete("/todos/:id", (req, res) => {

    const id = parseInt(req.params.id);

    todos = todos.filter(t => t.id !== id);

    res.json({
        message: "Todo deleted"
    });
});


app.listen(3000, () => {
    console.log("Todo API running");
});