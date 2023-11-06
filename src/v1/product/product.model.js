const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stripe_product_id: {
      type: String,
      required: true,
    },
    stripe_price_id: {
      type: String,
      required: true,
    },
    recurring: {
      type: Boolean,
      default: false,
    },
    interval: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
