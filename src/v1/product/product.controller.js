const stripe = require("../../configs/stripe.js");

const errorHandler = require("../../utils/errorHandler");

const Product = require("./product.model.js");

const addProduct = errorHandler(async (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const recurring = req.body.recurring;

  if (!name || !price) {
    res.status(406).json({ message: "Name and Price is required!" });
    return;
  }

  const stripeProduct = await stripe.prices.create({
    currency: "inr",
    unit_amount: price,
    recurring: recurring
      ? {
          interval: "month",
        }
      : undefined,
    product_data: {
      name: name.trim(),
    },
  });

  const product = await Product.create({
    name: name.trim(),
    price: price,
    recurring: recurring,
    interval: recurring ? "month" : "",
    stripe_product_id: stripeProduct.product,
    stripe_price_id: stripeProduct.id,
  });

  res.status(201).json({ message: "Product Created!", product: product });
});
const getAllProducts = errorHandler(async (req, res, next) => {
  // const products = await stripe.products.list();

  const products = await Product.find();

  res.status(201).json({ message: "Products fetched!", products: products });
});

module.exports = { addProduct, getAllProducts };
