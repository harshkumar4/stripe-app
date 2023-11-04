const express = require("express");

/// Middlewares
const isAuthenticated = require("../utils/auth.middleware");

/// Modules
const userRoutes = require("./user/user.routes");
const productRoutes = require("./product/product.routes");
const stripeRoutes = require("./stripe/stripe.routes");
const transactionsRoutes = require("./transactions/transactions.routes");

const router = express.Router();

router.use("/v1", userRoutes);
router.use("/v1", productRoutes);
router.use("/v1", isAuthenticated, stripeRoutes);
router.use("/v1", isAuthenticated, transactionsRoutes);

module.exports = router;
