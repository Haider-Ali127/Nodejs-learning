const express = require("express");
const app = express();
app.use(express.json());
let todos = [];
let nextId = 1;
app.post("/todo", (req, res) => {
    const { title, description, status } = req.body;

    if (!title) {
        return res.status(400).json({ status: "error", message: "where is title" });
    }
    if (status !== "pending" && status !== "completed") {
        return res.status(400).json({ status: "error", message: "status is invalid" });
    }
    const newTodo = {
        id: nextId++,
        title,
        description: description || "",
        status: status || "pending"
    };
    todos.push(newTodo);
    res.status(201).json({
        status: "success",
        todo: newTodo
    });
});
app.get("/todo", (req, res) => {
    res.json({
        status: "success",
        todos
    });
});
app.get("/todo/:id", (req, res) => {
    const id = Number(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({ status: "error", message: "Todo not found" });
    }

    res.json({ status: "success", todo });
});
app.put("/todo/:id", (req, res) => {
    const id = Number(req.params.id);
    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({ status: "error", message: "your todo list was not found" });
    }
    if (req.body.status !== undefined) {
        if (req.body.status !== "pending" && req.body.status !== "completed") {
            return res.status(400).json({
                status: "error",
                message: "status is invalid"
            });
        }
        todo.status = req.body.status;
    }

    todo.title = req.body.title || todo.title;
    todo.description = req.body.description || todo.description;

    res.json({ status: "success", todo });
});
app.delete("/todo/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ status: "error", message: "list was not found" });
    }

    todos.splice(index, 1);

    res.json({ status: "success", message: "list deleted" });
});

app.listen(3000, () => {
    console.log("Todo API running at http://localhost:3000");
});
