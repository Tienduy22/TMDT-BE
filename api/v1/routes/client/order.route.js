const express = require("express")
const router = express.Router();
const controller = require("../../controllers/client/order.controller");


router.get("/", controller.getOrder)

router.post("/paypal-transaction-complete", controller.paypalComplete);

router.get("/:userId", controller.getOrderOfUser)

router.get("/detail/:order_id", controller.getOrderDetail)

router.patch("/edit/:order_id", controller.getOrderEdit)

router.delete("/delete/:order_id", controller.getOrderDelete)

module.exports = router;