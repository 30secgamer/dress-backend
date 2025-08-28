const express = require("express");
const Product = require("../models/Product");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const router = express.Router();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "dress-products",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});
const upload = multer({ storage });

// Create product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, originalPrice, discountedPrice, sizes } = req.body;

    if (!name || !originalPrice || !sizes) {
      return res.status(400).json({ error: "Name, originalPrice, and sizes are required" });
    }

    const product = new Product({
      name,
      originalPrice: Number(originalPrice),
      discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
      sizes: sizes.split(","),
      image: req.file ? req.file.path : undefined,
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
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, originalPrice, discountedPrice, sizes } = req.body;

    const updated = {
      name,
      originalPrice: Number(originalPrice),
      discountedPrice: discountedPrice ? Number(discountedPrice) : undefined,
      sizes: sizes.split(","),
    };

    if (req.file) updated.image = req.file.path;

    const product = await Product.findByIdAndUpdate(req.params.id, updated, { new: true });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

module.exports = router;
