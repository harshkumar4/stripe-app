const Transaction = require("./transactions.model.js");

const errorHandler = require("../../utils/errorHandler");

const allUserTransactions = errorHandler(async (req, res, next) => {
  const userId = req.userId;

  // const user = await User.findById(userId);

  // const sessions = await stripe.checkout.sessions.list({
  //   customer_details: {
  //     email: user.email,
  //   },
  // });

  const userTransactions = await Transaction.find({ customer_id: userId });

  res.status(200).json({
    message: "User Transactions fetched!",
    transactions: userTransactions,
  });
});

const allTransactions = errorHandler(async (req, res, next) => {
  const transactions = await Transaction.find();

  res.status(200).json({
    message: "Transactions fetched!",
    transactions: transactions,
  });
});

module.exports = { allUserTransactions, allTransactions };
