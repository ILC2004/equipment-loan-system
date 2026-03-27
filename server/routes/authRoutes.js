const express = require("express");
const router = express.Router();

const {
  login,
  adminResetPassword,
  getAllUsers,
  changeMyPassword
} = require("../controllers/authController");

const {
  verifyToken,
  isAdmin
} = require("../middleware/authMiddleware");

router.post("/login", login);
router.get("/admin/users", verifyToken, isAdmin, getAllUsers);
router.post("/admin/reset-password", verifyToken, isAdmin, adminResetPassword);
router.post("/change-password", verifyToken, changeMyPassword);

module.exports = router;