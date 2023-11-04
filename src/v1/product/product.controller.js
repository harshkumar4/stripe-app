const stripe = require("../../configs/stripe.js");

const errorHandler = require("../../utils/errorHandler");

const addProduct = errorHandler(async (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const recurring = req.body.recurring;

  if (!name || !price) {
    res.status(406).json({ message: "Name and Price is required!" });
    return;
  }

  const product = await stripe.prices.create({
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

  res.status(201).json({ message: "Product Created!", product: product });
});
const getAllProducts = errorHandler(async (req, res, next) => {
  const products = await stripe.products.list();

  res.status(201).json({ message: "Products fetched!", products: products });
});

module.exports = { addProduct, getAllProducts };
