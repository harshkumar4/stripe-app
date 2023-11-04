const express = require("express");

const controller = require("./stripe.controller");

const router = express.Router();

router.post("/webhook", controller.webhook);
router.post("/create-checkout", controller.checkout);

module.exports = router;
