const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    stripe_transaction_id: {
      type: String,
      required: true,
    },
    amount_total: {
      type: Number,
      required: true,
    },
    cancel_url: {
      type: String,
    },
    customer_id: {
      type: String,
      required: true,
    },
    customer_email: {
      type: String,
      required: true,
    },
    payment_status: {
      type: String,
    },
    success_url: {
      type: String,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
