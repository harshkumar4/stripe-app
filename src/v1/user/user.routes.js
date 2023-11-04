const router = require("express").Router();

const isAuthenticated = require("../../utils/auth.middleware");

const controller = require("./user.controller");

router.get("/user", isAuthenticated, controller.getUser);
router.put("/user", controller.signupUser);
router.post("/user", controller.loginUser);

module.exports = router;
