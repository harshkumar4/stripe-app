const router = require("express").Router();

const controller = require("./transactions.controller");

router.get("/transactions", controller.allUserTransactions);

module.exports = router;
