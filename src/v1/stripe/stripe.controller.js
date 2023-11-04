const stripe = require("../../configs/stripe.js");
const errorHandler = require("../../utils/errorHandler");

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
  let error;

  if (!productId) {
    res.status(406).json({ message: "Missing Product ID!" });
    return;
  }

  const user = await User.findById(userId);

  const prices = await stripe.prices
    .list({
      product: productId.trim(),
    })
    .catch((val) => {
      error = val;
    });

  if (error === null || !prices || prices.data.length === 0) {
    return res.status(404).json({ message: "No prices found for the product" });
  }

  const priceId = prices.data[0].id;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: user.email,
    mode: "payment",
    success_url: `https://www.youtube.com`,
    cancel_url: `https://web.whatsapp.com`,
  });

  res.status(200).json({ sessionUrl: session.url });
});

module.exports = { webhook, checkout };
