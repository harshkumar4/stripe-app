const stripe = require("../../configs/stripe.js");
const errorHandler = require("../../utils/errorHandler");

const Product = require("../product/product.model.js");
const Transaction = require("../transactions/transactions.model.js");
const User = require("./../user/user.model.js");

const webhook = errorHandler(async (req, res, next) => {
  const event = request.body;
  console.log(event);
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
});

const checkout = errorHandler(async (req, res, next) => {
  const userId = req.userId;
  const productId = req.body.productId;
  // let error;

  if (!productId) {
    res.status(406).json({ message: "Missing Product ID!" });
    return;
  }

  const resolves = await Promise.all([
    User.findById(userId),
    Product.findById(productId),
  ]);

  const user = resolves[0];
  const product = resolves[1];

  // const prices = await stripe.prices
  //   .list({
  //     product: productId.trim(),
  //   })
  //   .catch((val) => {
  //     error = val;
  //   });

  if (product == null) {
    return res
      .status(404)
      .json({ message: "No Product found for the provided Product ID!" });
  }

  // const priceId = prices.data[0].id;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: product.stripe_price_id,
        quantity: 1,
      },
    ],
    customer_email: user.email,
    mode: "payment",
    success_url: `https://www.youtube.com`,
    cancel_url: `https://web.whatsapp.com`,
  });

  Transaction.create({
    stripe_transaction_id: session.id,
    payment_status: session.payment_status,
    success_url: session.success_url,
    cancel_url: session.cancel_url,
    amount_total: session.amount_total,
    customer_email: session.customer_email,
    customer_id: userId,
  });

  res.status(200).json({ sessionUrl: session.url });
});

module.exports = { webhook, checkout };
