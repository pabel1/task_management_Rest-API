const express = require("express");
const router = express.Router();
const {
  regiController,
  loginController,
  updateProfile,
  resetPassword,
  verifyOTPCode,
  recoverPassword,
} = require("../Controller/usersController");
const authVerification = require("../Middleware/authVerification");
// signup router
router.post("/signup", regiController);

// login router
router.post("/login", loginController);

// profile update

router.post("/profileupdate", authVerification, updateProfile);

// forget Password 
router.post("/sendotp", resetPassword);

// verify otp 
router.put("/verifyotp", verifyOTPCode);

// recover password by otp
router.post("/recoverpassword", recoverPassword);

module.exports = router;
