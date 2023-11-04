const express = require("express");

const controller = require("./product.controller");

const router = express.Router();

router.put("/product", controller.addProduct);
router.get("/products", controller.getAllProducts);

module.exports = router;
