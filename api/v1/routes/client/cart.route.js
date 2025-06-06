const express = require("express")
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");


router.get("/:userId", controller.cart);

router.patch("/update/:userId", controller.update);

router.delete("/delete/:userId", controller.delete);

module.exports = router;