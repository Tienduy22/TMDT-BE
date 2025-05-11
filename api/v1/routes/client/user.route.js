const express = require("express")
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const authenticateToken = require("../../../../middleware/auth.middleware");

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/profile/:id", controller.profile);

router.post("/refresh_token", controller.refreshToken)

router.post("/password/forgot", controller.forgotPassword)

router.post("/password/otp", controller.otpPassword)

router.post("/password/reset", controller.resetPassword) //sdas

module.exports = router;