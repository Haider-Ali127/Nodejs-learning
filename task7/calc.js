const express = require('express');
const app = express();

app.get('/calc', (req, res) => {
    const { num1, num2, op } = req.query;

    const a = Number(num1);
    const b = Number(num2);

    if (!num1 && !num2 && !op)
        return res.json({ error: "Operation missing" });

    let result;
    if (op === "add") result = a + b;
    else if (op === "sub") result = a - b;
    else if (op === "mul") result = a * b;
    else if (op === "div") {
        if (b === 0)
            return res.json({ error: "Cannot divide by zero" });
        result = a / b;
    } else {
        return res.json({ error: "Invalid operation" });
    }
    res.json({ result });
});
app.listen(3000, () => console.log("Server running on 3000"));