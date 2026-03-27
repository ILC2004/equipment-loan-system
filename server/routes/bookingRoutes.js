const express = require("express");
const router = express.Router();

const {
  createBooking,
  getBookings,
  getMyBookings,
  getApprovedBookingsByEquipment,
  approveBooking,
  rejectBooking,
  returnBooking,
  markCleaned
} = require("../controllers/bookingController");

const {
  verifyToken,
  isAdmin
} = require("../middleware/authMiddleware");

router.get("/", verifyToken, isAdmin, getBookings);
router.get("/my", verifyToken, getMyBookings);
router.get("/equipment/:equipmentId/unavailable", verifyToken, getApprovedBookingsByEquipment);

router.post("/", verifyToken, createBooking);
router.post("/approve", verifyToken, isAdmin, approveBooking);
router.post("/reject", verifyToken, isAdmin, rejectBooking);
router.post("/return", verifyToken, isAdmin, returnBooking);
router.post("/clean", verifyToken, isAdmin, markCleaned);

module.exports = router;