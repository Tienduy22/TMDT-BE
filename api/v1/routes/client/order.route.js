const express = require("express")
const router = express.Router();
const controller = require("../../controllers/client/order.controller");
const authenticateToken = require("../../../../middleware/auth.middleware");

router.post("/paypal-transaction-complete", controller.paypalComplete);

module.exports = router;