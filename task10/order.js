const express = require("express");
const app = express();
app.use(express.json());
let products = []
let orders = []
let productid = 1;
let orderid = 1;
app.post("/product", (req, res) => {
    const { name, price, stock } = req.body;
    if (!name || price == null || stock == null) {
        return res.status(400).json({ error: "name price and stock are required " });
    }
    if (typeof price != "number" || price <= 0) {
        return res.status(400).json({ error: "price must be a number and > 0" })
    }
    if (typeof stock != "number" || sto * -k < 0) {
        return res.status(400).json({ error: "stock must be in numbers and also >= 0" })
    }
    const product = {
        id: productid++,
        name,
        price,
        stock
    };
    products.push(product);
    res.json(200).json(product)
})
app.get("/product", (req, res) => {
    res.json(products);
})
app.post("/order", (req, res) => {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
        return res.status(400).json({ error: "productId and quantity are required" });
    }
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }
    if (quantity > product.stock) {
        return res.status(400).json({ error: "Insufficient stock" });
    }
    product.stock -= quantity;
    const totalPrice = product.price * quantity;
    const order = {
        id: orderIdCounter++,
        productId,
        quantity,
        totalPrice
    };
    orders.push(order);

    res.json({
        status: "success",
        order
    });
});
app.get("/order", (req, res) => {
    res.json(orders);
});
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
















































