const stripe = require("../../configs/stripe.js");

const User = require("./../user/user.model.js");
const errorHandler = require("../../utils/errorHandler");

const allUserTransactions = errorHandler(async (req, res, next) => {
  const userId = req.userId;

  const user = await User.findById(userId);

  const sessions = await stripe.checkout.sessions.list({
    customer_details: {
      email: user.email,
    },
  });

  res
    .status(200)
    .json({ message: "User Sessions fetched!", sessions: sessions });
});

module.exports = { allUserTransactions };
