const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Create product
router.post("/", async (req, res) => {
  try {
    const { name, originalPrice, discountedPrice, sizes, image } = req.body;

    if (!name || !originalPrice || !sizes || !image) {
      return res.status(400).json({ error: "Name, originalPrice, sizes, and image are required" });
    }

    const product = new Product({
      name,
      originalPrice: Number(originalPrice),
      discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
      sizes: sizes.split(","),
      image, // directly store Cloudinary URL
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Get all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Delete product
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const { name, originalPrice, discountedPrice, sizes, image } = req.body;

    const updated = {
      name,
      originalPrice: Number(originalPrice),
      discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
      sizes: sizes.split(","),
      image, // keep the URL
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updated, { new: true });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

module.exports = router;
