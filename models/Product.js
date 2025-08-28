const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number },
  sizes: { type: [String], required: true },
  image: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
