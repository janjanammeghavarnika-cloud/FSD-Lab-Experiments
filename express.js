import express from "express";

const app = express();

const products = [];

// Middleware to read JSON data
app.use(express.json());


app.post("/products", (req, res) => {
    const newProduct = req.body;

    products.push(newProduct);

    res.status(200).json({
        message: "Product Created",
        data: newProduct
    });
});


app.get("/products", (req, res) => {
    res.status(200).json({
        message: "All products fetched successfully",
        data: products
    });
});

app.get("/products/:id", (req, res) => {
    const productId = parseInt(req.params.id);

    const product = products.find(
        prod => prod.id === productId
    );

    if (product) {
        res.status(200).json({
            message: "Product details fetched successfully",
            data: product
        });
    } else {
        res.status(404).json({
            message: "Product not found"
        });
    }
});

app.put("/products/:id", (req, res) => {
    const productId = parseInt(req.params.id);

    const updateData = req.body;

    const productIndex = products.findIndex(
        prod => prod.id === productId
    );

    if (productIndex !== -1) {
        products[productIndex] = {
            ...products[productIndex],
            ...updateData,
            id: productId
        };

        res.status(200).json({
            message: "Product updated successfully",
            data: products[productIndex]
        });
    } else {
        res.status(404).json({
            message: "Product not found"
        });
    }
});

app.delete("/products/:id", (req, res) => {
    const productId = parseInt(req.params.id);

    const productIndex = products.findIndex(
        prod => prod.id === productId
    );

    if (productIndex !== -1) {
        const deletedProduct = products.splice(
            productIndex,
            1
        );

        res.status(200).json({
            message: "Product deleted successfully",
            data: deletedProduct[0]
        });
    } else {
        res.status(404).json({
            message: "Product not found"
        });
    }
});

app.listen(5000, () => {
    console.log("Server is running at http://localhost:5000");
});