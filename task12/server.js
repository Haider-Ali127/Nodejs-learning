const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose
    .connect("mongodb://127.0.0.1:27017")
    .then(() => console.log("DB connected"))
    .catch(() => console.log("DB error"));

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);

app.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || name.length < 3)
        return res.status(400).json({ error: "Invalid name" });

    if (!password || password.length < 6)
        return res.status(400).json({ error: "Invalid password" });

    const emailExists = await User.findOne({ email });
    if (emailExists)
        return res.status(400).json({ error: "Email already registered" });

    await User.create({ name, email, password, role });
    res.status(201).json({ message: "User created" });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const foundUser = await User.findOne({ email });
    if (!foundUser)
        return res.status(404).json({ error: "Account not found" });

    if (foundUser.isActive === false)
        return res.status(403).json({ error: "Account blocked" });

    if (foundUser.password !== password)
        return res.status(401).json({ error: "Wrong credentials" });

    res.json({
        message: "Login successful",
        user: {
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role
        }
    });
});

app.get("/users", async (_, res) => {
    const allUsers = await User.find({}, { password: 0 });
    res.json(allUsers);
});

app.put("/users/:id/toggle", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user)
        return res.status(404).json({ error: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json(user);
});

app.delete("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user)
        return res.status(404).json({ error: "User not found" });

    if (user.role === "admin")
        return res.status(403).json({ error: "Admin deletion not allowed" });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed" });
});

app.listen(5000, () => console.log("Server started on port 5000"));
