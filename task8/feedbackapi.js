const express = require('express');
const app = express();

app.use(express.json()); // to read JSON body
const feedbackList = []
app.post("/feedback", (req, res) => {
    const { name, message } = req.body;

    if (!name || !message) {
        return res.status(400).json({
            status: "error",
            message: "name and message required"
        });
    }
    const newFeedback = { name, message };
    feedbackList.push(newFeedback);

    return res.json({
        status: "success",
        data: newFeedback
    });
});
app.get("/feedback", (req, res) => {
    res.json({
        status: "success",
        feedback: feedbackList
    });
});
app.listen(3000, () => {
    console.log("Feedback API running at http://localhost:3000");
});