const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const PORT = 3000;
mongoose
    .connect("mongodb+srv://myUser:myPassword@cluster0.abcde.mongodb.net/myDatabase")
    .then(() => console.log("MongoDB Connected"))
    .catch(() => console.log("Connection Error"));
const itemSchema = new mongoose.Schema({
    title: String,
    price: Number,
    category: String,
    available: {
        type: Boolean,
        default: true,
    },
});

const Item = mongoose.model("Item", itemSchema);
app.get("/", (req, res) => {
    res.send("API is running");
});
app.post("/items", async (req, res) => {
    const item = new Item(req.body);
    const savedItem = await item.save();
    res.json(savedItem);
});
app.get("/items", async (req, res) => {
    const items = await Item.find();
    res.json(items);
});
app.get("/items/:id", async (req, res) => {
    const item = await Item.findById(req.params.id);
    res.json(item);
});
app.put("/items/:id", async (req, res) => {
    const updatedItem = await Item.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedItem);
});
app.delete("/items/:id", async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
