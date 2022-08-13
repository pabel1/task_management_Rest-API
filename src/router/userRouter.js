const express = require("express");
const router = express.Router();
const {
  regiController,
  loginController,
  updateProfile,
} = require("../Controller/usersController");
const authVerification = require("../Middleware/authVerification");
// signup router
router.post("/signup", regiController);

// login router
router.post("/login", loginController);

// profile update

router.post("/profileupdate", authVerification, updateProfile);

module.exports = router;
