const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  userInfo,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/userMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/account", protect, userInfo);

module.exports = router;
