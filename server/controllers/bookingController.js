const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "equipment_loan_db"
});

exports.createBooking = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate } = req.body;
    const userId = req.user.id;

    if (!equipmentId || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({ message: "Start date cannot be in the past" });
    }

    if (end < start) {
      return res.status(400).json({ message: "End date cannot be before start date" });
    }

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays > 14) {
      return res.status(400).json({ message: "Booking cannot exceed 14 days" });
    }

    // check equipment exists
    const [equipmentRows] = await db.execute(
      "SELECT * FROM equipment WHERE id = ?",
      [equipmentId]
    );

    if (equipmentRows.length === 0) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    const equipment = equipmentRows[0];

    if (equipment.status === "disinfecting") {
      return res.status(400).json({ message: "Equipment is currently unavailable" });
    }

    // limit user to max 3 active bookings
    const [activeBookingRows] = await db.execute(
      `SELECT COUNT(*) AS count
       FROM bookings
       WHERE user_id = ?
       AND status IN ('pending', 'approved')`,
      [userId]
    );

    if (activeBookingRows[0].count >= 3) {
      return res.status(400).json({
        message: "You can only have a maximum of 3 active bookings"
      });
    }

    // check overlapping approved bookings
    const [overlapRows] = await db.execute(
      `SELECT * FROM bookings
       WHERE equipment_id = ?
       AND status = 'approved'
       AND NOT (end_date < ? OR start_date > ?)`,
      [equipmentId, startDate, endDate]
    );

    if (overlapRows.length > 0) {
      return res.status(400).json({
        message: "Equipment is already booked for the selected dates"
      });
    }

    // create booking
    await db.execute(
      `INSERT INTO bookings (user_id, equipment_id, start_date, end_date, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [userId, equipmentId, startDate, endDate]
    );

    res.status(201).json({ message: "Booking request submitted successfully" });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        bookings.id,
        bookings.start_date,
        bookings.end_date,
        bookings.status,
        users.name AS user_name,
        users.role AS user_role,
        users.email,
        equipment.id AS equipment_id,
        equipment.name AS equipment_name,
        equipment.category,
        equipment.serial_number,
        equipment.status AS equipment_status
      FROM bookings
      JOIN users ON bookings.user_id = users.id
      JOIN equipment ON bookings.equipment_id = equipment.id
      ORDER BY bookings.id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("GET BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [rows] = await db.execute(
      `
      SELECT 
        bookings.id,
        bookings.start_date,
        bookings.end_date,
        bookings.status,
        equipment.id AS equipment_id,
        equipment.name AS equipment_name,
        equipment.category,
        equipment.serial_number,
        equipment.status AS equipment_status
      FROM bookings
      JOIN equipment ON bookings.equipment_id = equipment.id
      WHERE bookings.user_id = ?
      ORDER BY bookings.id DESC
    `,
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET MY BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch your bookings" });
  }
};

exports.getApprovedBookingsByEquipment = async (req, res) => {
  try {
    const { equipmentId } = req.params;

    const [rows] = await db.execute(
      `
      SELECT id, start_date, end_date
      FROM bookings
      WHERE equipment_id = ?
        AND status = 'approved'
      ORDER BY start_date ASC
      `,
      [equipmentId]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET APPROVED BOOKINGS BY EQUIPMENT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch unavailable dates" });
  }
};

exports.approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const [rows] = await db.execute(
      "SELECT * FROM bookings WHERE id = ?",
      [bookingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = rows[0];

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be approved" });
    }

    const [overlapRows] = await db.execute(
      `
      SELECT id
      FROM bookings
      WHERE equipment_id = ?
        AND status = 'approved'
        AND id <> ?
        AND NOT (end_date < ? OR start_date > ?)
      `,
      [booking.equipment_id, bookingId, booking.start_date, booking.end_date]
    );

    if (overlapRows.length > 0) {
      return res.status(400).json({ message: "Equipment is already booked for those dates" });
    }

    await db.execute(
      "UPDATE bookings SET status = 'approved' WHERE id = ?",
      [bookingId]
    );

    await db.execute(
      "UPDATE equipment SET status = 'borrowed' WHERE id = ?",
      [booking.equipment_id]
    );

    res.json({ message: "Booking approved" });
  } catch (err) {
    console.error("APPROVE BOOKING ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const [rows] = await db.execute(
      "SELECT * FROM bookings WHERE id = ?",
      [bookingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = rows[0];

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be rejected" });
    }

    await db.execute(
      "UPDATE bookings SET status = 'rejected' WHERE id = ?",
      [bookingId]
    );

    res.json({ message: "Booking rejected" });
  } catch (err) {
    console.error("REJECT BOOKING ERROR:", err);
    res.status(500).json({ message: "Failed to reject booking" });
  }
};

exports.returnBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }

    const [rows] = await db.execute(
      "SELECT * FROM bookings WHERE id = ?",
      [bookingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = rows[0];

    if (booking.status !== "approved") {
      return res.status(400).json({ message: "Only approved bookings can be marked as returned" });
    }

    await db.execute(
      "UPDATE bookings SET status = 'returned' WHERE id = ?",
      [bookingId]
    );

    await db.execute(
      "UPDATE equipment SET status = 'disinfecting' WHERE id = ?",
      [booking.equipment_id]
    );

    res.json({ message: "Marked as returned" });
  } catch (err) {
    console.error("RETURN BOOKING ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.markCleaned = async (req, res) => {
  try {
    const { equipment_id } = req.body;

    if (!equipment_id) {
      return res.status(400).json({ message: "Equipment ID is required" });
    }

    const [rows] = await db.execute(
      "SELECT * FROM equipment WHERE id = ?",
      [equipment_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    const equipment = rows[0];

    if (equipment.status !== "disinfecting") {
      return res.status(400).json({ message: "Only disinfecting equipment can be marked as cleaned" });
    }

    await db.execute(
      "UPDATE equipment SET status = 'available' WHERE id = ?",
      [equipment_id]
    );

    res.json({ message: "Equipment marked as cleaned and available" });
  } catch (err) {
    console.error("MARK CLEANED ERROR:", err);
    res.status(500).json({ message: "Failed to mark equipment as cleaned" });
  }
};