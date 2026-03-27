const express = require("express");
const router = express.Router();

const {
  getAllEquipment,
  addEquipment,
  updateEquipment
} = require("../controllers/equipmentController");

const {
  verifyToken,
  isAdmin
} = require("../middleware/authMiddleware");

router.get("/", verifyToken, getAllEquipment);
router.post("/", verifyToken, isAdmin, addEquipment);
router.put("/:id", verifyToken, isAdmin, updateEquipment);

module.exports = router;